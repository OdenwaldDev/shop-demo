#!/usr/bin/env node
/* Bild-Agent: prüft, ob alle Bilder im Store für Menschen gut aussehen.
   Öffnet jede Seite auf Handy, Tablet, Laptop und großem Bildschirm, scrollt durch und misst für jedes Foto:
   - Kern angeschnitten (z. B. das Wappen auf dem Schal, Gesichter)       -> Fehler
   - Motiv stark beschnitten (das Produkt ist nur zum Teil zu sehen)      -> Hinweis
   - Text liegt über dem Kern (Hero-Tafeln)                               -> Fehler
   - Bild wird hochgezogen und wirkt unscharf                              -> Hinweis
   - Für das Foto gibt es noch keine Motiv-Daten (neues Bild)              -> Hinweis
   - Bild lädt nicht (Datei fehlt)                                         -> Fehler
   Motiv-Daten: motive.json (vom Motiv-Agenten erkannt, je Foto Motiv und Kern in Prozent).
   Aufruf: node bildcheck.cjs <ordner-oder-url> <bericht.json> [--schnell]
   Im Live-Repo läuft das wöchentlich und nach jedem Ausrollen als GitHub-Aktion, der Bericht landet in bildcheck.json (Backoffice › Agenten). */
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require(process.env.PW_PFAD || 'playwright');
const [ziel = '.', aus = 'bildcheck.json'] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const schnell = process.argv.includes('--schnell');
const GERAETE = (schnell ? [['Handy', 390, 844, 3], ['Laptop', 1440, 900, 1]] : [['Handy', 390, 844, 3], ['Tablet', 820, 1180, 2], ['Laptop', 1440, 900, 1], ['Großer Bildschirm', 1920, 1080, 1]]);

function server(ordner) {
  const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
  const R = path.resolve(ordner);
  return new Promise(ok => { const s = http.createServer((q, r) => {
      let f = path.join(R, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(R)) return r.end();
      if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
      if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
      if (!fs.existsSync(f)) { f = path.join(R, '404.html'); r.statusCode = 404; }
      r.setHeader('Content-Type', T[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r);
    }).listen(0, '127.0.0.1', () => ok({ url: `http://127.0.0.1:${s.address().port}/`, s })); });
}

(async () => {
  let basis = ziel, srv = null, ordner = null;
  if (!/^https?:/.test(ziel)) { ordner = path.resolve(ziel); srv = await server(ordner); basis = srv.url; }
  const lies = f => { for (const o of [ordner, ordner && path.join(ordner, 'seiten'), __dirname, path.join(__dirname, '..', 'tools')].filter(Boolean)) { const p = path.join(o, f); if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8'); } return null; };
  const MOT = JSON.parse(lies('motive.json') || '{}');
  const index = ordner && fs.existsSync(path.join(ordner, 'index.html')) ? fs.readFileSync(path.join(ordner, 'index.html'), 'utf8') : await (await fetch(basis)).text();
  const zugang = (index.match(/var H='([0-9a-f]{64})'/) || [])[1];
  const konfig = JSON.parse(lies('konfig.json') || '{}');
  let seiten = ['', 'mannschaft', '1896', 'merch', 'kids', 'accessoires', 'alle', 'verein', 'aktionen'].concat((konfig.feste || []).filter(x => x && !x.startsWith('p/')));
  const pDir = ordner && path.join(ordner, 'p');
  const produkte = pDir && fs.existsSync(pDir) ? fs.readdirSync(pDir).filter(f => f.endsWith('.html')).map(f => 'p/' + f.slice(0, -5)) : [];
  seiten = [...new Set(seiten.concat(schnell ? produkte.slice(0, 6) : produkte))];

  const b = await chromium.launch(); const probleme = []; let bilder = 0, aufrufe = 0;
  for (const [geraet, w, h, dpr] of GERAETE) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: w < 800, hasTouch: w < 800, reducedMotion: 'reduce' });
    await ctx.addInitScript(z => { try { if (z) localStorage.setItem('zg1896', z); sessionStorage.setItem('svd_intro', '1'); } catch (e) { } }, zugang || '');
    const pg = await ctx.newPage();
    for (const s of seiten) {
      try { await pg.goto(basis + s, { waitUntil: 'load', timeout: 30000 }); } catch (e) { continue; }
      aufrufe++; await pg.waitForTimeout(900);
      await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); });
      await pg.waitForTimeout(700);
      // echte Pixel der geladenen Datei (bei srcset rechnet der Browser naturalWidth auf die Dichte um)
      const liste = await pg.evaluate(async () => { const echt = {}; await Promise.all([...document.querySelectorAll('img')].map(img => img.currentSrc).filter(Boolean).filter((u, i, a) => a.indexOf(u) === i).map(u => new Promise(ok => { const t = new Image(); t.onload = () => { echt[u] = t.naturalWidth; ok(); }; t.onerror = ok; t.src = u; })));
        const kaputt = [...document.querySelectorAll('img')].filter(img => img.complete && !img.naturalWidth && img.getAttribute('src') && !img.closest('.menue, .intro')).map(img => ({ kaputt: true, name: (String(img.getAttribute('src')).match(/img\/([^/?#]+?)(?:-s)?\.(?:webp|svg|png|jpg)/) || [])[1] || img.getAttribute('src').slice(0, 80) }));
        return kaputt.concat([...document.querySelectorAll('img')].map(img => {
        const r = img.getBoundingClientRect(), cs = getComputedStyle(img);
        const sichtbar = r.width >= 60 && r.height >= 60 && cs.visibility !== 'hidden' && cs.display !== 'none' && (!img.checkVisibility || img.checkVisibility({ opacityProperty: false, visibilityProperty: true }));
        const m = String(img.getAttribute('src') || '').match(/img\/([^/?#]+?)(?:-s)?\.webp/);
        return sichtbar && img.naturalWidth ? { name: m ? m[1] : (img.getAttribute('src') || '').slice(0, 80), w: r.width, h: r.height, nw: img.naturalWidth, nh: img.naturalHeight,
          px: echt[img.currentSrc] || img.naturalWidth, fit: cs.objectFit, pos: cs.objectPosition, tafel: !!img.closest('.tafel'), menue: !!img.closest('.menue, .intro, #ausBar') } : null; }).filter(Boolean)); });
      for (const x of liste) {
        if (x.kaputt) { bilder++; probleme.push({ seite: '/' + s, geraet, bild: x.name, rahmen: '', art: 'kaputt', schwere: 'fehler', text: 'Bild lädt nicht (Datei fehlt oder falscher Name).' }); continue; }
        if (x.menue || /^(icon|favicon|wappen|glocken|og)/.test(x.name) || x.name.endsWith('.svg')) continue;
        bilder++;
        const M = MOT[x.name]; const auf = { seite: '/' + s, geraet, bild: x.name, rahmen: `${Math.round(x.w)}×${Math.round(x.h)}` };
        // Schärfe: ab doppelter Pixeldichte sieht das Auge keinen Unterschied mehr, deshalb zählt höchstens 2x
        const soll = x.w * Math.min(dpr, 2); if (soll > x.px * 1.5 && x.w > 300) probleme.push({ ...auf, art: 'unscharf', schwere: 'hinweis', text: `Braucht rund ${Math.round(soll)} Pixel Breite, die Datei hat nur ${x.px}. Größere Datei hinterlegen.` });
        if (!M || !M.motiv) { if (/^[a-z0-9-]+$/.test(x.name)) probleme.push({ ...auf, art: 'unbekannt', schwere: 'hinweis', text: 'Für dieses Foto gibt es noch keine Motiv-Daten. Motiv-Agent laufen lassen.' }); continue; }
        if (x.fit !== 'cover') continue;
        const s2 = Math.max(x.w / x.nw, x.h / x.nh), dw = x.nw * s2, dh = x.nh * s2;
        const [px, py] = x.pos.split(' ').map((v, i) => v.endsWith('%') ? parseFloat(v) / 100 : (parseFloat(v) || 0) / Math.max(1, (i ? dh - x.h : dw - x.w)));
        const fx = (dw - x.w) * px / dw * 100, fy = (dh - x.h) * py / dh * 100, fw = x.w / dw * 100, fh = x.h / dh * 100;
        const deck = b => { const [bx, by, bw, bh] = b; const ix = Math.max(0, Math.min(bx + bw, fx + fw) - Math.max(bx, fx)), iy = Math.max(0, Math.min(by + bh, fy + fh) - Math.max(by, fy)); return bw * bh ? ix * iy / (bw * bh) : 1; };
        const k = deck(M.kern), mo = deck(M.motiv);
        if (k < 0.9) probleme.push({ ...auf, art: 'kern', schwere: 'fehler', wert: Math.round(k * 100), text: `${M.was || 'Das Wichtigste'}: nur ${Math.round(k * 100)} % zu sehen. Ausschnitt oder Rahmen anpassen.` });
        // Füllt das Motiv fast das ganze Foto (Szene, Person von Kopf bis Fuß), ist ein Anschnitt normal: dann nur der Kern
        else if (mo < 0.72 && M.motiv[2] * M.motiv[3] < 8000) probleme.push({ ...auf, art: 'motiv', schwere: 'hinweis', wert: Math.round(mo * 100), text: `Vom Motiv sind nur ${Math.round(mo * 100)} % zu sehen. Ein anderes Seitenverhältnis wäre besser.` });
        if (x.tafel) { const ky = ((M.kern[1] + M.kern[3] / 2) - fy) / fh; if (ky > 0.66) probleme.push({ ...auf, art: 'text', schwere: 'fehler', text: `Der Text liegt über dem Kern (${M.was || 'Motiv'}). Bild mit Platz unten verwenden.` }); }
      }
    }
    await ctx.close();
  }
  await b.close(); if (srv) srv.s.close();
  // gleiche Meldung je Bild und Gerät nur einmal (mit den betroffenen Seiten)
  const zus = new Map(); for (const p of probleme) { const k = [p.art, p.bild, p.geraet].join('|'); const z = zus.get(k); if (z) { if (!z.seiten.includes(p.seite)) z.seiten.push(p.seite); } else zus.set(k, { ...p, seiten: [p.seite] }); }
  const liste = [...zus.values()].map(({ seite, ...r }) => r).sort((a, b) => (a.schwere === 'fehler' ? 0 : 1) - (b.schwere === 'fehler' ? 0 : 1) || a.bild.localeCompare(b.bild));
  const bericht = { stand: new Date().toISOString(), seiten: seiten.length, geraete: GERAETE.map(g => g[0]), aufrufe, bilder, fehler: liste.filter(p => p.schwere === 'fehler').length, hinweise: liste.filter(p => p.schwere !== 'fehler').length, probleme: liste };
  fs.writeFileSync(aus, JSON.stringify(bericht, null, 1));
  console.log(`Bild-Agent: ${aufrufe} Seitenaufrufe, ${bilder} Bilder, ${bericht.fehler} Fehler, ${bericht.hinweise} Hinweise -> ${aus}`);
})().catch(e => { console.error(e); process.exit(1); });
