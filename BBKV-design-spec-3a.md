# Big Band Karlovy Vary — designový popis homepage
## Varianta 3a „Deco Ivory“ — podklad pro implementaci

Tento dokument je zadání pro stavbu statického webu (HTML + CSS, bez frameworku).
Obsahuje kompletní designový systém, popis sekcí a pravidla, kterých se držet.

---

## 1. Charakter

Světlé art deco. Deco geometrie je vyjádřená **oblouky, svislými kanelurami a stoupajícími
sloupky**, nikoli kosočtverci, vějíři ani zipy. Působení: prestižní regionální orchestr
s 40letou historií, který dnes hraje v divadle. Ne nostalgie, ne muzeum, ne startupová čistota.

Trilingvní web: **CZ / EN / DE**.

---

## 2. Barevná paleta

| Hex | Role |
|---|---|
| `#FBF9F4` | hlavní plocha (slonovina) |
| `#FFFFFF` | karty, povrchy nad plochou |
| `#16161A` | inkoust — veškerý hlavní text, tmavé sekce, primární tlačítko |
| `#8C6A16` | zlato — akcenty, linky, aktivní stav, datum, popisky nástrojů |
| `#E8D6A8` | světlé zlato — pouze na tmavém pozadí (hero, patičkové CTA) |
| `#6A6558` | sekundární text na světlém pozadí |
| `#DCD7CB` | sekundární text na tmavém pozadí |

Pravidla:
- Zlato `#8C6A16` je ztmavené záměrně — světlejší zlatá na slonovině nesplní WCAG AA.
- `#E8D6A8` používat **jen** na tmavém podkladu (kontrast 9,8:1 na `#16161A`).
- Maximálně dvě barvy pozadí na stránce: slonovina a inkoust. Žádné další.
- Nepoužívat: smaragdovou `#0f5257`, krémovou `#f4f0e4`.

Kontrasty (ověřeno):
- `#16161A` na `#FBF9F4` = 16,4:1
- `#6A6558` na `#FBF9F4` = 5,4:1
- `#8C6A16` na `#FBF9F4` = 4,8:1
- `#FBF9F4` na `#16161A` = 16,4:1
- `#DCD7CB` na `#16161A` = 11,6:1

---

## 3. Typografie

Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Josefin+Sans:wght@300;400;600&display=swap" rel="stylesheet">
```

**Nadpisy — Cinzel 700.** Vždy `text-transform: uppercase`, `letter-spacing: .10em` až `.16em`.
Cinzel nikdy nepoužívat na běžný text ani na položky delší než tři slova.
Pozor na českou diakritiku v prostrkaných verzálkách — vizuálně zkontrolovat Č, Ř, Ž, Ů.

**Text a navigace — Josefin Sans 300 / 400 / 600.**
Josefin Sans má nízkou x-výšku: nikdy pod 15 px pro odstavce.

Škála:

| Použití | Velikost / řez | letter-spacing | line-height |
|---|---|---|---|
| H1 hero (desktop) | 68 px Cinzel 700 | .12em | 1.12 |
| H1 hero (mobil) | 32 px Cinzel 700 | .10em | 1.20 |
| H2 sekce (desktop) | 38 px Cinzel 700 | .14em | 1.0 |
| H2 sekce (mobil) | 24 px Cinzel 700 | .14em | 1.0 |
| Číslo roku 1986 | 98 px Cinzel 700 | normal | 0.9 |
| Datum na kartě | 76 px Cinzel 700 (mobil 54 px) | normal | 0.9 |
| H3 název programu | 21 px Josefin Sans 600 | .04em | 1.3 |
| Jméno hudebníka | 14 px Josefin Sans 600 | .06em | 1.3 |
| Nástroj pod jménem | 11,5 px Josefin Sans 300 uppercase | .16em | 1.4 |
| Odstavec | 17 px Josefin Sans 300 | normal | 1.75 |
| Odstavec mobil | 15 px Josefin Sans 300 | normal | 1.7 |
| Navigace | 13 px Josefin Sans 400 uppercase | .20em | 1.0 |
| Tlačítko | 12,5 px Josefin Sans 600 uppercase | .22em | 1.0 |
| „since 1986“ | 12 px Josefin Sans 400 uppercase | .44em | 1.0 |
| Přepínač jazyků | 11,5 px Josefin Sans 600 | .14em | 1.0 |

Odstavce: `max-width: 62ch`, `text-wrap: pretty`.

---

## 4. Tvarosloví

- **Poloměr rohů: 0** u karet, tlačítek, navigace, jazykových přepínačů.
- **Jediná výjimka — deco oblouk:** obrázky mají zaoblenou pouze horní hranu,
  `border-radius: 50% 50% 0 0 / 40% 40% 0 0` nebo prakticky
  `border-radius: 210px 210px 0 0` pro blok o šířce 420 px.
  Portréty hudebníků: `border-radius: 120px 120px 0 0`.
- **Žádné výrazně kulaté pilulkové tvary.** Nikde.
- **Stín:** jediný — `box-shadow: 0 12px 34px rgba(22,22,26,.07)`.
  Karty koncertů a sticky navigace. Jinde stíny nepoužívat.
- **Linky:** `1px solid rgba(22,22,26,.10)` na kartách, `2px solid #8C6A16` pod sticky navigací.
- **Kanelury (deco linky):** svislé sloupky min. 8 px rozteč, tenčí blikají na retina displejích.
  Motiv „tři stoupající sloupky“ (9 / 15 / 21 px) = logo BBKV a oddělovač pod nadpisy sekcí.

### Logo BBKV
Tři svislé sloupky s narůstající výškou (4 × 12 / 20 / 28 px na desktopu, zlaté) + textem
`BBKV` v Cinzel 700, `letter-spacing: .22em`. Na tmavém pozadí sloupky `#E8D6A8`,
na světlém `#8C6A16`. Bez kosočtverce, bez rámečku.

### Tlačítka

| Typ | Vzhled | Hover |
|---|---|---|
| Primární na tmavém | pozadí `#FBF9F4`, text `#16161A`, padding 17/38 px | `box-shadow: inset 0 -3px 0 #8C6A16` |
| Primární na světlém | pozadí `#16161A`, text `#FBF9F4` | `box-shadow: inset 0 -3px 0 #8C6A16` |
| CTA v tmavé sekci | pozadí `#E8D6A8`, text `#16161A` | ztmavení na `#D9C48F` |
| Mobilní poptávka | pozadí `#8C6A16`, text `#FFFDF7` | ztmavení na `#755614` |

Tlačítka nikdy nemají zaoblení. Minimální výška dotykové plochy na mobilu **48 px**.

---

## 5. Layout a mřížka

- Obsahový kontejner: `max-width: 1280px`, boční padding **56 px** desktop / **20 px** mobil.
- Vertikální rytmus sekcí: 88–100 px desktop, 32–40 px mobil.
- Mřížka koncertů: 3 sloupce, gap 24 px → 1 sloupec pod 900 px.
- Mřížka obsazení: 5 sloupců (gap 26/22 px) → 3 sloupce pod 900 px → 2 sloupce pod 560 px.
- Sekce „o kapele“: dva sloupce `1fr 1.05fr`, gap 64 px → pod sebe na mobilu.

---

## 6. Sekce homepage — pořadí a obsah

### 6.1 Hero (fullscreen video)
- `<video autoplay muted loop playsinline poster="…">` přes celou výšku viewportu (`100svh`),
  `object-fit: cover`. Poster obrázek je povinný.
- **Scrim pro čitelnost:**
  `linear-gradient(180deg, rgba(22,22,26,.72) 0%, rgba(22,22,26,.28) 40%, rgba(22,22,26,.92) 100%)`
- Deco oblouk: prázdný rám s `border: 1px solid rgba(232,214,168,.35)`,
  `border-radius: 300px 300px 0 0`, ukotvený u spodní hrany, 56 px od okrajů.
- Obsah zarovnaný na střed, u spodní třetiny:
  1. `since 1986` — 12 px, letter-spacing .44em, barva `#E8D6A8`
  2. H1 `Big Band` / `Karlovy Vary` (zalomení na dva řádky)
  3. jedna věta perexu, max. 540 px
  4. jedno primární CTA → **Program koncertů** (odkaz na /koncerty)
- Žádné druhé tlačítko, žádná cena, žádný nákup.

### 6.2 Sticky navigace
- **Přes hero:** průhledné pozadí, logo se světlými sloupky, položky bílé,
  aktivní položka `#E8D6A8` s podtržením 2 px.
- **Po odscrollování** (přepnout přes `IntersectionObserver` na hero, nebo `scrollY > 80`):
  pozadí `#FBF9F4`, výška 66 px, `border-bottom: 2px solid #8C6A16`,
  stín `0 8px 22px rgba(22,22,26,.06)`, text `#3A3830`, aktivní položka `#16161A`
  s podtržením `2px solid #8C6A16`. Vpravo navíc přibude tlačítko **Poptávka**.
- Přechod mezi stavy `transition: background .25s, height .25s`.
- Položky: Úvod / Koncerty / O nás / Galerie / Kontakt.
- Vpravo přepínač **CZ EN DE** — aktivní jazyk `#16161A` (resp. bílý přes hero), ostatní
  `#6A6558`. Odkazy na jazykové mutace, ne JS přepínač.

### 6.3 Nejbližší koncerty
- Nadpis na střed + oddělovač ze tří sloupků (14 / 22 / 14 px, zlaté).
- Tři karty, bílé, 1px linka, stín, padding 32/28/28 px, text na střed.
- **Datum je dominantní:** číslo dne 76 px Cinzel 700 v inkoustu.
  Pod ním jeden řádek `LISTOPAD 2026 · 19:30` — 12 px, 600, letter-spacing .3em, zlatě.
- Pak zlatý oddělovač ze tří sloupků, název programu, místo.
- Hover: `border-color: #8C6A16`.
- Odkaz „Celý program“ pod sekcí.

### 6.4 O kapele
- Levý sloupec: `1986` v 98 px Cinzel zlatě, vedle popisek „rok / založení“.
- Odstavec: založení 1986 Milanem Hartem (pozounista), od 1998 vede Zdeněk Krám,
  20 hudebníků (trubky, pozouny, saxofony, rytmika) + zpěvák a zpěvačka,
  působiště: Karlovarské městské divadlo, Mariánské a Františkovy Lázně, příhraniční Bavorsko.
- Pod odstavcem tři čísla oddělená horní linkou: **20** hudebníků / **40** let / **3** země.
- Pravý sloupec: fotografie v deco oblouku, 420 px vysoká, zlatá linka 1 px.

### 6.5 Obsazení (20 portrétů)
- Nadpis na střed + podtitul „20 členů orchestru, řazeno po sekcích“.
- 5 sloupců × 4 řady. Portrét poměr **3:4**, oblouk nahoře (`120px 120px 0 0`).
- Pod fotkou: jméno (14 px, 600) a nástroj (11,5 px, 300, uppercase, zlatě).
- Řazení po sekcích: kapelník → trubky → pozouny → saxofony → rytmika → zpěv.
- Hover: `filter: brightness(1.04)`.
- Fotky musí mít jednotný ořez a jednotné pozadí — ve světlém layoutu se nesourodost pozná.

### 6.6 Pás z galerie
- Vodorovný pás obrázků výšky 220 px, gap 12 px, plynulý posun doleva
  (`@keyframes` translateX 0 → −50 %, obsah zdvojený, 44 s lineárně).
- Alternativa bez animace: prostý horizontálně scrollovatelný pás.
- Odkaz na /galerie.

### 6.7 Závěrečné CTA
- Tmavý blok `#16161A`, text na střed.
- Nadpis „Zahrajeme u vás“, odstavec o bálech, slavnostech, firemních večerech a komorní sestavě.
- Tlačítko `#E8D6A8` → **Nezávazná poptávka** (odkaz na /kontakt nebo formulář).
- Nikde žádné ceny.

### 6.8 Patička
- Světlá `#FBF9F4`, horní linka 1 px, čtyři sloupce:
  logo + „Big Band Karlovy Vary / since 1986“, navigace, navigace, kontakt + `CZ · EN · DE`.
- Text 14 px Josefin Sans 300, barva `#6A6558`.

---

## 7. Mobil (375 px)

- Hero 520 px vysoký, obsah na střed, CTA přes celou šířku.
- Hamburger: tři linky 24 × 2 px, barva `#E8D6A8` přes hero, `#16161A` po odscrollování.
- **Otevřené menu:** plná plocha `#FBF9F4`, položky vycentrované pod sebou,
  26 px Cinzel 700 uppercase, mezera 24 px, aktivní položka zlatá.
  Pod položkami oddělovač ze tří sloupků.
  Dole přepínač jazyků (aktivní = inkoustový blok, ostatní obrys 1 px)
  a tlačítko **Poptat vystoupení** přes celou šířku v `#8C6A16`.
- Karty koncertů pod sebou, datum 54 px.
- Obsazení 2–3 sloupce.

---

## 8. Animace

Povolené, všechny čistě CSS:
- Nájezd obsahu hero a karet: `opacity 0 → 1`, `translateY(28px) → 0`, 0,7–0,8 s `ease`.
- Pás galerie: nekonečný posun 44 s lineárně.
- Hover přechody 0,2 s.

Povinné vypnutí:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
  }
}
```

Video v hero: při `prefers-reduced-motion: reduce` nepřehrávat a zobrazit poster.

---

## 9. Přístupnost

- Kontrast textu min. 4,5:1 (nadpisy nad 24 px min. 3:1) — paleta výše to splňuje.
- Viditelný focus: `outline: 2px solid #8C6A16; outline-offset: 3px`.
- Video `muted`, bez zvuku, s `aria-hidden="true"`; informace nesmí být jen ve videu.
- Portréty: `alt` = jméno a nástroj. Dekorativní obrázky `alt=""`.
- Navigace `<nav>` + `<ul>`, mobilní menu s `aria-expanded` na hamburgeru.
- Jazykové odkazy s `hreflang` a `lang` atributy.
- Dotykové plochy min. 48 × 48 px.

---

## 10. Co je potřeba dodat (fotografie a video)

1. **Hero video** — orchestr na jevišti, měkké světlo, smyčka 10–15 s, bez zvuku,
   H.264 MP4 do 4 MB + WebM, plus poster JPG. Kompozice musí snést ztmavení o 70 % nahoře i dole.
2. **20 portrétů** — poměr 3:4, jednotné pozadí a světlo, ořez po hrudník.
   V tomto světlém layoutu se odlišný snímek okamžitě pozná.
3. **Foto do sekce „o kapele“** — na výšku nebo čtverec, snese ořez do oblouku (nahoře prostor).
4. **6–10 fotek do pásu galerie** — na šířku, jednotný barevný tón.
5. Doporučení: všechny fotky projet stejnou úpravou (teplota, kontrast), aby paleta držela.

---

## 11. Technické poznámky

- Statické HTML + CSS, žádný build, žádná JS knihovna.
- JS jen na dvě věci: přepnutí stavu sticky navigace a otevření mobilního menu.
- Tři jazykové mutace jako samostatné HTML soubory (`/`, `/en/`, `/de/`).
- Fonty načítat jedním `<link>` s `display=swap`, preconnect na oba Google hosty.
- Obrázky `loading="lazy"` mimo hero, `width`/`height` vždy uvedené kvůli CLS.
