# Jak spustit anglickou a německou verzi

Struktura je připravená, chybí jen přeložené soubory. Postup je pro obě
mutace stejný — níže je rozepsaný pro `/en/`, pro `/de/` platí totéž.

## 1. Zkopírovat soubory

```
index.html        →  en/index.html
gdpr.html         →  en/gdpr.html
vop.html          →  en/vop.html
404.html          →  en/404.html
blog/index.html   →  en/blog/index.html
```

Ve složce `en/` už leží dočasná přesměrování starých Webnode adres
(`/en/concerts/`, `/en/about-us/`, `/en/gallery/`, `/en/contact/`).
**Ty nech být** — drží autoritu ze starého webu. Přepiš jen `en/index.html`.

## 2. Co změnit v hlavičce každé stránky

| Co | Z | Na |
|---|---|---|
| `<html lang=`  | `cs` | `en` / `de` |
| `<link rel="canonical">` | `.../` | `.../en/` |
| `og:locale` | `cs_CZ` | `en_GB` / `de_DE` |
| `inLanguage` v JSON-LD | `cs-CZ` | `en-GB` / `de-DE` |
| `title`, `description`, `og:*` | česky | přeloženo |

## 3. Zapnout hreflang

V `<head>` je zakomentovaný blok `JAZYKOVÉ MUTACE`. Odkomentuj ho ve
**všech třech** jazykových verzích — musí být identický, jinak si Google
párování jazyků nepotvrdí.

## 4. Zapnout přepínač v navigaci

V `index.html` jsou dvě místa (navigace a mobilní menu), kde jsou EN a DE
zatím jako neaktivní `<span aria-disabled="true">`. Nahraď je odkazy:

```html
<a href="/en/" hreflang="en" lang="en">EN</a>
<a href="/de/" hreflang="de" lang="de">DE</a>
```

V anglické verzi bude aktivní `<span aria-current="true">EN</span>`
a odkazy povedou na `/` a `/de/`. Obdobně pro němčinu.

## 5. Data

`data/koncerty.json` má u názvů koncertů už pole `cs` / `en` / `de`.
Generátor zatím sype jen češtinu — až budou mutace hotové, rozšíří se
`build/generate.mjs` o jazykový parametr. Řekni a doplním to.

## 6. Sitemap

Do `sitemap.xml` přidej URL nových jazyků a ke každé skupině
`xhtml:link rel="alternate"` pro všechny tři jazyky.

## 7. Po nasazení

- Search Console → zkontrolovat sestavu *Mezinárodní cílení*
- ověřit, že `/en/` i `/de/` vracejí 200 a mají správný `lang`
- projet Rich Results Test na `MusicEvent` v každé mutaci

## Priorita

Němčina má větší potenciál než angličtina — hranice je 40 km, orchestr
už hrál v Luhe-Wildenau a Mariánské i Františkovy Lázně mají německy
mluvící publikum. Doporučuju pořadí **DE → EN**.
