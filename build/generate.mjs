/**
 * bigbandkv.cz — generátor obsahu
 *
 * Přepíše v index.html oblasti ohraničené značkami
 *   <!-- AUTO:NAZEV -->  ...  <!-- /AUTO:NAZEV -->
 * podle dat v /data/*.json.
 *
 * Spuštění:  node build/generate.mjs
 * Na GitHubu se spouští sám při každé změně souborů v /data/.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.bigbandkv.cz';
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));

const MESICE = ['Ledna','Února','Března','Dubna','Května','Června',
                'Července','Srpna','Září','Října','Listopadu','Prosince'];
const MESICE_KR = ['Led','Úno','Bře','Dub','Kvě','Čvn','Čvc','Srp','Zář','Říj','Lis','Pro'];

const esc = (s) => String(s ?? '')
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* ---------------------------------------------------------------- koncerty */
function koncerty() {
  const data = read('data/koncerty.json').koncerty
    .slice()
    .sort((a, b) => (a.datum + a.cas).localeCompare(b.datum + b.cas));

  const dnes = new Date(); dnes.setHours(0, 0, 0, 0);
  const budouci = data.filter(k => new Date(k.datum + 'T23:59') >= dnes);
  const prvniBudouciIndex = data.findIndex(k => budouci.includes(k));

  const slides = data.map((k, i) => {
    const d = new Date(k.datum + 'T' + k.cas);
    const minulost = new Date(k.datum + 'T23:59') < dnes;
    const den = String(d.getDate()).padStart(2, '0');
    const adresa = [k.ulice, k.mesto].filter(Boolean).join(', ');
    const listky = k.vstupenky
      ? `\n          <a class="gig__tickets" href="${esc(k.vstupenky)}" rel="noopener">Vstupenky</a>`
      : '';
    return `        <article class="gig${minulost ? ' gig--past' : ''}" data-i="${i}"${minulost ? ' data-past="1"' : ''}>
          <span class="gig__day">${den}</span>
          <span class="gig__when">${MESICE[d.getMonth()]} ${d.getFullYear()} &middot; ${esc(k.cas)}</span>
          <h3 class="gig__name">${esc(k.nazev)}</h3>
          <p class="gig__place"><span>${esc(k.misto)}</span>${adresa ? `<span class="gig__addr">${esc(adresa)}</span>` : ''}</p>${listky}
        </article>`;
  }).join('\n');

  const tecky = data.map((k, i) => {
    const d = new Date(k.datum + 'T' + k.cas);
    const minulost = new Date(k.datum + 'T23:59') < dnes;
    return `        <button type="button" class="rail-dot${minulost ? ' is-past' : ''}" data-go="${i}" aria-label="${esc(k.nazev)}, ${d.getDate()}. ${MESICE_KR[d.getMonth()]} ${d.getFullYear()}"><i></i></button>`;
  }).join('\n');

  const html =
`      <div class="gig-rail" id="gigRail" role="group" aria-label="Termíny koncertů" data-start="${prvniBudouciIndex < 0 ? data.length - 1 : prvniBudouciIndex}">
${slides}
      </div>
      <div class="gig-nav rail-nav">
        <button type="button" class="rail-arrow" id="gigPrev" aria-label="Předchozí termín"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4 7 12l8 8"/></svg></button>
        <div class="rail-dots" id="gigDots">
${tecky}
        </div>
        <button type="button" class="rail-arrow" id="gigNext" aria-label="Další termín"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8"/></svg></button>
      </div>`;

  /* strukturovaná data — jen budoucí koncerty */
  const events = budouci.map(k => {
    const off = tz(k.datum);
    const adr = { '@type': 'PostalAddress', addressLocality: k.mesto, addressCountry: k.zeme || 'CZ' };
    if (k.ulice) adr.streetAddress = k.ulice;
    if (k.psc) adr.postalCode = k.psc;
    const ev = {
      '@type': 'MusicEvent',
      '@id': `${SITE}/#koncert-${k.datum}`,
      name: k.nazev,
      startDate: `${k.datum}T${k.cas}:00${off}`,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: k.misto, address: adr },
      performer: { '@id': `${SITE}/#orchestr` },
      organizer: { '@id': `${SITE}/#orchestr` },
      image: `${SITE}/SEO/og-image.jpg`,
      url: `${SITE}/#koncerty`,
      inLanguage: 'cs-CZ'
    };
    if (k.vstupenky) ev.offers = { '@type': 'Offer', url: k.vstupenky, availability: 'https://schema.org/InStock' };
    return ev;
  });

  return { html, events };
}

/** letní čas v ČR: poslední neděle v březnu → poslední neděle v říjnu */
function tz(datum) {
  const d = new Date(datum + 'T12:00:00Z');
  const rok = d.getUTCFullYear();
  const posledniNedele = (mesic) => {
    const x = new Date(Date.UTC(rok, mesic + 1, 0));
    x.setUTCDate(x.getUTCDate() - x.getUTCDay());
    return x;
  };
  return (d >= posledniNedele(2) && d < posledniNedele(9)) ? '+02:00' : '+01:00';
}

/* --------------------------------------------------------------- obsazení */
function obsazeni() {
  const sekce = read('data/hudebnici.json').sekce.filter(s => s.clenove.length);

  const mono = (jm) => jm.split(' ').filter(p => !/^(ml\.|st\.)$/.test(p))
    .map(p => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

  const html = sekce.map(s => {
    const karty = s.clenove.map(c => {
      const role = c.nastroj || '— doplnit —';
      const alt = c.nastroj
        ? `${c.jmeno} — ${c.nastroj}, Big Band Karlovy Vary`
        : `${c.jmeno} — člen Big Bandu Karlovy Vary`;
      return `          <figure class="member${c.nastroj ? '' : ' member--todo'}">
            <div class="member__tile">
              <span class="member__mono" aria-hidden="true">${esc(mono(c.jmeno))}</span>
              <img src="/hudebnici/${esc(c.soubor)}.png" width="330" height="440" loading="lazy" decoding="async" alt="${esc(alt)}" onerror="this.remove()">
            </div>
            <figcaption>
              <span class="member__name">${esc(c.jmeno)}</span>
              <span class="member__role">${esc(role)}</span>
            </figcaption>
          </figure>`;
    }).join('\n');
    return `      <div class="member-row reveal-stagger" data-section="${esc(s.id)}">
        <h3 class="member-row__title">${esc(s.nazev)}</h3>
        <div class="member-row__grid">
${karty}
        </div>
      </div>`;
  }).join('\n');

  const persons = [];
  for (const s of sekce) for (const c of s.clenove) {
    const p = { '@type': 'Person', name: c.jmeno };
    if (c.nastroj) p.jobTitle = c.nastroj;
    if (c.jmeno === 'David Kleňha') { p['@id'] = `${SITE}/#david-klenha`; p.sameAs = ['https://www.davidklenha.cz/']; }
    persons.push(p);
  }
  return { html, persons };
}

/* -------------------------------------------------------------- repertoár */
function repertoar() {
  const s = read('data/repertoar.json').skladby;
  const polozky = s.map((x, i) => `          <li class="song${i >= 12 ? ' song--more' : ''}"><span class="song__t">${esc(x.nazev)}</span><span class="song__a">${esc(x.autor)}</span></li>`).join('\n');
  const html =
`        <ul class="songs is-collapsed" id="songList">
${polozky}
        </ul>
        <div class="songs-foot">
          <button type="button" class="btn btn--outline" id="songsToggle" aria-expanded="false" aria-controls="songList">
            <span>Zobrazit celý repertoár (${s.length} skladeb)</span>
          </button>
        </div>`;
  return { html, pocet: s.length };
}

/* ------------------------------------------------------------------ JSON-LD */
function jsonld(events, persons, pocetSkladeb) {
  const faq = [
    ['Kolik hudebníků má Big Band Karlovy Vary?',
     'Orchestr má dvacet hudebníků — trubky, pozouny, saxofony a rytmiku — a k tomu dva sólisty: zpěváka Davida Kleňhu a zpěvačku Mirku Lendělovou.'],
    ['Odkdy orchestr existuje a kdo ho založil?',
     'Big Band Karlovy Vary vznikl v roce 1986. Založil ho pozounista Milan Hart, vyznavač swingové taneční hudby, který kolem sebe soustředil renomované hudebníky karlovarského regionu.'],
    ['Je možné orchestr pozvat na vlastní akci?',
     'Ano. Big Band Karlovy Vary hraje na plesech, městských slavnostech, firemních večerech a adventních koncertech. Termín a podmínky domluvíte s kapelníkem Zdeňkem Krámem na telefonu +420 607 947 301 nebo e-mailem.'],
    ['Kdo orchestr vede dnes?',
     'Od roku 1998 vede Big Band Karlovy Vary Zdeněk Krám. Navázal spolu s hudebníky na myšlenky zakladatele — šířit swingovou a jazzovou hudbu pro všechny generace.'],
    ['Jaký hraje orchestr repertoár?',
     `Pilířem repertoáru jsou skladby klasiků jazzové hudby — Duke Ellington, Count Basie, Benny Goodman a Frank Sinatra. Kromě swingu má orchestr v repertoáru také latinské a popové skladby. Nastudovaných je ${pocetSkladeb} skladeb se zpěvem.`],
    ['Kde je možné Big Band Karlovy Vary slyšet?',
     'Orchestr vystupuje především v Karlovarském kraji. Pravidelně hraje v Karlovarském městském divadle, v Mariánských Lázních a ve Františkových Lázních. Vystupoval také v příhraničním Bavorsku.'],
    ['Hraje orchestr i v zahraničí?',
     'Ano. Orchestr vystupoval v příhraničním Bavorsku, například v Luhe-Wildenau. Vzdálenost od Karlových Varů k německé hranici je zhruba čtyřicet kilometrů.'],
    ['Kolik stojí vystoupení big bandu?',
     'Cena závisí na délce programu, místě konání, technickém zázemí a termínu. Konkrétní nabídku pošleme na vyžádání — napište nebo zavolejte kapelníkovi.']
  ];

  const graph = [
    { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`,
      name: 'Big Band Karlovy Vary', inLanguage: 'cs-CZ',
      publisher: { '@id': `${SITE}/#orchestr` } },

    { '@type': 'WebPage', '@id': `${SITE}/#webpage`, url: `${SITE}/`,
      name: 'Big Band Karlovy Vary — swingový orchestr od roku 1986',
      description: 'Big Band Karlovy Vary — dvacetičlenný swingový orchestr se zpěvákem a zpěvačkou. Ellington, Basie, Goodman, Sinatra. Koncerty v Karlovarském městském divadle, Mariánských a Františkových Lázních.',
      isPartOf: { '@id': `${SITE}/#website` }, about: { '@id': `${SITE}/#orchestr` },
      inLanguage: 'cs-CZ',
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.hero__lead', '#orchestr .lead'] } },

    { '@type': ['MusicGroup', 'PerformingGroup', 'Organization'], '@id': `${SITE}/#orchestr`,
      name: 'Big Band Karlovy Vary',
      alternateName: ['Big Band KV', 'BBKV', 'Bigband Karlovy Vary'],
      url: `${SITE}/`,
      description: 'Swingový orchestr z Karlových Varů založený v roce 1986. Dvacet hudebníků, zpěvák a zpěvačka. Repertoár staví na skladbách Duke Ellingtona, Counta Basieho, Bennyho Goodmana a Franka Sinatry, doplněných o latinské a popové skladby.',
      foundingDate: '1986',
      foundingLocation: { '@type': 'Place', name: 'Karlovy Vary',
        address: { '@type': 'PostalAddress', addressLocality: 'Karlovy Vary', addressCountry: 'CZ' } },
      founder: { '@type': 'Person', name: 'Milan Hart', jobTitle: 'pozounista, zakladatel orchestru' },
      genre: ['Swing', 'Jazz', 'Big band', 'Latin jazz'],
      numberOfEmployees: { '@type': 'QuantitativeValue', value: 20 },
      member: persons,
      image: `${SITE}/SEO/og-image.jpg`,
      logo: `${SITE}/favicon/favicon-512.png`,
      email: 'kramzdenek@seznam.cz',
      telephone: '+420607947301',
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Karlovarský kraj' },
        { '@type': 'Country', name: 'Česká republika' },
        { '@type': 'Country', name: 'Deutschland' }],
      contactPoint: { '@type': 'ContactPoint', contactType: 'booking',
        name: 'Zdeněk Krám — kapelník', telephone: '+420607947301',
        email: 'kramzdenek@seznam.cz', availableLanguage: ['cs', 'de', 'en'] },
      event: events.map(e => ({ '@id': e['@id'] })) },

    { '@type': 'FAQPage', '@id': `${SITE}/#faq`, inLanguage: 'cs-CZ',
      mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q,
        acceptedAnswer: { '@type': 'Answer', text: a } })) },

    ...events
  ];

  return '<script type="application/ld+json">\n' +
    JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2) +
    '\n</script>';
}

/* ------------------------------------------------------------------- zápis */
function nahrad(html, klic, obsah) {
  const re = new RegExp(`(<!-- AUTO:${klic} -->)[\\s\\S]*?(<!-- /AUTO:${klic} -->)`);
  if (!re.test(html)) throw new Error(`Značka AUTO:${klic} v index.html nenalezena.`);
  return html.replace(re, `$1\n${obsah}\n$2`);
}

const k = koncerty();
const o = obsazeni();
const r = repertoar();

let html = readFileSync(join(ROOT, 'index.html'), 'utf8');
html = nahrad(html, 'KONCERTY', k.html);
html = nahrad(html, 'OBSAZENI', o.html);
html = nahrad(html, 'REPERTOAR', r.html);
html = nahrad(html, 'JSONLD', jsonld(k.events, o.persons, r.pocet));
writeFileSync(join(ROOT, 'index.html'), html);

console.log(`index.html přegenerováno:
  koncertů:   ${read('data/koncerty.json').koncerty.length} (z toho ${k.events.length} budoucích ve strukturovaných datech)
  hudebníků:  ${o.persons.length}
  skladeb:    ${r.pocet}`);
