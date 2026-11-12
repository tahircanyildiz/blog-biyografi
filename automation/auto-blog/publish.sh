#!/bin/zsh
# Hazırlanan taslağı yayınlar: görselleri sunucuya yükler, yazıyı yayına alır, canlı sayfayı doğrular.
# Kullanım:
#   npm run blog:yayinla                 → en son yayınlanmamış taslak
#   npm run blog:yayinla -- <slug>        → belirli bir taslak
#   npm run blog:yayinla -- <slug> --evet → onay sormadan
set -euo pipefail
setopt no_nomatch  # eşleşmeyen dosya kalıpları hata vermesin

here=${0:A:h}
root=${here:h:h}
drafts="$HOME/.autoblog/drafts"
topics="$HOME/.autoblog/topics-log.md"
cd "$root"

target=""; confirm=1
for arg in "$@"; do
  case $arg in
    --evet|--yes) confirm=0 ;;
    *) target=$arg ;;
  esac
done

# Taslak klasörünü bul
if [[ -z $target ]]; then
  dir=""
  for d in $(ls -d "$drafts"/*/ 2>/dev/null | sort -r); do
    if [[ -f $d/draft-result.json ]] && ! grep -q '"published"' "$d/meta.json"; then dir=${d%/}; break; fi
  done
elif [[ -d $target ]]; then
  dir=${target:A}
else
  dir=$(ls -d "$drafts"/*-"$target" 2>/dev/null | tail -1)
fi
if [[ -z ${dir:-} || ! -f $dir/meta.json ]]; then
  echo "Yayınlanacak taslak bulunamadı." >&2
  exit 1
fi

slug=$(node -e 'console.log(require(process.argv[1]).slug)' "$dir/meta.json")
title=$(node -e 'console.log(require(process.argv[1]).title)' "$dir/meta.json")
if grep -q '"published"' "$dir/meta.json"; then
  echo "Bu taslak zaten yayınlanmış: $slug"; exit 0
fi

echo "Taslak : $title"
echo "Adres  : https://www.tahircanyildiz.com/blog/$slug"
echo "Önizleme: file://$dir/preview.html"
if (( confirm )); then
  read "answer?Yayınlansın mı? (e/h) "
  [[ $answer == [eE]* ]] || { echo "İptal edildi."; exit 0; }
fi

# Sunucu bilgileri .env'den (repoya girmez)
envval() { grep -E "^$1=" .env | tail -1 | cut -d= -f2-; }
host=$(envval AUTOBLOG_SSH_HOST); uploads=$(envval AUTOBLOG_UPLOADS_DIR); owner=$(envval AUTOBLOG_UPLOADS_OWNER)
if [[ -z $host || -z $uploads || -z $owner ]]; then
  echo ".env içinde AUTOBLOG_SSH_HOST / AUTOBLOG_UPLOADS_DIR / AUTOBLOG_UPLOADS_OWNER eksik." >&2; exit 1
fi

images=("$dir"/images/*.webp)
echo "→ ${#images} görsel sunucuya yükleniyor"
tmp="/tmp/autoblog-$slug"
ssh -o BatchMode=yes "$host" "mkdir -p '$tmp'"
scp -q -o BatchMode=yes "${images[@]}" "$host:$tmp/"
ssh -o BatchMode=yes "$host" "cd '$uploads' && for f in '$tmp'/*.webp; do sudo install -m 644 -o '${owner%:*}' -g '${owner#*:}' \"\$f\" ./; done && rm -rf '$tmp'"

for f in "${images[@]}"; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "https://www.tahircanyildiz.com/uploads/${f:t}")
  [[ $code == 200 ]] || { echo "Görsel erişilemiyor (${f:t}: $code), yayın durduruldu." >&2; exit 1; }
done
echo "→ görseller yayında"

node "$here/lib/publish.mjs" "$dir"

# Konu kaydını güncelle
sed -i '' "s/| taslak | $slug\$/| yayında | $slug/" "$topics" 2>/dev/null || true

echo ""
echo "Sonraki adım (isteğe bağlı): Search Console → URL denetimi → https://www.tahircanyildiz.com/blog/$slug → Dizine eklenmesini iste"
