# Jak přidat koncert

Všechny termíny se upravují **na jediném místě**: v souboru `koncerty.js` v kořeni
repozitáře. Karty na webu, tečky pod nimi i údaje pro Google se z něj vytvoří samy
ve všech třech jazycích (česky, anglicky, německy).

**Do `index.html` ani do anglické a německé verze už nesaháte.**

---

## Rychlý postup (3 minuty)

1. Na GitHubu otevřete soubor **`koncerty.js`**.
2. Klikněte na ikonu tužky vpravo nahoře (*Edit this file*).
3. Najděte seznam `var KONCERTY = [` a přidejte nový řádek podle vzoru níž.
4. Dole klikněte na **Commit changes**.
5. Počkejte asi minutu a obnovte web (Ctrl+F5 / Cmd+Shift+R).

---

## Vzor nového koncertu

```js
  { datum: '2026-12-12', cas: '19:30', misto: 'divadlo',
    nazev: { cs: 'Adventní koncert', en: 'Advent Concert', de: 'Adventskonzert' } },
```

Vložte ho mezi ostatní koncerty v seznamu. **Na pořadí nezáleží** — web si termíny
seřadí sám podle data.

Pozor jen na dvě věci:
- každý koncert končí čárkou `,` (kromě úplně posledního v seznamu),
- texty se píší do apostrofů `'takto'`.

### Co znamenají jednotlivé údaje

| Údaj | Jak vyplnit | Příklad |
|---|---|---|
| `datum` | vždy ve tvaru rok-měsíc-den | `'2026-12-12'` |
| `cas` | ve 24hodinovém formátu | `'19:30'` |
| `misto` | klíč ze seznamu míst (viz níž) | `'divadlo'` |
| `nazev` | název ve třech jazycích | `{ cs: '…', en: '…', de: '…' }` |
| `vstupenky` | nepovinné, odkaz na prodej | `'https://www.karlovarske-divadlo.cz/…'` |

Anglický web si sám přepočítá čas na `7:30pm` a přeloží měsíc. Německý napíše
`Dezember`. Vy vyplňujete jen jednou.

### S odkazem na vstupenky

```js
  { datum: '2026-12-12', cas: '19:30', misto: 'divadlo',
    nazev: { cs: 'Adventní koncert', en: 'Advent Concert', de: 'Adventskonzert' },
    vstupenky: 'https://www.karlovarske-divadlo.cz/' },
```

Pod kartou se objeví tlačítko „Vstupenky" a Google bude vědět, kde se prodávají.

---

## Místa konání

V `koncerty.js` je nahoře seznam `MISTA`. Už jsou v něm připravená:

| Klíč | Místo |
|---|---|
| `divadlo` | Karlovarské městské divadlo |
| `kynsperk` | Městské kulturní středisko, Kynšperk nad Ohří |
| `casino` | Společenský dům Casino, Mariánské Lázně |
| `kostel_fl` | Kostel sv. Petra a Pavla, Františkovy Lázně |

### Nové místo

Přidejte ho do seznamu `MISTA` podle vzoru:

```js
  sokolov: {
    nazev: { cs: 'Městský dům kultury', en: 'Municipal House of Culture', de: 'Städtisches Kulturhaus' },
    ulice: '5. května 655',
    mesto: { cs: 'Sokolov', en: 'Sokolov', de: 'Sokolov' },
    psc: '356 01'
  },
```

Pak u koncertu napíšete `misto: 'sokolov'`.

Adresa je důležitá — Google podle ní zobrazuje koncert v mapách a ve vyhledávání.

---

## Co se děje samo

- **Odehrané koncerty** zešednou a slider se posune na nejbližší budoucí termín.
  Počítá se to podle data v prohlížeči návštěvníka, takže nemusíte nic mazat.
- **Staré termíny** můžete v seznamu klidně nechat. Z údajů pro Google zmizí
  automaticky měsíc po odehrání.
- **Letní a zimní čas** se u údajů pro Google dopočítá sám.

---

## Časté chyby

**Koncerty se vůbec nezobrazí** → nejspíš chybí čárka mezi koncerty, nebo je
navíc za posledním. Na GitHubu se špatný řádek obvykle obarví jinak. Zkontrolujte
poslední úpravu a čárky na koncích řádků.

**Místo názvu se zobrazí klíč** (třeba `sokolov`) → místo není v seznamu `MISTA`
nebo je v klíči překlep. Klíče rozlišují malá a velká písmena.

**Změna se neprojeví** → GitHub potřebuje asi minutu na zveřejnění. Pak obnovte
stránku s Ctrl+F5 (Windows) nebo Cmd+Shift+R (Mac).

---

## Než přidáte hodně koncertů najednou

Vyplatí se zkontrolovat, že je vše správně, ještě před zveřejněním: na GitHubu
při úpravě přepněte na záložku **Preview** — ta ukáže barevně zvýrazněný kód
a překlepy v uvozovkách nebo čárkách jsou vidět na první pohled.

Po zveřejnění si web otevřete a ověřte, že se nový termín ukazuje i na
anglické (`/en/`) a německé (`/de/`) verzi.
