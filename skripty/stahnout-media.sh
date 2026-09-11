#!/usr/bin/env bash
# ============================================================================
# Stažení fotek ze starého Webnode webu + převod do WebP
#
# Spusť z kořene repozitáře:   bash skripty/stahnout-media.sh
#
# Potřebuje: curl a ImageMagick (příkaz `magick` nebo `convert`)
#   macOS:  brew install imagemagick
#   Ubuntu: sudo apt install imagemagick curl
#
# POZOR: spusť dřív, než zrušíš předplatné Webnode — pak už CDN nebude
#        fotky servírovat.
# ============================================================================
set -uo pipefail

BASE="https://f76fd7fc9c.clvaw-cdnwnd.com/cb117bafd4efe5d15e5e24558fca0272"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

if command -v magick >/dev/null 2>&1; then IM="magick"
elif command -v convert >/dev/null 2>&1; then IM="convert"
else echo "CHYBA: ImageMagick nenalezen. Nainstaluj ho a spusť znovu."; exit 1; fi

mkdir -p foto hudebnici video/orig foto/orig hudebnici/orig

stahni () {  # $1 = cesta na CDN, $2 = cílový soubor bez přípony, $3 = složka, $4 = šířka
  local url="$BASE/$1" out="$2" dir="$3" w="$4"
  echo "  → $out"
  if ! curl -fsSL "$url" -o "$TMP/$out.orig"; then
    echo "     !! nestáhlo se: $url"; return 1
  fi
  cp "$TMP/$out.orig" "$dir/orig/$out.jpg"
  "$IM" "$TMP/$out.orig" -auto-orient -resize "${w}x>" -quality 82 -strip "$dir/$out.webp"
}

echo "=== FOTOGALERIE (pás na webu, 660 px = 330 CSS px @2x) ==="
i=1
for item in \
  "200000195-7496b7496d/Sv%C3%A1tky%20sv%C4%9Btla_Karlovy%20Vary%2014.12.2024-41.jpeg" \
  "200000142-5a4135a414/386A0358.jpg" \
  "200000157-29a3929a3a/IMG_8793.JPG" \
  "200000159-179c7179c9/IMG_8920.JPG" \
  "200000162-0d49e0d49f/386A0840.JPG" \
  "200000154-7e38f7e390/386A3382.jpg" \
  "200000169-b2c30b2c31/386A0934_v1.jpg" \
  "200000171-b849db849e/386A3406.jpg" \
  "200000158-6f3e76f3e8/IMG_8913.JPG" \
  "200000151-ad11aad11b/386A7421.jpg" \
  "200000148-b554cb554d/386A5780.JPG" \
  "200000153-e670ce670d/386A5827.JPG" \
  "200000140-a80e9a80eb/386A0278.jpg" \
  "200000146-6dcc46dcc5/386A3381.jpg" \
  "200000156-abe76abe77/IMG_8847.JPG" \
  "200000160-9952a9952c/386A0453_v1.jpg" \
  "200000163-d2363d2364/386A0951_v1.jpg" \
  "200000167-6a1fb6a1fc/386A0608_v1.jpg" \
  "200000173-0e53d0e53e/386A7393.jpg" ; do
  stahni "$item" "foto_$i" "foto" 660
  i=$((i+1))
done

echo
echo "=== HISTORICKÁ FOTKA 1990 + fotka do sekce O kapele ==="
stahni "200000003-22e4522e46/BIG%20BAND%20Karlovy%20Vary%20%281990%29.jpg" "orchestr-1990" "foto" 1240

echo
echo "=== PORTRÉTY HUDEBNÍKŮ (originály s pozadím) ==="
while IFS='|' read -r cdn name; do
  [ -z "$cdn" ] && continue
  stahni "$cdn" "$name" "hudebnici" 660
done << 'LIST'
200000043-de580de581/Zden%C4%9Bk%20Kr%C3%A1m-6.jpg|zdenek-kram
200000041-6aeb26aeb3/David%20Kle%C5%88ha.jpg|david-klenha
200000045-ea2ffea300/Mirka%20Lend%C4%9Blov%C3%A1.jpg|mirka-lendelova
200000047-a9f4fa9f51/Jakub%20Smutn%C3%BD.jpg|jakub-smutny
200000105-3df913df93/V%C3%A1clav%20Vejvoda.jpg|vaclav-vejvoda
200000053-27f8f27f90/Ji%C5%99%C3%AD%20Drahokoupil.jpg|jiri-drahokoupil
200000059-0a0f30a0f4/Jan%20%C5%A0olt%C3%A9sz.jpg|jan-soltesz
200000103-110b4110b5/Ji%C5%99%C3%AD%20Kare%C5%A1%20ml.jpg|jiri-kares-ml
200000101-1f0b21f0b3/Ji%C5%99%C3%AD%20Kare%C5%A1%20st.jpg|jiri-kares-st
200000073-52f9852f99/Stanislav%20B%C3%A1rta.jpg|stanislav-barta
200000049-c9c19c9c1a/Pavel%20Horych-7.jpg|pavel-horych
200000099-9af769af78/Milan%20Szep-0.jpg|milan-szep
200000065-a96dfa96e0/Pavel%20Truhl%C3%A1%C5%99.jpg|pavel-truhlar
200000069-d115bd115d/Jaroslav%20Dlouh%C3%BD.jpg|jaroslav-dlouhy
200000051-77ac677ac7/Karel%20%C5%A0imandl.jpg|karel-simandl
200000057-b5029b502a/Anton%C3%ADn%20T%C3%BDnek.jpg|antonin-tynek
200000063-43b4d43b4e/V%C3%A1clav%20Ro%C5%BEec-4.jpg|vaclav-rozec
200000109-8bce98bcea/Miloslav%20%C5%A0enitka.jpg|miloslav-senitka
200000071-5a9a85a9aa/Jind%C5%99ich%20Zmrzl%C3%BD.jpg|jindrich-zmrzly
200000075-af2d6af2d7/Zden%C4%9Bk%20Havl%C3%AD%C4%8Dek-5.jpg|zdenek-havlicek
200000107-49c3b49c3c/Jan%20Vacula.jpg|jan-vacula
LIST

echo
echo "=== NÁHLEDY YOUTUBE VIDEÍ ==="
j=1
for id in E-YqAIQaOVY 8EkUIP8M2UA Qy5uX-y7d0c SwFmJBtF_iU o4ixDY1Pqdk; do
  echo "  → video/$j.webp ($id)"
  if curl -fsSL "https://i.ytimg.com/vi/$id/maxresdefault.jpg" -o "$TMP/yt$j.jpg" \
     || curl -fsSL "https://i.ytimg.com/vi/$id/hqdefault.jpg" -o "$TMP/yt$j.jpg"; then
    "$IM" "$TMP/yt$j.jpg" -resize "1280x>" -quality 80 -strip "video/$j.webp"
  else
    echo "     !! náhled se nestáhl"
  fi
  j=$((j+1))
done

echo
echo "============================================================"
echo "HOTOVO."
echo
echo "Originály jsou v foto/orig/ a hudebnici/orig/ — do gitu je NECOMMITUJ,"
echo "jsou v .gitignore. Slouží jen jako záloha pro další úpravy."
echo
echo "ZBÝVÁ RUČNĚ:"
echo "  1) hudebnici/*.webp jsou zatím s pozadím. Web čeká PNG s průhledným"
echo "     pozadím: hudebnici/<jmeno>.png, ideálně 660 × 880 px (poměr 3:4),"
echo "     postava zarovnaná k dolní hraně dlaždice."
echo "     Odmazat pozadí jde v Photoshopu, GIMPu nebo online (remove.bg,"
echo "     Photoroom). Výsledek ulož jako PNG se stejným názvem."
echo "  2) foto/kapelnik.webp — fotka Zdeňka Kráma na výšku (min. 620 x 820 px),"
echo "     nahoře nech volný prostor, ořezává se do oblouku."
echo "     Rychlá varianta: převeď hudebnici/orig/zdenek-kram.jpg."
echo "  3) video/hero.mp4 + video/hero.webm + video/hero-poster.jpg — hero video."
echo "============================================================"
