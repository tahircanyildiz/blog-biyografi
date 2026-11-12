#!/bin/zsh
# Otomatik blog taslağı üretir. macOS zamanlayıcısı (launchd) tarafından çalıştırılır.
#   zsh automation/auto-blog/run.sh               → elle çalıştırma (günde en fazla bir taslak)
#   zsh automation/auto-blog/run.sh --zamanlayici → launchd'nin kullandığı mod: önce "yazı zamanı geldi mi?" kontrolü
#   zsh automation/auto-blog/run.sh --force       → bugün taslak olsa da yenisini dene
#   zsh automation/auto-blog/run.sh --kontrol     → sadece ortamı kontrol et, yazı üretme
#   zsh automation/auto-blog/run.sh --onay        → bekleyen taslak için yayın onay penceresini aç
#
# Zamanlayıcı her 30 dakikada bir ve Mac açıldığında bu betiği --zamanlayici ile çağırır. Yazı;
# saat 09:00'u geçtiyse, bugün taslak yoksa ve (bugün Paz/Pzt/Çar/Cum ise ya da son taslak 2 günden
# eskiyse) üretilir. Böylece Mac sabah kapalı olsa bile açıldığında telafi edilir. Hata olursa günde
# en fazla 2 deneme yapılır.
# Yalnızca TASLAK oluşturur; yayınlamak için publish.sh kullanılır.
#
# Not: macOS, launchd işlerinin Masaüstü klasörüne erişimini engeller. Bu yüzden zamanlayıcı
# bu betiği ~/.autoblog/biografi-blog altındaki ayrı kopyadan çalıştırır; taslaklar, loglar ve
# konu kaydı ~/.autoblog altında tutulur.
set -uo pipefail
setopt no_nomatch  # eşleşmeyen dosya kalıpları hata vermesin (yoksa "boş" sonuç döner)

here=${0:A:h}
root=${here:h:h}
home_dir="$HOME/.autoblog"
drafts="$home_dir/drafts"
logs="$home_dir/logs"
topics="$home_dir/topics-log.md"
cd "$root" || exit 1

# launchd kısıtlı bir PATH ile başlar: Homebrew, en yeni nvm Node'u ve sistem araçları
node_bin=$(ls -d "$HOME"/.nvm/versions/node/*/bin 2>/dev/null | sort -V | tail -1)
export PATH="$node_bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

# VS Code eklentisi güncellendikçe yolu değişir; her seferinde en yeni sürümü bul
claude_bin=$(ls -d "$HOME"/.vscode/extensions/anthropic.claude-code-*/resources/native-binary/claude 2>/dev/null | sort -V | tail -1)
[[ -z $claude_bin ]] && claude_bin=$(command -v claude || true)

# Gözetimsiz çalışma için uzun ömürlü giriş anahtarı (claude setup-token ile üretilir) Keychain'de tutulur.
# Yoksa Claude Code'un normal oturumu kullanılır (o da birkaç günde bir yenilenmeli).
has_token=0
if token=$(security find-generic-password -s autoblog-claude-token -w 2>/dev/null) && [[ -n $token ]]; then
  # Yanlışlıkla boş/hatalı bir değer kaydedildiyse kullanma; normal oturuma düş
  if [[ $token == sk-ant-oat* && ${#token} -gt 40 ]]; then
    export CLAUDE_CODE_OAUTH_TOKEN=$token
    has_token=1
  else
    has_token=2
  fi
fi
unset token

# Kalıcı bilgi penceresi: macOS bildirimleri birkaç saniyede kaybolduğu ve ayarı her sürümde
# bulunamadığı için pencere kullanılır. "Tamam"a basılana kadar (en fazla 20 saat) ekranda kalır.
notify() {
  local title=${1//\"/\\\"} body=${2//\"/\\\"}
  osascript -e "display dialog \"$body\" with title \"Blog otomasyonu — $title\" buttons {\"Tamam\"} default button \"Tamam\" with icon note giving up after 72000" >/dev/null 2>&1 || true
}

# Taslağı yayınlamak için tek tıkla onay penceresi. Yayın yalnızca "Yayınla"ya basılırsa yapılır
# (şirket kuralı: canlıya her değişiklik için açık onay). Pencere 20 saat yanıtsız kalırsa kapanır, taslak bekler.
ask_publish() {
  local dir=$1 title=${2//\"/\\\"} answer
  while true; do
    answer=$(osascript \
      -e "display dialog \"Yeni blog taslağı hazır:\n\n$title\n\nYayınlansın mı?\" with title \"Blog otomasyonu\" buttons {\"Sonra\", \"Önizle\", \"Yayınla\"} default button \"Önizle\" giving up after 72000" \
      2>/dev/null)
    case $answer in
      *"button returned:Yayınla"*)
        if zsh "$here/publish.sh" "$dir" --evet >> "$log" 2>&1; then
          notify "Yayınlandı" "$title"
        else
          notify "Yayınlanamadı" "Ayrıntı: ~/.autoblog/logs/$(date +%Y-%m-%d).log"
        fi
        return
        ;;
      *"button returned:Önizle"*)
        open "$dir/preview.html"
        ;;
      *)
        # "Sonra" ya da 20 saat yanıt yok: taslak bekler (pencereyi tekrar açmak için: npm run blog:onay)
        return
        ;;
    esac
  done
}

# Yayınlanmamış en son taslak
latest_unpublished() {
  local d
  for d in $(ls -d "$drafts"/*/ 2>/dev/null | sort -r); do
    if [[ -f $d/draft-result.json ]] && ! grep -q '"published"' "$d/meta.json"; then
      echo "${d%/}"; return
    fi
  done
}

# Yazı zamanı geldi mi? (yalnızca --zamanlayici modunda kullanılır)
is_due() {
  local hour dow attempts last last_s now_s
  hour=$(date +%H); dow=$(date +%w)
  (( 10#$hour >= 9 )) || return 1                              # 09:00'dan önce değil
  ls -d "$drafts/$today-"* >/dev/null 2>&1 && return 1         # bugün zaten taslak var
  attempts=$(cat "$logs/$today.attempts" 2>/dev/null || echo 0)
  (( attempts < 2 )) || return 1                               # bugün 2 kez denendi
  [[ $dow == (0|1|3|5) ]] && return 0                          # planlı gün: Paz, Pzt, Çar, Cum
  # Planlı gün değil: son taslak 2 günden eskiyse kaçırılan günü telafi et
  last=$(ls -d "$drafts"/20??-??-??-* 2>/dev/null | sed -E 's#.*/([0-9]{4}-[0-9]{2}-[0-9]{2})-.*#\1#' | sort | tail -1)
  [[ -z $last ]] && return 0
  last_s=$(date -j -f %Y-%m-%d "$last" +%s); now_s=$(date -j -f %Y-%m-%d "$today" +%s)
  (( (now_s - last_s) / 86400 >= 2 ))
}

mkdir -p "$drafts" "$logs"
[[ -f $topics ]] || cp "$here/topics-log.md" "$topics"
today=$(date +%Y-%m-%d)
log="$logs/$today.log"

# Zamanlayıcı modu: başka çalıştırma sürüyorsa ya da yazı zamanı gelmediyse sessizce çık
if [[ ${1:-} == "--zamanlayici" ]]; then
  [[ -d $home_dir/.lock ]] && exit 0
  is_due || exit 0
fi

# Ayrı kopyadan çalışıyorsak en güncel talimat ve betikleri çek
if [[ $root == "$home_dir/biografi-blog" ]]; then
  git -C "$root" pull -q --ff-only origin main >> "$log" 2>&1 || echo "$(date) git pull başarısız, mevcut sürümle devam" >> "$log"
fi

if [[ ${1:-} == "--kontrol" ]]; then
  {
    echo "kontrol $(date)"
    echo "claude: ${claude_bin:-YOK}"
    echo "node: $(command -v node || echo YOK) $(node --version 2>/dev/null)"
    echo "sharp: $([[ -d $root/node_modules/sharp ]] && echo var || echo YOK)"
    echo "chrome: $([[ -x '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' ]] && echo var || echo YOK)"
    echo "gh: $(command -v gh || echo YOK)"
    echo ".env blog anahtarı: $(grep -c '^BLOG_API_KEY=.' "$root/.env" 2>/dev/null || echo 0)"
    case $has_token in
      1) echo "uzun ömürlü token: var" ;;
      2) echo "uzun ömürlü token: Anahtar Zinciri'ndeki kayıt GEÇERSİZ (yok sayıldı, normal oturum kullanılacak)" ;;
      *) echo "uzun ömürlü token: yok (normal oturum kullanılacak)" ;;
    esac
    echo "taslak klasörü: $drafts"
  } | tee -a "$log"
  exit 0
fi

if [[ ${1:-} == "--onay" ]]; then
  draft=$(latest_unpublished)
  if [[ -z $draft ]]; then
    notify "Bekleyen taslak yok" "Yayınlanmamış taslak bulunamadı."
    exit 0
  fi
  ask_publish "$draft" "$(node -e 'console.log(require(process.argv[1]).title)' "$draft/meta.json")"
  exit 0
fi

if [[ -z $claude_bin ]]; then
  echo "$(date) Claude Code bulunamadı" >> "$log"
  notify "Çalışmadı" "Claude Code bulunamadı. VS Code eklentisi kurulu mu?"
  exit 1
fi

# Aynı anda iki çalıştırmayı ve aynı gün ikinci taslağı engelle
if ! mkdir "$home_dir/.lock" 2>/dev/null; then
  echo "$(date) Başka bir çalıştırma sürüyor, çıkılıyor" >> "$log"
  exit 0
fi
trap 'rmdir "$home_dir/.lock" 2>/dev/null' EXIT

if ls -d "$drafts/$today-"* >/dev/null 2>&1 && [[ ${1:-} != "--force" ]]; then
  echo "$(date) Bugün için taslak zaten var, çıkılıyor" >> "$log"
  exit 0
fi

attempts=$(( $(cat "$logs/$today.attempts" 2>/dev/null || echo 0) + 1 ))
echo $attempts > "$logs/$today.attempts"
echo "=== $(date) başladı, bugünkü $attempts. deneme ($claude_bin)" >> "$log"

prompt=$(<"$here/PROMPT.md")
prompt=${prompt//\{\{AUTOBLOG_HOME\}\}/$home_dir}

"$claude_bin" -p "$prompt" \
  --permission-mode dontAsk \
  --no-session-persistence \
  --allowedTools \
    "WebSearch" "WebFetch" "Glob" "Grep" "TodoWrite" \
    "Read(/$home_dir/**)" \
    "Edit(/$drafts/**)" "Edit(/$topics)" \
    "Bash(node automation/auto-blog/lib/existing-posts.mjs:*)" \
    "Bash(node automation/auto-blog/lib/check-links.mjs:*)" \
    "Bash(node automation/auto-blog/lib/create-draft.mjs:*)" \
    "Bash(zsh automation/auto-blog/lib/render.sh:*)" \
    "Bash(zsh automation/auto-blog/lib/gh-get.sh:*)" \
    "Bash(npm view:*)" "Bash(date:*)" "Bash(ls:*)" \
  --disallowedTools \
    "Read(./.env)" "Read(./.env.*)" \
    "Bash(ssh:*)" "Bash(scp:*)" "Bash(git push:*)" \
    "Bash(node automation/auto-blog/lib/publish.mjs:*)" "Bash(zsh automation/auto-blog/publish.sh:*)" \
  >> "$log" 2>&1
code=$?

echo "=== $(date) bitti (çıkış kodu $code)" >> "$log"

draft=$(ls -d "$drafts/$today-"* 2>/dev/null | tail -1)
if [[ -n $draft && -f $draft/draft-result.json ]]; then
  title=$(node -e 'console.log(require(process.argv[1]).title)' "$draft/meta.json" 2>/dev/null)
  ask_publish "$draft" "$title"
elif [[ -n $draft && -f $draft/SUMMARY.md ]]; then
  notify "Bugün yazı yok" "Uygun konu bulunamadı; ayrıntı: ${draft:t}/SUMMARY.md"
else
  notify "Taslak oluşturulamadı" "Log: ~/.autoblog/logs/$today.log"
fi
exit $code
