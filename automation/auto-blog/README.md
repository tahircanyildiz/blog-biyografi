# Otomatik blog taslakları

macOS zamanlayıcısı (launchd) Mac açıldığında ve her 30 dakikada bir kısa bir kontrol yapar. Saat 09:00'u
geçtiyse, bugün taslak yoksa ve bugün Pazar/Pazartesi/Çarşamba/Cuma ise (ya da son taslak 2 günden eskiyse)
Claude Code'u arka planda çalıştırır; Mac sabah kapalı olsa bile açıldığında telafi edilir. Ajan güncel bir konu seçer, resmi kaynaklardan doğrular, yazıyı ve 3 görseli hazırlar ve
LobsterLead'e **taslak** olarak ekler. Bitince ekrana "Yayınla / Önizle / Sonra" penceresi gelir; yayın
yalnızca "Yayınla"ya basılınca yapılır (şirket kuralı: canlıya her değişiklik için açık onay).

## Günlük kullanım

| İş | Komut |
|---|---|
| Onay penceresini tekrar aç | `npm run blog:onay` |
| Son taslağı terminalden yayınla | `npm run blog:yayinla` |
| Belirli bir taslağı yayınla | `npm run blog:yayinla -- <slug>` |
| Şimdi bir taslak üret | `npm run blog:taslak` |
| Ortamı kontrol et | `zsh automation/auto-blog/run.sh --kontrol` |

Taslaklar: `~/.autoblog/drafts/<tarih>-<slug>/` — `preview.html` (önizleme), `SUMMARY.md` (Türkçe özet),
`sources.md` (kaynak listesi). Loglar: `~/.autoblog/logs/`. Konu kaydı: `~/.autoblog/topics-log.md`.

## Neden ~/.autoblog?

macOS, zamanlayıcının başlattığı işlerin Masaüstü klasörüne erişimini engeller. Zamanlayıcı bu yüzden
`~/.autoblog/biografi-blog` altındaki ayrı kopyayı kullanır ve her çalıştırmada `main` dalından günceller.
Bu kopyadaki `.env` dosyası elle kopyalanır (git'e girmez).

## Güvenlik sınırları

Ajan yalnızca `~/.autoblog` altına yazabilir; `.env`'i okuyamaz, sunucuya bağlanamaz, git push ve yayın
betiğini çalıştıramaz. GitHub'a yalnızca `lib/gh-get.sh` üzerinden okuma (GET) isteği yapabilir.
Yayın adımı (`publish.sh`) görselleri sunucuya yükler ve yazıyı yayına alır; bunu insan çalıştırır.

## Giriş anahtarı

Claude Code'un normal oturumu birkaç günde bir yenilenir. Gözetimsiz çalışma için bir kez:

```
claude setup-token
security add-generic-password -a "$USER" -s autoblog-claude-token -w
```

İkinci komut anahtarı sorar; `setup-token` çıktısını yapıştırın. Anahtar macOS Anahtar Zinciri'nde saklanır.
