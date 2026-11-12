#!/bin/zsh
# Bir görsel HTML'ini PNG'ye render eder ve WebP'ye çevirir.
# Kullanım: zsh automation/auto-blog/lib/render.sh <kaynak.html> <genişlik> <yükseklik> <çıktı.webp>
# PNG kopyası da <çıktı>.png olarak bırakılır; taşma/çakışma kontrolü için açıp bakın.
set -euo pipefail

if [[ $# -ne 4 ]]; then
  echo "Kullanım: render.sh <kaynak.html> <genişlik> <yükseklik> <çıktı.webp>" >&2
  exit 2
fi

src=${1:A}; width=$2; height=$3; out=${4:A}
here=${0:A:h}
root=${here:h:h:h}
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Repo yolunda Türkçe karakter olduğu için render, ASCII bir geçici klasörde yapılır.
work=$(mktemp -d /tmp/autoblog-render.XXXXXX)
trap 'rm -rf "$work"' EXIT

cp "$src" "$work/page.html"
cp "$here/../assets/base.css" "$work/base.css"
mkdir -p "$work/fonts"
cp "$root/public/fonts/og/"*.woff "$work/fonts/"

"$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --allow-file-access-from-files --virtual-time-budget=3000 \
  --user-data-dir="$work/.chrome" --window-size="$width,$height" \
  --screenshot="$work/page.png" "file://$work/page.html" >/dev/null 2>&1

mkdir -p "${out:h}"
cp "$work/page.png" "${out%.webp}.png"
node -e '
const sharp = require(process.argv[1]);
sharp(process.argv[2]).webp({ quality: 84 }).toFile(process.argv[3])
  .then((i) => console.log(`${process.argv[3]} ${i.width}x${i.height} ${Math.round(i.size / 1024)} KB`))
  .catch((e) => { console.error(e.message); process.exit(1); });
' "$root/node_modules/sharp" "$work/page.png" "$out"
