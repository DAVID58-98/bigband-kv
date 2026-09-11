# Video

## Hero video (úvodní obrazovka)
- `hero.mp4` — H.264, do 4 MB, bez zvuku, smyčka 10–15 s
- `hero.webm` — stejný záběr, VP9
- `hero-poster.jpg` — první snímek, 1920 × 1080, do 250 kB

Kompozice musí snést ztmavení: nahoře 72 %, dole 92 %. Důležité věci
patří do prostředního pásu obrazu.

Převod z originálu:
```
ffmpeg -i original.mov -t 14 -an -vf "scale=1920:-2" -c:v libx264 -crf 26 -preset slow -movflags +faststart hero.mp4
ffmpeg -i original.mov -t 14 -an -vf "scale=1920:-2" -c:v libvpx-vp9 -crf 34 -b:v 0 hero.webm
ffmpeg -i hero.mp4 -vframes 1 -q:v 3 hero-poster.jpg
```

## Náhledy YouTube
`1.webp` … `5.webp` — náhledy pro fasádu přehrávače, 1280 × 720.
Stáhne `skripty/stahnout-media.sh`.
