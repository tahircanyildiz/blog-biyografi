#!/bin/zsh
# Otomatik blog taslağı üretir. macOS zamanlayıcısı (launchd) tarafından çalıştırılır.
#   zsh automation/auto-blog/run.sh            → normal çalıştırma (günde en fazla bir taslak)
#   zsh automation/auto-blog/run.sh --force    → bugün taslak olsa da yenisini dene
#   zsh automation/auto-blog/run.sh --kontrol  → sadece ortamı kontrol et, yazı üretme
# Yalnızca TASLAK oluşturur; yayınlamak için publish.sh kullanılır.
#
# Not: macOS, launchd işlerinin Masaüstü klasörüne erişimini engeller. Bu yüzden zamanlayıcı
# bu betiği ~/.autoblog/biografi-blog altındaki ayrı kopyadan çalıştırır; taslaklar, loglar ve
# konu kaydı ~/.autoblog altında tutulur.
set -uo pipefail

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
  export CLAUDE_CODE_OAUTH_TOKEN=$token
  has_token=1
fi

notify() {
  osascript -e "display notification \"$2\" with title \"Blog otomasyonu\" subtitle \"$1\" sound name \"Glass\"" >/dev/null 2>&1 || true
}

mkdir -p "$drafts" "$logs"
[[ -f $topics ]] || cp "$here/topics-log.md" "$topics"
today=$(date +%Y-%m-%d)
log="$logs/$today.log"

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
    echo "uzun ömürlü token: $([[ $has_token == 1 ]] && echo var || echo 'yok (normal oturum kullanılacak)')"
    echo "taslak klasörü: $drafts"
  } | tee -a "$log"
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

echo "=== $(date) başladı ($claude_bin)" >> "$log"

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
  notify "Yeni taslak hazır" "$title — yayınlamak için: npm run blog:yayinla"
elif [[ -n $draft && -f $draft/SUMMARY.md ]]; then
  notify "Bugün yazı yok" "Uygun konu bulunamadı; ayrıntı: ${draft:t}/SUMMARY.md"
else
  notify "Taslak oluşturulamadı" "Log: ~/.autoblog/logs/$today.log"
fi
exit $code
