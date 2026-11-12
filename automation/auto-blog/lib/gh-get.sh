#!/bin/zsh
# GitHub REST API'ye YALNIZCA OKUMA (GET) isteği yapar. Otomatik ajan gh'ye doğrudan erişemez;
# böylece web içeriğinden gelebilecek bir talimat GitHub hesabında değişiklik yapamaz.
# Kullanım: zsh automation/auto-blog/lib/gh-get.sh <endpoint> [jq-filtresi]
#   ör. zsh automation/auto-blog/lib/gh-get.sh repos/vercel/next.js/releases/latest '.tag_name'
#       zsh automation/auto-blog/lib/gh-get.sh 'repos/nodejs/node/security-advisories?per_page=5'
set -euo pipefail

endpoint=${1:-}
filter=${2:-.}

if [[ -z $endpoint || $endpoint == -* || ! $endpoint =~ '^[A-Za-z0-9/_.?=&%:+,-]+$' ]]; then
  echo "Geçersiz endpoint: yalnızca yol ve sorgu parametreleri kabul edilir." >&2
  exit 2
fi

exec gh api --method GET -H "Accept: application/vnd.github+json" "$endpoint" --jq "$filter"
