/* =====================================================================
   KONCERTY — jediné místo, kde se termíny upravují
   =====================================================================
   Návod je v souboru KONCERTY-NAVOD.md.
   Stačí upravit seznam KONCERTY níž. Karty na webu, tečky pod nimi
   i data pro Google se vytvoří samy ve všech třech jazycích.
   ===================================================================== */

/* Místa, kde hrajete. Klíč (vlevo) se pak píše u koncertu do „misto“. */
var MISTA = {
  divadlo: {
    nazev: { cs: 'Karlovarské městské divadlo', en: 'Karlovy Vary Municipal Theatre', de: 'Stadttheater Karlovy Vary' },
    ulice: 'Divadelní náměstí 21',
    mesto: { cs: 'Karlovy Vary', en: 'Karlovy Vary', de: 'Karlovy Vary' },
    psc: '360 01'
  },
  kynsperk: {
    nazev: { cs: 'Městské kulturní středisko', en: 'Municipal Cultural Centre', de: 'Städtisches Kulturzentrum' },
    ulice: 'Sokolovská 141',
    mesto: { cs: 'Kynšperk nad Ohří', en: 'Kynšperk nad Ohří', de: 'Kynšperk nad Ohří' },
    psc: '357 51'
  },
  casino: {
    nazev: { cs: 'Společenský dům Casino', en: 'Casino Assembly Hall', de: 'Kursaal Casino' },
    ulice: 'Reitenbergerova 95/4',
    mesto: { cs: 'Mariánské Lázně', en: 'Mariánské Lázně', de: 'Marienbad' },
    psc: '353 01'
  },
  kostel_fl: {
    nazev: { cs: 'Kostel sv. Petra a Pavla', en: 'Church of Sts Peter and Paul', de: 'Kirche St. Peter und Paul' },
    ulice: 'Ruská 15',
    mesto: { cs: 'Františkovy Lázně', en: 'Františkovy Lázně', de: 'Franzensbad' },
    psc: '351 01'
  }
};

/* =====================================================================
   SEZNAM KONCERTŮ — tady přidáváte a mažete
   datum: "RRRR-MM-DD"   cas: "19:30"   misto: klíč z MISTA výše
   nazev: text ve třech jazycích        vstupenky: odkaz (nepovinné)
   Pořadí nehraje roli, web si je seřadí sám podle data.
   ===================================================================== */
var KONCERTY = [
  { datum: '2026-05-06', cas: '19:30', misto: 'divadlo',
    nazev: { cs: 'Hvězdy jazzu', en: 'Jazz Stars', de: 'Jazz-Stars' } },

  { datum: '2026-06-27', cas: '19:30', misto: 'divadlo',
    nazev: { cs: 'Hvězdy jazzu', en: 'Jazz Stars', de: 'Jazz-Stars' } },

  { datum: '2026-09-19', cas: '19:30', misto: 'divadlo',
    nazev: { cs: 'Hvězdy jazzu', en: 'Jazz Stars', de: 'Jazz-Stars' } },

  { datum: '2026-09-20', cas: '16:00', misto: 'kynsperk',
    nazev: { cs: 'Výročí Jana Zmrzlého', en: 'Jan Zmrzlý Anniversary', de: 'Jan-Zmrzlý-Jubiläum' } },

  { datum: '2026-10-10', cas: '19:30', misto: 'divadlo',
    nazev: { cs: 'Hvězdy jazzu', en: 'Jazz Stars', de: 'Jazz-Stars' } },

  { datum: '2026-11-07', cas: '19:30', misto: 'divadlo',
    nazev: { cs: 'Hvězdy jazzu', en: 'Jazz Stars', de: 'Jazz-Stars' } }
];

/* =====================================================================
   Níž už nic upravovat nemusíte.
   ===================================================================== */
(function () {
  'use strict';
  var d = document;
  var jazyk = (d.documentElement.lang || 'cs').slice(0, 2);
  if (['cs', 'en', 'de'].indexOf(jazyk) < 0) jazyk = 'cs';

  var MESICE = {
    cs: ['Ledna', 'Února', 'Března', 'Dubna', 'Května', 'Června', 'Července', 'Srpna', 'Září', 'Října', 'Listopadu', 'Prosince'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  };
  var ZKRATKY = {
    cs: ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  };
  var POPISKY = {
    cs: { vstupenky: 'Vstupenky' }, en: { vstupenky: 'Tickets' }, de: { vstupenky: 'Tickets' }
  };

  function preloz(h) { return (h && typeof h === 'object') ? (h[jazyk] || h.cs) : h; }

  /* letní čas v Praze: od poslední neděle v březnu do poslední neděle v říjnu */
  function posun(datum) {
    var c = datum.split('-'), r = +c[0], m = +c[1], den = +c[2];
    function posledniNedele(rok, mesic) {
      var d = new Date(Date.UTC(rok, mesic, 31));
      while (d.getUTCMonth() !== mesic) d.setUTCDate(d.getUTCDate() - 1);
      return d.getUTCDate() - d.getUTCDay();
    }
    var od = posledniNedele(r, 2), do_ = posledniNedele(r, 9);
    var letni = (m > 3 && m < 10) || (m === 3 && den >= od) || (m === 10 && den < do_);
    return letni ? '+02:00' : '+01:00';
  }
  function dvojcifer(n) { return n < 10 ? '0' + n : String(n); }

  /* anglický web ukazuje čas ve tvaru 7:30pm */
  function cas(t) {
    if (jazyk !== 'en') return t;
    var c = t.split(':'), h = +c[0], m = c[1];
    var pm = h >= 12; h = h % 12; if (h === 0) h = 12;
    return h + ':' + m + (pm ? 'pm' : 'am');
  }

  function unik(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var seznam = KONCERTY.slice().sort(function (a, b) { return a.datum < b.datum ? -1 : 1; });

  /* ---------- karty a tečky ---------- */
  var rail = d.getElementById('gigRail');
  var dots = d.getElementById('gigDots');
  if (rail) {
    var karty = '', tecky = '';
    seznam.forEach(function (k, i) {
      var m = MISTA[k.misto] || { nazev: k.misto, ulice: '', mesto: '', psc: '' };
      var cast = k.datum.split('-'), rok = +cast[0], mes = +cast[1] - 1, den = +cast[2];
      var nazev = unik(preloz(k.nazev));
      var mistoN = unik(preloz(m.nazev));
      var adresa = [m.ulice, preloz(m.mesto)].filter(Boolean).join(', ');
      var odkaz = k.vstupenky
        ? '<a class="gig__tickets" href="' + unik(k.vstupenky) + '" target="_blank" rel="noopener">' + POPISKY[jazyk].vstupenky + '</a>'
        : '';
      karty += '<article class="gig" data-i="' + i + '" data-date="' + k.datum + '">' +
        '<span class="gig__day">' + dvojcifer(den) + '</span>' +
        '<span class="gig__when">' + MESICE[jazyk][mes] + ' ' + rok + ' &middot; ' + cas(k.cas) + '</span>' +
        '<h3 class="gig__name">' + nazev + '</h3>' +
        '<p class="gig__place"><span>' + mistoN + '</span><span class="gig__addr">' + unik(adresa) + '</span></p>' +
        odkaz + '</article>';
      tecky += '<button type="button" class="rail-dot" data-go="' + i + '" aria-label="' +
        nazev + ', ' + den + '. ' + ZKRATKY[jazyk][mes] + ' ' + rok + '"><i></i></button>';
    });
    rail.innerHTML = karty;
    if (dots) dots.innerHTML = tecky;
  }

  /* ---------- data pro Google (MusicEvent) ---------- */
  var dnes = new Date(); dnes.setHours(0, 0, 0, 0);
  var udalosti = seznam.filter(function (k) {
    var c = k.datum.split('-');
    return new Date(+c[0], +c[1] - 1, +c[2]) >= new Date(dnes.getTime() - 86400000 * 30);
  }).map(function (k) {
    var m = MISTA[k.misto] || {};
    var pre = jazyk === 'cs' ? '' : '/' + jazyk;
    return {
      '@type': 'MusicEvent',
      '@id': 'https://www.bigbandkv.cz' + pre + '/#koncert-' + k.datum,
      name: preloz(k.nazev),
      startDate: k.datum + 'T' + k.cas + ':00' + posun(k.datum),
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: preloz(m.nazev),
        address: {
          '@type': 'PostalAddress',
          streetAddress: m.ulice,
          addressLocality: preloz(m.mesto),
          postalCode: m.psc,
          addressCountry: 'CZ'
        }
      },
      performer: { '@id': 'https://www.bigbandkv.cz/#orchestr' },
      organizer: { '@id': 'https://www.bigbandkv.cz/#orchestr' },
      url: 'https://www.bigbandkv.cz' + pre + '/#koncerty',
      image: ['https://www.bigbandkv.cz/SEO/og-image.png'],
      inLanguage: jazyk,
      offers: k.vstupenky ? {
        '@type': 'Offer', url: k.vstupenky, availability: 'https://schema.org/InStock'
      } : undefined
    };
  });
  if (udalosti.length) {
    var s = d.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': udalosti });
    d.head.appendChild(s);
  }
})();
