# bigbandkv.cz

Statický jednostránkový web Big Bandu Karlovy Vary. Čisté HTML + CSS,
žádný framework, žádný build krok. Připraveno pro GitHub Pages.

Design: varianta **3a „Deco Ivory"** podle `BBKV-design-spec-3a.md`.

---

## Rychlý start

1. Vytvoř na GitHubu repozitář a nahraj do jeho kořene **celý obsah této složky**.
2. Settings → Pages → Source `Deploy from a branch`, větev `main`, složka `/ (root)`.
3. Custom domain `www.bigbandkv.cz` (soubor `CNAME` je připravený), zaškrtni **Enforce HTTPS**.
4. DNS u registrátora:
   - `A` pro `bigbandkv.cz` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` pro `www` → `<uzivatel>.github.io`
5. **Nejdřív si vše otestuj na `<uzivatel>.github.io`**, teprve pak přepni DNS.
   Webnode a nový web nemohou na doméně běžet současně.
6. **Webnode neruš hned** — nech předplatné ještě zhruba měsíc jako pojistku.
7. Ještě před zrušením Webnode spusť `bash skripty/stahnout-media.sh` (viz níže).

---

## Stav

| Část | Stav |
|---|---|
| CZ jednostránkový web | hotovo |
| Obsazení (19 hudebníků + host, po sekcích) | hotovo |
| Repertoár (48 skladeb) | hotovo |
| GDPR, podmínky užití, 404 | hotovo |
| Rozcestník článků `/blog/` + šablona článku | hotovo, články zatím nejsou |
| Favicony (zlatá trumpeta), logo v patičce | hotovo |
| robots.txt, sitemap.xml, manifest, llms.txt | hotovo |
| Přesměrování starých Webnode URL | hotovo |
| EN a DE mutace | připraveno, viz `PREKLAD.md` |
| Fotky, hero video, OG obrázky | **chybí — viz „Co doplnit"** |

---

## Struktura

```
index.html                  CZ jednostránkový web
404.html  gdpr.html  vop.html
blog/index.html             rozcestník článků
blog/_sablona-clanku.html   šablona pro nový článek (noindex)

data/koncerty.json          termíny koncertů
data/hudebnici.json         obsazení po sekcích
data/repertoar.json         seznam skladeb
build/generate.mjs          generátor obsahu
.github/workflows/          automatické přegenerování po změně dat

foto/  hudebnici/  video/   média (zatím prázdné)
favicon/  SEO/              ikony a logo
skripty/stahnout-media.sh   stažení fotek z Webnode

koncerty/ onas/ galerie/ kontakt/   přesměrování starých URL
en/ de/                             připraveno pro mutace

robots.txt  sitemap.xml  site.webmanifest  llms.txt  CNAME  .nojekyll
PREKLAD.md                  návod na spuštění EN a DE
```

---

## Jak přidat koncert

**Upravíš jediný soubor: `data/koncerty.json`.** Přidáš objekt s datem, časem,
názvem a místem a uložíš. V HTML nesaháš na nic.

Na GitHubu to jde přímo v prohlížeči: otevři `data/koncerty.json`, klikni na
tužku, přidej termín, ulož. Workflow *Přegenerovat obsah* pak spustí
`build/generate.mjs`, přepíše karty v `index.html` i strukturovaná data
`MusicEvent` (včetně správného časového pásma) a výsledek commitne.

Lokálně totéž udělá `node build/generate.mjs`.

Minulé koncerty **nemaž** — slider je ukazuje vlevo od nejbližšího termínu.
Do strukturovaných dat pro Google jdou jen budoucí.

Stejně fungují `data/hudebnici.json` a `data/repertoar.json`. Vše, co je
v `index.html` mezi značkami `<!-- AUTO:… -->`, generuje skript — ručně to
needituj, přepsalo by se to.

---

## Jak přidat článek

1. Zkopíruj `blog/_sablona-clanku.html` na `blog/<slug>.html`.
2. Uvnitř je komentář s kontrolním seznamem — nadpis, popis, canonical,
   datum, přepnutí `robots` z `noindex` na `index, follow`.
3. V `blog/index.html` nahraď blok „Připravujeme" kartou článku
   (šablona je v komentáři na konci souboru).
4. Přidej URL do `sitemap.xml`.

---

## Co doplnit

### 1. Média — udělej dřív, než zrušíš Webnode
```
bash skripty/stahnout-media.sh
```
Stáhne 19 fotek galerie, 20 portrétů a náhledy videí a převede je do WebP.
Po zrušení předplatného už jejich CDN nic nevydá.

Portréty pak potřebují **odmazat pozadí** a uložit jako PNG — viz
`hudebnici/README.md`. Dokud fotka chybí, dlaždice ukáže monogram.

Chybí ještě **hero video** (`video/README.md`) a **fotka kapelníka**
(`foto/kapelnik.webp`) — do té doby je v sekci Orchestr vidět placeholder,
který sám zmizí, jakmile soubor přibude.

### 2. Počet hudebníků — rozhodnout
Po odebrání Miloslava Šenitky má obsazení **19 hudebníků + 1 host**, ale text
na třech místech mluví o „dvaceti hudebnících" (perex v hero, odstavec
v sekci Orchestr, odpověď v dotazech) a meta description říká
„dvacetičlenný". Statistika ukazuje „20+". Řekni správné číslo a sjednotím to.

### 3. Rok u koncertů — potvrdit
Termíny na Webnode byly bez roku, odhadnut **2026** podle data zveřejnění.
Pokud je to jinak, oprav `data/koncerty.json`.

### 4. Právní subjekt
V `gdpr.html` a `vop.html` je HTML komentář `<!-- DOPLNIT -->`.
Potřebuji název subjektu (spolek / z. s. / OSVČ), IČO a sídlo.

### 5. Který GTM kontejner je živý
Starý web načítal dva najednou — `GTM-NJKLRNW8` a `GTM-542MMSL`. Do nového
patří jeden. Consent Mode v2 je připravený v `<head>`, stačí pod něj vložit
snippet vybraného kontejneru.

### 6. Odkazy na profily
Facebook, YouTube kanál, Instagram → doplní se do `sameAs` ve strukturovaných datech.

### 7. Názvy videí
Pět záznamů má zatím obecný popisek „záznam z koncertu".

### 8. OG obrázky
`SEO/og-image.jpg` (1200 × 630) a `SEO/twitter-card.jpg` (1200 × 628).
Zadání dodám, až doladíme web.

---

## Po nasazení

- Search Console → odeslat `sitemap.xml`, zkontrolovat indexaci
- Rich Results Test na `#koncerty` (schéma `MusicEvent`)
- založit / doplnit **Google Business Profile** a propojit s webem

Ověřovací meta tag Search Console z Webnode je v `index.html` zachovaný,
takže vlastnictví domény v GSC nepřijdeš a historie dat zůstane.

---

## Poznámky k technice

- **Opona** v úvodu běží celá v CSS — když selže JavaScript, animace doběhne
  a web se neschová. Přehraje se jednou za návštěvu, Escape ji přeskočí,
  při `prefers-reduced-motion` se nespustí.
- **YouTube fasáda** — přehrávač se načte až po kliknutí; do té doby YouTube
  o návštěvníkovi neví a stránka je o zhruba 1,5 MB lehčí.
- **Consent Mode v2** je ve výchozím stavu `denied` u všech kategorií.
  Cookie karta se ukáže, až návštěvník začne rolovat.
- **Slidery** koncertů a videí sdílejí jeden kus kódu, ovládají se šipkami,
  tečkami, šipkami na klávesnici i tahem prstu.
- JavaScript je rozdělený do samostatných bloků; chyba v jednom nepoloží
  zbytek stránky.
