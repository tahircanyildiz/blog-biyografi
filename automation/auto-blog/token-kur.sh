#!/bin/zsh
# Zamanlayıcının gözetimsiz çalışabilmesi için Claude giriş anahtarını kurar.
# Kullanım (herhangi bir klasörden): zsh ~/.autoblog/biografi-blog/automation/auto-blog/token-kur.sh
set -u

claude_bin=$(command -v claude || ls -d "$HOME"/.vscode/extensions/anthropic.claude-code-*/resources/native-binary/claude 2>/dev/null | sort -V | tail -1)
if [[ -z $claude_bin ]]; then
  echo "Claude Code bulunamadı. VS Code eklentisi kurulu mu?"
  exit 1
fi

echo ""
echo "ADIM 1/2 — Anahtarı oluştur"
echo "Tarayıcı açılacak; Claude hesabınla onay ver. İşlem bitince burada"
echo "'sk-ant-oat' ile başlayan uzun bir anahtar görünecek. Onu kopyala."
echo ""
"$claude_bin" setup-token

echo ""
echo "ADIM 2/2 — Anahtarı kaydet"
echo "Kopyaladığın anahtarı yapıştırıp Enter'a bas (yazarken ekranda görünmez):"
read -rs token
echo ""

token=${token//[[:space:]]/}
if [[ $token != sk-ant-oat* || ${#token} -lt 40 ]]; then
  echo "Bu bir anahtar gibi görünmüyor: 'sk-ant-oat' ile başlamalı. Hiçbir şey kaydedilmedi; komutu tekrar çalıştır."
  exit 1
fi

security delete-generic-password -s autoblog-claude-token >/dev/null 2>&1 || true
if security add-generic-password -a "$USER" -s autoblog-claude-token -w "$token"; then
  echo "✓ Anahtar Anahtar Zinciri'ne kaydedildi. Zamanlayıcı artık gözetimsiz çalışabilir."
else
  echo "Anahtar kaydedilemedi."
  exit 1
fi
unset token
