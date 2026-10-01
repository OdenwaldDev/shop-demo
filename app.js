(function(){"use strict";
/* ================= Icons ================= */
const I = (p, v = '0 0 24 24') => `<svg viewBox="${v}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICO = {
  pfeil: I('<path d="M4 12h16M14 6l6 6-6 6"/>'),
  pfeilL: I('<path d="M20 12H4M10 6l-6 6 6 6"/>'),
  suche: I('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'),
  herz: I('<path d="M12 20s-7.5-4.6-9.2-9.4C1.6 7.2 3.8 4 7.1 4c2 0 3.4 1.1 4.9 3 1.5-1.9 2.9-3 4.9-3 3.3 0 5.5 3.2 4.3 6.6C19.5 15.4 12 20 12 20z"/>'),
  korb: I('<path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'),
  zu: I('<path d="M6 6l12 12M18 6 6 18"/>'),
  check: I('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  lkw: I('<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>'),
  ort: I('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  nadel: I('<path d="M19 3 8.5 13.5M15 3h4v4"/><path d="M8.5 13.5c-2 2-4.5 2.5-5.5 4.5s1 4 3 3 2.5-3.5 4.5-5.5"/>'),
  kal: I('<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
  uhr: I('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  info: I('<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>'),
  lineal: I('<path d="M3 15 15 3l6 6L9 21z"/><path d="m7 11 2 2M10 8l2 2M13 5l2 2"/>'),
  schild: I('<path d="M12 3 4.5 6v6c0 4.5 3.2 7.6 7.5 9 4.3-1.4 7.5-4.5 7.5-9V6z"/><path d="m9 12 2 2 4-4"/>'),
  zurueck: I('<path d="M4 9h11a5 5 0 0 1 0 10H8"/><path d="m8 5-4 4 4 4"/>'),
  geschenk: I('<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8c-1.5-3-5-3.5-5-1.2C7 8.5 12 8 12 8zm0 0c1.5-3 5-3.5 5-1.2C17 8.5 12 8 12 8z"/>'),
  hand: I('<path d="M12 7.5c-1-1.7-3.5-1.9-4.5-.3-1 1.5.2 3.4 4.5 6.3 4.3-2.9 5.5-4.8 4.5-6.3-1-1.6-3.5-1.4-4.5.3z"/><path d="M3 15h3l4 3h6.5a1.5 1.5 0 0 0 0-3H12"/><path d="M6 15v5H3"/>'),
  team: I('<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M14.5 14.3c.8-.3 1.6-.5 2.5-.5 2.2 0 3.8 1.4 4.3 4"/>'),
  luft: I('<path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7"/>'),
  waesche: I('<path d="M4 7h16l-1.5 12h-13z"/><path d="M4 7c2 2 4 2 6 0s4-2 6 0 4 2 4 0"/><text x="12" y="16.5" font-size="6" text-anchor="middle" fill="currentColor" stroke="none" font-family="sans-serif">30</text>'),
  buegeln: I('<path d="M4 17h16c0-5-3-8-8-8H8L6 13"/><circle cx="12" cy="14" r=".6" fill="currentColor"/>'),
  insta: I('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8" fill="currentColor"/>'),
  tiktok: I('<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 4c.5 2.5 2.4 4 5 4"/>'),
  fb: I('<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>'),
  stern: I('<path d="m12 3 2.6 6 6.4.6-4.8 4.3 1.4 6.3L12 17l-5.6 3.2 1.4-6.3L3 9.6 9.4 9z"/>'),
  plus: I('<path d="M12 5v14M5 12h14"/>'),
  minus: I('<path d="M5 12h14"/>'),
  blitz: I('<path d="M13 3 5 13h6l-1 8 8-10h-6z"/>'),
  play: I('<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>'),
  teilen: I('<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1"/>'),
  wa: I('<path d="M4 20l1.2-3.6A8 8 0 1 1 8 19z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 1c-1.2-.5-2.4-1.7-2.9-2.9l1-1-1-2z"/>'),
  tropfen: I('<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>'),
};
const WAPPEN = `<svg viewBox="0 0 40 46" fill="none" aria-hidden="true"><path d="M3 3h34v19.5c0 11.6-7.7 18.6-17 21.5C10.7 41.1 3 34.1 3 22.5z" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><g fill="currentColor"><path d="M7.8 17.1c.3-4.4 1.6-7.4 5.2-7.4s4.9 3 5.2 7.4l2 2.6h-14.4z"/><circle cx="13" cy="8.6" r="1.1"/><circle cx="13" cy="21.1" r="1.5"/><path d="M21.8 17.1c.3-4.4 1.6-7.4 5.2-7.4s4.9 3 5.2 7.4l2 2.6h-14.4z"/><circle cx="27" cy="8.6" r="1.1"/><circle cx="27" cy="21.1" r="1.5"/><path d="M14.8 31.1c.3-4.4 1.6-7.4 5.2-7.4s4.9 3 5.2 7.4l2 2.6h-14.4z"/><circle cx="20" cy="22.6" r="1.1"/><circle cx="20" cy="35.1" r="1.5"/></g></svg>`;

/* ================= Termine (immer relativ zu heute, damit die Demo frisch bleibt) ================= */
const JETZT = new Date();
const TAG = 864e5;
function naechsterSonntag(minTage) { const d = new Date(JETZT.getTime() + minTage * TAG); d.setDate(d.getDate() + ((7 - d.getDay()) % 7)); d.setHours(20, 0, 0, 0); return d; }
const DROP1_ENDE = naechsterSonntag(5);
const DROP1_START = new Date(DROP1_ENDE.getTime() - 16 * TAG); DROP1_START.setHours(18, 0, 0, 0);
const DROP2_START = (() => { const d = new Date(DROP1_ENDE.getTime() + 26 * TAG); d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7)); d.setHours(18, 0, 0, 0); return d; })();
function kw(d) { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const n = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - n); const j = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return Math.ceil(((t - j) / TAG + 1) / 7); }
const VERSAND_KW = kw(new Date(DROP1_ENDE.getTime() + 21 * TAG));
const fDatum = (d, o) => d.toLocaleDateString('de-DE', o || { day: '2-digit', month: '2-digit' });
const fTag = d => d.toLocaleDateString('de-DE', { weekday: 'long' });

/* ================= Linien ================= */
const LINIEN = {
  mannschaft: { w: 'team', name: 'Mannschaft', nr: '01', zeile: 'Teamwear für Platz, Training und Spieltag.', bild: 'team-anzug-tasche', fp: '46% 4%' },
  '1896': { w: 'street', name: '1896', nr: '02', zeile: 'Streetwear in limitierten Drops. Bestickt, vorbestellt, nie wieder aufgelegt.', bild: '1896-crew-kirche', fp: '55% 8%' },
  merch: { w: 'fan', name: 'Merch', nr: '03', zeile: 'Schals, Mützen und Kleinkram für alle, die dazugehören.', bild: 'merch-schal-bank-hoch', fp: '30% 55%' },
};

/* Bildschwerpunkte (object-position), damit Gesichter und Produkte im Ausschnitt bleiben */
const FOKUS = { 'team-anzug-tasche': '46% 4%', '1896-crew-kirche': '55% 8%', 'merch-schal-bank-hoch': '30% 55%', 'team-anzug-treppe': '38% 14%', '1896-hoodie-treppe': '58% 60%', '1896-hoodie-bank-weit': '72% 55%', 'team-tribuene': '50% 25%', 'kids-papa': '50% 20%', 'team-hoodie-ruecken': '50% 30%' };

/* ================= Produkte (Dummy) ================= */
const GR_ERW = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const GR_KIDS = ['116', '128', '140', '152', '164'];
const P = [
  // ---------- Mannschaft ----------
  { s: 'heimtrikot-26-27', l: 'mannschaft', k: 'trikots', n: 'Heimtrikot 26/27', u: 'Royal · Teamline', p: 59.95, img: ['team-trikot-royal-kids', 'kids-trikot-royal', 'd-number'], gr: GR_ERW, aus: ['XS'], wenig: ['XXL'], b: ['Bestseller', 'Personalisierbar'], pers: true, f: [['Royal', '#1F57C3', 'heimtrikot-26-27'], ['Night Navy', '#1A2238', 'auswaertstrikot-26-27']],
    t: 'Das Trikot, in dem samstags gespielt wird. Leichtes, atmungsaktives Funktionsmaterial, gesticktes Vereinswappen und der Partner auf der Brust.', mat: ['100 % recyceltes Polyester, 140 g/m²', 'Feuchtigkeitstransport mit Mesh-Einsätzen', 'Wappen gestickt, Partner-Logo im Transferdruck'], fit: 'Regular Fit. Fällt normal aus. Wer es lockerer mag, nimmt eine Größe größer.', model: 'Spieler ist 1,82 m und trägt M.' },
  { s: 'auswaertstrikot-26-27', l: 'mannschaft', k: 'trikots', n: 'Auswärtstrikot 26/27', u: 'Night Navy · Teamline', p: 59.95, img: ['team-trikot', 'd-number', 'team-tribuene'], gr: GR_ERW, aus: [], wenig: ['S'], b: ['Neu', 'Personalisierbar'], pers: true, f: [['Royal', '#1F57C3', 'heimtrikot-26-27'], ['Night Navy', '#1A2238', 'auswaertstrikot-26-27']],
    t: 'Dunkel, ruhig, selbstbewusst. Das Auswärtstrikot in Night Navy mit weißen Akzenten und großer Rückennummer.', mat: ['100 % recyceltes Polyester, 140 g/m²', 'Kragen mit Rippbündchen', 'Nummer und Name auf Wunsch geflockt'], fit: 'Regular Fit. Fällt normal aus.', model: 'Spieler ist 1,38 m und trägt 140.' },
  { s: 'praesentationsanzug', l: 'mannschaft', k: 'praesentation', n: 'Präsentationsanzug Matchday', u: 'Jacke + Hose · Schwarz/Weiß', p: 89.95, img: ['team-anzug-treppe', 'team-anzug', 'team-anzug-tasche'], gr: GR_ERW, aus: [], wenig: ['M'], b: ['Bestseller'], f: [['Schwarz', '#1C1D20', 'praesentationsanzug']],
    t: 'Für den Weg zum Platz und die Bank. Gewebte Jacke mit Stehkragen, schmale Hose mit Reißverschluss am Saum.', mat: ['Jacke: 100 % Polyester, leicht glänzend', 'Hose: Polyester mit Elasthan', 'Wappen gestickt auf der Brust'], fit: 'Slim Fit. Bei breiten Schultern eine Größe größer.', model: 'Spieler ist 1,85 m und trägt L.' },
  { s: 'trainingsjacke-damen', l: 'mannschaft', k: 'training', n: 'Trainingsjacke Damen', u: 'Taillierter Schnitt', p: 54.95, img: ['team-jacke-damen', 'team-anzug'], gr: ['XS', 'S', 'M', 'L', 'XL'], aus: [], wenig: [], b: ['Neu'], f: [['Schwarz', '#1C1D20', 'trainingsjacke-damen']],
    t: 'Die Trainingsjacke im taillierten Schnitt. Weiche Innenseite, hoher Kragen, Daumenschlaufen.', mat: ['Doppelstrick, 100 % Polyester', 'Zwei Seitentaschen mit Reißverschluss', 'Wappen gestickt'], fit: 'Tailliert. Fällt normal aus.', model: 'Model ist 1,70 m und trägt S.' },
  { s: 'coach-polo', l: 'mannschaft', k: 'coach', n: 'Coach Polo', u: 'Navy · Trainerteam', p: 34.95, img: ['team-polo', 'team-tribuene'], gr: GR_ERW, aus: [], wenig: [], b: [], f: [['Navy', '#1E2A44', 'coach-polo']],
    t: 'Das Polo fürs Trainerteam. Schnell trocknend, knitterfrei, mit Platz für Initialen am Ärmel.', mat: ['Piqué-Funktionsmaterial, 100 % Polyester', 'Zwei-Knopf-Leiste', 'Initialen am Ärmel möglich'], fit: 'Regular Fit.', model: 'Trainer ist 1,80 m und trägt L.' },
  { s: 'team-hoodie', l: 'mannschaft', k: 'training', n: 'Team Hoodie Rücken', u: 'Navy · Rückenprint', p: 49.95, img: ['team-hoodie-ruecken', 'd-backprint'], gr: GR_ERW, aus: ['XXL'], wenig: [], b: [], f: [['Navy', '#1A2238', 'team-hoodie']],
    t: 'Der Hoodie für die ganze Mannschaft. Großer Rückenprint, damit man auch von hinten weiß, wer da kommt.', mat: ['80 % Baumwolle, 20 % Polyester, 320 g/m²', 'Rückenprint im Siebdruck', 'Kängurutasche'], fit: 'Regular Fit.', model: 'Spieler ist 1,78 m und trägt M.' },
  { s: 'kids-trainingsanzug', l: 'mannschaft', k: 'training', kids: true, n: 'Trainingsanzug Kids', u: 'Jacke + Hose', p: 64.95, img: ['team-kids-anzug', 'kids-papa'], gr: GR_KIDS, aus: ['116'], wenig: ['164'], b: ['Kids'], f: [['Schwarz', '#1C1D20', 'kids-trainingsanzug']],
    t: 'Der Anzug für die Kleinen. Robust, waschbar bei 40 Grad und mit Platz zum Reinwachsen.', mat: ['100 % Polyester', 'Knie verstärkt', 'Name innen auf dem Etikett eintragbar'], fit: 'Fällt normal aus. Zwischen zwei Größen lieber die größere.', model: 'Kind ist 1,32 m und trägt 128.' },
  { s: 'heimtrikot-kids', l: 'mannschaft', k: 'trikots', kids: true, n: 'Heimtrikot Kids 26/27', u: 'Royal · Teamline', p: 49.95, img: ['kids-trikot-royal', 'team-trikot-royal-kids'], gr: GR_KIDS, aus: [], wenig: ['140'], b: ['Kids', 'Personalisierbar'], pers: true, f: [['Royal', '#1F57C3', 'heimtrikot-kids']],
    t: 'Das gleiche Trikot wie bei den Großen, nur kleiner. Mit Name und Nummer wird es zum Lieblingsteil.', mat: ['100 % recyceltes Polyester', 'Wappen gestickt'], fit: 'Regular Fit.', model: 'Kind ist 1,40 m und trägt 140.' },
  { s: 'sporttasche', l: 'mannschaft', k: 'taschen', acc: true, n: 'Sporttasche Team', u: '45 Liter · Schuhfach', p: 39.95, img: ['team-anzug-tasche', 'team-anzug'], gr: ['One Size'], aus: [], wenig: [], b: [], f: [['Schwarz', '#1C1D20', 'sporttasche']],
    t: 'Passt alles rein: Schuhe, Trikot, Duschzeug, Kabinenlautsprecher. Separates Schuhfach, abwischbarer Boden.', mat: ['Polyester 600D, wasserabweisend', 'Separates Schuhfach', 'Gepolsterter Schultergurt'], fit: '55 × 30 × 28 cm, 45 Liter.', model: '' },

  // ---------- 1896 ----------
  { s: 'crew-royal-heritage', l: '1896', k: 'crew', d: '01', n: 'Crewneck Royal Heritage', u: 'Drop 01 · Heavy Fleece', p: 79, img: ['1896-crew-blau', '1896-crew-kirche', 'd-crest-chest', '1896-bank'], gr: GR_ERW, aus: ['XS'], wenig: ['M', 'L'], b: ['Limited', 'Vorbestellung'], vor: true, f: [['Royal', '#2B58B8', 'crew-royal-heritage'], ['Stone Grey', '#A9A7A2', 'crew-stone-grey']],
    t: 'Schwerer Sweat in Royal mit weißen Ärmeln. Das Wappen ist gestickt, nicht gedruckt. Wird erst nach Bestellschluss für dich gefertigt.', mat: ['100 % Baumwolle, 420 g/m², gebürstet', 'Wappen in Flachstick, 9.000 Stiche', 'Rippbündchen mit Elasthan'], fit: 'Boxy Fit. Etwas weiter und kürzer geschnitten. Für einen normalen Sitz eine Größe kleiner.', model: 'Model ist 1,84 m und trägt L.' },
  { s: 'crew-stone-grey', l: '1896', k: 'crew', d: '01', n: 'Crewneck Stone Grey', u: 'Drop 01 · Heavy Fleece', p: 79, img: ['1896-crew-grau-treppe', '1896-couch', 'd-crest-grey'], gr: GR_ERW, aus: [], wenig: ['XL'], b: ['Limited', 'Vorbestellung'], vor: true, f: [['Royal', '#2B58B8', 'crew-royal-heritage'], ['Stone Grey', '#A9A7A2', 'crew-stone-grey']],
    t: 'Melierter Heavy Fleece in Stone Grey. Ruhig, zeitlos und mit gesticktem Wappen auf der Brust.', mat: ['80 % Baumwolle, 20 % Polyester, 420 g/m²', 'Wappen gestickt', 'Seitennähte für bessere Form'], fit: 'Boxy Fit. Für normalen Sitz eine Größe kleiner.', model: 'Model ist 1,79 m und trägt M.' },
  { s: 'hoodie-1896-glocken', l: '1896', k: 'hoodie', d: '01', n: 'Hoodie 1896 Glocken', u: 'Drop 01 · Midnight Navy', p: 89, img: ['1896-hoodie-treppe', 'd-stick-1896', '1896-hoodie-bank-weit'], gr: GR_ERW, aus: [], wenig: ['S', 'M'], b: ['Limited', 'Vorbestellung'], vor: true, f: [['Midnight Navy', '#1B2235', 'hoodie-1896-glocken']],
    t: 'Das Herzstück von Drop 01. Ton in Ton gestickt: 1896, Mörlenbach und die drei Glocken. Auf dem Ärmel noch einmal die Jahreszahl.', mat: ['100 % Bio-Baumwolle, 450 g/m²', 'Stick in Off-White und Silber', 'Doppellagige Kapuze, Metallenden an der Kordel'], fit: 'Relaxed Fit. Fällt normal aus.', model: 'Model ist 1,82 m und trägt L.' },
  { s: 'hoodie-mehr-als-ein-verein', l: '1896', k: 'hoodie', d: '01', n: 'Hoodie Mehr als ein Verein', u: 'Drop 01 · Rückenprint', p: 89, img: ['1896-mehr-als-ein-verein', 'd-hoodie-back', 'd-graffiti'], gr: GR_ERW, aus: ['XXL'], wenig: [], b: ['Limited', 'Vorbestellung'], vor: true, f: [['Navy', '#1A2238', 'hoodie-mehr-als-ein-verein']],
    t: 'Großer Rücken, große Aussage. Puff-Print im Rücken, kleines Wappen vorne. Für die Tage auf der Tribüne und alle danach.', mat: ['100 % Baumwolle, 450 g/m²', 'Puff-Print im Rücken', 'Gesticktes Wappen vorne'], fit: 'Oversized. Eine Größe kleiner für normalen Sitz.', model: 'Model ist 1,80 m und trägt M.' },
  { s: 'track-jacket-1896', l: '1896', k: 'jacken', d: '01', n: 'Track Jacket 1896', u: 'Drop 01 · Retro Track', p: 99, img: ['1896-treppe', '1896-couch-2', '1896-mauer'], gr: GR_ERW, aus: [], wenig: ['L'], b: ['Limited', 'Vorbestellung'], vor: true, f: [['Schwarz', '#1C1D20', 'track-jacket-1896']],
    t: 'Die Trainingsjacke, die nicht zum Training will. Retro-Schnitt, gewebte Streifen, hoher Kragen.', mat: ['Tricot, 100 % Polyester', 'Gewebte Seitenstreifen', 'YKK-Reißverschluss'], fit: 'Regular Fit.', model: 'Model ist 1,77 m und trägt M.' },
  { s: 'hoodie-heritage-navy', l: '1896', k: 'hoodie', d: '01', n: 'Hoodie Heritage Navy', u: 'Drop 01 · Wappen-Stick', p: 85, img: ['1896-hoodie-bank-weit', 'd-crest-chest'], gr: GR_ERW, aus: [], wenig: [], b: ['Limited', 'Vorbestellung'], vor: true, f: [['Navy', '#1B2235', 'hoodie-heritage-navy']],
    t: 'Klassisch im besten Sinn: Mörlenbach, 1896 und das Wappen in Off-White gestickt. Der Hoodie für jeden Tag.', mat: ['100 % Baumwolle, 420 g/m²', 'Stick in Off-White', 'Rippbündchen'], fit: 'Regular Fit.', model: '' },
  { s: 'cap-1896-cream', l: '1896', k: 'caps', d: '01', acc: true, n: 'Cap 1896 Cream', u: 'Drop 01 · Washed Cotton', p: 35, img: ['d-cap', '1896-crew-cap-cafe'], gr: ['One Size'], aus: [], wenig: ['One Size'], b: ['Limited', 'Vorbestellung'], vor: true, f: [['Cream', '#E9E4D8', 'cap-1896-cream']],
    t: 'Sechs Felder, gewaschene Baumwolle, Wappen und Jahreszahl gestickt. Verstellbar mit Metallschnalle.', mat: ['100 % Baumwolle, gewaschen', 'Stick in Schwarz', 'Verstellbar mit Metallschnalle'], fit: 'One Size, 54 bis 60 cm.', model: '' },
  { s: 'crew-heather', l: '1896', k: 'crew', d: '01', n: 'Crewneck Heather', u: 'Drop 01 · Oatmeal', p: 79, img: ['1896-crew-cap-cafe', 'd-cap'], gr: GR_ERW, aus: [], wenig: ['XS'], b: ['Limited', 'Vorbestellung'], vor: true, f: [['Oatmeal', '#DCD8D0', 'crew-heather']],
    t: 'Hell, weich und mit Wappen-Stick in Schwarz. Der Pullover für den Sonntagmorgen am Marktplatz.', mat: ['80 % Baumwolle, 20 % Polyester, 400 g/m²', 'Stick in Schwarz', 'Raglan-Ärmel'], fit: 'Boxy Fit.', model: '' },

  // ---------- Merch ----------
  { s: 'fanschal-heimat', l: 'merch', k: 'schals', n: 'Fanschal Heimat', u: 'Jacquard · Royal/Weiß', p: 19.95, img: ['merch-schal-bank-wappen', 'merch-schal-bank-hoch', 'd-scarf-crest'], gr: ['One Size'], aus: [], wenig: [], b: ['Bestseller'], acc: true, f: [['Royal', '#1F57C3', 'fanschal-heimat']],
    t: 'Gestrickt, nicht gedruckt. Der Schal für Spieltag, Weihnachtsmarkt und die Bank am Brunnen.', mat: ['100 % Acryl, Jacquard-Strick', 'Fransen an beiden Enden', '140 × 18 cm'], fit: 'One Size.', model: '' },
  { s: 'fanschal-glocken', l: 'merch', k: 'schals', n: 'Fanschal Glocken', u: 'Jacquard · Navy', p: 19.95, img: ['merch-schal', 'd-knit'], gr: ['One Size'], aus: [], wenig: [], b: [], acc: true, f: [['Navy', '#1A2238', 'fanschal-glocken']],
    t: 'Navy mit weißen Streifen und großem Glocken-Wappen. Klassisch, warm und stadiontauglich.', mat: ['100 % Acryl, Jacquard-Strick', '140 × 18 cm'], fit: 'One Size.', model: '' },
  { s: 'balkenschal', l: 'merch', k: 'schals', n: 'Balkenschal', u: 'Royal/Weiß gestreift', p: 22.95, img: ['merch-balkenschal', 'merch-schal-royal'], gr: ['One Size'], aus: [], wenig: [], b: ['Neu'], acc: true, f: [['Royal/Weiß', '#1F57C3', 'balkenschal']],
    t: 'Breite Balken, extra lang. Der Schal, den man auch von der anderen Seite des Platzes sieht.', mat: ['100 % Acryl', '160 × 20 cm'], fit: 'One Size.', model: '' },
  { s: 'supporter-hoodie', l: 'merch', k: 'hoodies', n: 'Supporter Hoodie', u: 'Grau meliert', p: 44.95, img: ['merch-hoodie-grau', 'merch-gruppe'], gr: GR_ERW, aus: [], wenig: [], b: [], f: [['Grau', '#B9B8B4', 'supporter-hoodie']],
    t: 'Der gemütliche Hoodie für alle, die am Rand stehen und trotzdem mitspielen.', mat: ['80 % Baumwolle, 20 % Polyester, 300 g/m²', 'Wappen gedruckt'], fit: 'Regular Fit.', model: 'Model ist 1,66 m und trägt S.' },
  { s: 'beanie-wappen', l: 'merch', k: 'muetzen', n: 'Beanie Wappen', u: 'Navy · Umschlag', p: 19.95, img: ['merch-gruppe', 'd-knit'], gr: ['One Size'], aus: [], wenig: [], b: [], acc: true, f: [['Navy', '#1A2238', 'beanie-wappen']],
    t: 'Warm, weich, mit gesticktem Wappen auf dem Umschlag. Passt zu allem, was im Winter am Platz getragen wird.', mat: ['100 % Acryl, Feinstrick', 'Wappen gestickt'], fit: 'One Size.', model: '' },
  { s: 'cap-royal', l: 'merch', k: 'muetzen', n: 'Cap Royal', u: 'Wappen-Stick', p: 24.95, img: ['ill-cap.svg'], gr: ['One Size'], aus: [], wenig: [], b: [], acc: true, ill: true, f: [['Royal', '#1F57C3', 'cap-royal']],
    t: 'Die Kappe für sonnige Spieltage. Vereinsblau, weißer Stick, verstellbar.', mat: ['100 % Baumwolle', 'Stick in Weiß', 'Klettverschluss'], fit: 'One Size, 54 bis 60 cm.', model: '' },
  { s: 'trinkflasche', l: 'merch', k: 'unterwegs', n: 'Trinkflasche Edelstahl', u: '750 ml · doppelwandig', p: 16.95, img: ['ill-flasche.svg'], gr: ['750 ml'], aus: [], wenig: [], b: ['Neu'], acc: true, ill: true, f: [['Navy', '#1E355E', 'trinkflasche']],
    t: 'Hält 24 Stunden kalt und 12 Stunden warm. Für Training, Büro und Auswärtsfahrt.', mat: ['Edelstahl, doppelwandig', 'Pulverbeschichtung', 'BPA-frei'], fit: '750 ml, 27 cm hoch.', model: '' },
  { s: 'stoffbeutel', l: 'merch', k: 'unterwegs', n: 'Stoffbeutel Mörlenbach', u: 'Bio-Baumwolle', p: 14.95, img: ['ill-beutel.svg'], gr: ['One Size'], aus: [], wenig: [], b: [], acc: true, ill: true, f: [['Natur', '#EDE6D6', 'stoffbeutel']],
    t: 'Für den Wochenmarkt, die Bücherei und alles dazwischen. Mehr als ein Verein, auch beim Einkaufen.', mat: ['100 % Bio-Baumwolle, 280 g/m²', 'Lange Henkel', 'Siebdruck'], fit: '38 × 42 cm.', model: '' },
  { s: 'gutschein', l: 'merch', k: 'kleinkram', n: 'Geschenkgutschein', u: 'Per E-Mail · 25 bis 100 €', p: 25, img: ['ill-gutschein.svg'], gr: ['25 €', '50 €', '75 €', '100 €'], aus: [], wenig: [], b: ['Neu'], acc: true, ill: true, gut: true, f: [['Navy', '#1E355E', 'gutschein']],
    t: 'Wenn du nicht weißt, welche Größe oder welche Linie: Der Gutschein passt immer. Einlösbar für Mannschaft, Merch und jeden Drop.', mat: ['Kommt sofort per E-Mail als PDF', 'Drei Jahre gültig', 'Auch für Vorbestellungen einlösbar'], fit: 'Einlösbar im ganzen Store.', model: '' },
  { s: 'pin-set', l: 'merch', k: 'kleinkram', n: 'Pin-Set Drei Glocken', u: 'Emaille · 3 Stück', p: 9.95, img: ['ill-pins.svg'], gr: ['Set'], aus: [], wenig: [], b: [], acc: true, ill: true, f: [['Gold', '#C9A659', 'pin-set']],
    t: 'Drei Emaille-Pins für Jacke, Rucksack oder Cap. Kommen auf einer Karte, perfekt zum Verschenken.', mat: ['Hartemaille mit Goldrand', 'Butterfly-Verschluss'], fit: '25 bis 32 mm.', model: '' },
];
const PS = Object.fromEntries(P.map(x => [x.s, x]));
const bildUrl = (n, klein) => n.endsWith('.svg') ? 'img/' + n : `img/${n}${klein && !n.startsWith('d-') && !n.includes('bank-wappen') && !n.includes('bank-hoch') ? '-s' : ''}.webp`;
const LINIE_W = { mannschaft: 'team', '1896': 'street', merch: 'fan' };

/* Kategorien */
const KATS = {
  mannschaft: [['trikots', 'Trikots'], ['training', 'Training'], ['praesentation', 'Präsentation'], ['coach', 'Coachwear'], ['taschen', 'Taschen']],
  '1896': [['crew', 'Crewnecks'], ['hoodie', 'Hoodies'], ['jacken', 'Jacken'], ['caps', 'Caps']],
  merch: [['schals', 'Schals'], ['muetzen', 'Mützen & Caps'], ['hoodies', 'Hoodies'], ['unterwegs', 'Für unterwegs'], ['kleinkram', 'Kleinkram']],
};

/* Größentabellen (cm, Brustweite halbe / Länge) */
const GTAB = {
  erw: { kopf: ['Größe', 'Brust (cm)', 'Länge (cm)', 'Körpergröße'], z: [['XS', 48, 66, '160–167'], ['S', 51, 69, '167–173'], ['M', 54, 72, '173–179'], ['L', 57, 74, '179–185'], ['XL', 60, 76, '185–191'], ['XXL', 63, 78, '191–197']] },
  kids: { kopf: ['Größe', 'Brust (cm)', 'Länge (cm)', 'Alter'], z: [['116', 36, 48, '5–6 J.'], ['128', 39, 52, '7–8 J.'], ['140', 42, 56, '9–10 J.'], ['152', 45, 60, '11–12 J.'], ['164', 48, 64, '13–14 J.']] },
};

/* ================= Helfer ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const eur = n => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
const BASE = window.BASE || '/';
const U = p => BASE + String(p).replace(/^\//, '');
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const woerter = (txt, cls = '') => txt.split(/ (?![^<]*>)/).map(w => `<span class="wz ${cls}"><span>${w}</span></span>`).join(' ');
function srcset(n) { if (n.endsWith('.svg')) return `src="img/${n}"`; const hatS = !n.startsWith('d-') && !/bank-(wappen|hoch)/.test(n); return hatS ? `src="img/${n}-s.webp" srcset="img/${n}-s.webp 560w, img/${n}.webp 1122w"` : `src="img/${n}.webp"`; }

/* ================= Zustand ================= */
const S = { korb: ls.get('svd_korb', []), merk: ls.get('svd_merk', []) };
const korbSumme = () => S.korb.reduce((a, x) => a + x.p * x.m, 0);
const korbAnz = () => S.korb.reduce((a, x) => a + x.m, 0);
const FREI_AB = 75;
function korbRein(slug, gr, pers) {
  const pr = PS[slug]; const key = slug + '|' + gr + '|' + (pers ? pers.name + pers.nr : '');
  const vorh = S.korb.find(x => x.key === key);
  const preis = (pr.gut ? parseFloat(gr) : pr.p) + (pers ? 12 : 0);
  if (vorh) vorh.m++; else S.korb.push({ key, s: slug, gr, m: 1, p: preis, pers });
  ls.set('svd_korb', S.korb); korbMalen(); zaehler(true); konfetti();
  toast(`<img src="${bildUrl(pr.img[0], true)}" alt=""><span><b>${esc(pr.n)}</b><br>Größe ${esc(gr)} liegt im Warenkorb</span>`);
}
function merken(slug) {
  const i = S.merk.indexOf(slug); if (i >= 0) S.merk.splice(i, 1); else S.merk.push(slug);
  ls.set('svd_merk', S.merk);
  $$(`[data-herz="${slug}"]`).forEach(b => b.classList.toggle('on', S.merk.includes(slug)));
  zaehler(); if (i < 0) toast(`${ICO.herz}<span>Auf dem Merkzettel</span>`);
}
function zaehler(bump) {
  const em = $('#korbBtn em'); const n = korbAnz(); em.textContent = n; em.classList.toggle('da', n > 0);
  if (bump) { const b = $('#korbBtn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  const m = $('#merkBtn em'); m.textContent = S.merk.length; m.classList.toggle('da', S.merk.length > 0);
}
let toastT; function toast(html, ms = 2600) { const t = $('#toast'); t.innerHTML = html; t.classList.add('auf'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('auf'), ms); }

/* ================= Produktkachel ================= */
function kachel(p, o = {}) {
  const b2 = p.img[1] && !p.ill ? `<img class="b2" ${srcset(p.img[1])} sizes="(max-width:720px) 50vw, 25vw" alt="" loading="lazy">` : '';
  const badges = (o.badges !== false ? p.b : []).slice(0, 2).map(x => `<span class="chip ${x === 'Limited' || x === 'Neu' ? 'akz' : 'hell'}">${x}</span>`).join('');
  const gr = p.gr.length > 1 ? `<div class="schnell"><b>Schnell in den Warenkorb</b>${p.gr.map(g => `<button data-schnell="${p.s}" data-gr="${g}" class="${p.aus.includes(g) ? 'aus' : ''}">${g}</button>`).join('')}</div>` : '';
  return `<article class="kachel${p.ill ? ' illu' : ''}" ${o.r ? 'data-r' : ''} style="${o.d ? `transition-delay:${o.d}ms` : ''}">
    <div class="bildw"><img class="b1" ${srcset(p.img[0])} sizes="(max-width:720px) 50vw, 25vw" alt="${esc(p.n)}" loading="lazy">${b2}
      <div class="badges">${badges}</div>
      <button class="herz${S.merk.includes(p.s) ? ' on' : ''}" data-herz="${p.s}" aria-label="Merken">${ICO.herz}</button>${gr}</div>
    <div class="info"><h3>${esc(p.n)}</h3><span class="preis num">${p.vor ? '' : ''}${eur(p.p)}</span><p>${esc(p.u)}</p>
      ${p.f.length > 1 ? `<div class="farben">${p.f.map(f => `<i style="background:${f[1]}" title="${f[0]}"></i>`).join('')}</div>` : ''}</div>
    <a class="flaeche" href="${U('p/' + p.s)}" data-link aria-label="${esc(p.n)} ansehen"></a></article>`;
}

/* ================= Countdown ================= */
function uhrHtml(ziel, labels = true) {
  return `<div class="uhr" data-uhr="${ziel.getTime()}">${['Tage', 'Std', 'Min', 'Sek'].map((l, i) => `${i ? '<i>:</i>' : ''}<div><b>00</b>${labels ? `<span>${l}</span>` : ''}</div>`).join('')}</div>`;
}
function uhrenTick() {
  $$('[data-uhr]').forEach(u => {
    let s = Math.max(0, Math.floor((+u.dataset.uhr - Date.now()) / 1000));
    const v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
    $$('b', u).forEach((b, i) => { const t = String(v[i]).padStart(2, '0'); if (b.textContent !== t) b.textContent = t; });
  });
}
setInterval(uhrenTick, 1000);

/* ================= Rahmen ================= */
function rahmen() {
  const navItems = [['mannschaft', 'Mannschaft'], ['1896', '1896'], ['merch', 'Merch'], ['kids', 'Kids'], ['accessoires', 'Accessoires'], ['drops', 'Drops'], ['verein', 'Verein'], ['faq', 'FAQ']];
  const msg = ['Kostenloser Versand ab 75 €', 'Abholung am Sportplatz kostenlos', `Drop 01 läuft bis ${fTag(DROP1_ENDE)}, ${fDatum(DROP1_ENDE)}`, 'Name und Nummer auf jedes Trikot', 'Jeder Kauf unterstützt die Jugend', `Drop 02 am ${fDatum(DROP2_START)} um 18 Uhr`];
  const spur = [...msg, ...msg].map(m => `<span><i></i>${m}</span>`).join('');
  document.body.insertAdjacentHTML('afterbegin', `
  <a class="vh" href="#haupt">Zum Inhalt springen</a>
  <div class="oben" id="oben"><div class="topbar"><div class="spur">${spur}</div></div>
    <header class="hdr">
      <nav class="hnav" aria-label="Hauptmenü">${navItems.slice(0, 6).map(([k, t]) => `<a href="${U(k)}" data-link data-nav="${k}" class="${k === 'drops' ? 'drop' : ''}">${t}</a>`).join('')}</nav>
      <button class="ibtn menue-btn" id="menueBtn" aria-label="Menü öffnen"><span></span><span></span></button>
      <a class="marke" href="${U('')}" data-link aria-label="SV Mörlenbach Store, Startseite">${WAPPEN}<span><b>SV MÖRLENBACH</b><small>STORE · EST. 1896</small></span></a>
      <div class="hicons"><a class="hnav" href="${U('verein')}" data-link data-nav="verein" style="margin-right:12px">Verein</a>
        <button class="ibtn" id="suchBtn" aria-label="Suchen">${ICO.suche}</button>
        <a class="ibtn" id="merkBtn" href="${U('merkzettel')}" data-link aria-label="Merkzettel">${ICO.herz}<em>0</em></a>
        <button class="ibtn" id="korbBtn" aria-label="Warenkorb">${ICO.korb}<em>0</em></button></div>
    </header></div>
  <div class="menue" id="menue" aria-hidden="true"><button class="zu" id="menueZu" aria-label="Menü schließen">${ICO.zu}</button>
    <div class="links"><nav>${navItems.map(([k, t], i) => `<a href="${U(k)}" data-link data-bild="${{ mannschaft: 'team-anzug-treppe', '1896': '1896-hoodie-treppe', merch: 'merch-schal-bank-hoch', kids: 'kids-trikot-royal', accessoires: '1896-crew-cap-cafe', drops: '1896-mauer', verein: 'team-tribuene', faq: 'merch-gruppe' }[k]}" style="transition-delay:${120 + i * 45}ms"><small>0${i + 1}</small>${t}</a>`).join('')}</nav>
      <div class="klein-links"><a href="#" data-tour>▶ Tour starten</a><a href="${U('konzept')}" data-link>Konzept</a><a href="${U('faq#versand')}" data-link>Versand</a><a href="${U('faq#vorbestellung')}" data-link>Vorbestellung</a><a href="${U('merkzettel')}" data-link>Merkzettel</a><span>Ei gude!</span></div></div>
    <div class="bild">${['team-anzug-treppe', '1896-hoodie-treppe', 'merch-schal-bank-hoch', 'kids-trikot-royal', '1896-crew-cap-cafe', '1896-mauer', 'team-tribuene', 'merch-gruppe'].map((b, i) => `<img src="img/${b}${b.includes('bank-hoch') ? '' : '-s'}.webp" data-b="${b}" class="${i ? '' : 'on'}" alt="">`).join('')}</div></div>
  <main id="haupt" tabindex="-1"></main>
  <footer class="fuss" id="fuss"></footer>
  <div class="schleier" id="schleier"></div>
  <aside class="lade" id="lade" aria-label="Warenkorb"><div class="lade-kopf"><h2>Warenkorb<sup id="ladeAnz"></sup></h2><button class="zu" id="ladeZu" aria-label="Schließen">${ICO.zu}</button></div>
    <div class="versandbalken" id="versandbalken"></div><div class="lade-inhalt" id="ladeInhalt"></div><div class="lade-fuss" id="ladeFuss"></div></aside>
  <div class="suche" id="suche" role="dialog" aria-label="Suche"><div class="feld">${ICO.suche}<input id="sucheIn" type="search" placeholder="Wonach suchst du?" autocomplete="off"><button class="ibtn" id="sucheZu" aria-label="Suche schließen">${ICO.zu}</button></div>
    <div class="vorschlag">${['Hoodie', 'Trikot', 'Schal', 'Drop 01', 'Kids', 'Cap', 'Geschenk'].map(v => `<button data-v="${v}">${v}</button>`).join('')}</div><div class="treffer" id="treffer"></div></div>
  <div class="vorhang" id="vorhang"><div class="wort"></div><div class="unter"><span></span><span>SV Mörlenbach · Est. 1896</span></div></div>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <div class="demo-pill"><a href="${U('konzept')}" data-link aria-label="Konzept-Demo"><i>i</i><span>Konzept</span></a><button id="tourBtn" aria-label="Tour starten">${ICO.play}<span>Tour</span></button></div>
  <div class="zeiger" id="zeiger">ANSEHEN</div>`);
  $('#fuss').innerHTML = fussHtml();
  // Menü
  const menue = $('#menue');
  const auf = a => { menue.classList.toggle('auf', a); menue.setAttribute('aria-hidden', !a); document.body.style.overflow = a ? 'hidden' : ''; };
  $('#menueBtn').onclick = () => auf(true); $('#menueZu').onclick = () => auf(false);
  $$('#menue nav a').forEach(a => a.addEventListener('mouseenter', () => $$('#menue .bild img').forEach(i => i.classList.toggle('on', i.dataset.b === a.dataset.bild))));
  window.menueZu = () => auf(false);
  // Korb
  $('#korbBtn').onclick = () => lade(true); $('#ladeZu').onclick = () => lade(false); $('#schleier').onclick = () => { lade(false); };
  // Suche
  $('#suchBtn').onclick = () => suche(true); $('#sucheZu').onclick = () => suche(false);
  $('#sucheIn').oninput = sucheMalen;
  $$('#suche .vorschlag button').forEach(b => b.onclick = () => { $('#sucheIn').value = b.dataset.v; sucheMalen(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { lade(false); suche(false); auf(false); $$('.dlg,.lupe').forEach(d => d.remove()); } if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName))) { e.preventDefault(); suche(true); } });
  korbMalen(); zaehler();
  // Header-Verhalten beim Scrollen
  let letzt = 0;
  addEventListener('scroll', () => {
    const y = scrollY, o = $('#oben');
    o.classList.toggle('kompakt', y > 40);
    o.classList.toggle('weg', y > 500 && y > letzt + 4 && !document.body.classList.contains('lade-auf'));
    if (y < letzt - 4) o.classList.remove('weg');
    letzt = y;
  }, { passive: true });
}
function lade(a) { $('#lade').classList.toggle('auf', a); $('#schleier').classList.toggle('auf', a); document.body.classList.toggle('lade-auf', a); if (a) korbMalen(); }
function suche(a) { $('#suche').classList.toggle('auf', a); $('#schleier').classList.toggle('auf', a); if (a) setTimeout(() => $('#sucheIn').focus(), 300); }
function sucheMalen() {
  const q = $('#sucheIn').value.trim().toLowerCase(); const t = $('#treffer');
  if (!q) { t.innerHTML = ''; return; }
  const alias = { geschenk: ['schal', 'pin', 'flasche', 'beutel', 'cap'], 'drop 01': ['drop 01'] };
  const R = P.filter(p => { const h = `${p.n} ${p.u} ${p.l} ${p.k} ${p.b.join(' ')} ${p.kids ? 'kids kinder' : ''}`.toLowerCase(); return h.includes(q) || (alias[q] || []).some(a => h.includes(a)); });
  t.innerHTML = R.length ? R.map(p => `<a href="${U('p/' + p.s)}" data-link><img ${srcset(p.img[0])} sizes="160px" alt="" style="${p.ill ? 'object-fit:contain;padding:12%' : ''}">${esc(p.n)}<span>${eur(p.p)}</span></a>`).join('') : `<p style="color:#777">Nichts gefunden. Probier es mit „Hoodie“, „Schal“ oder „Trikot“.</p>`;
}
function korbMalen() {
  const sum = korbSumme(); const rest = Math.max(0, FREI_AB - sum);
  $('#ladeAnz').textContent = korbAnz() ? `(${korbAnz()})` : '';
  $('#versandbalken').innerHTML = rest > 0 ? `Noch <b>${eur(rest)}</b> bis zum kostenlosen Versand<div class="spur"><i style="width:${Math.min(100, sum / FREI_AB * 100)}%"></i></div>` : `<b>Kostenloser Versand</b> ist freigeschaltet. Stark!<div class="spur"><i style="width:100%"></i></div>`;
  const vorschlag = P.filter(p => !S.korb.some(k => k.s === p.s) && p.p < 30).slice(0, 3);
  $('#ladeInhalt').innerHTML = S.korb.length ? S.korb.map((x, i) => { const p = PS[x.s]; return `<div class="kpos"><img ${srcset(p.img[0])} sizes="84px" alt="" style="${p.ill ? 'object-fit:contain;padding:8%' : ''}"><div><h4>${esc(p.n)}</h4><p>Größe ${esc(x.gr)}${x.pers ? ` · ${esc(x.pers.name)} ${esc(x.pers.nr)}` : ''}${p.vor ? ' · Vorbestellung' : ''}</p>
      <div class="menge"><button data-m="${i}" data-d="-1" aria-label="weniger">−</button><span>${x.m}</span><button data-m="${i}" data-d="1" aria-label="mehr">+</button></div></div>
      <div class="re"><span class="num">${eur(x.p * x.m)}</span><button data-weg="${i}">Entfernen</button></div></div>`; }).join('')
    + `<div class="dazu"><h5>Passt dazu</h5><div class="reihe">${vorschlag.map(p => `<a href="${U('p/' + p.s)}" data-link><img ${srcset(p.img[0])} sizes="120px" alt="" style="${p.ill ? 'object-fit:contain;padding:10%' : ''}">${esc(p.n)}<b>${eur(p.p)}</b></a>`).join('')}</div></div>`
    : `<div class="leer">${ICO.korb}<b>Dein Warenkorb ist noch leer.</b><span style="color:#777;font-size:14px">Wie wär’s mit was Warmem für den Spieltag?</span><a class="btn klein" href="${U('1896')}" data-link>Zu Drop 01 ${ICO.pfeil}</a></div>`;
  $('#ladeFuss').innerHTML = S.korb.length ? `<div class="summe"><span>Zwischensumme</span><span class="num">${eur(sum)}</span></div><span style="font-size:12.5px;color:#777">inkl. MwSt. Versand oder kostenlose Abholung am Sportplatz wählst du an der Kasse.</span><a class="btn voll" href="${U('kasse')}" data-link>Zur Kasse ${ICO.pfeil}</a>` : '';
  $$('#ladeInhalt [data-m]').forEach(b => b.onclick = () => { const x = S.korb[+b.dataset.m]; x.m += +b.dataset.d; if (x.m < 1) S.korb.splice(+b.dataset.m, 1); ls.set('svd_korb', S.korb); korbMalen(); zaehler(); });
  $$('#ladeInhalt [data-weg]').forEach(b => b.onclick = () => { S.korb.splice(+b.dataset.weg, 1); ls.set('svd_korb', S.korb); korbMalen(); zaehler(); });
}
function fussHtml() {
  return `<div class="wrap"><div class="oben-f">
    <div class="nl"><h4>Die Drop-Liste</h4><b style="font-size:24px;font-weight:750;letter-spacing:-.02em">Ei gude! Sei als Erstes dabei.</b><p>Neue Drops, Bestellschluss und Abholtermine. Höchstens zwei Mails im Monat, versprochen.</p>
      <form data-demo="Danke! In der Demo wird nichts gespeichert."><input type="email" placeholder="Deine E-Mail" aria-label="E-Mail" required><button>Eintragen ${ICO.pfeil}</button></form>
      <div class="zahl-arten"><span>Vorkasse</span><span>Bar bei Abholung</span><span>PayPal (geplant)</span></div></div>
    <div><h4>Shop</h4><ul>${[['mannschaft', 'Mannschaft'], ['1896', '1896'], ['merch', 'Merch'], ['kids', 'Kids'], ['accessoires', 'Accessoires'], ['drops', 'Drops'], ['alle', 'Alle Produkte']].map(([k, t]) => `<li><a href="${U(k)}" data-link>${t}</a></li>`).join('')}</ul></div>
    <div><h4>Service</h4><ul>${[['faq#versand', 'Versand & Abholung'], ['faq#vorbestellung', 'Vorbestellung & Drops'], ['faq#veredelung', 'Veredelung'], ['faq#groessen', 'Größenberatung'], ['faq#team', 'Teambestellung'], ['faq#kontakt', 'Kontakt']].map(([k, t]) => `<li><a href="${U(k)}" data-link>${t}</a></li>`).join('')}</ul></div>
    <div><h4>Verein</h4><ul><li><a href="${U('verein')}" data-link>Über uns</a></li><li><a href="${U('verein')}#geld" data-link>Wohin dein Geld geht</a></li><li><a href="${U('faq')}" data-link>FAQ</a></li><li><a href="${U('konzept')}" data-link>Konzept & Styleguide</a></li></ul></div>
    <div><h4>Folgen</h4><ul><li><a href="#" data-demo="Hier käme der Instagram-Kanal des Vereins hin.">Instagram</a></li><li><a href="#" data-demo="Hier käme TikTok hin.">TikTok</a></li><li><a href="#" data-demo="Hier käme Facebook hin.">Facebook</a></li></ul>
      <h4 style="margin-top:28px">Kleingedrucktes</h4><ul><li><a href="${U('info/impressum')}" data-link>Impressum</a></li><li><a href="${U('info/datenschutz')}" data-link>Datenschutz</a></li><li><a href="${U('info/agb')}" data-link>AGB & Widerruf</a></li></ul></div>
  </div></div>
  <div class="gross" aria-hidden="true">${'MÖRLENBACH'.split('').map(c => `<span>${c}</span>`).join('')}</div>
  <div class="wrap"><div class="unten-f"><span>© ${JETZT.getFullYear()} SV Mörlenbach 1896 e.V. · Konzept-Demo, Produkte und Preise beispielhaft</span><span>Gemacht im Odenwald. Mach’s gut, bis Samstag.</span></div></div>`;
}

/* ================= Router + Übergänge ================= */
const ROUTEN = [];
const route = (re, fn) => ROUTEN.push([re, fn]);
function pfad() { let p = location.pathname; if (BASE !== '/' && p.startsWith(BASE)) p = '/' + p.slice(BASE.length); return (p.replace(/\/index\.html$/, '/').replace(/(.)\/$/, '$1')) || '/'; }
function weltVon(p) {
  if (/^\/(mannschaft)/.test(p)) return 'team'; if (/^\/(1896|drops|drop\/)/.test(p)) return 'street'; if (/^\/merch/.test(p)) return 'fan';
  const m = p.match(/^\/p\/(.+)$/); if (m && PS[m[1]]) return LINIE_W[PS[m[1]].l];
  if (p === '/') return 'home'; return 'neutral';
}
let laeuft = false;
async function geh(url, opt = {}) {
  if (laeuft) return; const ziel = new URL(url, location.href);
  if (ziel.pathname === location.pathname && !opt.immer) { if (ziel.hash) $(ziel.hash)?.scrollIntoView({ behavior: 'smooth' }); else scrollTo({ top: 0, behavior: 'smooth' }); return; }
  laeuft = true; lade(false); suche(false); window.menueZu && window.menueZu();
  const alt = pfad(); history.pushState({}, '', ziel.pathname + ziel.search + ziel.hash); const neu = pfad();
  const w = weltVon(neu); const linienSeite = /^\/(mannschaft|1896|merch|drops)$/.test(neu) && neu !== alt;
  try {
    if (opt.flip) await flipRein(opt.flip);
    else if (linienSeite && !ruhig) await vorhangZu(w, { mannschaft: 'Mannschaft', '1896': '1896', merch: 'Merch', drops: 'Drops' }[neu.slice(1)]);
    else if (!ruhig) await blende(true);
    await zeigen(); if (ziel.hash) setTimeout(() => $(ziel.hash)?.scrollIntoView(), 60);
    if (opt.flip) await flipRaus();
    else if (linienSeite && !ruhig) await vorhangAuf(); else if (!ruhig) await blende(false);
  } finally { laeuft = false; }
}
async function vorhangZu(w, wort) {
  const v = $('#vorhang'); v.dataset.w = w; v.style.visibility = 'visible';
  $('.wort', v).innerHTML = wort.split('').map((c, i) => `<span style="transform:translateY(110%);transition:transform .7s ${i * 30}ms var(--ease)">${c}</span>`).join('');
  $('.unter span', v).textContent = { team: '01 · Teamwear', street: '02 · Limitierte Drops', fan: '03 · Für alle' }[w] || '';
  await v.animate([{ transform: 'translateY(105vh)' }, { transform: 'translateY(0)' }], { duration: 650, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' }).finished;
  $$('.wort span', v).forEach(s => s.style.transform = 'none'); await sleep(520);
}
async function vorhangAuf() {
  const v = $('#vorhang');
  await v.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-105vh)' }], { duration: 800, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' }).finished;
  v.getAnimations().forEach(a => a.cancel()); v.style.transform = 'translateY(105vh)'; v.style.visibility = 'hidden';
}
async function blende(raus) { const h = $('#haupt'); await h.animate(raus ? [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-14px)' }] : [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: raus ? 260 : 520, easing: 'cubic-bezier(.16,.84,.24,1)' }).finished; }
let flipEl;
async function flipRein(img) {
  const r = img.getBoundingClientRect(); flipEl = img.cloneNode(); Object.assign(flipEl.style, { position: 'fixed', zIndex: 210, left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', objectFit: 'cover', margin: 0, animation: 'none', transform: 'none', filter: 'none' });
  document.body.appendChild(flipEl);
  await flipEl.animate([{ left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' }, { left: '0px', top: '0px', width: innerWidth + 'px', height: innerHeight + 'px' }], { duration: 850, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' }).finished;
}
async function flipRaus() { if (!flipEl) return; await flipEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, easing: 'ease', fill: 'forwards' }).finished; flipEl.remove(); flipEl = null; }

let aufraeumen = [];
async function zeigen() {
  aufraeumen.forEach(f => { try { f(); } catch (e) { } }); aufraeumen = [];
  const p = pfad(); const h = $('#haupt');
  let treffer; for (const [re, fn] of ROUTEN) { const m = p.match(re); if (m) { treffer = [fn, m]; break; } }
  const w = weltVon(p); document.body.dataset.w = w;
  const erg = treffer ? treffer[0](treffer[1]) : nix();
  h.innerHTML = erg.html; document.title = (erg.titel ? erg.titel + ' · ' : '') + 'SV Mörlenbach Store';
  $('#oben').classList.toggle('ueber', !!erg.ueber);
  $$('.hnav a').forEach(a => a.classList.toggle('on', p.slice(1).split('/')[0] === a.dataset.nav || (a.dataset.nav === '1896' && /^\/(drop\/)/.test(p))));
  $('#zeiger').classList.remove('an');
  scrollTo(0, 0);
  if (erg.nach) { const f = erg.nach(h); if (typeof f === 'function') aufraeumen.push(f); }
  reveal(h); uhrenTick(); wow(h, p);
}
function nix() { return { titel: 'Nicht gefunden', html: `<section class="seite wrap sec" style="min-height:70svh"><p class="kicker">Fehler 404</p><h1 class="h-xl" style="margin-block:20px">Abseits.</h1><p class="lead">Diese Seite gibt es nicht. Vielleicht hat der Schiri was übersehen.</p><p style="margin-top:28px"><a class="btn" href="${U('')}" data-link>Zur Startseite ${ICO.pfeil}</a></p></section>` }; }

/* Reveal */
let beob;
function reveal(root) {
  if (!beob) beob = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); beob.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  $$('[data-r]:not(.in), .wz-block:not(.in)', root).forEach(el => beob.observe(el));
}

/* Globale Klicks */
document.addEventListener('click', e => {
  const herz = e.target.closest('[data-herz]'); if (herz) { e.preventDefault(); merken(herz.dataset.herz); return; }
  const sch = e.target.closest('[data-schnell]'); if (sch) { e.preventDefault(); korbRein(sch.dataset.schnell, sch.dataset.gr); return; }
  const demo = e.target.closest('a[data-demo]'); if (demo) { e.preventDefault(); toast(`${ICO.info}<span>${esc(demo.dataset.demo)}</span>`); return; }
  const anker = e.target.closest('a[href^="#"]'); if (anker && anker.getAttribute('href').length > 1) { e.preventDefault(); $(anker.getAttribute('href'))?.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth' }); return; }
  const a = e.target.closest('a[data-link]'); if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
  const u = new URL(a.href, location.href); if (u.origin !== location.origin) return;
  e.preventDefault(); geh(u.href, { flip: a.dataset.flip ? $(a.dataset.flip) : null });
});
document.addEventListener('submit', e => { const f = e.target.closest('form[data-demo]'); if (f) { e.preventDefault(); toast(`${ICO.check}<span>${esc(f.dataset.demo)}</span>`); f.reset(); } });
addEventListener('popstate', () => zeigen());

/* Intro */
async function intro() {
  let gesehen = false; try { gesehen = sessionStorage.getItem('svd_intro'); sessionStorage.setItem('svd_intro', 1); } catch (e) { }
  if (gesehen || ruhig || pfad() !== '/') return;
  const d = document.createElement('div'); d.className = 'intro';
  d.innerHTML = `<div class="in">${WAPPEN.replace('stroke-width="2.4"', 'stroke-width="1.6"')}<div class="zahl num">${[1, 8, 9, 6].map(z => `<span><i>${Array.from({ length: z + 1 }, (_, i) => `<b style="display:block;height:.8em;line-height:.8em;font-weight:inherit">${i}</b>`).join('')}</i></span>`).join('')}</div><div class="zeile">SV Mörlenbach · Store</div></div>`;
  document.body.appendChild(d);
  await sleep(250);
  $$('.zahl span i', d).forEach((i, k) => { const z = [1, 8, 9, 6][k]; i.style.transitionDelay = k * 90 + 'ms'; i.style.transform = `translateY(-${z * .8}em)`; });
  d.onclick = () => d.classList.add('weg');
  await sleep(1700); d.classList.add('weg'); await sleep(1000); d.remove();
}

/* ================= Startseite ================= */
route(/^\/$/, () => {
  const tafeln = [['mannschaft', 'team', 'Für den Platz.'], ['1896', 'street', 'Für die Straße.'], ['merch', 'fan', 'Für alle.']];
  const best = ['hoodie-1896-glocken', 'heimtrikot-26-27', 'fanschal-heimat', 'crew-royal-heritage', 'praesentationsanzug', 'cap-1896-cream', 'balkenschal', 'auswaertstrikot-26-27', 'trinkflasche', 'hoodie-mehr-als-ein-verein'].map(s => PS[s]);
  const statement = 'Wir sind ein Dorfverein aus dem Odenwald. Seit 1896 spielen hier Generationen auf demselben Platz, frieren am selben Geländer und feiern in derselben Kabine. Dieses Gefühl kann man jetzt anziehen.';
  const drop = P.filter(p => p.d === '01');
  const prozent = Math.round(Math.min(1, Math.max(0, (JETZT - DROP1_START) / (DROP1_ENDE - DROP1_START))) * 100);
  return {
    ueber: true, html: `
  <section class="held" aria-label="Drei Linien">
    <div class="titelzeile"><h1>${woerter('Drei Welten.')} <br class="nur-mobil">${woerter('Ein <em>Verein.</em>')}</h1>
      <div class="seit">SV Mörlenbach 1896 e.V.<br>Offizieller Store<br>Odenwald, Hessen</div></div>
    <div class="tafeln" id="tafeln">${tafeln.map(([k, w, z], i) => { const L = LINIEN[k]; return `
      <a class="tafel" data-l="${w}" href="${U(k)}" data-link data-flip="#tafel-${k} img" id="tafel-${k}" aria-label="${L.name} entdecken">
        <img src="img/${L.bild}.webp" alt="" style="--fp:${L.fp}" ${i ? '' : 'fetchpriority="high"'}><span class="streifen"></span>
        <div class="unten"><div class="nr"><span>${L.nr} / 03</span><span>${z}</span></div><div class="titel">${L.name}</div><p class="zeile">${L.zeile}</p>
          <span class="mehr">${L.name} entdecken ${ICO.pfeil}</span></div></a>`; }).join('')}</div>
    <div class="punkte" id="tafelPunkte"><i class="on"></i><i></i><i></i></div>
    <div class="scroll" aria-hidden="true"></div>
  </section>

  <div class="band" aria-hidden="true"><div class="spur" id="bandSpur">${Array(3).fill(`<span>Mannschaft</span>${WAPPEN}<span class="serif">1896</span>${WAPPEN}<span class="hohl">Merch</span>${WAPPEN}<span>Mehr als ein Verein</span>${WAPPEN}`).join('')}</div></div>

  <section class="statement wrap" id="statement">
    <p class="kicker" style="margin-bottom:28px">Warum es diesen Store gibt</p>
    <p class="gross">${statement.split(' ').map(w => `<span class="w">${w}</span>`).join(' ')}</p>
    <div class="fuss-z">
      <div class="fakt" data-r><b class="num" data-zaehl="1896">0</b><span>gegründet, im selben Ort</span></div>
      <div class="fakt" data-r style="transition-delay:100ms"><b class="num"><span data-zaehl="130">0</span> Jahre</b><span>Vereinsgeschichte in 2026</span></div>
      <div class="fakt" data-r style="transition-delay:200ms"><b>3 Linien</b><span>Mannschaft, 1896 und Merch</span></div>
      <div class="fakt" data-r style="transition-delay:300ms"><b>100 %</b><span>des Überschusses bleibt im Verein</span></div>
    </div>
  </section>

  <section class="stapel wrap" aria-label="Kollektionen">
    <div class="sec-kopf"><h2 class="h-l" data-r>Drei Linien. Drei Gefühle.</h2><p class="lead" data-r>Jede Linie hat ihre eigene Sprache, ihre eigenen Farben und ihren eigenen Rhythmus. Zusammen sind sie der Verein.</p></div>
    ${stapelKarte('mannschaft', 'k-team', 'Teamline 26/27', 'Trikots, Trainingsanzüge und Coachwear. Gemacht für 90 Minuten und alles davor.', ['Trikots', 'Training', 'Präsentation', 'Coachwear'], ['heimtrikot-26-27', 'praesentationsanzug', 'coach-polo'], 'team-anzug-treppe')}
    ${stapelKarte('1896', 'k-street', `Drop 01 · live bis ${fDatum(DROP1_ENDE)}`, 'Streetwear in kleinen Auflagen. Vorbestellen, besticken lassen, tragen. Wenn ein Drop vorbei ist, kommt er nicht wieder.', ['Limitiert', 'Bestickt', 'Vorbestellung'], ['hoodie-1896-glocken', 'crew-royal-heritage', 'cap-1896-cream'], '1896-hoodie-treppe')}
    ${stapelKarte('merch', 'k-fan', 'Für alle, die dazugehören', 'Schals, Mützen, Flaschen und kleine Dinge, die man verschenken möchte. Für Oma, Kumpel und dich selbst.', ['Schals', 'Mützen', 'Geschenke'], ['fanschal-heimat', 'balkenschal', 'pin-set'], 'merch-schal-bank-hoch')}
  </section>

  <section class="sec" style="padding-top:0" aria-label="Bestseller">
    <div class="wrap karussell-kopf"><div><p class="kicker" data-r>Gerade beliebt</p><h2 class="h-l" style="margin-top:14px" data-r>Was Mörlenbach trägt</h2></div>
      <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><div class="reiter" id="bReiter">${[['alle', 'Alle'], ['mannschaft', 'Mannschaft'], ['1896', '1896'], ['merch', 'Merch']].map(([k, t], i) => `<button data-k="${k}" class="${i ? '' : 'on'}">${t}</button>`).join('')}</div>
      <div class="pfeile"><button id="kLinks" aria-label="Zurück">${ICO.pfeilL}</button><button id="kRechts" aria-label="Weiter">${ICO.pfeil}</button></div></div></div>
    <div class="karussell" id="karussell">${best.map(p => kachel(p)).join('')}</div>
    <div class="fortschritt"><i id="kFort"></i></div>
  </section>

  <section class="dropmodul" aria-label="1896 Drop">
    <div class="grid2"><div class="bild"><img src="img/1896-hoodie-treppe.webp" alt="Hoodie 1896 Glocken auf einer Treppe in Mörlenbach" loading="lazy" style="--fp:58% 60%">
      <svg class="stempel" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="kreis" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/></defs><text fill="#F4F1EA" font-family="IBM Plex Mono,monospace" font-size="10.5" letter-spacing="3.2"><textPath href="#kreis">LIMITED · DROP 01 · KEIN NACHSCHUB · </textPath></text><text x="60" y="68" text-anchor="middle" fill="#F4F1EA" font-family="Bodoni Moda,serif" font-style="italic" font-size="24">1896</text></svg></div>
      <div class="text"><span class="chip hell" style="width:max-content"><span class="dot"></span>Drop 01 · Heritage · live</span>
        <h2 class="h-xl">Einmal.<br>Dann nie wieder.</h2>
        <p class="lead">Jedes Teil aus der 1896-Linie wird erst nach Bestellschluss gestickt und genäht. Was du bis ${fTag(DROP1_ENDE)} bestellst, bekommst du. Danach ist der Drop Geschichte.</p>
        <div><p class="mono" style="opacity:.6;margin-bottom:12px">Bestellschluss in</p>${uhrHtml(DROP1_ENDE)}</div>
        <div class="zeitstrahl" id="zs"><span class="lauf" style="width:0" data-w="${12 + prozent * .26}%"></span>
          <div class="jetzt"><b>Vorbestellen</b><span>bis ${fDatum(DROP1_ENDE)}</span></div><div><b>Bestellschluss</b><span>${fTag(DROP1_ENDE)}, 20 Uhr</span></div><div><b>Stickerei</b><span>in der Region</span></div><div><b>Versand</b><span>ab KW ${VERSAND_KW}</span></div></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn hell" href="${U('1896')}" data-link>Drop 01 ansehen ${ICO.pfeil}</a><a class="btn rand" href="${U('faq#vorbestellung')}" data-link>So funktioniert’s</a></div></div></div>
  </section>

  <section class="sec details wrap" aria-label="Details">
    <div class="sec-kopf"><div><p class="kicker" data-r>Material & Veredelung</p><h2 class="h-l" style="margin-top:14px" data-r>Schau genau hin.</h2></div><p class="lead" data-r>Wappen werden gestickt, Schals gestrickt, Rücken bedruckt. Wir zeigen die Details so nah, wie du sie später auf der Haut spürst.</p></div>
    <div class="gitter">
      <figure class="detail d1" data-r="maske"><img src="img/d-scarf-crest.webp" alt="" loading="lazy"><span class="marker">01 · JACQUARD</span><figcaption><b>Gestrickt, nicht gedruckt.</b><span>Das Wappen ist ins Garn gestrickt. Es verblasst nicht und reißt nicht.</span></figcaption></figure>
      <figure class="detail d2" data-r="maske" style="transition-delay:80ms"><img src="img/d-stick-1896.webp" alt="" loading="lazy"><span class="marker">02 · STICK</span><figcaption><b>Ton in Ton gestickt</b><span>1896, Mörlenbach und drei Glocken in Off-White und Silber.</span></figcaption></figure>
      <figure class="detail d3" data-r="maske" style="transition-delay:160ms"><img src="img/d-number.webp" alt="" loading="lazy"><span class="marker">03 · FLOCK</span><figcaption><b>Dein Name, deine Nummer</b></figcaption></figure>
      <figure class="detail d4" data-r="maske" style="transition-delay:120ms"><img src="img/d-crest-grey.webp" alt="" loading="lazy"><span class="marker">04 · 420 G/M²</span><figcaption><b>Heavy Fleece</b></figcaption></figure>
      <figure class="detail d5" data-r="maske" style="transition-delay:200ms"><img src="img/d-hoodie-back.webp" alt="" loading="lazy"><span class="marker">05 · RÜCKEN</span><figcaption><b>Groß im Rücken</b><span>Damit man auch von hinten weiß, wer da kommt.</span></figcaption></figure>
    </div>
  </section>

  <section class="sec gemeinschaft wrap" aria-label="Verein" style="padding-top:0">
    <div class="sec-kopf"><div><p class="kicker" data-r>Gemeinschaft</p><h2 class="h-l" style="margin-top:14px" data-r>Samstag, 15 Uhr. Immer.</h2></div></div>
    <div class="collage">
      <figure class="c1" data-r="maske"><img src="img/team-tribuene.webp" alt="Trainer und Jugend auf der Tribüne" loading="lazy"></figure>
      <figure class="c2" data-r="maske" style="transition-delay:120ms"><img src="img/kids-papa.webp" alt="Vater und Sohn am Spielfeldrand" loading="lazy"></figure>
      <figure class="c3" data-r="maske" style="transition-delay:240ms"><img src="img/merch-gruppe-s.webp" alt="Fans mit Schal" loading="lazy"></figure>
      <p class="zitat" data-r>„Hier kennt jeder jeden. Und jeder trägt irgendwas mit Glocken drauf.“<small>Gefühlt jeder am Sportplatz</small></p>
      <div class="wohin" id="wohin" data-r><h3>Wohin dein Geld geht</h3><p>Der Store gehört dem Verein. Jeder Euro Überschuss fließt zurück in den Sport.</p>
        <div class="balken">${[['Jugendarbeit & Ausrüstung', 45], ['Platz & Vereinsheim', 25], ['Trainer & Lizenzen', 20], ['Feste & Fahrten', 10]].map(([t, w]) => `<div><span>${t}</span><b>${w} %</b><i style="--w:${w}%"></i></div>`).join('')}</div>
        <p class="hinweis">Beispielhafte Aufteilung für das Konzept.</p></div>
    </div>
  </section>

  <section aria-label="Instagram"><div class="wrap" style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-bottom:20px"><div><p class="kicker">#svm1896</p><h2 class="h-m" style="margin-top:10px">Zeig uns, wie du’s trägst.</h2></div><a class="link" href="#" data-demo="Hier käme der Instagram-Kanal hin.">Auf Instagram folgen ${ICO.pfeil}</a></div>
    <div class="insta">${['1896-bank', 'merch-schal-royal', '1896-couch', 'team-trikot-royal-kids', '1896-crew-cap-cafe', 'merch-balkenschal'].map(b => `<a href="#" data-demo="Hier käme der Beitrag von Instagram."><img src="img/${b}-s.webp" alt="" loading="lazy">${ICO.insta}</a>`).join('')}</div></section>

  <div class="servicezeile" style="margin-top:clamp(60px,8vw,110px)">
    <div>${ICO.lkw}<p><b>Versand ab 75 € kostenlos</b><span>Sonst 5,90 €. Versand in 3 bis 5 Werktagen.</span></p></div>
    <div>${ICO.ort}<p><b>Abholung am Sportplatz</b><span>Kostenlos, zu jedem Heimspiel und Training.</span></p></div>
    <div>${ICO.nadel}<p><b>Veredelung inklusive</b><span>Wappen gestickt, Name und Nummer auf Wunsch.</span></p></div>
    <div>${ICO.team}<p><b>Teambestellung</b><span>Ganze Mannschaft ausrüsten mit Staffelpreisen.</span></p></div>
  </div>
  <section class="dropliste sec"><div class="wrap"><div><p class="mono" style="opacity:.85;margin-bottom:16px">Drop 02 · ${fDatum(DROP2_START)} · 18 Uhr</p><h2 class="h-l">Nicht verpassen. Nie wieder.</h2></div>
    <div><form data-demo="Danke! Du stehst auf der Drop-Liste (Demo)."><input type="email" placeholder="Deine E-Mail" aria-label="E-Mail" required><button class="btn">Auf die Liste ${ICO.pfeil}</button></form><small>Erinnerung 24 Stunden vor jedem Drop. Abmelden geht jederzeit.</small></div></div></section>`,
    nach: root => homeNach(root)
  };
});
function stapelKarte(k, cls, kick, text, tags, prods, bild) {
  const L = LINIEN[k];
  return `<article class="karte ${cls}"><div class="text"><div><p class="mono" style="opacity:.7;margin-bottom:20px">${L.nr} · ${kick}</p><h2>${L.name}</h2><p class="lead" style="margin-top:20px">${text}</p>
    <div class="tags" style="margin-top:22px">${tags.map(t => `<span>${t}</span>`).join('')}</div></div>
    <div><div class="mini">${prods.map(s => { const p = PS[s]; return `<a href="${U('p/' + s)}" data-link><img ${srcset(p.img[0])} sizes="140px" alt="" loading="lazy" style="${p.ill ? 'object-fit:contain;padding:10%;background:rgba(255,255,255,.5)' : ''}">${esc(p.n)}<span>${eur(p.p)}</span></a>`; }).join('')}</div>
    <p style="margin-top:24px"><a class="btn ${cls === 'k-fan' ? 'akz' : 'hell'}" style="${cls === 'k-fan' ? 'border-radius:99px' : ''}" href="${U(k)}" data-link>${L.name} entdecken ${ICO.pfeil}</a></p></div></div>
    <div class="bild"><img src="img/${bild}.webp" alt="" loading="lazy" style="--fp:${FOKUS[bild] || '50% 30%'}"></div></article>`;
}
function homeNach(root) {
  const weg = [];
  // Headline-Reveal
  requestAnimationFrame(() => $$('.held h1 .wz', root).forEach((w, i) => { w.firstElementChild.style.transitionDelay = 250 + i * 110 + 'ms'; w.classList.add('in'); }));
  // Mobile: Punkte für Tafeln
  const tf = $('#tafeln'); tf.addEventListener('scroll', () => { const i = Math.round(tf.scrollLeft / (tf.scrollWidth / 3)); $$('#tafelPunkte i').forEach((p, k) => p.classList.toggle('on', k === i)); }, { passive: true });
  // Band: Geschwindigkeit an Scroll gekoppelt
  const spur = $('#bandSpur'); let x = 0, v = 1, ly = scrollY, raf;
  const lauf = () => { const dy = scrollY - ly; ly = scrollY; v += (1 + Math.min(12, Math.abs(dy) * .25) - v) * .1; x -= v * (dy < 0 ? -1 : 1) * .6; const w = spur.scrollWidth / 3; if (x < -w) x += w; if (x > 0) x -= w; spur.style.transform = `translate3d(${x}px,0,0)`; raf = requestAnimationFrame(lauf); };
  if (!ruhig) raf = requestAnimationFrame(lauf); weg.push(() => cancelAnimationFrame(raf));
  // Statement: Wörter füllen sich beim Scrollen
  const st = $('#statement'), ws = $$('.w', st);
  const fuell = () => { const r = st.getBoundingClientRect(); const pr = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height * .75))); const n = Math.round(pr * ws.length); ws.forEach((w, i) => w.classList.toggle('an', i < n)); };
  addEventListener('scroll', fuell, { passive: true }); fuell(); weg.push(() => removeEventListener('scroll', fuell));
  // Zähler
  const zb = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; zb.unobserve(e.target); const el = e.target, z = +el.dataset.zaehl, t0 = performance.now(); const f = t => { const p = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(z * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }), { threshold: .6 });
  $$('[data-zaehl]', root).forEach(e => zb.observe(e)); weg.push(() => zb.disconnect());
  // Stapel: hintere Karten schrumpfen leicht
  const karten = $$('.stapel .karte', root);
  const stapel = () => { if (innerWidth < 861) return; karten.forEach((k, i) => { const n = karten[i + 1]; if (!n) return; const r = n.getBoundingClientRect(); const p = Math.min(1, Math.max(0, 1 - (r.top - 120) / innerHeight)); k.style.transform = `scale(${1 - p * .05})`; k.style.filter = `brightness(${1 - p * .25})`; }); };
  addEventListener('scroll', stapel, { passive: true }); weg.push(() => removeEventListener('scroll', stapel));
  karussellVerdrahten(root, P.filter(p => ['hoodie-1896-glocken', 'heimtrikot-26-27', 'fanschal-heimat', 'crew-royal-heritage', 'praesentationsanzug', 'cap-1896-cream', 'balkenschal', 'auswaertstrikot-26-27', 'trinkflasche', 'hoodie-mehr-als-ein-verein', 'team-hoodie', 'pin-set', 'beanie-wappen', 'track-jacket-1896'].includes(p.s)));
  // Zeitstrahl + Wohin-Balken
  const zs = $('#zs'); const zo = new IntersectionObserver(es => { if (es[0].isIntersecting) { const l = $('.lauf', zs); l.style.width = l.dataset.w; zo.disconnect(); } }, { threshold: .5 }); zo.observe(zs); weg.push(() => zo.disconnect());
  return () => weg.forEach(f => f());
}
function karussellVerdrahten(root, liste) {
  const k = $('#karussell', root); if (!k) return;
  const fort = () => { const max = k.scrollWidth - k.clientWidth; $('#kFort').style.width = (max > 0 ? (k.clientWidth + k.scrollLeft) / k.scrollWidth * 100 : 100) + '%'; };
  k.addEventListener('scroll', fort, { passive: true }); setTimeout(fort, 100);
  $('#kLinks', root).onclick = () => k.scrollBy({ left: -k.clientWidth * .8, behavior: 'smooth' });
  $('#kRechts', root).onclick = () => k.scrollBy({ left: k.clientWidth * .8, behavior: 'smooth' });
  // Ziehen mit der Maus
  let ab = null, sx = 0, sl = 0, bew = false;
  k.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; ab = e.pointerId; sx = e.clientX; sl = k.scrollLeft; bew = false; });
  addEventListener('pointermove', e => { if (ab !== e.pointerId) return; const d = e.clientX - sx; if (Math.abs(d) > 5) { bew = true; k.classList.add('zieh'); } k.scrollLeft = sl - d; });
  addEventListener('pointerup', () => { if (ab === null) return; ab = null; setTimeout(() => k.classList.remove('zieh'), 0); });
  k.addEventListener('click', e => { if (bew) { e.preventDefault(); e.stopPropagation(); bew = false; } }, true);
  $$('#bReiter button', root).forEach(b => b.onclick = () => {
    $$('#bReiter button', root).forEach(x => x.classList.toggle('on', x === b));
    const L = b.dataset.k === 'alle' ? liste : P.filter(p => p.l === b.dataset.k);
    k.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180 }).finished.then(() => { k.innerHTML = L.map(p => kachel(p)).join(''); k.scrollLeft = 0; fort(); k.animate([{ opacity: 0, transform: 'translateX(30px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.16,.84,.24,1)' }); });
  });
}

/* ================= MANNSCHAFT ================= */
function trikotSvg(farbe = '#1F57C3', name = 'DEIN NAME', nr = '10', schrift = '#FFFFFF') {
  return `<svg class="trikot" viewBox="0 0 300 320" aria-label="Trikot-Vorschau"><defs><linearGradient id="tg" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".25" stop-color="#000" stop-opacity="0"/><stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs>
    <path d="M92 18c18 10 38 14 58 14s40-4 58-14l58 30 30 76-48 20-12-28v196c-58 12-114 12-172 0V116l-12 28-48-20 30-76z" fill="${farbe}"/>
    <path d="M92 18c18 10 38 14 58 14s40-4 58-14l58 30 30 76-48 20-12-28v196c-58 12-114 12-172 0V116l-12 28-48-20 30-76z" fill="url(#tg)"/>
    <path d="M92 18c18 12 38 17 58 17s40-5 58-17" stroke="#0E1A33" stroke-opacity=".5" stroke-width="5" fill="none"/>
    <path d="M7 116l46 19M293 116l-46 19" stroke="#F28C28" stroke-width="7"/>
    <text x="150" y="92" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="800" font-stretch="80%" font-size="${Math.max(13, 24 - Math.max(0, name.length - 8) * 1.1)}" letter-spacing="1.5" fill="${schrift}" id="tName">${esc(name)}</text>
    <text x="150" y="232" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="800" font-stretch="70%" font-size="128" fill="${schrift}" id="tNr">${esc(nr)}</text>
    <text x="150" y="292" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="8" letter-spacing="3" fill="${schrift}" fill-opacity=".6">SV MÖRLENBACH · 1896</text></svg>`;
}
route(/^\/mannschaft$/, () => {
  const L = P.filter(p => p.l === 'mannschaft');
  return {
    titel: 'Mannschaft', html: `
  <section class="t-held">
    <div class="grid"><div class="text">
      <p class="kicker">01 · Mannschaft · Teamline 26/27</p>
      <h1>${woerter('Für den')}<br><span class="wz"><span class="o">Platz</span></span><br><span class="wz"><span class="b">gemacht.</span></span></h1>
      <p class="lead">Trikots, Trainingsanzüge und Coachwear für alle, die samstags auf dem Platz stehen. Und für alle, die daneben mitfiebern.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn akz" href="#kit">Matchday Kit ${ICO.pfeil}</a><a class="btn rand" href="#team">Ganze Mannschaft ausrüsten</a></div>
      <div class="spec"><span>${ICO.luft}Atmungsaktiv</span><span>${ICO.nadel}Wappen gestickt</span><span>${ICO.blitz}Name & Nummer</span></div></div>
      <div class="bild"><img src="img/team-anzug-tasche.webp" alt="Spieler im Präsentationsanzug mit Sporttasche" fetchpriority="high" style="object-position:46% 8%"><div class="riesen num">26/27</div></div></div>
    <span class="balken" aria-hidden="true"></span>
    <a class="karte" href="${U('p/heimtrikot-26-27')}" data-link><img src="img/team-trikot-royal-kids-s.webp" alt=""><div><b>Heimtrikot 26/27</b><span>ab ${eur(49.95)} · jetzt mit Flock</span></div></a>
  </section>
  <div class="wrap"><nav class="t-kats" aria-label="Kategorien">${KATS.mannschaft.map(([k, t]) => `<a href="#raster" data-kat="${k}"><span>${t}</span><sup>${L.filter(p => p.k === k).length}</sup></a>`).join('')}<a href="${U('kids')}" data-link><span>Kids</span><sup>${P.filter(p => p.kids).length}</sup></a></nav></div>

  <section class="t-kit sec" id="kit"><div class="wrap grid">
    <div class="bilder" data-r="zoom"><img id="kitA" src="img/team-trikot-royal-kids.webp" alt="Heimtrikot Royal"><img id="kitB" class="weg" src="img/team-trikot.webp" alt="Auswärtstrikot Night Navy"></div>
    <div><p class="mono" style="opacity:.6">Matchday Kit 26/27</p>
      <div class="schalter" id="kitSchalter"><i></i><button data-k="a">Heim</button><button data-k="b">Auswärts</button></div>
      <h2 id="kitTitel">Royal.<br>Wie immer.</h2>
      <p class="lead" id="kitText" style="margin-top:18px">Vereinsblau, weißer Kragen, Wappen auf der Brust. Das Heimtrikot ist das, was man im Ort sofort erkennt.</p>
      <div class="werte"><div><b>140 g</b><span>pro m², superleicht</span></div><div><b>100 %</b><span>recyceltes Polyester</span></div><div><b>+12 €</b><span>Name & Nummer</span></div></div>
      <a class="btn" style="--b:#fff;--t:var(--ink)" id="kitLink" href="${U('p/heimtrikot-26-27')}" data-link>Zum Heimtrikot ${ICO.pfeil}</a></div></div></section>

  <section class="sec wrap" aria-label="Personalisierung"><div class="flock">
    <div class="buehne" id="flockBuehne" data-r="zoom">${trikotSvg()}</div>
    <div><p class="kicker" data-r>Personalisierung live</p><h2 class="h-l" style="margin:14px 0 16px;font-weight:900;font-style:italic;font-stretch:62%;text-transform:uppercase" data-r>Mach es zu deinem.</h2>
      <p class="lead" style="margin-bottom:26px" data-r>Name und Nummer werden in unserer Partnerwerkstatt geflockt. Probier es aus, die Vorschau ändert sich sofort.</p>
      <div class="felder"><div class="zwei"><div class="feld-g"><label for="fName">Name</label><input id="fName" maxlength="12" placeholder="DEIN NAME" value="MÖRLENBACH"></div><div class="feld-g"><label for="fNr">Nummer</label><input id="fNr" maxlength="2" inputmode="numeric" value="18"></div></div>
        <div class="feld-g"><label>Trikot</label><div class="farbwahl" id="fFarbe"><button class="on" style="background:#1F57C3" data-f="#1F57C3" aria-label="Royal"></button><button style="background:#1A2238" data-f="#1A2238" aria-label="Night Navy"></button></div></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px"><a class="btn akz" href="${U('p/heimtrikot-26-27')}" data-link id="fLink">Mit diesem Flock bestellen ${ICO.pfeil}</a><span class="passt" style="align-self:center">${ICO.info}+12 € pro Trikot, Lieferzeit +5 Tage</span></div></div></div></div></section>

  <section class="sec wrap" id="raster" style="padding-top:0"><div class="sec-kopf"><div><p class="kicker">Teamline 26/27</p><h2 class="h-l" style="margin-top:14px;font-weight:900;font-style:italic;font-stretch:62%;text-transform:uppercase">Alles für den Spieltag</h2></div>
    <div class="reiter" id="tFilter"><button class="on" data-k="">Alle</button>${KATS.mannschaft.map(([k, t]) => `<button data-k="${k}">${t}</button>`).join('')}</div></div>
    <div class="raster" id="tRaster">${L.map((p, i) => kachel(p, { r: 1, d: (i % 4) * 70 })).join('')}</div></section>

  <div class="techband">${[['3D', 'Stick auf allen Wappen'], ['48 h', 'Flock-Service im Ort'], ['5 J.', 'Nachkaufgarantie Teamline'], ['10 %', 'Teamrabatt ab 10 Teilen']].map(([b, t], i) => `<div data-r style="transition-delay:${i * 80}ms"><b>${b}</b><span>${t}</span></div>`).join('')}</div>

  <section class="sec wrap" id="team"><div class="teambox">
    <div style="position:relative;z-index:1"><p class="mono" style="opacity:.6;margin-bottom:16px">Für Trainer, Betreuer und Elternvertreter</p><h2 class="h-l">Ganze Mannschaft ausrüsten.</h2>
      <p class="lead" style="margin-top:18px">Größen eintragen, Artikel wählen, Angebot anfragen. Ab 10 Teilen gibt es 10 Prozent, ab 20 Teilen 15 Prozent. Flock mit Namen und Nummern wird gleich mitgeplant.</p>
      <div class="lieferinfo" style="margin-top:24px;--line:rgba(255,255,255,.15);color:#fff"><div>${ICO.check}<span>Eine Sammelrechnung an den Verein oder Einzelzahlung je Spieler</span></div><div>${ICO.check}<span>Übergabe im Paket pro Spieler, beschriftet</span></div><div>${ICO.check}<span>Nachbestellung für Neuzugänge über die ganze Saison</span></div></div></div>
    <div class="matrix"><div class="feld-g"><label style="color:rgba(255,255,255,.7)">Artikel</label><select id="mArt">${['heimtrikot-26-27', 'auswaertstrikot-26-27', 'praesentationsanzug', 'trainingsjacke-damen', 'team-hoodie', 'coach-polo'].map(s => `<option value="${s}">${PS[s].n} · ${eur(PS[s].p)}</option>`).join('')}</select></div>
      <div class="zeilen">${GR_ERW.map((g, i) => `<label>${g}<input type="number" min="0" max="40" value="${[0, 3, 5, 4, 2, 0][i]}" data-g="${g}" inputmode="numeric"></label>`).join('')}</div>
      <label style="display:flex;gap:10px;align-items:center;font-size:14px"><input type="checkbox" id="mFlock" checked style="width:18px;height:18px;accent-color:#F28C28"> Mit Name & Nummer (+12 € pro Teil)</label>
      <div class="summe-t"><div><span id="mStk">14 Teile · 10 % Teamrabatt</span><br><b class="num" id="mSum">0 €</b></div><button class="btn akz" id="mAnfrage">Angebot anfragen</button></div></div>
  </div></section>`,
    nach: root => {
      requestAnimationFrame(() => $$('.t-held h1 .wz', root).forEach((w, i) => { w.firstElementChild.style.transitionDelay = 120 + i * 90 + 'ms'; w.classList.add('in'); }));
      // Kit-Schalter
      const sch = $('#kitSchalter'); const T = { a: ['Royal.<br>Wie immer.', 'Vereinsblau, weißer Kragen, Wappen auf der Brust. Das Heimtrikot ist das, was man im Ort sofort erkennt.', 'heimtrikot-26-27', 'Zum Heimtrikot'], b: ['Night Navy.<br>Auswärts.', 'Dunkel, ruhig, selbstbewusst. Mit großer weißer Nummer und Ärmelbündchen, die auch unter Flutlicht wirken.', 'auswaertstrikot-26-27', 'Zum Auswärtstrikot'] };
      $$('button', sch).forEach(b => b.onclick = () => { const k = b.dataset.k; sch.classList.toggle('r', k === 'b'); $('#kitB').classList.toggle('weg', k === 'a'); const t = T[k]; const ti = $('#kitTitel'); ti.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-10px)' }], { duration: 200 }).finished.then(() => { ti.innerHTML = t[0]; $('#kitText').textContent = t[1]; const l = $('#kitLink'); l.href = U('p/' + t[2]); l.innerHTML = t[3] + ' ' + ICO.pfeil; ti.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.16,.84,.24,1)' }); }); });
      // Flock
      let farbe = '#1F57C3';
      const mal = () => { const n = ($('#fName').value || 'DEIN NAME').toUpperCase(); const nr = ($('#fNr').value.replace(/\D/g, '') || '10'); $('#flockBuehne').innerHTML = trikotSvg(farbe, n, nr); $('#fLink').href = U('p/' + (farbe === '#1F57C3' ? 'heimtrikot-26-27' : 'auswaertstrikot-26-27') + `?name=${encodeURIComponent(n)}&nr=${nr}`); };
      $('#fName').oninput = mal; $('#fNr').oninput = mal;
      $$('#fFarbe button').forEach(b => b.onclick = () => { farbe = b.dataset.f; $$('#fFarbe button').forEach(x => x.classList.toggle('on', x === b)); mal(); }); mal();
      // Filter
      const filt = k => { $$('#tFilter button').forEach(x => x.classList.toggle('on', x.dataset.k === k)); const r = $('#tRaster'); r.innerHTML = P.filter(p => p.l === 'mannschaft' && (!k || p.k === k)).map(p => kachel(p).replace('<article class="kachel', '<article class="kachel raus')).join(''); };
      $$('#tFilter button').forEach(b => b.onclick = () => filt(b.dataset.k));
      $$('.t-kats a[data-kat]', root).forEach(a => a.addEventListener('click', () => filt(a.dataset.kat)));
      // Matrix
      const rechne = () => { const pr = PS[$('#mArt').value].p + ($('#mFlock').checked ? 12 : 0); const n = $$('.matrix [data-g]').reduce((a, i) => a + (+i.value || 0), 0); const rab = n >= 20 ? .15 : n >= 10 ? .1 : 0; $('#mStk').textContent = `${n} Teile${rab ? ` · ${rab * 100} % Teamrabatt` : ' · ab 10 Teilen 10 % Rabatt'}`; $('#mSum').textContent = eur(n * pr * (1 - rab)); };
      $$('.matrix input, .matrix select').forEach(i => i.addEventListener('input', rechne)); rechne();
      $('#mAnfrage').onclick = () => toast(`${ICO.check}<span>Anfrage vorbereitet. In der Demo wird nichts verschickt.</span>`);
    }
  };
});

/* ================= 1896 ================= */
route(/^\/1896$/, () => {
  const D = P.filter(p => p.d === '01');
  const looks = [['1896-bank', 'Look 01', 'Royal Crew · Stone Crew · Track Jacket'], ['1896-hoodie-treppe', 'Look 02', 'Hoodie 1896 Glocken'], ['1896-mauer', 'Look 03', 'Stone Crew · Royal Crew'], ['1896-crew-cap-cafe', 'Look 04', 'Crewneck Heather · Cap Cream'], ['1896-mehr-als-ein-verein', 'Look 05', 'Hoodie Mehr als ein Verein'], ['1896-couch-2', 'Look 06', 'Royal Crew · Track Jacket'], ['1896-crew-grau-treppe', 'Look 07', 'Stone Crew']];
  const phase = JETZT < DROP1_ENDE ? 0 : 1;
  return {
    ueber: true, titel: '1896', html: `
  <section class="s-held grain"><picture><source media="(min-width:861px)" srcset="img/1896-hoodie-bank-weit.webp"><img src="img/1896-crew-kirche.webp" alt="1896 in Mörlenbach" fetchpriority="high"></picture>
    <div class="oben-z"><p>Streetwear aus Mörlenbach.<br>Kleine Auflagen. Gestickt in der Region.<br>Kein Nachschub.</p><span class="chip hell"><span class="dot"></span>Drop 01 · live</span></div>
    <div class="jahr" aria-hidden="true">${'1896'.split('').map((c, i) => `<span class="wz"><span style="transition-delay:${200 + i * 90}ms">${c}</span></span>`).join('')}</div>
    <div class="unten-z"><h1>Die Linie, die <em>nicht</em> auf den Platz will.</h1>
      <div style="display:grid;gap:12px;justify-items:end"><p class="mono" style="opacity:.7">Bestellschluss in</p>${uhrHtml(DROP1_ENDE)}</div></div></section>

  <section class="s-manifest wrap"><div class="grid"><p class="kicker" data-r>Manifest</p>
    <div><p class="gross" data-r>Wir machen keine Massenware. Wir machen <em>Drops</em>. Jeder ist an einen Moment im Verein gebunden, wird vorbestellt und erst dann <em>gestickt</em>. Wenn er vorbei ist, bleibt er vorbei.</p>
      <div class="regeln"><div data-r><b>01 · LIMITIERT</b><p>Wir legen keine Stückzahl fest. Wir legen ein Ende fest. Was bis dahin bestellt ist, wird produziert.</p></div>
        <div data-r style="transition-delay:100ms"><b>02 · VERANTWORTUNG</b><p>Keine Lagerware, kein Überschuss, kein Ausverkauf. Nur was wirklich jemand tragen will.</p></div>
        <div data-r style="transition-delay:200ms"><b>03 · REGION</b><p>Stick und Veredelung passieren in Betrieben aus der Region. Kurze Wege, echte Handarbeit.</p></div></div></div></div></section>

  <section class="lookbook" id="lookbook"><div class="pin"><div class="spur" id="lbSpur">
    <div class="titel"><p class="mono" style="opacity:.6;margin-bottom:18px">Lookbook · Drop 01</p><h2>Heritage.</h2><p style="margin-top:18px;opacity:.7;max-width:30ch">Fotografiert in Mörlenbach, auf den Treppen, Mauern und Bänken, an denen wir aufgewachsen sind.</p></div>
    ${looks.map(([b, n, t]) => `<figure class="look" data-zeiger><div class="bw"><img src="img/${b}.webp" alt="${t}" loading="lazy"></div><figcaption><span>${n}</span><span>${t}</span></figcaption></figure>`).join('')}
  </div><div class="zaehler"><span id="lbN">01</span><i><b id="lbBar" style="width:0"></b></i><span>0${looks.length}</span></div></div></section>

  <section class="sec wrap" id="drop01"><div class="s-drop-kopf"><div><p class="kicker" style="margin-bottom:16px">Drop 01 · seit ${fDatum(DROP1_START)}</p><h2>Heritage <em>Collection</em></h2></div>
    <div class="meta"><span class="chip hell"><span class="dot"></span>Vorbestellung offen</span><span class="mono" style="opacity:.7">Bestellschluss ${fTag(DROP1_ENDE)}, ${fDatum(DROP1_ENDE, { day: '2-digit', month: 'long' })}, 20 Uhr</span></div></div>
    <div class="editorial">${D.map((p, i) => kachel(p, { r: 1, d: (i % 3) * 80 })).join('')}</div></section>

  <section class="sec wrap" style="padding-top:0"><p class="kicker" style="margin-bottom:16px" data-r>So läuft ein Drop</p><h2 class="h-l" style="font-family:var(--f-serif);font-weight:500;margin-bottom:clamp(30px,4vw,50px)" data-r>Vom Klick bis zum <em>Stick</em>.</h2>
    <div class="ablauf">${[['Vorbestellen', 'Du bestellst deine Größe und zahlst per Vorkasse oder bar bei Abholung.', `bis ${fDatum(DROP1_ENDE)}`], ['Bestellschluss', 'Der Drop schließt. Ab jetzt zählt jedes Teil, das bestellt wurde. Nicht mehr, nicht weniger.', `${fTag(DROP1_ENDE)}, 20 Uhr`], ['Veredelung', 'Unser Partnerbetrieb in der Region stickt und näht. Das dauert rund zwei Wochen.', 'ca. 14 Tage'], ['Versand & Abholung', 'Wir schicken dir das Paket oder du holst es am Sportplatz ab. Mit Nummer auf dem Etikett.', `ab KW ${VERSAND_KW}`]].map(([t, x, w], i) => `<div class="${i === phase ? 'jetzt' : ''}" data-r style="transition-delay:${i * 90}ms"><div class="n">0${i + 1}</div><b>${t}</b><p>${x}</p><span class="wann">${w}</span></div>`).join('')}</div></section>

  <section class="naechster"><img src="img/1896-treppe.webp" alt="" loading="lazy"><div class="in">
    <p class="mono" style="opacity:.7">Drop 02 · ${fTag(DROP2_START)}, ${fDatum(DROP2_START, { day: '2-digit', month: 'long' })} · 18 Uhr</p>
    <h2>Mehr als <em>ein</em> Verein.</h2>
    <p style="max-width:44ch;opacity:.75">Was kommt, verraten wir noch nicht. Nur so viel: Es wird schwer, gestickt und es gibt es nur einmal.</p>
    ${uhrHtml(DROP2_START)}
    <form data-demo="Du wirst 24 Stunden vor Drop 02 erinnert (Demo)."><input type="email" placeholder="E-Mail für den Early Access" aria-label="E-Mail" required><button class="btn hell">Erinnern</button></form>
    <p class="mono" style="opacity:.5;font-size:10.5px">Mitglieder bekommen 24 Stunden früher Zugang</p></div></section>

  <section class="sec wrap"><p class="kicker" style="margin-bottom:22px">Archiv</p><div class="archiv">
    <a href="#drop01"><span>01</span><span class="t">Heritage</span><span>${fDatum(DROP1_START)} bis ${fDatum(DROP1_ENDE)}</span><span>Live</span></a>
    <div class="z" style="opacity:.55"><span>02</span><span class="t">Mehr als ein Verein</span><span>ab ${fDatum(DROP2_START)}</span><span>Bald</span></div>
    <div class="z" style="opacity:.35"><span>03</span><span class="t">130 Jahre</span><span>2026</span><span>Geplant</span></div></div></section>`,
    nach: root => {
      requestAnimationFrame(() => { $$('.s-held .jahr .wz', root).forEach(w => w.classList.add('in')); });
      const weg = [];
      // Lookbook horizontal pinnen
      const lb = $('#lookbook'), sp = $('#lbSpur');
      const setz = () => { if (innerWidth < 861) { lb.style.height = ''; return; } const d = sp.scrollWidth - innerWidth; lb.style.height = (innerHeight + d) + 'px'; };
      const roll = () => { if (innerWidth < 861) return; const r = lb.getBoundingClientRect(); const d = sp.scrollWidth - innerWidth; const p = Math.min(1, Math.max(0, -r.top / (lb.offsetHeight - innerHeight))); sp.style.transform = `translate3d(${-p * d}px,0,0)`; $('#lbBar').style.width = p * 100 + '%'; $('#lbN').textContent = String(Math.min(7, 1 + Math.floor(p * 7))).padStart(2, '0'); };
      setz(); roll(); addEventListener('resize', setz); addEventListener('scroll', roll, { passive: true });
      weg.push(() => { removeEventListener('resize', setz); removeEventListener('scroll', roll); });
      // Eigener Zeiger
      const z = $('#zeiger'); const mv = e => { z.style.left = e.clientX + 'px'; z.style.top = e.clientY + 'px'; z.classList.toggle('an', !!e.target.closest('[data-zeiger], .editorial .kachel')); };
      addEventListener('pointermove', mv); weg.push(() => { removeEventListener('pointermove', mv); z.classList.remove('an'); });
      $$('#lookbook .look', root).forEach(f => f.onclick = () => lupe(f.querySelector('img').src));
      return () => weg.forEach(f => f());
    }
  };
});

/* ================= MERCH ================= */
route(/^\/merch$/, () => {
  const L = P.filter(p => p.l === 'merch');
  const katBild = { schals: 'merch-schal-royal-s', muetzen: 'merch-gruppe-s', hoodies: 'merch-hoodie-grau-s', unterwegs: 'ill-flasche', kleinkram: 'ill-pins' };
  return {
    titel: 'Merch', html: `
  <section class="f-held"><div class="grid"><div>
    <p class="kicker" style="margin-bottom:20px">03 · Merch · für alle</p>
    <h1>Für alle, die <span class="blau">da&shy;zu&shy;ge&shy;hören</span> <span class="kringel">wollen.<svg viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden="true"><path d="M20 70C30 20 250 5 285 50c30 40-120 65-200 55C20 98 5 70 40 40" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg></span></h1>
    <p class="lead">Schals, Mützen, Flaschen und kleine Dinge mit Glocken drauf. Für den Spieltag, den Weihnachtsmarkt und die Oma, die eh jedes Spiel schaut.</p>
    <div class="btns"><a class="btn akz" href="#finder">Geschenk finden ${ICO.geschenk}</a><a class="btn rand" href="#mRaster">Alles ansehen</a></div>
    <p class="tipp">${ICO.info} Psst: Die Sticker kann man verschieben.</p></div>
    <div class="f-collage">
      <figure class="p1" data-r><img src="img/merch-schal-bank-hoch.webp" alt="Fanschal auf einer Bank in Mörlenbach"><figcaption>am Brunnen</figcaption></figure>
      <figure class="p2" data-r style="transition-delay:120ms"><img src="img/merch-gruppe-s.webp" alt="Fans mit Schal und Beanie"><figcaption>nach dem Abpfiff</figcaption></figure>
      <figure class="p3" data-r style="transition-delay:240ms"><img src="img/merch-hoodie-grau-s.webp" alt="Supporter Hoodie"><figcaption>auf der Tribüne</figcaption></figure>
      <div class="sticker s1">Ei<br>gude!</div><div class="sticker s2">Seit 1896 ♥</div><div class="sticker s3">SA<br>15:00</div></div></div></section>

  <section class="wrap" style="padding-bottom:clamp(50px,7vw,100px)"><div class="f-kats">${KATS.merch.map(([k, t], i) => `<a href="#mRaster" data-kat="${k}" data-r style="transition-delay:${i * 70}ms"><span class="rund"><img src="img/${katBild[k]}${katBild[k].startsWith('ill') ? '.svg' : '.webp'}" alt="" loading="lazy" style="${katBild[k].startsWith('ill') ? 'object-fit:contain;padding:14%' : ''}"></span>${t}<small>${L.filter(p => p.k === k).length} Artikel</small></a>`).join('')}</div></section>

  <section class="wrap" id="finder" style="padding-bottom:clamp(50px,7vw,100px)"><div class="finder" data-r>
    <div><p class="kicker" style="margin-bottom:16px">Geschenkfinder</p><h2>Wer soll sich freuen?</h2><p class="lead" style="margin-top:16px">Zwei Klicks, drei Ideen. Funktioniert auch kurz vor Weihnachten noch.</p></div>
    <div><div class="frage"><b>Für wen?</b><div class="opts" data-f="wer">${[['ich', 'Für mich'], ['kind', 'Fürs Kind'], ['oma', 'Oma & Opa'], ['kumpel', 'Kumpel']].map(([k, t], i) => `<button data-v="${k}" class="${i ? '' : 'on'}">${t}</button>`).join('')}</div></div>
      <div class="frage"><b>Budget</b><div class="opts" data-f="geld">${[['20', 'bis 20 €'], ['50', 'bis 50 €'], ['egal', 'Egal, Hauptsache Glocken']].map(([k, t], i) => `<button data-v="${k}" class="${i === 1 ? 'on' : ''}">${t}</button>`).join('')}</div></div>
      <div class="ergebnis" id="ergebnis"></div></div></div></section>

  <section class="wrap" style="padding-bottom:clamp(50px,7vw,100px)"><div class="paket" data-r><div class="bild"><img src="img/merch-schal-royal.webp" alt="Schal, Pullover und Wappen" loading="lazy"></div>
    <div class="text"><p class="mono" style="opacity:.8">Bundle · spart 7,85 €</p><h2>Das Stadion-Paket.</h2><ul><li><span>Fanschal Heimat</span><span>19,95 €</span></li><li><span>Beanie Wappen</span><span>19,95 €</span></li><li><span>Trinkflasche Edelstahl</span><span>16,95 €</span></li></ul>
      <div class="preis"><b class="num">49,00 €</b><s>56,85 €</s></div><button class="btn" id="paketBtn">Paket in den Warenkorb ${ICO.korb}</button></div></div></section>

  <section class="wrap" id="mRaster" style="padding-bottom:clamp(60px,8vw,120px)"><div class="sec-kopf"><h2 class="h-l" style="font-family:var(--f-round);font-weight:800;letter-spacing:-.05em">Alles mit Glocken.</h2>
    <div class="reiter" id="mFilter"><button class="on" data-k="">Alle</button>${KATS.merch.map(([k, t]) => `<button data-k="${k}">${t}</button>`).join('')}</div></div>
    <div class="raster" id="mGrid">${L.map((p, i) => kachel(p, { r: 1, d: (i % 4) * 70 })).join('')}</div></section>`,
    nach: root => {
      // Sticker ziehen
      $$('.sticker', root).forEach(s => { let sx, sy, ox = 0, oy = 0;
        s.addEventListener('pointerdown', e => { s.setPointerCapture(e.pointerId); sx = e.clientX - ox; sy = e.clientY - oy; s.style.transition = 'none'; });
        s.addEventListener('pointermove', e => { if (!s.hasPointerCapture(e.pointerId)) return; ox = e.clientX - sx; oy = e.clientY - sy; s.style.translate = `${ox}px ${oy}px`; });
        s.addEventListener('pointerup', () => { s.style.transition = ''; s.animate([{ scale: 1.15 }, { scale: 1 }], { duration: 500, easing: 'cubic-bezier(.34,1.56,.64,1)' }); }); });
      // Geschenkfinder
      const sel = { wer: 'ich', geld: '50' };
      const finde = () => { const max = sel.geld === 'egal' ? 999 : +sel.geld; const pool = { ich: ['hoodie-1896-glocken', 'fanschal-heimat', 'cap-1896-cream', 'supporter-hoodie', 'trinkflasche', 'beanie-wappen'], kind: ['heimtrikot-kids', 'beanie-wappen', 'pin-set', 'cap-royal', 'kids-trainingsanzug', 'fanschal-glocken'], oma: ['fanschal-heimat', 'gutschein', 'stoffbeutel', 'balkenschal', 'pin-set', 'supporter-hoodie', 'trinkflasche'], kumpel: ['gutschein', 'trinkflasche', 'cap-royal', 'balkenschal', 'crew-stone-grey', 'beanie-wappen', 'pin-set'] }[sel.wer].map(s => PS[s]).filter(p => p.p <= max).slice(0, 3);
        $('#ergebnis').innerHTML = pool.map(p => `<a href="${U('p/' + p.s)}" data-link><img ${srcset(p.img[0])} sizes="180px" alt="" class="${p.ill ? 'ill' : ''}">${esc(p.n)}<span>${eur(p.p)}</span></a>`).join('') || '<p>Für das Budget haben wir gerade nichts. Wie wär’s mit dem Pin-Set?</p>'; };
      $$('.finder .opts', root).forEach(o => $$('button', o).forEach(b => b.onclick = () => { sel[o.dataset.f] = b.dataset.v; $$('button', o).forEach(x => x.classList.toggle('on', x === b)); finde(); })); finde();
      $('#paketBtn').onclick = () => { let rest = 49; ['fanschal-heimat', 'beanie-wappen', 'trinkflasche'].forEach((s, k) => { const pr = PS[s]; const p = k < 2 ? +(pr.p * 49 / 56.85).toFixed(2) : +rest.toFixed(2); rest -= p; S.korb.push({ key: s + '|paket|' + Date.now(), s, gr: pr.gr[0], m: 1, p }); }); ls.set('svd_korb', S.korb); korbMalen(); zaehler(true); konfetti(); lade(true); };
      const filt = k => { $$('#mFilter button').forEach(x => x.classList.toggle('on', x.dataset.k === k)); $('#mGrid').innerHTML = P.filter(p => p.l === 'merch' && (!k || p.k === k)).map(p => kachel(p).replace('<article class="kachel', '<article class="kachel raus')).join(''); };
      $$('#mFilter button').forEach(b => b.onclick = () => filt(b.dataset.k));
      $$('.f-kats a', root).forEach(a => a.addEventListener('click', () => filt(a.dataset.kat)));
    }
  };
});

/* ================= Produktseite ================= */
const DETAIL_TEXT = { 'd-number': 'Flock-Nummer', 'd-crest-chest': 'Wappen gestickt', 'd-crest-grey': 'Flachstick', 'd-stick-1896': 'Stick in Silber', 'd-hoodie-back': 'Rückenprint', 'd-graffiti': 'Mehr als ein Verein', 'd-backprint': 'Siebdruck', 'd-scarf-crest': 'Jacquard', 'd-knit': 'Strickbild', 'd-cap': 'Stick auf Cap' };
route(/^\/p\/([a-z0-9-]+)$/, m => {
  const p = PS[m[1]]; if (!p) return nix();
  const L = LINIEN[p.l]; const kids = p.gr[0] === '116';
  const q = new URLSearchParams(location.search);
  const persVor = q.get('name') ? { name: q.get('name').slice(0, 12), nr: (q.get('nr') || '').slice(0, 2) } : null;
  const dazu = P.filter(x => x.l === p.l && x.s !== p.s).sort((a, b) => (b.k === p.k) - (a.k === p.k)).slice(0, 4);
  const look = { mannschaft: ['team-anzug-treppe', ['praesentationsanzug', 'heimtrikot-26-27', 'sporttasche'], [[38, 40], [62, 60], [30, 78]]], '1896': ['1896-bank', ['crew-royal-heritage', 'crew-stone-grey', 'track-jacket-1896'], [[30, 46], [62, 42], [80, 40]]], merch: ['merch-gruppe', ['beanie-wappen', 'fanschal-glocken', 'supporter-hoodie'], [[82, 22], [86, 60], [40, 50]]] }[p.l];
  const detailBilder = p.img.filter(b => b.startsWith('d-'));
  const geld = { mannschaft: 'Mit jedem Teamline-Kauf finanzieren wir Bälle und Trikots für die Jugend.', '1896': 'Der Überschuss aus jedem Drop fließt direkt in den Verein, vom Flutlicht bis zur Jugendfahrt.', merch: 'Jeder Schal hilft beim nächsten Jugend-Turnier mit. Auch Kleinvieh macht Mist.' }[p.l];
  return {
    titel: p.n, html: `
  <section class="pdp wrap"><nav class="brot" aria-label="Brotkrumen"><a href="${U('')}" data-link>Start</a><span>/</span><a href="${U(p.l)}" data-link>${L.name}</a><span>/</span><span>${esc(p.n)}</span></nav>
  <div class="grid"><div><div class="galerie" id="galerie">${p.img.map((b, i) => `<figure class="${p.ill ? 'ill' : ''}" data-src="${bildUrl(b)}"><img ${b.endsWith('.svg') ? `src="img/${b}"` : `src="${bildUrl(b)}"`} alt="${esc(p.n)}${i ? ' Ansicht ' + (i + 1) : ''}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>${DETAIL_TEXT[b] ? `<figcaption>${DETAIL_TEXT[b]}</figcaption>` : ''}</figure>`).join('')}</div>
    <div class="gal-punkte" id="galPunkte">${p.img.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div></div>
  <aside class="kaufbox" id="kaufbox">
    <div><div class="badges">${p.b.map(x => `<span class="chip ${x === 'Limited' ? 'akz' : 'rand'}">${x}</span>`).join('')}</div>
      <h1 style="margin-top:14px">${esc(p.n)}</h1><p class="unter">${esc(p.u)}</p></div>
    <div class="preiszeile"><b class="num" id="preis">${eur(p.p + (persVor ? 12 : 0))}</b><small>inkl. MwSt.${p.vor ? ' · Vorbestellung' : ' · auf Lager'}</small></div>
    ${!p.gut && (p.f.length > 1 || p.f[0]) ? `<div><div class="wahl-kopf"><span>Farbe: <b>${p.f.find(f => f[2] === p.s)?.[0] || p.f[0][0]}</b></span></div><div class="farben-w">${p.f.map(f => `<a href="${U('p/' + f[2])}" data-link class="${f[2] === p.s ? 'on' : ''}" style="background:${f[1]}" aria-label="${f[0]}" title="${f[0]}"></a>`).join('')}</div></div>` : ''}
    <div><div class="wahl-kopf"><span>${p.gut ? 'Betrag' : 'Größe'}: <b id="grWahl">${p.gr.length === 1 ? p.gr[0] : 'bitte wählen'}</b></span>${p.gr.length > 1 && !p.gut ? `<button id="grHilfe">${ICO.lineal.replace('<svg', '<svg style="width:15px;display:inline;vertical-align:-3px;margin-right:4px"')}Größe finden</button>` : ''}</div>
      <div class="groessen">${p.gr.map(g => `<button data-g="${g}" class="${p.aus.includes(g) ? 'aus' : ''}${p.wenig.includes(g) ? ' wenig' : ''}${p.gr.length === 1 ? ' on' : ''}" ${p.aus.includes(g) ? 'aria-disabled="true"' : ''}>${g}</button>`).join('')}</div>
      ${p.wenig.length && p.gr.length > 1 ? `<p class="passt" style="margin-top:10px"><i style="width:7px;height:7px;border-radius:50%;background:var(--orange);display:inline-block"></i>Nur noch wenige in ${p.wenig.join(', ')}</p>` : ''}
      ${p.fit ? `<p class="passt" style="margin-top:8px">${ICO.info}<span>${esc(p.fit)}${p.model ? ' ' + esc(p.model) : ''}</span></p>` : ''}</div>
    ${p.pers ? `<div class="persbox"><div class="kopf" id="persKopf"><div><b>Name & Nummer</b><br><span>Geflockt von unserem Partner, +12 €</span></div><span class="schalter-k${persVor ? ' on' : ''}" id="persSch" role="switch" aria-checked="${!!persVor}"></span></div>
      <div class="eingaben" id="persEin" ${persVor ? '' : 'hidden'}><input id="pName" maxlength="12" placeholder="NAME" value="${esc(persVor?.name || '')}"><input id="pNr" maxlength="2" inputmode="numeric" placeholder="Nr." value="${esc(persVor?.nr || '')}"><div class="mini-t" id="pMini">${trikotSvg(p.f.find(f => f[2] === p.s)?.[1] || '#1F57C3', persVor?.name || 'NAME', persVor?.nr || '10')}</div></div></div>` : ''}
    ${p.vor ? `<div class="vorbest"><div class="oben-v"><span class="chip"><span class="dot"></span>Bestellschluss in</span><span class="mono" style="color:var(--muted)">${fTag(DROP1_ENDE)}, 20 Uhr</span></div>${uhrHtml(DROP1_ENDE, false)}
      <div class="zeitstrahl hell" style="--line:var(--line)"><span class="lauf" style="width:12%"></span><div class="jetzt"><b style="font-size:12.5px">Jetzt</b><span>vorbestellen</span></div><div><b style="font-size:12.5px">${fDatum(DROP1_ENDE)}</b><span>Schluss</span></div><div><b style="font-size:12.5px">Stick</b><span>ca. 14 Tage</span></div><div><b style="font-size:12.5px">KW ${VERSAND_KW}</b><span>Versand</span></div></div>
      <p>Limitiert auf den Zeitraum, nicht auf eine Stückzahl. Nach Bestellschluss wird nicht nachproduziert.</p></div>` : ''}
    <div class="kaufzeile"><button class="btn akz" id="kaufen">${p.vor ? 'Jetzt vorbestellen' : 'In den Warenkorb'} ${ICO.korb}</button><button class="merk${S.merk.includes(p.s) ? ' on' : ''}" data-herz="${p.s}" aria-label="Merken">${ICO.herz}</button></div>
    <div class="lieferinfo"><div>${ICO.lkw}<span><b>${p.gut ? 'Sofort per E-Mail' : p.vor ? `Versand ab KW ${VERSAND_KW}` : 'Lieferung in 3 bis 5 Werktagen'}</b><br>${p.gut ? 'Als PDF zum Ausdrucken oder Weiterleiten' : 'Kostenlos ab 75 €, sonst 5,90 €'}</span></div><div>${ICO.ort}<span><b>Abholung am Sportplatz</b><br>Kostenlos, wir melden uns, sobald es da ist</span></div><div>${ICO.zurueck}<span><b>14 Tage Umtausch</b>${p.pers || p.vor ? '<br>Personalisierte und vorbestellte Teile sind vom Umtausch ausgenommen' : '<br>Einfach am Sportplatz oder per Post'}</span></div></div>
    <div class="geld">${ICO.hand}<span>${geld}</span></div>
    <div class="akk">
      <details open><summary>Beschreibung<i></i></summary><div class="inhalt"><p>${esc(p.t)}</p></div></details>
      <details><summary>Material & Pflege<i></i></summary><div class="inhalt"><ul>${p.mat.map(x => `<li>${esc(x)}</li>`).join('')}</ul><div class="pflege"><span>${ICO.waesche}30 °C</span><span>${ICO.buegeln}links bügeln</span><span>${ICO.luft}nicht trocknen</span></div></div></details>
      <details><summary>Passform & Größe<i></i></summary><div class="inhalt"><p>${esc(p.fit)} ${esc(p.model || '')}</p>${p.gr.length > 1 ? `<button class="link" id="grHilfe2" style="justify-self:start">Größentabelle öffnen ${ICO.pfeil}</button>` : ''}</div></details>
      <details><summary>Versand & Rückgabe<i></i></summary><div class="inhalt"><p>Versand per DHL oder kostenlose Abholung am Sportplatz. Zahlung per Vorkasse oder bar bei Abholung. Umtausch innerhalb von 14 Tagen, außer bei personalisierten und vorbestellten Teilen.</p></div></details>
    </div></aside></div></section>

  ${detailBilder.length ? `<section class="sec wrap" style="padding-bottom:0"><p class="kicker" style="margin-bottom:20px">Im Detail</p><div class="im-detail">${[...detailBilder, ...p.img.filter(x => !x.startsWith('d-') && x !== p.img[0])].slice(0, 3).map(b => `<figure data-r="maske"><img src="${bildUrl(b)}" alt="" loading="lazy"><figcaption>${DETAIL_TEXT[b] || ''}</figcaption></figure>`).join('')}</div></section>` : ''}

  <section class="sec wrap"><p class="kicker" style="margin-bottom:14px">Complete the Look</p><h2 class="h-m" style="margin-bottom:28px">So tragen wir’s in Mörlenbach.</h2>
    <div class="look-set"><div class="grossbild" data-r><img src="img/${look[0]}.webp" alt="" loading="lazy">${look[2].map(([x, y], i) => `<span class="punkt" style="left:${x}%;top:${y}%">${i + 1}</span>`).join('')}</div>
      <ul>${look[1].map((s, i) => { const x = PS[s]; return `<li data-r style="transition-delay:${i * 90}ms"><a href="${U('p/' + s)}" data-link><span class="n">${i + 1}</span><img ${srcset(x.img[0])} sizes="80px" alt="">
        <span><b>${esc(x.n)}</b><span>${esc(x.u)}</span></span><b class="num">${eur(x.p)}</b></a></li>`; }).join('')}
        <li><button class="btn voll" id="lookRein" style="margin-top:10px">Ganzen Look in den Warenkorb</button></li></ul></div></section>

  <section class="sec wrap" style="padding-top:0"><div class="sec-kopf"><h2 class="h-m">Passt dazu</h2><a class="link" href="${U(p.l)}" data-link>Alles aus ${L.name} ${ICO.pfeil}</a></div>
    <div class="raster">${dazu.map((x, i) => kachel(x, { r: 1, d: i * 70 })).join('')}</div></section>
  <div class="unterleiste" id="unterleiste"><img src="${bildUrl(p.img[0], true)}" alt=""><div><b>${esc(p.n)}</b><span class="num" id="ulPreis">${eur(p.p)}</span></div><button class="btn akz klein" id="ulKaufen">${p.vor ? 'Vorbestellen' : 'In den Warenkorb'}</button></div>`,
    nach: root => {
      let gr = p.gr.length === 1 ? p.gr[0] : null; let pers = !!persVor;
      const preis = () => { const v = eur(p.p + (pers ? 12 : 0)); $('#preis').textContent = v; $('#ulPreis').textContent = v; };
      $$('.groessen button', root).forEach(b => b.onclick = () => { if (b.classList.contains('aus')) { toast(`${ICO.info}<span>Größe ${b.dataset.g} ist vergriffen. Wir sagen Bescheid, falls sie wiederkommt.</span>`); return; } gr = b.dataset.g; $$('.groessen button', root).forEach(x => x.classList.toggle('on', x === b)); $('#grWahl').textContent = gr; if (p.gut) { const v = eur(parseFloat(gr)); $('#preis').textContent = v; $('#ulPreis').textContent = v; } });
      const kauf = () => {
        if (!gr) { const g = $('.groessen'); g.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(-5px)' }, { transform: 'none' }], { duration: 420 }); $('#grWahl').textContent = 'bitte zuerst wählen'; $('#grWahl').style.color = 'var(--orange)'; g.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
        const pv = pers ? { name: ($('#pName').value || '').toUpperCase(), nr: $('#pNr').value } : null;
        if (pers && (!pv.name || !pv.nr)) { toast(`${ICO.info}<span>Bitte Name und Nummer eintragen.</span>`); $('#pName').focus(); return; }
        korbRein(p.s, gr, pv); fliegen();
        const b = $('#kaufen'); const html = b.innerHTML; b.classList.add('ok'); b.innerHTML = `Liegt im Warenkorb ${ICO.check}`; setTimeout(() => { b.classList.remove('ok'); b.innerHTML = html; }, 1800);
      };
      const fliegen = () => { if (ruhig) return; const src = $('#galerie img'); const r = src.getBoundingClientRect(); const z = $('#korbBtn').getBoundingClientRect(); const c = src.cloneNode(); Object.assign(c.style, { position: 'fixed', left: r.left + 'px', top: Math.max(0, r.top) + 'px', width: r.width + 'px', height: Math.min(r.height, innerHeight) + 'px', objectFit: 'cover', zIndex: 300, borderRadius: '6px', pointerEvents: 'none' }); document.body.appendChild(c);
        c.animate([{ transform: 'none', opacity: 1 }, { transform: `translate(${z.left - r.left - r.width / 2 + 20}px, ${z.top - Math.max(0, r.top) - Math.min(r.height, innerHeight) / 2 + 20}px) scale(.06)`, opacity: .6 }], { duration: 800, easing: 'cubic-bezier(.7,0,.3,1)' }).finished.then(() => c.remove()); };
      $('#kaufen').onclick = kauf; $('#ulKaufen').onclick = kauf;
      // Personalisierung
      if (p.pers) { const sw = $('#persSch'); const farb = p.f.find(f => f[2] === p.s)?.[1] || '#1F57C3';
        $('#persKopf').onclick = () => { pers = !pers; sw.classList.toggle('on', pers); sw.setAttribute('aria-checked', pers); $('#persEin').hidden = !pers; preis(); if (pers) $('#pName').focus(); };
        const mini = () => { $('#pMini').innerHTML = trikotSvg(farb, ($('#pName').value || 'NAME').toUpperCase(), $('#pNr').value.replace(/\D/g, '') || '10'); };
        $('#pName').oninput = mini; $('#pNr').oninput = mini; preis(); }
      // Galerie
      $$('#galerie figure', root).forEach(f => f.onclick = () => lupe(f.dataset.src));
      const gal = $('#galerie'); gal.addEventListener('scroll', () => { const i = Math.round(gal.scrollLeft / (gal.scrollWidth / p.img.length)); $$('#galPunkte i').forEach((x, k) => x.classList.toggle('on', k === i)); }, { passive: true });
      // Größe finden
      [$('#grHilfe'), $('#grHilfe2')].forEach(b => b && (b.onclick = () => groessenDialog(kids, g => { const btn = $(`.groessen [data-g="${g}"]`); btn && btn.click(); })));
      // Look
      $('#lookRein').onclick = () => { look[1].forEach(s => { const x = PS[s]; const g = x.gr.length === 1 ? x.gr[0] : (x.gr.includes('M') ? 'M' : x.gr[2]); S.korb.push({ key: s + '|' + g + '|look' + Date.now(), s, gr: g, m: 1, p: x.p }); }); ls.set('svd_korb', S.korb); korbMalen(); zaehler(true); lade(true); };
      // Mobile Kaufleiste
      const ul = $('#unterleiste'); const io = new IntersectionObserver(es => ul.classList.toggle('auf', !es[0].isIntersecting && es[0].boundingClientRect.top < 0), { threshold: 0 }); io.observe($('#kaufen'));
      return () => io.disconnect();
    }
  };
});
function lupe(src) { const d = document.createElement('div'); d.className = 'lupe'; d.innerHTML = `<img src="${src}" alt=""><button class="zu" aria-label="Schließen">${ICO.zu}</button>`; d.onclick = () => d.remove(); document.body.appendChild(d); }
function groessenDialog(kids, wahl) {
  const T = kids ? GTAB.kids : GTAB.erw;
  const d = document.createElement('div'); d.className = 'dlg';
  d.innerHTML = `<div class="box breit"><button class="zu" aria-label="Schließen">${ICO.zu}</button><h2>Welche Größe passt?</h2><p>Gib Körpergröße und Gewicht ein. Wir schlagen dir eine Größe vor und markieren sie in der Tabelle.</p>
    <div class="rechner"><label>Körpergröße (cm)<input id="rK" type="number" inputmode="numeric" value="${kids ? 135 : 180}"></label><label>Gewicht (kg)<input id="rG" type="number" inputmode="numeric" value="${kids ? 30 : 78}"></label><button class="btn klein" id="rOk">Größe übernehmen</button><output id="rOut"></output></div>
    <div class="tabwrap"><table class="gtab"><thead><tr>${T.kopf.map(k => `<th>${k}</th>`).join('')}</tr></thead><tbody>${T.z.map(z => `<tr data-g="${z[0]}">${z.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <p style="font-size:13px;margin-top:14px">Maße am flach liegenden Teil gemessen. Brust ist die halbe Weite von Achsel zu Achsel.</p></div>`;
  document.body.appendChild(d);
  let empf;
  const rechne = () => { const k = +$('#rK', d).value, g = +$('#rG', d).value; if (kids) { const i = Math.min(4, Math.max(0, Math.round((k - 116) / 12))); empf = T.z[i][0]; } else { let i = Math.min(5, Math.max(0, Math.round((k - 163) / 6.2))); const bmi = g / Math.pow(k / 100, 2); if (bmi > 27) i = Math.min(5, i + 1); if (bmi < 19.5) i = Math.max(0, i - 1); empf = T.z[i][0]; }
    $('#rOut', d).innerHTML = `Unsere Empfehlung: <b>${empf}</b>. ${kids ? 'Zum Reinwachsen ruhig eine Nummer größer.' : 'Für einen lockeren Look eine Größe größer.'}`; $$('tbody tr', d).forEach(t => t.classList.toggle('empf', t.dataset.g === empf)); };
  $('#rK', d).oninput = rechne; $('#rG', d).oninput = rechne; rechne();
  $('#rOk', d).onclick = () => { wahl(empf); d.remove(); };
  d.onclick = e => { if (e.target === d || e.target.closest('.zu')) d.remove(); };
}

/* ================= Listen: Kids, Accessoires, Alle, Drops ================= */
function listeSeite(key) {
  const def = {
    kids: { t: 'Kids', k: 'Für die Kleinen', h: 'Klein. Laut. Mörlenbach.', l: 'Trikots, Trainingsanzüge und alles, was am Spielfeldrand warm hält. In den Größen 116 bis 164.', f: p => p.kids || ['beanie-wappen', 'pin-set', 'cap-royal', 'fanschal-glocken'].includes(p.s), bild: 'kids-trikot-royal' },
    accessoires: { t: 'Accessoires', k: 'Kleine Dinge, große Wirkung', h: 'Accessoires.', l: 'Caps, Mützen, Schals, Taschen und Flaschen. Die Teile, mit denen man den Verein jeden Tag dabei hat.', f: p => p.acc, bild: '1896-crew-cap-cafe' },
    alle: { t: 'Alle Produkte', k: 'Der ganze Store', h: 'Alles auf einen Blick.', l: 'Mannschaft, 1896 und Merch zusammen. Filtern, sortieren, verlieben.', f: () => true, bild: 'merch-gruppe' },
  }[key];
  const L = P.filter(def.f);
  return {
    titel: def.t, html: `
  <section class="liste-kopf wrap"><div class="grid"><div><p class="kicker" style="margin-bottom:18px">${def.k}</p><h1 class="h-xl">${woerter(def.h)}</h1></div><p class="lead">${def.l}</p></div></section>
  <section class="wrap" style="padding-bottom:clamp(60px,8vw,120px)"><div class="werkzeug"><div class="filter" id="lFilter"><button class="on" data-k="">Alle</button><button data-k="mannschaft">Mannschaft</button><button data-k="1896">1896</button><button data-k="merch">Merch</button></div>
    <div style="display:flex;gap:12px;align-items:center"><span class="anz" id="lAnz">${L.length} Artikel</span><select id="lSort" aria-label="Sortieren"><option value="">Empfohlen</option><option value="auf">Preis aufsteigend</option><option value="ab">Preis absteigend</option><option value="neu">Neu zuerst</option></select></div></div>
    <div class="raster" id="lRaster">${L.map((p, i) => kachel(p, { r: 1, d: (i % 4) * 60 })).join('')}</div></section>`,
    nach: root => {
      requestAnimationFrame(() => $$('.liste-kopf .wz', root).forEach((w, i) => { w.firstElementChild.style.transitionDelay = i * 80 + 'ms'; w.classList.add('in'); }));
      let f = '', s = '';
      const mal = () => { let R = L.filter(p => !f || p.l === f); if (s === 'auf') R = [...R].sort((a, b) => a.p - b.p); if (s === 'ab') R = [...R].sort((a, b) => b.p - a.p); if (s === 'neu') R = [...R].sort((a, b) => b.b.includes('Neu') - a.b.includes('Neu')); $('#lRaster').innerHTML = R.map(p => kachel(p).replace('<article class="kachel', '<article class="kachel raus')).join('') || '<p style="color:var(--muted)">Hier gibt es gerade nichts. Schau mal in den anderen Linien.</p>'; $('#lAnz').textContent = R.length + ' Artikel'; };
      $$('#lFilter button').forEach(b => b.onclick = () => { f = b.dataset.k; $$('#lFilter button').forEach(x => x.classList.toggle('on', x === b)); mal(); });
      $('#lSort').onchange = e => { s = e.target.value; mal(); };
    }
  };
}
route(/^\/kids$/, () => listeSeite('kids'));
route(/^\/accessoires$/, () => listeSeite('accessoires'));
route(/^\/alle$/, () => listeSeite('alle'));
route(/^\/drops$/, () => ({
  titel: 'Drops', ueber: false, html: `
  <section class="seite wrap"><p class="kicker" style="margin-bottom:18px">1896 · Drops</p><h1 class="h-xl" style="font-family:var(--f-serif);font-weight:500;font-style:italic">Drops.</h1>
    <p class="lead" style="margin-top:22px">Jeder Drop hat einen Anfang und ein Ende. Dazwischen kannst du vorbestellen. Danach wird gestickt, genäht und verschickt. Und dann ist er Geschichte.</p></section>
  <section class="sec wrap" style="padding-top:clamp(40px,5vw,70px)"><div class="dropmodul" style="border-radius:0"><div class="grid2" style="min-height:0"><div class="bild" style="min-height:420px"><img src="img/1896-hoodie-treppe.webp" alt="" loading="lazy"></div>
    <div class="text"><span class="chip hell" style="width:max-content"><span class="dot"></span>Live</span><h2 class="h-l" style="font-family:var(--f-serif);font-weight:500;font-style:italic">Drop 01 · Heritage</h2>
      <p class="lead">${P.filter(p => p.d === '01').length} Produkte. Heavy Fleece, Stick in der Region, Bestellschluss am ${fTag(DROP1_ENDE)}.</p>${uhrHtml(DROP1_ENDE)}<a class="btn hell" href="${U('1896')}#drop01" data-link style="width:max-content">Zum Drop ${ICO.pfeil}</a></div></div></div></section>
  <section class="naechster" style="min-height:60svh"><img src="img/1896-mauer.webp" alt="" loading="lazy"><div class="in"><p class="mono" style="opacity:.7">Drop 02 · ${fDatum(DROP2_START, { day: '2-digit', month: 'long' })} · 18 Uhr</p><h2>Mehr als <em>ein</em> Verein.</h2>${uhrHtml(DROP2_START)}
    <form data-demo="Du wirst 24 Stunden vorher erinnert (Demo)."><input type="email" placeholder="E-Mail für die Erinnerung" aria-label="E-Mail" required><button class="btn hell">Erinnern</button></form></div></section>
  <section class="sec wrap"><p class="kicker" style="margin-bottom:22px">Archiv</p><div class="archiv"><a href="${U('1896')}" data-link><span>01</span><span class="t">Heritage</span><span>${fDatum(DROP1_START)} bis ${fDatum(DROP1_ENDE)}</span><span>Live</span></a><div class="z" style="opacity:.55"><span>02</span><span class="t">Mehr als ein Verein</span><span>ab ${fDatum(DROP2_START)}</span><span>Bald</span></div><div class="z" style="opacity:.35"><span>03</span><span class="t">130 Jahre</span><span>2026</span><span>Geplant</span></div></div></section>`
}));

/* ================= Merkzettel ================= */
route(/^\/merkzettel$/, () => {
  const L = S.merk.map(s => PS[s]).filter(Boolean);
  return { titel: 'Merkzettel', html: `<section class="liste-kopf wrap"><p class="kicker" style="margin-bottom:18px">Merkzettel</p><h1 class="h-xl">${L.length ? 'Gut gemerkt.' : 'Noch leer.'}</h1><p class="lead" style="margin-top:18px">${L.length ? 'Deine Favoriten, gespeichert auf diesem Gerät.' : 'Tippe auf das Herz an einem Produkt, dann landet es hier.'}</p></section>
    <section class="wrap" style="padding-bottom:clamp(60px,8vw,120px)">${L.length ? `<div class="raster">${L.map(p => kachel(p)).join('')}</div>` : `<a class="btn" href="${U('alle')}" data-link>Alle Produkte ansehen ${ICO.pfeil}</a>`}</section>` };
});

/* ================= Verein ================= */
route(/^\/verein$/, () => ({
  titel: 'Verein', html: `
  <section class="seite wrap"><div class="verein-held"><div><p class="kicker" style="margin-bottom:18px">Über uns</p><h1 class="h-xl">${woerter('Mehr als')}<br>${woerter('ein <em style="font-family:var(--f-serif);font-weight:500">Verein.</em>')}</h1>
    <p class="lead" style="margin-top:26px">Der SV Mörlenbach ist ein Fußballverein aus dem Odenwald. Seit 1896 treffen sich hier Menschen, um zu spielen, zu trainieren, zu helfen und hinterher zusammenzusitzen. Dieser Store ist ein Teil davon.</p></div>
    <div class="bild" data-r="maske"><img src="img/team-hoodie-ruecken.webp" alt="Drei Spieler auf dem Weg zum Platz"></div></div></section>
  <section class="sec wrap"><div class="chronik">${[['1896', 'Gegründet', 'Im Ort, für den Ort. Seitdem ist der Verein ein fester Teil von Mörlenbach.'], ['Heute', 'Von den Bambini bis zu den Aktiven', 'Viele Mannschaften, viele Ehrenamtliche, ein Platz. Und jedes Wochenende Fußball.'], ['2026', '130 Jahre', 'Ein Jubiläum, das gefeiert wird. Mit einem eigenen Drop und vielen Gelegenheiten, zusammenzukommen.'], ['Store', 'Mehr als Merch', 'Mit dem eigenen Store wird der Verein auch abseits des Platzes sichtbar. Jeder Euro Überschuss bleibt im Verein.']].map(([b, h, t]) => `<div data-r><b>${b}</b><div><h3>${h}</h3><p>${t}</p></div></div>`).join('')}</div></section>
  <section class="sec wrap" id="geld" style="padding-top:0"><h2 class="h-l" style="margin-bottom:30px" data-r>Wohin dein Geld geht.</h2><div class="werte3">${[['Jugend', 'Bälle, Trikots, Turnierfahrten und Trainerausbildung für die Kleinsten bis zur A-Jugend.'], ['Platz & Heim', 'Pflege, Flutlicht, Kabinen und alles, was ein Sportgelände am Laufen hält.'], ['Gemeinschaft', 'Feste, Fahrten, Ehrungen. Die Momente, wegen denen man überhaupt im Verein ist.']].map(([b, t], i) => `<div data-r style="transition-delay:${i * 90}ms"><b>${b}</b><p>${t}</p></div>`).join('')}</div></section>`,
  nach: root => requestAnimationFrame(() => $$('.verein-held .wz', root).forEach((w, i) => { w.firstElementChild.style.transitionDelay = i * 90 + 'ms'; w.classList.add('in'); }))
}));

/* ================= FAQ ================= */
const FAQ = [
  ['bestellung', 'Bestellung & Zahlung', [['Wie kann ich bezahlen?', 'Per Vorkasse (Überweisung) oder bar bei Abholung am Sportplatz. Weitere Zahlarten wie PayPal sind geplant.'], ['Brauche ich ein Kundenkonto?', 'Nein. Du bestellst als Gast. Deine Bestellung bekommst du per E-Mail mit einem Link, über den du den Status jederzeit siehst.'], ['Kann ich meine Bestellung ändern?', 'Solange sie noch nicht bezahlt oder veredelt ist, ja. Schreib uns einfach.']]],
  ['versand', 'Versand & Abholung', [['Was kostet der Versand?', 'Innerhalb Deutschlands 5,90 €. Ab 75 € Bestellwert ist der Versand kostenlos.'], ['Wie funktioniert die Abholung?', 'Wähle an der Kasse „Abholung am Sportplatz“. Wir melden uns, sobald dein Paket bereitliegt. Abholung zu Heimspielen und Trainingszeiten, kostenlos.'], ['Wie schnell ist meine Bestellung da?', 'Lagerware in 3 bis 5 Werktagen. Personalisierte Teile brauchen etwa 5 Tage länger. Vorbestellungen zum angegebenen Versandtermin.']]],
  ['vorbestellung', 'Vorbestellung & Drops', [['Was ist ein Drop?', 'Eine kleine, zeitlich begrenzte Kollektion der Linie 1896. Sie ist nur in einem festen Zeitraum bestellbar und wird danach nicht wieder aufgelegt.'], ['Wie viele Teile gibt es?', 'Wir legen keine Stückzahl fest, sondern ein Ende. Alles, was bis zum Bestellschluss bestellt wird, wird produziert. Danach nichts mehr.'], ['Wann kommt meine Vorbestellung?', 'Nach Bestellschluss wird etwa 14 Tage gestickt und genäht. Den Versandtermin siehst du auf jeder Produktseite.'], ['Bekommen Mitglieder Vorteile?', 'Ja, im Konzept: Mitglieder bekommen 24 Stunden früher Zugang zu jedem Drop.']]],
  ['veredelung', 'Veredelung & Personalisierung', [['Was kostet Name und Nummer?', '12 € pro Trikot. Der Flock wird von unserem Partner im Ort gemacht.'], ['Kann ich personalisierte Teile umtauschen?', 'Leider nein. Personalisierte und vorbestellte Teile sind vom Umtausch ausgeschlossen.'], ['Werden Wappen gedruckt oder gestickt?', 'Auf Trikots und der 1896-Linie gestickt, auf Schals gestrickt. Gedruckt wird nur bei großen Rückenmotiven.']]],
  ['groessen', 'Größen', [['Wie fallen die Größen aus?', 'Teamline normal, 1896 eher weit (Boxy Fit). Auf jeder Produktseite gibt es einen Größenrechner und die Maße.'], ['Gibt es Kindergrößen?', 'Ja, von 116 bis 164 in der Teamline und bei ausgewählten Merch-Artikeln.']]],
  ['team', 'Teambestellung', [['Wie bestelle ich für eine ganze Mannschaft?', 'Auf der Seite Mannschaft gibt es den Teambesteller. Größen eintragen, Artikel wählen, Angebot anfragen. Ab 10 Teilen gibt es 10 % Rabatt, ab 20 Teilen 15 %.'], ['Können Spieler einzeln zahlen?', 'Ja. Entweder eine Sammelrechnung oder jeder zahlt seinen Anteil selbst.']]],
  ['kontakt', 'Kontakt', [['Wie erreiche ich euch?', 'Per E-Mail an den Store oder persönlich am Sportplatz. Die Kontaktdaten stehen im Impressum.']]],
];
route(/^\/faq$/, () => ({
  titel: 'FAQ', html: `<section class="seite wrap"><p class="kicker" style="margin-bottom:18px">Hilfe</p><h1 class="h-xl">Fragen? Klar.</h1><p class="lead" style="margin-top:20px">Alles zu Bestellung, Abholung, Drops und Größen. Und wenn doch was fehlt: Frag am Sportplatz, da weiß immer jemand Bescheid.</p></section>
  <section class="sec wrap"><div class="faq-grid"><nav class="faq-nav">${FAQ.map(([k, t]) => `<a href="#${k}">${t}</a>`).join('')}</nav>
    <div>${FAQ.map(([k, t, qs]) => `<h2 id="${k}">${t}</h2><div class="akk">${qs.map(([q, a]) => `<details><summary>${q}<i></i></summary><div class="inhalt"><p>${a}</p></div></details>`).join('')}</div>`).join('')}</div></div></section>`
}));

/* ================= Kasse (Demo) ================= */
route(/^\/kasse$/, () => {
  const sum = korbSumme();
  return {
    titel: 'Kasse', html: `<section class="seite wrap" style="padding-bottom:clamp(60px,8vw,120px)"><p class="kicker" style="margin-bottom:18px">Kasse</p><h1 class="h-l" style="margin-bottom:clamp(30px,4vw,50px)">Fast geschafft.</h1>
    ${S.korb.length ? `<div class="kasse-grid"><form id="kForm" novalidate>
      <fieldset><legend><i>1</i>Kontakt</legend><div class="zwei"><div class="feld-g"><label>Vorname</label><input autocomplete="given-name"></div><div class="feld-g"><label>Nachname</label><input autocomplete="family-name"></div></div><div class="feld-g"><label>E-Mail</label><input type="email" autocomplete="email"></div></fieldset>
      <fieldset><legend><i>2</i>Lieferung</legend>
        <label class="wahl-karte"><input type="radio" name="lief" value="abh" checked><div><b>Abholung am Sportplatz</b><span>Wir melden uns, sobald es bereitliegt.</span></div><em>kostenlos</em></label>
        <label class="wahl-karte"><input type="radio" name="lief" value="vers"><div><b>Versand mit DHL</b><span>3 bis 5 Werktage, Vorbestellungen zum Versandtermin</span></div><em>${sum >= FREI_AB ? 'kostenlos' : '5,90 €'}</em></label></fieldset>
      <fieldset><legend><i>3</i>Zahlung</legend>
        <label class="wahl-karte"><input type="radio" name="zahl" checked><div><b>Vorkasse</b><span>Überweisung, Bankdaten kommen per E-Mail</span></div></label>
        <label class="wahl-karte"><input type="radio" name="zahl"><div><b>Bar bei Abholung</b><span>Nur bei Abholung am Sportplatz</span></div></label></fieldset>
      <button class="btn voll" type="submit">Zahlungspflichtig bestellen ${ICO.pfeil}</button><p style="font-size:12.5px;color:var(--muted);margin-top:12px">Mit der Bestellung akzeptierst du AGB und Widerruf. In dieser Demo wird nichts bestellt.</p></form>
      <aside class="kasse-box">${S.korb.map(x => { const p = PS[x.s]; return `<div class="zeile"><span>${x.m} × ${esc(p.n)} <small style="color:var(--muted)">(${esc(x.gr)})</small></span><span class="num">${eur(x.p * x.m)}</span></div>`; }).join('')}
        <div class="zeile"><span>Lieferung</span><span id="kLief">kostenlos</span></div><div class="zeile gesamt"><span>Gesamt</span><span class="num" id="kSum">${eur(sum)}</span></div><span style="font-size:12.5px;color:var(--muted)">inkl. 19 % MwSt.</span>
        <div class="geld" style="margin-top:6px">${ICO.hand}<span>Mit dieser Bestellung unterstützt du den SV Mörlenbach. Danke!</span></div></aside></div>`
        : `<p class="lead">Dein Warenkorb ist leer.</p><p style="margin-top:24px"><a class="btn" href="${U('alle')}" data-link>Zum Store ${ICO.pfeil}</a></p>`}</section>`,
    nach: root => { const f = $('#kForm', root); if (!f) return;
      $$('[name=lief]', f).forEach(r => r.onchange = () => { const v = r.value === 'vers' && sum < FREI_AB ? 5.9 : 0; $('#kLief').textContent = v ? eur(v) : 'kostenlos'; $('#kSum').textContent = eur(sum + v); });
      f.onsubmit = e => { e.preventDefault(); const d = document.createElement('div'); d.className = 'dlg'; d.innerHTML = `<div class="box"><button class="zu" aria-label="Schließen">${ICO.zu}</button><h2>Hier wäre jetzt bestellt.</h2><p>Das ist eine Konzept-Demo. Im echten Store bekommt die Kundin jetzt eine Bestellnummer, die Bankdaten per E-Mail und einen Link zur Bestellübersicht. Im Backoffice erscheint die Bestellung sofort.</p><p style="margin-top:20px"><a class="btn" href="${U('konzept')}#technik" data-link>So läuft’s im Hintergrund ${ICO.pfeil}</a></p></div>`; d.onclick = ev => { if (ev.target === d || ev.target.closest('.zu') || ev.target.closest('a')) d.remove(); }; document.body.appendChild(d); }; }
  };
});

/* ================= Rechtliches (Platzhalter) ================= */
route(/^\/info\/([a-z]+)$/, m => ({ titel: { impressum: 'Impressum', datenschutz: 'Datenschutz', agb: 'AGB & Widerruf' }[m[1]] || 'Info', html: `<section class="seite wrap" style="min-height:60svh;padding-bottom:80px"><p class="kicker" style="margin-bottom:18px">Kleingedrucktes</p><h1 class="h-l">${{ impressum: 'Impressum', datenschutz: 'Datenschutz', agb: 'AGB & Widerruf' }[m[1]] || 'Info'}</h1><div class="hinweisbox" style="margin-top:28px">Platzhalter in der Konzept-Demo. Im echten Store stehen hier die rechtlich geprüften Texte des SV Mörlenbach 1896 e.V.</div></section>` }));

/* ================= Konzept & Styleguide ================= */
route(/^\/konzept$/, () => {
  const K = [['idee', 'Leitidee'], ['stil', 'Stilrichtung'], ['welten', 'Drei Welten'], ['farbe', 'Farben'], ['typo', 'Typografie'], ['struktur', 'Seitenstruktur'], ['hero', 'Startseite & Hero'], ['pdp', 'Produktseite'], ['drop', 'Drop-Logik'], ['texte', 'Texte & Ton'], ['ui', 'UI-Elemente'], ['bild', 'Bildsprache'], ['benchmark', 'Benchmark'], ['partner', 'Rolle des Partners'], ['business', 'Business Case'], ['technik', 'Technik & Roadmap']];
  const sw = (n, h, r) => `<div class="swatch"><i style="background:${h}"></i><div><b>${n}</b><span>${h}</span><br><span style="font-family:var(--f-sans)">${r}</span></div></div>`;
  return {
    titel: 'Konzept', html: `<div class="konzept">
  <header class="k-kopf wrap"><p class="kicker" style="margin-bottom:22px">Konzept & Styleguide · Store SV Mörlenbach</p><h1>Drei Welten.<br>Ein <em>Verein.</em></h1>
    <p style="margin-top:22px"><button class="btn akz" data-tour>${ICO.play} Geführte Tour starten</button></p><p class="lead" style="margin-top:26px;max-width:62ch">Wie der Store des SV Mörlenbach aussieht, klingt und funktioniert. Grundlage für das Gespräch mit dem Teamsport-Partner. Alles, was hier beschrieben ist, ist in dieser Demo klickbar umgesetzt.</p>
    <div class="k-meta"><span>Stand ${fDatum(JETZT, { day: '2-digit', month: 'long', year: 'numeric' })}</span><span>Version 1.0 · Demo</span><span>Verkäufer: SV Mörlenbach 1896 e.V.</span></div></header>
  <div class="wrap k-layout"><nav class="k-nav" id="kNav">${K.map(([k, t], i) => `<a href="#${k}"><b>${String(i + 1).padStart(2, '0')}</b>${t}</a>`).join('')}</nav><div>

  <section class="k-sek" id="idee"><span class="nr">01 · Leitidee</span><h2>Ein Vereinsstore, der sich wie eine Marke anfühlt.</h2>
    <p>Der Store ist nicht der Fanartikel-Tisch im Vereinsheim, nur online. Er ist die Bühne, auf der der Verein zeigt, wer er ist: ein Dorfverein mit 130 Jahren Geschichte, der modern auftritt, ohne seine Herkunft zu verstecken.</p>
    <p>Dafür teilen wir das Sortiment in drei klar getrennte Linien. Jede hat ihre eigene Zielgruppe, ihren eigenen Ton und ihre eigene Gestaltung. Gemeinsam ist allen der Rahmen: Anthrazit, Off-White und das Glockenwappen.</p>
    <ul class="k-liste"><li><b>Mannschaft</b> verkauft Zugehörigkeit auf dem Platz: Teamwear, die Spieler, Trainer und Eltern wirklich brauchen.</li><li><b>1896</b> verkauft Begehrlichkeit: limitierte Streetwear, die man auch trägt, wenn man nie gegen einen Ball tritt.</li><li><b>Merch</b> verkauft Zuneigung: kleine, bezahlbare Dinge zum Verschenken und Dazugehören.</li></ul>
    <div class="hinweisbox">Der Satz, an dem sich alles messen lassen muss: <b>Würde das auch ein Mensch kaufen, der den Verein nicht kennt?</b> Bei 1896 lautet die Antwort Ja. Bei Mannschaft und Merch sorgt die Gestaltung dafür, dass Fans stolz darauf sind.</div></section>

  <section class="k-sek" id="stil"><span class="nr">02 · Visuelle Stilrichtung</span><h2>Reduziert, warm, mit Mut zu großen Momenten.</h2>
    <p>Vorbild sind moderne Mode- und Brand-Shops, nicht klassische Sportversender. Das heißt: viel Fläche, große Bilder, wenige Farben, starke Typografie. Bewegung wird gezielt eingesetzt, um Übergänge zu erzählen, nicht um zu dekorieren.</p>
    <ul class="k-liste"><li>Keine Logo-Tapeten, keine Verläufe in Vereinsfarben, keine Sterne-Bewertungen aus dem Nichts.</li><li>Branding sitzt auf den Produkten. Das Wappen taucht im Interface sparsam auf: im Header, im Intro und als Trenner im Laufband.</li><li>Jede Linie wechselt beim Betreten die komplette Bühne: Hintergrund, Schrift, Rundungen und Rhythmus. Ein farbiger Vorhang mit dem Liniennamen macht den Wechsel spürbar.</li><li>Animationen: Wort-für-Wort-Reveals, Ken-Burns im Hero, Scroll-Füllung im Manifest-Text, horizontal gepinntes Lookbook, gestapelte Kollektionskarten, Ziehen im Karussell, fliegendes Produktbild in den Warenkorb.</li></ul></section>

  <section class="k-sek" id="welten"><span class="nr">03 · Collection-Logik</span><h2>Drei Welten, drei Systeme.</h2>
    <p>Jede Linie ist ein eigenes Mini-Designsystem. Technisch ist das ein einziges Attribut auf der Seite, das Farben, Schrift und Radius umschaltet. So bleibt der Store wartbar und trotzdem überraschend.</p>
    <div class="welten3">
      <div class="welt"><div class="w-kopf" style="background:#1F57C3;color:#fff"><span class="mono" style="opacity:.7">01 · Mannschaft</span><span class="gross" style="font-weight:900;font-style:italic;font-stretch:62%;text-transform:uppercase">Für den Platz</span></div><div class="w-body"><div class="w-farben"><i style="background:#1F57C3"></i><i style="background:#F28C28"></i><i style="background:#fff"></i><i style="background:#1D2026"></i></div><p><b>Gefühl:</b> sportlich, schnell, teamnah.</p><p><b>Schrift:</b> Archivo extra-schmal, kursiv, Versalien.</p><p><b>Form:</b> schräge Kanten, Streifen in Orange, kaum Rundung.</p><p><b>Module:</b> Heim/Auswärts-Schalter, Live-Flock, Teambesteller mit Staffelpreis.</p></div></div>
      <div class="welt"><div class="w-kopf" style="background:#141517;color:#F4F1EA"><span class="mono" style="opacity:.6">02 · 1896</span><span class="gross" style="font-family:var(--f-serif);font-style:italic">Für die Straße</span></div><div class="w-body"><div class="w-farben"><i style="background:#1A1C1F"></i><i style="background:#2E3D57"></i><i style="background:#F4F1EA"></i><i style="background:#BDB6A8"></i></div><p><b>Gefühl:</b> urban, limitiert, hochwertig.</p><p><b>Schrift:</b> Bodoni kursiv für Headlines, Plex Mono für Daten.</p><p><b>Form:</b> dunkel, Filmkorn, keine Rundungen, viel Luft.</p><p><b>Module:</b> Countdown, Drop-Zeitstrahl, gepinntes Lookbook, Archiv.</p></div></div>
      <div class="welt"><div class="w-kopf" style="background:#ECE3D3;color:#22252A"><span class="mono" style="opacity:.6">03 · Merch</span><span class="gross" style="font-family:var(--f-round);font-weight:800;letter-spacing:-.05em">Für alle</span></div><div class="w-body"><div class="w-farben"><i style="background:#F1EADD"></i><i style="background:#D9D5CF"></i><i style="background:#2F66C8"></i><i style="background:#F28C28"></i></div><p><b>Gefühl:</b> zugänglich, sympathisch, warm.</p><p><b>Schrift:</b> Bricolage Grotesque, rund und freundlich.</p><p><b>Form:</b> große Rundungen, Polaroids, ziehbare Sticker.</p><p><b>Module:</b> Geschenkfinder, Bundle, runde Kategorien.</p></div></div></div>
    <h3>Querschnitt-Seiten</h3><p>Kids, Accessoires und Alle Produkte sind Filteransichten über alle drei Linien. Sie nutzen den neutralen Rahmen und zeigen jede Kachel in der Sprache ihrer Linie. Drops gehört zur Welt 1896.</p></section>

  <section class="k-sek" id="farbe"><span class="nr">04 · Farbkonzept</span><h2>Vier Basisfarben, zwei Akzente.</h2>
    <p>Basis ist neutral und warm. Die Vereinsfarbe Blau und das Orange als Signal werden sparsam eingesetzt: für Aktionen, Status und Momente, in denen etwas passiert.</p>
    <h3>Basis</h3><div class="swatches">${sw('Anthrazit', '#22252A', 'Text, Footer, Rahmen')}${sw('Off-White', '#F4F1EA', 'Hintergrund')}${sw('Warmgrau', '#D9D5CF', 'Flächen, Linien')}${sw('Navy', '#1E355E', 'Tiefe, Teambox')}</div>
    <h3>Akzente</h3><div class="swatches">${sw('Vereinsblau', '#2F66C8', 'Merch, Links')}${sw('Vereinsblau dunkel', '#1F57C3', 'Mannschaft')}${sw('Orange', '#F28C28', 'Signal, Badges, Hover')}</div>
    <h3>Erweiterung für 1896</h3><div class="swatches">${sw('Night', '#1A1C1F', 'Hintergrund 1896')}${sw('Washed Navy', '#2E3D57', 'Akzent')}${sw('Stone', '#BDB6A8', 'Sekundärtext')}${sw('Sand', '#ECE3D3', 'Merch-Fläche')}</div>
    <p style="margin-top:16px">Regel: pro Ansicht höchstens ein Akzent in voller Sättigung. Orange ist für Handlung und Status reserviert, nie für Dekoration.</p></section>

  <section class="k-sek" id="typo"><span class="nr">05 · Typografie</span><h2>Eine Familie, drei Stimmen.</h2>
    <p>Alle Schriften sind frei lizenziert und werden selbst gehostet. Es gehen keine Daten an Google oder andere Schriftanbieter.</p>
    <div class="typo-probe">
      <div><small>Archivo · variabel<br>Breite 62 bis 125 %<br>Rahmen & Mannschaft</small><span style="font-weight:900;font-style:italic;font-stretch:62%;font-size:clamp(40px,5vw,64px);line-height:.9;text-transform:uppercase">Für den Platz gemacht</span></div>
      <div><small>Archivo breit<br>Headlines Start</small><span style="font-weight:850;font-stretch:110%;font-size:clamp(30px,4vw,48px);line-height:1;letter-spacing:-.04em">Drei Welten. Ein Verein.</span></div>
      <div><small>Bodoni Moda kursiv<br>1896</small><span style="font-family:var(--f-serif);font-style:italic;font-size:clamp(36px,4.6vw,60px);line-height:1;letter-spacing:-.03em">Einmal. Dann nie wieder.</span></div>
      <div><small>IBM Plex Mono<br>Daten, Labels, Countdown</small><span class="mono" style="font-size:15px">DROP 01 · BESTELLSCHLUSS ${fTag(DROP1_ENDE).toUpperCase()} 20:00</span></div>
      <div><small>Bricolage Grotesque<br>Merch</small><span style="font-family:var(--f-round);font-weight:800;font-size:clamp(34px,4.4vw,56px);letter-spacing:-.05em;line-height:1">Für alle, die dazugehören.</span></div>
      <div><small>Archivo 400<br>Fließtext 16 bis 20 px</small><span style="max-width:55ch">Gestrickt, nicht gedruckt. Der Schal für Spieltag, Weihnachtsmarkt und die Bank am Brunnen.</span></div></div></section>

  <section class="k-sek" id="struktur"><span class="nr">06 · Seitenstruktur</span><h2>Flach, klar, schnell gefunden.</h2>
    <div class="sitemap"><div class="knoten start"><b>Startseite</b>Hero-Triptychon · Laufband · Manifest · Linien-Stapel · Bestseller · Drop-Modul · Details · Gemeinschaft · Service · Drop-Liste</div>
      <div class="knoten"><b>Mannschaft</b>Kategorien · Matchday Kit · Live-Flock · Raster · Teambesteller</div><div class="knoten"><b>1896</b>Manifest · Lookbook · Drop 01 · Ablauf · Drop 02 · Archiv</div><div class="knoten"><b>Merch</b>Kategorien · Geschenkfinder · Bundle · Raster</div>
      <div class="knoten"><b>Kids · Accessoires · Alle</b>Filter, Sortierung, linienübergreifend</div><div class="knoten"><b>Drops</b>Live, Kommend, Archiv</div><div class="knoten"><b>Produktseite</b>Galerie, Kaufbox, Detail, Look, Passt dazu</div>
      <div class="knoten"><b>Verein</b>Geschichte, Wohin dein Geld geht</div><div class="knoten"><b>FAQ</b>7 Themen, Anker aus dem Footer</div><div class="knoten"><b>Service</b>Merkzettel, Suche, Warenkorb, Kasse</div></div>
    <p style="margin-top:18px">Globale Elemente: Laufband mit Service-Botschaften, Header (blendet beim Runterscrollen aus), Vollbild-Menü mit Bildvorschau, Suche als Overlay (Taste /), Warenkorb als Schublade mit Gratis-Versand-Balken, Merkzettel ohne Konto.</p></section>

  <section class="k-sek" id="hero"><span class="nr">07 · Startseite & Hero</span><h2>Der erste Eindruck entscheidet die Linie.</h2>
    <h3>Umgesetzt: Das Triptychon</h3><p>Drei hohe Bildtafeln nebeneinander, jede eine Linie, jede in ihrer eigenen Schrift. Beim Überfahren wächst eine Tafel, die anderen werden entsättigt. Ein Klick zoomt das Bild auf Vollbild und landet nahtlos in der Linie. Auf dem Handy werden die Tafeln zu einem wischbaren Karussell.</p>
    <h3>Alternative B: Spieltag-Modus</h3><p>An Heimspieltagen wechselt der Hero automatisch: Countdown bis Anpfiff, Abholhinweis für vorbestellte Ware und ein Matchday-Angebot. Danach Ergebnis und ein „Danke fürs Kommen“.</p>
    <h3>Alternative C: Drop-Takeover</h3><p>24 Stunden vor einem Drop gehört die Startseite allein 1896: schwarzer Bildschirm, Countdown, Anmeldung zur Erinnerung. Zum Startzeitpunkt öffnet sich der Drop mit einer Vorhang-Animation.</p>
    <h3>Reihenfolge der Sektionen</h3><ul class="k-liste"><li>Hero zeigt die drei Linien und gibt sofort die Wahl.</li><li>Manifest erzählt, warum es den Store gibt, und füllt sich beim Scrollen Wort für Wort.</li><li>Gestapelte Linienkarten wiederholen die drei Welten, diesmal mit Produkten.</li><li>Bestseller als ziehbares Karussell mit Linienfilter.</li><li>1896-Drop-Modul mit Countdown und Produktions-Zeitstrahl.</li><li>Material und Veredelung in Nahaufnahmen.</li><li>Gemeinschaft, „Wohin dein Geld geht“, Instagram, Service und Drop-Liste.</li></ul></section>

  <section class="k-sek" id="pdp"><span class="nr">08 · Produktseiten-Logik</span><h2>Verkaufen, ohne zu drängeln.</h2>
    <div style="overflow-x:auto"><table class="k-tabelle"><thead><tr><th>Modul</th><th>Zweck</th><th>Besonderheit</th></tr></thead><tbody>
      <tr><td>Galerie</td><td>Großes Hauptbild, dann Lifestyle und Details</td><td>Lupe im Vollbild, auf dem Handy wischbar mit Punkten</td></tr>
      <tr><td>Kaufbox</td><td>Titel, Preis, Farbe, Größe, Kaufen</td><td>Klebt beim Scrollen mit, auf dem Handy als Leiste unten</td></tr>
      <tr><td>Größe finden</td><td>Unsicherheit nehmen, Retouren senken</td><td>Rechner aus Körpergröße und Gewicht, markiert die Tabelle</td></tr>
      <tr><td>Passform-Satz</td><td>Ehrliche Orientierung</td><td>„Spieler ist 1,82 m und trägt M“</td></tr>
      <tr><td>Name & Nummer</td><td>Personalisierung</td><td>Schalter, Live-Vorschau am Mini-Trikot, +12 €</td></tr>
      <tr><td>Vorbestellung</td><td>Drop-Mechanik erklären</td><td>Countdown, Zeitstrahl, Versand-KW automatisch berechnet</td></tr>
      <tr><td>Lieferinfo</td><td>Versand, Abholung, Umtausch</td><td>Abholung am Sportplatz als gleichwertige Option</td></tr>
      <tr><td>Wohin dein Geld geht</td><td>Kaufgrund mit Sinn</td><td>Pro Linie eigener Satz</td></tr>
      <tr><td>Im Detail</td><td>Qualität zeigen</td><td>Makros von Stick, Strick und Druck</td></tr>
      <tr><td>Complete the Look</td><td>Warenkorb vergrößern</td><td>Nummerierte Punkte im Bild, ganzer Look mit einem Klick</td></tr>
      <tr><td>Passt dazu</td><td>Weiterstöbern</td><td>Gleiche Linie, gleiche Kategorie zuerst</td></tr></tbody></table></div></section>

  <section class="k-sek" id="drop"><span class="nr">09 · 1896 Drop-Logik</span><h2>Begrenzt wird die Zeit, nicht die Menge.</h2>
    <p>Die Stückzahl wird nie genannt. Stattdessen hat jeder Drop ein festes Ende. Was bis dahin bestellt ist, wird gefertigt. Das erzeugt echte Knappheit ohne Restposten und ohne Lagerrisiko für den Verein.</p>
    <ul class="k-liste"><li><b>Ankündigung:</b> 2 bis 3 Wochen vorher Teaser mit unscharfem Bild, Datum und Erinnerung per E-Mail.</li><li><b>Early Access:</b> Mitglieder 24 Stunden früher.</li><li><b>Live:</b> 10 bis 16 Tage Vorbestellung, Countdown überall sichtbar.</li><li><b>Bestellschluss:</b> immer sonntags 20 Uhr. Danach automatische Bestellung beim Partner.</li><li><b>Produktion:</b> etwa 14 Tage Stick und Konfektion in der Region.</li><li><b>Auslieferung:</b> Versand oder Abholung am Sportplatz, Status per E-Mail.</li><li><b>Archiv:</b> Der Drop wandert ins Archiv und bleibt dort sichtbar. Sammlerwert entsteht von selbst.</li></ul>
    <h3>Kommunikation</h3><div class="texte"><div><small>Badge</small><p>Limited · Vorbestellung</p></div><div><small>Kaufbox</small><p>Limitiert auf den Zeitraum, nicht auf eine Stückzahl.</p></div><div><small>Drop-Modul</small><p>Einmal. Dann nie wieder.</p></div><div><small>Nach Bestellschluss</small><p>Drop 01 ist zu. Danke an alle, die dabei sind.</p></div></div></section>

  <section class="k-sek" id="texte"><span class="nr">10 · Texte & Tonalität</span><h2>Wie ein Mensch vom Sportplatz. Nur gut formuliert.</h2>
    <p>Kurz, direkt, mit einem Augenzwinkern aus dem Odenwald. Wir duzen. Wir übertreiben nicht. Keine Superlative, keine Anglizismen, wo ein deutsches Wort reicht. Dialekt nur als Gewürz, zum Beispiel „Ei gude!“ in Footer und Menü.</p>
    <div class="texte">
      <div><small>Startseite Hero</small><p>Drei Welten. Ein Verein.</p></div><div><small>Mannschaft</small><p>Für den Platz gemacht.</p></div>
      <div><small>1896</small><p>Die Linie, die nicht auf den Platz will.</p></div><div><small>Merch</small><p>Für alle, die dazugehören wollen.</p></div>
      <div><small>Material</small><p>Gestrickt, nicht gedruckt.</p></div><div><small>Gemeinschaft</small><p>Samstag, 15 Uhr. Immer.</p></div>
      <div><small>Leerer Warenkorb</small><p>Wie wär’s mit was Warmem für den Spieltag?</p></div><div><small>404</small><p>Abseits. Diese Seite gibt es nicht.</p></div>
      <div><small>Newsletter</small><p>Ei gude! Sei als Erstes dabei.</p></div><div><small>Footer</small><p>Gemacht im Odenwald. Mach’s gut, bis Samstag.</p></div></div></section>

  <section class="k-sek" id="ui"><span class="nr">11 · UI-Elemente</span><h2>Die Bausteine.</h2>
    <div class="ui-demo"><a class="btn" href="#ui">Primär ${ICO.pfeil}</a><a class="btn akz" href="#ui">Akzent</a><a class="btn rand" href="#ui">Kontur</a><a class="link" href="#ui">Textlink ${ICO.pfeil}</a><span class="chip akz">Limited</span><span class="chip rand">Personalisierbar</span><span class="chip"><span class="dot"></span>Live</span></div>
    <div class="ui-demo" style="background:#141517;color:#F4F1EA">${uhrHtml(DROP1_ENDE)}</div>
    <div class="ui-demo"><div class="groessen" style="flex:1;min-width:260px"><button>S</button><button class="on">M</button><button class="wenig">L</button><button class="aus">XL</button></div><span class="schalter-k on"></span></div>
    <ul class="k-liste" style="margin-top:20px"><li>Buttons füllen sich beim Überfahren von unten mit Orange, der Pfeil rückt nach rechts.</li><li>Produktkachel: zweites Bild beim Überfahren, Merken-Herz, Schnellkauf mit Größen, bis zu zwei Badges.</li><li>Größen: ausgewählt (gefüllt), wenig verfügbar (oranger Punkt), vergriffen (schraffiert).</li><li>Warenkorb-Schublade mit Fortschrittsbalken bis zum Gratisversand und Vorschlägen unter 30 €.</li><li>Toasts unten mittig, Dialoge mit weichem Einflug, Seitenwechsel mit Vorhang in Linienfarbe.</li><li>Startseite am Handy als Stories: automatisch weiterblättern, Tippen links und rechts, Wischen, Halten pausiert.</li><li>Am Rechner bewegen sich die Hero-Bilder leicht mit der Maus, ein warmes Gegenlicht wandert mit. Buttons ziehen sich magnetisch zum Mauszeiger.</li><li>Produktbilder zoomen beim Überfahren dorthin, wo die Maus steht. Teilen per WhatsApp direkt an der Kaufbox.</li><li>Jede Seite hat ein eigenes Vorschaubild für WhatsApp und Co. Geteilte Produktlinks zeigen Foto, Name und Preis.</li><li>Geführte Tour mit zwölf Stationen für Präsentationen, steuerbar mit den Pfeiltasten. Direktlink: shop.kaderwerk.pro/?tour</li></ul></section>

  <section class="k-sek" id="bild"><span class="nr">12 · Bildsprache & Content</span><h2>Echte Orte, echtes Licht, echte Leute.</h2>
    <p>Fotografiert wird in Mörlenbach: auf Treppen, Mauern, Bänken, am Brunnen und am Sportplatz. Goldene Stunde, leicht unperfekt, oft aus der Hocke. Das Produkt steht im Mittelpunkt, Logos sitzen nur auf der Kleidung.</p>
    <div class="k-bild-reihe"><figure><img src="img/team-kids-anzug-s.webp" alt="" loading="lazy">Mannschaft: Schnürsenkel binden</figure><figure><img src="img/1896-hoodie-treppe-s.webp" alt="" loading="lazy">1896: Produkt auf Stein</figure><figure><img src="img/1896-mauer-s.webp" alt="" loading="lazy">1896: Gruppe auf der Mauer</figure><figure><img src="img/merch-schal-bank-wappen.webp" alt="" loading="lazy">Merch: Alltag im Ort</figure></div>
    <h3>Shotlist für das Shooting</h3><ul class="k-liste"><li><b>Mannschaft:</b> Kabinengang, Schulterklopfen, Trainer an der Linie, Hände am Ball, Bank im Regen, Präsentationsanzug auf dem Weg zum Platz.</li><li><b>1896:</b> Treppen am Kirchberg, Mauer am Bach, Bushaltestelle, Rücken-Prints im Gegenlicht, Makros von Stick und Bündchen, flach gelegte Produkte auf Stein.</li><li><b>Merch:</b> Schal am Brunnen, Familie am Spielfeldrand, Oma mit Mütze, Flasche im Rucksack, Geschenk unterm Weihnachtsbaum.</li><li><b>Packshots:</b> jedes Produkt einmal freigestellt auf Off-White, gleiche Perspektive, gleicher Schatten. Für Raster, Feeds und Werbeanzeigen.</li></ul>
    <h3>Content-Module</h3><p>Lookbook pro Drop, kurze Hochformat-Videos für Instagram und TikTok (Auspacken, Stick in Nahaufnahme, Spieler zieht Trikot an), „Gesichter des Vereins“ als Serie mit Ehrenamtlichen, Spieltag-Story mit Abholpunkt.</p>
    <div class="hinweisbox">Die Bilder in dieser Demo sind KI-generierte Platzhalter. Für den Start braucht es ein echtes Shooting mit Vereinsmitgliedern und freigestellte Packshots aller Produkte.</div></section>

  <section class="k-sek" id="benchmark"><span class="nr">13 · Benchmark</span><h2>Was wir uns abgeschaut haben. Und was wir besser machen.</h2>
    <p>Angeschaut haben wir Bundesliga-Shops (St. Pauli, BVB, FC Bayern, Eintracht Frankfurt, VfB Stuttgart), PSG sowie Mode- und Streetwear-Shops wie Aimé Leon Dore, Kith, Represent, Palace, Stüssy, Satisfy und Nikes SNKRS.</p>
    <ul class="k-liste"><li><b>Bundesliga</b> setzt im Hero meist auf Rabatte und Saisonaktionen. Das wirkt wie ein Händler. Wir setzen auf Gefühl und Wahl.</li><li><b>Streetwear-Marken</b> trennen Linien über eigene Bildwelten und erzählen Drops über feste Termine. Das übernehmen wir für 1896.</li><li><b>SNKRS</b> zeigt anstehende Releases mit Countdown. Eine sichtbare Produktions-Zeitleiste nach Bestellschluss hatte keiner der Shops. Wir haben sie.</li><li><b>Premium-Produktseiten</b> geben Passform-Sätze, Material-Details und „Complete the Look“. Alles drin.</li></ul>
    <h3>Was ein Bundesligist so nicht hat</h3><ul class="k-liste"><li>Abholung am eigenen Sportplatz als gleichwertige Lieferart.</li><li>Ein Teambesteller, mit dem ein Jugendtrainer in zwei Minuten eine ganze Mannschaft ausrüstet.</li><li>Ehrliche Knappheit ohne Stückzahl-Theater: Vorbestellung statt Lager.</li><li>„Wohin dein Geld geht“ direkt an der Kaufbox.</li><li>Ein Ton, der nach Odenwald klingt und nicht nach Konzern.</li></ul></section>

  <section class="k-sek" id="partner"><span class="nr">14 · Rolle des Teamsport-Partners</span><h2>Was wir gemeinsam möglich machen.</h2>
    <div style="overflow-x:auto"><table class="k-tabelle"><thead><tr><th>Bereich</th><th>Verein</th><th>Partner</th></tr></thead><tbody>
      <tr><td>Teamline</td><td>Auswahl, Fotos, Kommunikation</td><td>Katalog, Lager, Nachkaufgarantie über mehrere Saisons</td></tr>
      <tr><td>Veredelung</td><td>Gestaltung von Wappen, Flock, Prints</td><td>Stick, Flock, Druck, Qualitätskontrolle</td></tr>
      <tr><td>1896 Drops</td><td>Design, Drop-Planung, Marketing</td><td>Produktion nach Bestellschluss, auch kleine Mengen, feste Lieferzeit</td></tr>
      <tr><td>Logistik</td><td>Abholung am Sportplatz</td><td>Versand an Endkunden oder Sammellieferung an den Verein</td></tr>
      <tr><td>Daten</td><td>Shop, Backoffice, Auswertung</td><td>Artikeldaten und Bestände als Feed, Bestellübergabe per Schnittstelle oder CSV</td></tr>
      <tr><td>Marketing</td><td>Instagram, Spieltag, Mitglieder</td><td>Co-Branding, Bildmaterial, Aktionen zum Saisonstart</td></tr></tbody></table></div>
    <h3>Fragen für den Termin</h3><ul class="k-liste"><li>Ab welcher Menge lohnt sich eine Drop-Produktion, und wie lange dauert sie?</li><li>Gibt es einen Produktdaten-Feed (Bilder, Größen, Preise, Bestand)?</li><li>Kann der Partner direkt an Endkunden versenden, oder sammeln wir am Verein?</li><li>Wie sehen Staffelpreise für Teambestellungen und Flock aus?</li><li>Welche Marken und Logos dürfen in Fotos und Werbung gezeigt werden?</li></ul></section>

  <section class="k-sek" id="business"><span class="nr">15 · Business Case</span><h2>Was steckt drin? Spiel es durch.</h2>
    <p>Ein Rechner zum Durchspielen im Termin. Alle Werte sind Annahmen und lassen sich mit den Reglern verändern. Er zeigt, wie sich Umsatz, Volumen für den Partner und Überschuss für den Verein zusammensetzen.</p>
    <div class="rechner-bc" id="bc"></div>
    <p class="klein-hinweis">Annahmen zum Durchspielen, keine Prognose. Umsatz brutto. Wareneinsatz und Veredelung pauschal 55 % vom Umsatz, Versand, Verpackung und Zahlung 12 %. Überschuss nach Abzug dieser Posten und 19 % Mehrwertsteuer.</p></section>

  <section class="k-sek" id="technik"><span class="nr">16 · Technik & Roadmap</span><h2>Eigenständig, aber verbunden.</h2>
    <p>Der Store läuft eigenständig auf eigener Adresse, ohne Verknüpfung zur Vereins-App. Im Hintergrund nutzt er dieselbe Datenbank wie die Sportzentrale des Vereins. So landen Umsätze und Kennzahlen später direkt in der Finanzübersicht, ohne doppelte Pflege.</p>
    <ul class="k-liste"><li><b>Backoffice</b> mit Vereinslogin: Bestellungen, Produkte, Drops, Rabattcodes, Kunden, Auswertung.</li><li><b>Auswertung</b> ohne Cookies: Seitenaufrufe, Verweildauer, Klick-Heatmaps, Funnel bis zur Bestellung. Pixel für Instagram und andere Kanäle nur mit Zustimmung.</li><li><b>Zahlung</b> zum Start per Vorkasse und bar bei Abholung. Online-Zahlung als nächster Schritt.</li><li><b>Datenschutz:</b> Schriften und Bilder selbst gehostet, Merkzettel und Warenkorb nur auf dem Gerät.</li></ul>
    <div class="roadmap"><div><b>Phase 1 · Start</b><ul><li>Teamline und Merch</li><li>Drop 01 als Vorbestellung</li><li>Abholung und Versand</li><li>Backoffice und Auswertung</li></ul></div><div><b>Phase 2 · Ausbau</b><ul><li>Online-Zahlung</li><li>Mitglieder-Early-Access</li><li>Produkt-Feed für Instagram Shopping</li><li>Spieltag-Modus im Hero</li></ul></div><div><b>Phase 3 · Jubiläum</b><ul><li>Drop 03 zu 130 Jahren</li><li>Teamshop-Seiten pro Mannschaft</li><li>Gutscheine und Geschenkkarten</li><li>Anbindung an das Warenwirtschaftssystem des Partners</li></ul></div></div></section>
  </div></div></div>`,
    nach: root => {
      const links = $$('#kNav a', root); const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-30% 0px -60% 0px' });
      $$('.k-sek', root).forEach(s => io.observe(s)); return () => io.disconnect();
    }
  };
});

/* ================= Wow-Schicht: Hero-Stories, Parallax, Zoom, Teilen, Tour, Business Case ================= */
const desktop = () => matchMedia('(hover:hover) and (min-width:861px)').matches;
function wow(root) {
  if ($('#tafeln', root)) heroWow(root);
  if ($('#galerie', root)) pdpWow(root);
  if (document.body.dataset.w === 'street') kratzen(root);
  if ($('#bc', root)) businessCase($('#bc', root));
}

/* ---------- Hero: Desktop Parallax + Licht, Handy Stories ---------- */
function heroWow(root) {
  const held = $('.held', root), t = $('#tafeln', root);
  if (matchMedia('(max-width:860px)').matches) return stories(t);
  if (ruhig) return;
  t.insertAdjacentHTML('beforeend', '<span class="lichtfleck" aria-hidden="true"></span>');
  held.addEventListener('pointermove', e => { const r = held.getBoundingClientRect(); held.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3)); held.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3)); });
  held.addEventListener('pointerleave', () => { held.style.setProperty('--mx', 0); held.style.setProperty('--my', 0); });
}
function stories(t) {
  const tafeln = $$('.tafel', t); let i = 0, x0 = null, gewischt = false;
  t.classList.add('story');
  t.insertAdjacentHTML('afterbegin', `<div class="story-balken" aria-hidden="true">${tafeln.map(() => '<i><b></b></i>').join('')}</div><span class="story-tipp" aria-hidden="true">Tippen zum Blättern</span>`);
  const balken = $$('.story-balken i', t);
  const zeig = n => { i = (n + tafeln.length) % tafeln.length; tafeln.forEach((x, k) => x.classList.toggle('on', k === i)); balken.forEach((b, k) => { b.classList.remove('lauf'); b.classList.toggle('voll', k < i); }); void t.offsetWidth; balken[i].classList.add('lauf'); };
  balken.forEach(b => b.querySelector('b').addEventListener('animationend', () => zeig(i + 1)));
  t.addEventListener('click', e => { if (e.target.closest('.mehr')) return; e.preventDefault(); e.stopPropagation(); if (gewischt) { gewischt = false; return; } const r = t.getBoundingClientRect(); zeig(e.clientX - r.left < r.width / 3 ? i - 1 : i + 1); }, true);
  t.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; t.classList.add('pause'); }, { passive: true });
  t.addEventListener('touchend', e => { t.classList.remove('pause'); if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 40) { gewischt = true; zeig(dx < 0 ? i + 1 : i - 1); setTimeout(() => gewischt = false, 400); } });
  zeig(0);
}

/* ---------- Produktseite: Lupe beim Überfahren, Teilen ---------- */
function pdpWow(root) {
  if (desktop()) $$('#galerie figure', root).forEach(f => {
    if (f.classList.contains('ill')) return; const img = $('img', f);
    f.addEventListener('pointermove', e => { const r = f.getBoundingClientRect(); img.style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`; img.style.transform = 'scale(1.9)'; });
    f.addEventListener('pointerleave', () => { img.style.transform = ''; img.style.transformOrigin = ''; });
  });
  const kz = $('.kaufzeile', root); if (!kz) return;
  const url = location.origin + location.pathname, name = document.title.split(' · ')[0];
  kz.insertAdjacentHTML('afterend', `<div class="teilen"><button id="teilenBtn">${ICO.teilen}Teilen</button><a href="https://wa.me/?text=${encodeURIComponent(name + ' ' + url)}" target="_blank" rel="noopener">${ICO.wa}Per WhatsApp schicken</a></div>`);
  $('#teilenBtn').onclick = async () => { try { if (navigator.share) { await navigator.share({ title: name, url }); return; } await navigator.clipboard.writeText(url); toast(`${ICO.check}<span>Link kopiert</span>`); } catch (e) { } };
}

/* ---------- 1896: Mono-Texte „entschlüsseln“ sich ---------- */
function kratzen(root) {
  if (ruhig) return; const Z = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·';
  $$('.s-held .oben-z p, .s-drop-kopf .kicker, .lookbook figcaption, .naechster p.mono', root).forEach(el => {
    const io = new IntersectionObserver(es => { if (!es[0].isIntersecting) return; io.disconnect();
      const kn = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); while (w.nextNode()) kn.push([w.currentNode, w.currentNode.textContent]);
      let f = 0; const max = 24; const tick = () => { f++; kn.forEach(([n, t]) => { const fertig = Math.floor(t.length * f / max); n.textContent = t.slice(0, fertig) + t.slice(fertig).replace(/\S/g, () => Z[Math.random() * Z.length | 0]); }); if (f < max) setTimeout(tick, 34); }; tick(); }, { threshold: .6 });
    io.observe(el);
  });
}

/* ---------- Merch: Konfetti beim Einpacken ---------- */
function konfetti() {
  if (ruhig || document.body.dataset.w !== 'fan') return; const z = $('#korbBtn').getBoundingClientRect(); const F = ['#2F66C8', '#F28C28', '#ECE3D3', '#22252A', '#ffffff'];
  for (let k = 0; k < 36; k++) { const s = document.createElement('i'); s.className = 'konfetti'; s.style.background = F[k % 5]; s.style.left = z.left + z.width / 2 + 'px'; s.style.top = z.top + z.height / 2 + 'px'; document.body.appendChild(s);
    const a = Math.random() * Math.PI, v = 140 + Math.random() * 240;
    s.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: `translate(${-Math.cos(a) * v - 40}px, ${Math.sin(a) * v * .6 + 220}px) rotate(${Math.random() * 900}deg)`, opacity: 0 }], { duration: 1200 + Math.random() * 700, easing: 'cubic-bezier(.15,.6,.3,1)' }).finished.then(() => s.remove()); }
}

/* ---------- Magnetische Buttons (Desktop) ---------- */
let magnet = null;
document.addEventListener('pointermove', e => {
  if (!desktop() || ruhig) return; const b = e.target.closest('.btn, .tafel .mehr, .pfeile button');
  if (magnet && magnet !== b) { magnet.style.translate = ''; magnet = null; } if (!b) return;
  const r = b.getBoundingClientRect(); b.style.translate = `${((e.clientX - r.left - r.width / 2) * .2).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * .32).toFixed(1)}px`; magnet = b;
}, { passive: true });

/* ---------- Business Case ---------- */
function businessCase(el) {
  const de = n => Math.round(n).toLocaleString('de-DE');
  const R = [['reich', 'Reichweite: Mitglieder, Eltern, Fans', 300, 5000, 50, 1200, v => de(v) + ' Menschen'], ['quote', 'Davon kaufen pro Jahr', 5, 60, 1, 30, v => v + ' %'], ['bon', 'Ø Warenkorb Mannschaft & Merch', 20, 150, 1, 58, v => v + ' €'],
    ['drops', 'Drops pro Jahr', 0, 6, 1, 3, v => v + (v === 1 ? ' Drop' : ' Drops')], ['teile', 'Verkaufte Teile pro Drop', 20, 400, 5, 90, v => v + ' Teile'], ['dpreis', 'Ø Preis Drop-Teil', 35, 120, 1, 82, v => v + ' €'],
    ['teams', 'Teambestellungen pro Jahr', 0, 30, 1, 8, v => v + ' Mannschaften'], ['tvol', 'Ø Volumen je Teambestellung', 300, 4000, 50, 1400, v => de(v) + ' €']];
  el.innerHTML = `<div class="bc-regler">${R.map(([k, l, mi, ma, st, d]) => `<label><span>${l}<b id="bv-${k}"></b></span><input type="range" min="${mi}" max="${ma}" step="${st}" value="${d}" data-k="${k}" aria-label="${l}"></label>`).join('')}</div>
    <div class="bc-ergebnis"><p class="mono">Umsatz pro Jahr (brutto)</p><b class="bc-summe num" id="bcSumme"></b><div class="bc-balken" id="bcBalken"></div><div class="bc-legende" id="bcLeg"></div>
      <div class="bc-drei"><div><span>Einkaufsvolumen beim Partner</span><b class="num" id="bcPartner"></b></div><div><span>Überschuss für den Verein</span><b class="num" id="bcVerein"></b></div><div><span>Anteil der Drops</span><b class="num" id="bcDrop"></b></div></div></div>`;
  const rech = () => { const v = {}; $$('input', el).forEach(i => { v[i.dataset.k] = +i.value; $('#bv-' + i.dataset.k, el).textContent = R.find(x => x[0] === i.dataset.k)[6](+i.value); });
    const shop = v.reich * v.quote / 100 * v.bon, drop = v.drops * v.teile * v.dpreis, team = v.teams * v.tvol, sum = shop + drop + team;
    $('#bcSumme', el).textContent = de(sum) + ' €'; $('#bcPartner', el).textContent = de(sum * .55) + ' €'; $('#bcVerein', el).textContent = de(Math.max(0, sum / 1.19 - sum * .55 - sum * .12)) + ' €'; $('#bcDrop', el).textContent = (sum ? Math.round(drop / sum * 100) : 0) + ' %';
    const T = [['Mannschaft & Merch', shop, '#2F66C8'], ['1896 Drops', drop, '#22252A'], ['Teambestellungen', team, '#F28C28']];
    $('#bcBalken', el).innerHTML = T.map(([n, w, c]) => `<i style="width:${sum ? w / sum * 100 : 0}%;background:${c}" title="${n}"></i>`).join('');
    $('#bcLeg', el).innerHTML = T.map(([n, w, c]) => `<span><i style="background:${c}"></i>${n}<b class="num">${de(w)} €</b></span>`).join(''); };
  $$('input', el).forEach(i => i.addEventListener('input', rech)); rech();
}

/* ---------- Geführte Tour für den Termin ---------- */
const TOUR = [
  ['', '.held', 'Drei Welten, ein Verein', 'Jede Linie hat ihre eigene Bildwelt und Schrift. Ein Klick auf ein Bild zoomt direkt in die Linie hinein.'],
  ['', '#statement', 'Die Haltung', 'Beim Scrollen füllt sich der Text Wort für Wort. Der Verein erzählt, warum es den Store gibt.'],
  ['', '.stapel', 'Drei Linien im Stapel', 'Die Karten schieben sich beim Scrollen übereinander. Jede zeigt ihre Sprache und erste Produkte.'],
  ['', '.dropmodul', 'Drops statt Lager', 'Vorbestellung mit Countdown und Zeitleiste bis zum Versand. Nichts liegt auf Halde.'],
  ['mannschaft', '#kit', 'Matchday Kit', 'Heim und Auswärts mit einem Schalter, ganz in Blau und Orange.', 'kit'],
  ['mannschaft', '.flock', 'Trikot live beflocken', 'Name und Nummer eintippen, die Vorschau ändert sich sofort.', 'flock'],
  ['mannschaft', '#team', 'Ganze Mannschaft ausrüsten', 'Der Teambesteller rechnet Staffelrabatte live. Gebaut für Trainer und Elternvertreter.', 'team'],
  ['1896', '.lookbook', 'Lookbook', 'Beim Scrollen läuft das Lookbook seitwärts. Fotografiert in Mörlenbach.'],
  ['1896', '.ablauf', 'So läuft ein Drop', 'Vom Klick bis zum Stick mit festen Terminen. Begrenzt wird die Zeit, nicht die Menge.'],
  ['merch', '#finder', 'Geschenkfinder', 'Zwei Klicks, drei Ideen. Für Oma, Kumpel oder Kind.', 'finder'],
  ['p/hoodie-1896-glocken', '#kaufbox', 'Produktseite', 'Bildzoom beim Überfahren, Countdown, Größenrechner und Teilen per WhatsApp.'],
  ['konzept', '#business', 'Business Case', 'Mit den Reglern das Potenzial durchspielen: Volumen für den Partner, Überschuss für den Verein.', 'bc'],
];
let tourI = -1;
async function tourZeig(n) {
  if (n < 0) n = 0; if (n >= TOUR.length) return tourEnde(true);
  tourI = n; const [url, sel, titel, text, aktion] = TOUR[n];
  let box = $('#tour'); if (!box) { document.body.insertAdjacentHTML('beforeend', '<div class="tour" id="tour" role="dialog" aria-label="Demo-Tour"></div>'); box = $('#tour'); }
  box.innerHTML = `<div class="tour-kopf"><span class="mono">Tour · ${n + 1} / ${TOUR.length}</span><button class="tour-zu" aria-label="Tour beenden">${ICO.zu}</button></div><div class="tour-balken"><i style="width:${(n + 1) / TOUR.length * 100}%"></i></div>
    <b>${titel}</b><p>${text}</p><div class="tour-knoepfe"><small>Pfeiltasten ← → zum Blättern</small><button class="tour-zur" aria-label="Zurück" ${n ? '' : 'disabled'}>${ICO.pfeilL}</button><button class="btn klein tour-weiter">${n === TOUR.length - 1 ? 'Fertig' : 'Weiter'} ${ICO.pfeil}</button></div>`;
  requestAnimationFrame(() => box.classList.add('auf')); document.body.classList.add('tour-an');
  $('.tour-zu', box).onclick = () => tourEnde(); $('.tour-zur', box).onclick = () => tourZeig(tourI - 1); $('.tour-weiter', box).onclick = () => tourZeig(tourI + 1);
  while (laeuft) await sleep(80);
  if (pfad() !== '/' + url) { await geh(U(url)); while (laeuft) await sleep(80); }
  if (tourI !== n) return; await sleep(200);
  $$('.tour-fokus').forEach(x => x.classList.remove('tour-fokus'));
  const el = $(sel); if (!el) return;
  const r = el.getBoundingClientRect(); const handy = innerWidth < 700;
  const ziel = sel === '.held' ? 0 : scrollY + r.top - (handy ? 84 : Math.max(96, (innerHeight - Math.min(r.height, innerHeight * .78)) / 2));
  scrollTo({ top: Math.max(0, ziel), behavior: ruhig ? 'auto' : 'smooth' }); el.classList.add('tour-fokus');
  if (aktion) setTimeout(() => tourAktion(aktion, n), 1000);
}
async function tourAktion(a, n) {
  const noch = () => tourI === n; const tipp = async (el, txt) => { el.value = ''; for (const c of txt) { if (!noch()) return; el.value += c; el.dispatchEvent(new Event('input')); await sleep(110); } };
  if (a === 'kit') { $('#kitSchalter button[data-k="b"]')?.click(); await sleep(2400); if (noch()) $('#kitSchalter button[data-k="a"]')?.click(); }
  if (a === 'flock' && $('#fName')) { await tipp($('#fName'), 'KAPITÄN'); await tipp($('#fNr'), '7'); }
  if (a === 'team') { const i = $('.matrix [data-g="M"]'); if (i) { for (const v of [6, 8, 10]) { if (!noch()) return; i.value = v; i.dispatchEvent(new Event('input')); await sleep(450); } } }
  if (a === 'finder') { $('.finder .opts[data-f="wer"] button[data-v="oma"]')?.click(); }
  if (a === 'bc') { const i = $('#bc input[data-k="drops"]'); if (i) for (const v of [4, 5, 6, 3]) { if (!noch()) return; i.value = v; i.dispatchEvent(new Event('input')); await sleep(520); } }
}
function tourEnde(fertig) { tourI = -1; $('#tour')?.classList.remove('auf'); document.body.classList.remove('tour-an'); $$('.tour-fokus').forEach(x => x.classList.remove('tour-fokus')); if (fertig) toast(`${ICO.check}<span>Tour beendet. Viel Spaß beim Stöbern!</span>`); }
document.addEventListener('click', e => { const t = e.target.closest('[data-tour], #tourBtn'); if (!t) return; e.preventDefault(); e.stopImmediatePropagation(); window.menueZu && window.menueZu(); $('#toast')?.classList.remove('auf'); tourZeig(0); }, true);
addEventListener('keydown', e => {
  if (tourI < 0 || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); tourZeig(tourI + 1); }
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); tourZeig(tourI - 1); }
  if (e.key === 'Escape') tourEnde();
});

/* ================= Start ================= */
rahmen();
(function () { const r = new URLSearchParams(location.search).get('r'); if (r) history.replaceState({}, '', U(r)); })();
intro();
const mitTour = new URLSearchParams(location.search).has('tour');
zeigen().then(() => { if (location.hash) setTimeout(() => $(location.hash)?.scrollIntoView(), 120); if (mitTour) setTimeout(() => tourZeig(0), pfad() === '/' ? 2600 : 600); });
setTimeout(() => { let s = null; try { s = sessionStorage.getItem('svd_tipp'); sessionStorage.setItem('svd_tipp', 1); } catch (e) { } if (!s && !mitTour && tourI < 0) toast(`${ICO.play}<span>Zum ersten Mal hier?<button data-tour class="toast-link">Tour starten</button></span>`, 8000); }, pfad() === '/' ? 4800 : 1800);
window.__demo = { geh: u => geh(U(u)), S, P };

})();