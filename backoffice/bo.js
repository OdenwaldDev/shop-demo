/* SV Mörlenbach Store · Backoffice
   Anmeldung mit dem Konto der Sportzentrale. Wer den Bereich „Shop“ hat (Vorgabe: Vorstand, Admin immer), kommt rein.
   Alles läuft über die Funktionen shop_bo_* in der Datenbank, die das Recht selbst prüfen. */
(function(){
'use strict';
const CFG=window.STORE_CFG||{}; const BASE=(CFG.base||'/').replace(/\/?$/,'/');
const sb=window.supabase.createClient(CFG.url,CFG.anon,{auth:{storageKey:'svm-store-bo',persistSession:true,autoRefreshToken:true}});
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur=c=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format((c||0)/100);
const cent=v=>{ const s=String(v??'').trim().replace(/\s|€/g,''); if(!s)return null; const n=Number(s.replace(/\.(?=\d{3}(\D|$))/g,'').replace(',','.')); return isFinite(n)?Math.round(n*100):null; };
const zuEur=c=>c==null?'':(c/100).toFixed(2).replace('.',',');
const datum=(t,uhr)=>t?new Date(t).toLocaleString('de-DE',Object.assign({day:'2-digit',month:'2-digit',year:'2-digit',timeZone:'Europe/Berlin'},uhr?{hour:'2-digit',minute:'2-digit'}:{})):'';
const bild=p=>!p?'':(/^https?:/.test(p)?p:/^[a-z0-9-]+$/.test(p)?BASE+'img/'+p+'.webp':BASE+p.replace(/^\//,''));
const klein=p=>!p?'':(/^https?:/.test(p)?p:/^[a-z0-9-]+$/.test(p)?BASE+'img/'+p+(/^d-|bank-(wappen|hoch)/.test(p)?'':'-s')+'.webp':bild(p.replace(/\.webp$/,'-s.webp')));
const ZA={vorkasse:'Überweisung',online:'Online',bar:'bar',verein:'Verein zahlt'};
const LIN={mannschaft:'Mannschaft','1896':'1896',merch:'Merch'};
const ST={neu:['Neu','neu'],bezahlt:['Bezahlt','ok'],in_arbeit:['Beim Partner','neu'],versendet:['Versendet','ok'],abholbereit:['Liegt bereit','warn'],abgeschlossen:['Abgeschlossen','ok'],storniert:['Storniert','aus']};
const I=window.BO_IC||{};   // Phosphor Icons, erzeugt mit tools/icons.py
const SEITEN=[['uebersicht','Übersicht',I.home],['vorschlaege','Vorschläge',I.vorschl],['bestellungen','Bestellungen',I.best],['sammel','Sammelbestellung',I.sammel],['produkte','Produkte',I.prod],['drops','Drops',I.drop],['rabatte','Rabattcodes',I.rab],['kunden','Kunden',I.kund],['auswertung','Analyse',I.ausw],['community','Community',I.comm],['marketing','Marketing',I.mark],['aktionen','Aktionen',I.aktion],['agenten','Agenten',I.agent],['retro','Retro-Linien',I.retro],['einstellungen','Einstellungen',I.einst]];
async function fn(name,body){ const {data:{session}}=await sb.auth.getSession(); const r=await fetch(CFG.url+'/functions/v1/'+name,{method:'POST',headers:{'Content-Type':'application/json',apikey:CFG.anon,Authorization:'Bearer '+(session?session.access_token:CFG.anon)},body:JSON.stringify(body||{})}); const j=await r.json().catch(()=>({})); if(!r.ok)throw new Error(j.error||j.detail||'Fehler '+r.status); return j; }
async function rpc(fn,args){ const {data,error}=await sb.rpc(fn,args||{}); if(error)throw new Error(error.message||'Fehler'); return data; }
function toast(t){ const e=$('#toast'); e.textContent=t; e.classList.add('an'); clearTimeout(toast.t); toast.t=setTimeout(()=>e.classList.remove('an'),2600); }
const A={seite:'uebersicht',tage:30,filter:'offen',suche:'',offen:{},produkte:null,drops:null};
async function kopie(t){ try{ await navigator.clipboard.writeText(t); toast('Kopiert'); }catch(e){ prompt('Kopieren:',t); } }

/* ---------- Anmeldung ---------- */
async function start(){
  const {data:{session}}=await sb.auth.getSession();
  if(!session)return login();
  let darf=false; try{ darf=await rpc('darf',{p:'shop'}); }catch(e){}
  if(!darf){ document.body.innerHTML=`<div class="login"><div class="karte"><img src="${BASE}img/crest.svg" width="40" alt=""><h1>Kein Zugang</h1><p>Dein Konto hat den Bereich „Shop“ nicht. Der Admin kann ihn in der Sportzentrale unter Verwaltung freischalten.</p><p style="margin-top:16px"><button class="btn rand" id="aus">Abmelden</button></p></div></div><div class="toast" id="toast"></div>`; $('#aus').onclick=async()=>{ await sb.auth.signOut(); location.reload(); }; return; }
  A.ich=(await sb.from('profiles').select('name,email').eq('id',session.user.id).maybeSingle()).data||{email:session.user.email};
  try{ const c0=await rpc('shop_bo_einstellungen'); A.partnerRabatt=+((c0.partner||{}).rabatt)||45; }catch(e){}
  rahmen(); geh(location.hash.slice(1)||'uebersicht'); vBadge();
}
function login(){
  document.body.innerHTML=`<div class="login"><form class="karte form" id="lf"><img src="${BASE}img/crest.svg" width="40" alt=""><div><h1>Store-Backoffice</h1><p style="color:var(--ink3)">Mit deinem Konto der Sportzentrale anmelden.</p></div>
    <div class="feld"><label for="le">E-Mail</label><input id="le" type="email" autocomplete="username" required></div><div class="feld"><label for="lp">Passwort</label><input id="lp" type="password" autocomplete="current-password" required></div>
    <div id="lfeh"></div><button class="btn" type="submit">Anmelden</button><p style="font-size:13px;color:var(--ink3)">Passwort vergessen? In der Sportzentrale über „Passwort vergessen“ neu setzen.</p></form></div><div class="toast" id="toast"></div>`;
  $('#lf').onsubmit=async e=>{ e.preventDefault(); const b=$('button',e.target); b.disabled=true;
    const {error}=await sb.auth.signInWithPassword({email:$('#le').value.trim(),password:$('#lp').value});
    if(error){ $('#lfeh').innerHTML=`<div class="hinweis">Anmeldung hat nicht geklappt. E-Mail und Passwort prüfen.</div>`; b.disabled=false; return; }
    start(); };
}

/* ---------- Rahmen ---------- */
function rahmen(){
  document.body.innerHTML=`<div class="mobilkopf"><img src="${BASE}img/crest.svg" alt=""><b>Store</b><button id="mMehr">Mehr</button></div>
  <div class="app"><aside class="seite"><a class="logo" href="${BASE}" target="_blank"><img src="${BASE}img/crest.svg" alt=""><div><b>Store</b><small>Backoffice</small></div></a>
    ${SEITEN.map(([k,t,i])=>`<button data-s="${k}">${i}<span>${t}</span>${k==='bestellungen'?'<em id="bBadge" hidden></em>':k==='vorschlaege'?'<em id="vBadge" hidden></em>':''}</button>`).join('')}
    <div class="unten"><span>${esc(A.ich.name||A.ich.email||'')}</span><a href="${BASE}" target="_blank">Zum Shop ↗</a><a href="#" id="abm">Abmelden</a></div></aside>
    <main id="main"></main></div>
  <nav class="mobilnav">${[['uebersicht','Start',I.home],['bestellungen','Bestellungen',I.best],['sammel','Freitag',I.sammel],['produkte','Produkte',I.prod],['auswertung','Zahlen',I.ausw]].map(([k,t,i])=>`<button data-s="${k}">${i}<span>${t}</span>${k==='bestellungen'?'<em id="bBadge2" hidden></em>':''}</button>`).join('')}</nav>
  <div class="toast" id="toast" role="status"></div>`;
  $$('[data-s]').forEach(b=>b.onclick=()=>geh(b.dataset.s));
  $('#abm').onclick=async e=>{ e.preventDefault(); await sb.auth.signOut(); location.hash=''; location.reload(); };
  $('#mMehr').onclick=()=>fenster(`<h2 class="t">Mehr</h2><div class="stack">${SEITEN.map(([k,t,i])=>`<button class="btn rand" data-mg="${k}" style="justify-content:flex-start">${i.replace('<svg','<svg width="18"')} ${t}</button>`).join('')}<a class="btn rand" href="${BASE}" target="_blank">Zum Shop ↗</a><button class="btn weg" id="abm2">Abmelden</button></div>`,f=>{ $$('[data-mg]',f).forEach(b=>b.onclick=()=>{ zu(); geh(b.dataset.mg); }); $('#abm2',f).onclick=async()=>{ await sb.auth.signOut(); location.reload(); }; });
  addEventListener('hashchange',()=>{ const s=location.hash.slice(1); if(s&&s!==A.seite)geh(s); });
}
async function geh(s){
  if(!SEITEN.some(x=>x[0]===s))s='uebersicht'; A.seite=s; if(location.hash.slice(1)!==s)history.replaceState(null,'','#'+s);
  $$('[data-s]').forEach(b=>b.classList.toggle('on',b.dataset.s===s));
  const m=$('#main'); m.innerHTML='<div class="leer">Lade …</div>'; scrollTo(0,0);
  try{ await S[s](m); }catch(e){ m.innerHTML=`<div class="hinweis">Konnte nicht laden: ${esc(e.message)}</div>`; }
}
let _schicht=null;
function fenster(html,nach){ zu(); const s=document.createElement('div'); s.className='schicht'; s.innerHTML=`<div class="fenster" role="dialog" aria-modal="true"><button class="zu" aria-label="Schließen">✕</button>${html}</div>`;
  s.onclick=e=>{ if(e.target===s)zu(); }; $('.zu',s).onclick=zu; document.body.appendChild(s); document.body.style.overflow='hidden'; _schicht=s; if(nach)nach($('.fenster',s)); return $('.fenster',s); }
function zu(){ if(_schicht){ _schicht.remove(); _schicht=null; document.body.style.overflow=''; } }
addEventListener('keydown',e=>{ if(e.key==='Escape')zu(); });
function badge(n){ ['#bBadge','#bBadge2'].forEach(s=>{ const e=$(s); if(e){ e.textContent=n; e.hidden=!n; } }); }
const periode=()=>`<div class="periode">${[[7,'7 Tage'],[30,'30 Tage'],[90,'90 Tage'],[365,'1 Jahr']].map(([t,l])=>`<button data-t="${t}" class="${A.tage===t?'on':''}">${l}</button>`).join('')}</div>`;
const periodeVerdrahten=(m,neu)=>$$('.periode button',m).forEach(b=>b.onclick=()=>{ A.tage=+b.dataset.t; neu(); });

/* ---------- Diagramme (SVG, ohne Bibliothek) ---------- */
function saeulen(daten,wert,label,farbe){
  if(!daten.length)return '<div class="leer">Noch keine Daten</div>';
  const W=640,H=180,P=24, max=Math.max(1,...daten.map(wert)), bw=(W-P)/daten.length;
  const ticks=[0,.5,1].map(f=>Math.round(max*f));
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H+22}" role="img" aria-label="Verlauf">${ticks.map(t=>`<line x1="${P}" x2="${W}" y1="${H-t/max*(H-10)}" y2="${H-t/max*(H-10)}" stroke="#E7E4DE"/><text x="0" y="${H-t/max*(H-10)+4}">${label(t)}</text>`).join('')}
    ${daten.map((d,i)=>{ const h=wert(d)/max*(H-10); return `<rect x="${P+i*bw+bw*.15}" y="${H-h}" width="${bw*.7}" height="${Math.max(h,0)}" rx="2" fill="${farbe}"><title>${esc(d.tag||'')}: ${label(wert(d))}</title></rect>`; }).join('')}
    ${daten.map((d,i)=>(daten.length<=14||i%Math.ceil(daten.length/10)===0)&&d.tag?`<text x="${P+i*bw+bw/2}" y="${H+16}" text-anchor="middle">${new Date(d.tag).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})}</text>`:'').join('')}</svg></div>`;
}
function balken(liste,name,wert,fmt,farbe){
  if(!liste.length)return '<div class="leer">Noch keine Daten</div>';
  const max=Math.max(1,...liste.map(wert));
  return `<div class="balken">${liste.map(x=>`<div class="z"><span>${name(x)}</span><i style="width:${Math.max(2,wert(x)/max*100)}%;${farbe?`background:${farbe(x)}`:''}"></i><span>${fmt(wert(x))}</span></div>`).join('')}</div>`;
}
const LF={mannschaft:'#1D2760','1896':'#1D1D20',merch:'#C9B48F'};

/* ---------- Seiten ---------- */
const S={};
S.uebersicht=async m=>{
  const d=await rpc('shop_bo_uebersicht',{p_tage:A.tage}); badge(d.offen.zahlung+d.offen.packen);
  const cfg=await rpc('shop_bo_einstellungen'); const sm=await rpc('shop_bo_sammel_liste').catch(()=>null); const Pt=cfg.partner||{};
  m.innerHTML=`<div class="kopfz"><div><h1>Übersicht</h1><p>Hallo ${esc((A.ich.name||'').split(' ')[0]||'')}, so läuft der Store.</p></div>${periode()}</div>
  ${cfg.offen?'':`<div class="hinweis" style="margin-bottom:14px"><b>Der Store ist noch geschlossen.</b> Alle können sich umsehen, bestellen geht noch nicht. Öffnen unter <a href="#einstellungen">Einstellungen</a>, sobald Rechtstexte und Bankdaten stehen.</div>`}
  <div class="raster r3" style="margin-bottom:14px">
    <div class="karte todo ${d.offen.zahlung?'an':''}" data-go="zahlung"><b>${d.offen.zahlung}</b><div>Zahlung offen<small>Vorkasse noch nicht da</small></div></div>
    <div class="karte todo ${sm&&sm.offen.bestellungen?'an':''}" data-seite="sammel"><b>${sm?sm.offen.bestellungen:'–'}</b><div>Für Freitag<small>${sm?sm.offen.teile+' Teile, gehen mit der nächsten Sammelbestellung an '+esc(Pt.kontakt||Pt.name||'den Partner'):'bezahlt, noch nicht beim Partner'}</small></div></div>
    <div class="karte todo" data-seite="sammel"><b>${sm&&sm.liste.filter(x=>x.status!=='test'&&x.status!=='bezahlt'&&x.status!=='storniert').length||0}</b><div>Rechnung offen<small>Sammelbestellungen, die wir noch an den Partner zahlen</small></div></div></div>
  ${Pt.aktiv?'':'<div class="hinweis" style="margin-bottom:14px"><b>Die Freitags-Mail an den Partner ist aus.</b> Einschalten unter <a href="#einstellungen">Einstellungen</a>.</div>'}${Pt.aktiv&&Pt.testmodus!==false?'<div class="hinweis" style="margin-bottom:14px"><b>Testmodus:</b> Die Freitags-Mail geht nur an die Kopie-Adressen, nicht an den Partner.</div>':''}
  <div class="raster r4" style="margin-bottom:14px">
    <div class="karte kpi"><small>Umsatz</small><b>${eur(d.umsatz)}</b><span>davon bezahlt ${eur(d.umsatz_bezahlt)} · heute ${eur(d.umsatz_heute)}</span></div>
    <div class="karte kpi"><small>Bestellungen</small><b>${d.bestellungen}</b><span>Ø Warenkorb ${eur(d.schnitt)}</span></div>
    <div class="karte kpi"><small>Besuche</small><b>${d.besuche}</b><span>${d.live} gerade im Shop</span></div>
    <div class="karte kpi"><small>Conversion</small><b>${d.conversion==null?'–':String(d.conversion).replace('.',',')+' %'}</b><span>Besuche, die gekauft haben</span></div></div>
  <div class="raster r2" style="margin-bottom:14px">
    <div class="karte"><h2>Umsatz je Tag <small>letzte ${Math.min(A.tage,90)} Tage</small></h2>${saeulen(d.je_tag,x=>x.umsatz,v=>v>=100000?Math.round(v/100)+' €':eur(v).replace(',00',''),'#1D1D20')}</div>
    <div class="karte"><h2>Besuche je Tag</h2>${saeulen(d.je_tag,x=>x.besuche,v=>String(v),'#2B43A8')}</div></div>
  <div class="raster r3" style="margin-bottom:14px">
    <div class="karte"><h2>Umsatz je Linie</h2>${balken(d.je_linie,x=>LIN[x.linie]||x.linie,x=>x.umsatz,eur,x=>LF[x.linie])}</div>
    <div class="karte"><h2>Bestseller</h2>${d.top.length?d.top.map(t=>`<div class="pos" style="grid-template-columns:1fr auto"><div><b>${esc(t.titel)}</b><br><span class="pill l-${t.linie}">${LIN[t.linie]}</span></div><div class="num" style="text-align:right"><b>${t.stueck}×</b><br><small>${eur(t.umsatz)}</small></div></div>`).join(''):'<div class="leer">Noch nichts verkauft</div>'}</div>
    <div class="karte"><h2>Woher kommt der Umsatz</h2>${balken(d.quellen,x=>esc(x.quelle),x=>x.umsatz,eur)}</div></div>
  <div class="raster r2">
    <div class="karte"><h2>Drops</h2>${d.drops.length?d.drops.map(x=>{ const g=x.verkauft+x.rest; return `<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;gap:10px"><b>${esc(x.titel)}</b><span class="pill ${x.live?'warn':''}">${x.live?'live':new Date(x.start)>new Date()?'ab '+datum(x.start,true):'vorbei'}</span></div>
      <div style="height:10px;background:#EEECE8;border-radius:5px;margin:8px 0 4px;overflow:hidden"><i style="display:block;height:100%;width:${g?x.verkauft/g*100:0}%;background:var(--acc)"></i></div><small style="color:var(--ink3)">${x.verkauft} von ${g} verkauft · ${x.merkliste} auf der Erinnerungsliste</small></div>`; }).join(''):'<div class="leer">Keine Drops</div>'}</div>
    <div class="karte"><h2>Wird knapp</h2>${d.wenig.length?d.wenig.map(w=>`<div class="pos" style="grid-template-columns:1fr auto"><div><b>${esc(w.titel)}</b> <small>${esc(w.groesse)}</small></div><span class="pill ${w.bestand?'warn':'aus'}">${w.bestand?'noch '+w.bestand:'ausverkauft'}</span></div>`).join(''):'<div class="leer">Alles gut gefüllt</div>'}</div></div>`;
  periodeVerdrahten(m,()=>geh('uebersicht'));
  $$('[data-go]',m).forEach(k=>k.onclick=()=>{ A.filter=k.dataset.go; geh('bestellungen'); });
  $$('[data-seite]',m).forEach(k=>k.onclick=()=>geh(k.dataset.seite));
};

S.bestellungen=async m=>{
  const F=[['offen','Offen'],['zahlung','Zahlung offen'],['packen','Zu packen'],['abholbereit','Liegt bereit'],['versendet','Versendet'],['abgeschlossen','Abgeschlossen'],['storniert','Storniert'],['alle','Alle']];
  m.innerHTML=`<div class="kopfz"><div><h1>Bestellungen</h1></div><input class="suche" id="bS" placeholder="Nummer, Name oder E-Mail" value="${esc(A.suche)}"></div>
    <div class="chips">${F.map(([k,t])=>`<button data-f="${k}" class="${A.filter===k?'on':''}">${t}</button>`).join('')}</div><div class="karte"><div class="scroll" id="bL"><div class="leer">Lade …</div></div></div>`;
  const laden=async()=>{ const L=await rpc('shop_bo_bestellungen',{p:{filter:A.filter,suche:A.suche}});
    $('#bL').innerHTML=L.length?`<table class="tabelle"><thead><tr><th>Nr.</th><th>Datum</th><th>Kunde</th><th>Artikel</th><th>Lieferung</th><th>Status</th><th class="r">Summe</th></tr></thead><tbody>${L.map(b=>`<tr class="klick" data-b="${b.id}"><td class="num"><b>${esc(b.nummer)}</b></td><td>${datum(b.am,true)}</td><td>${esc(b.kunde)}<br><small style="color:var(--ink3)">${esc(b.email)}</small></td>
      <td style="max-width:280px"><small>${esc(b.kurz)}</small></td><td>${b.versandart==='versand'?'Versand':'Abholung'}<br><small style="color:var(--ink3)">${ZA[b.zahlart]||b.zahlart}${b.zahlart!=='bar'?(b.bezahlt?' · bezahlt':' · offen'):''}</small></td>
      <td><span class="pill ${ST[b.status][1]}">${ST[b.status][0]}</span>${b.zahlart!=='bar'&&!b.bezahlt&&b.status==='neu'?' <span class="pill warn">Zahlung offen</span>':''}</td><td class="r"><b>${eur(b.summe)}</b></td></tr>`).join('')}</tbody></table>`:'<div class="leer">Keine Bestellungen in dieser Ansicht</div>';
    $$('[data-b]',m).forEach(r=>r.onclick=()=>bestellung(r.dataset.b,laden)); };
  $$('.chips button',m).forEach(b=>b.onclick=()=>{ A.filter=b.dataset.f; $$('.chips button',m).forEach(x=>x.classList.toggle('on',x===b)); laden(); });
  let t; $('#bS').oninput=e=>{ clearTimeout(t); t=setTimeout(()=>{ A.suche=e.target.value; laden(); },300); };
  await laden();
};
async function bestellung(id,nachher){
  const b=await rpc('shop_bo_bestellung',{p_id:id}); const k=b.kunde, ab=b.versandart==='abholung';
  const link=location.origin+BASE+'bestellung/'+b.link_token;
  const mailText=encodeURIComponent(ab?`Hallo ${k.vorname},\n\ndeine Bestellung ${b.nummer} liegt zur Abholung bereit: ${b.abholort_titel||'am Sportplatz'}.\n${b.zahlart==='bar'?`Bitte ${eur(b.summe)} bar mitbringen.\n`:''}\nDen Stand siehst du hier: ${link}\n\nSportliche Grüße\nSV Mörlenbach`
    :`Hallo ${k.vorname},\n\ndeine Bestellung ${b.nummer} ist unterwegs.${b.tracking?`\nSendungsnummer: ${b.tracking}`:''}\n\nDen Stand siehst du hier: ${link}\n\nSportliche Grüße\nSV Mörlenbach`);
  const f=fenster(`<span class="pill ${ST[b.status][1]}">${ST[b.status][0]}</span><h2 class="t num">Bestellung ${esc(b.nummer)}</h2><p style="color:var(--ink3)">${datum(b.created_at,true)} · ${b.fruehere?`${b.fruehere} frühere Bestellung${b.fruehere>1?'en':''}`:'Erstbestellung'}${b.quelle&&b.quelle.quelle?` · über ${esc(b.quelle.quelle)}${b.quelle.kampagne?' ('+esc(b.quelle.kampagne)+')':''}`:''}</p>
    <div class="stack">
    <div class="karte"><h2>Artikel</h2>${b.positionen.map(x=>`<div class="pos"><img src="${klein(x.bild)}" alt=""><div><b>${x.menge}× ${esc(x.titel)}</b><br><small>${esc([x.groesse,x.farbe].filter(Boolean).join(' · '))}</small>${x.personalisierung?`<br><span class="flock">BEFLOCKUNG: ${esc(Object.entries(x.personalisierung).map(([a,v])=>(a==='name'?'Name ':'Nr. ')+v).join(' · '))}</span>`:''}</div><b class="num">${eur(x.summe)}</b></div>`).join('')}
      <div style="display:grid;grid-template-columns:1fr auto;gap:4px 12px;margin-top:10px" class="num"><span>Waren</span><span>${eur(b.waren)}</span>${b.rabatt?`<span>Rabatt ${esc(b.rabatt_code||'')}</span><span>−${eur(b.rabatt)}</span>`:''}<span>${ab?'Abholung':'Versand'}</span><span>${eur(b.versand)}</span><b>Gesamt</b><b>${eur(b.summe)}</b></div></div>
    <div class="raster r2"><div class="karte"><h2>Kunde</h2><p><b>${esc(k.vorname+' '+k.nachname)}</b><br><a href="mailto:${esc(k.email)}">${esc(k.email)}</a>${k.telefon?`<br><a href="tel:${esc(k.telefon)}">${esc(k.telefon)}</a>`:''}</p>${b.notiz?`<p style="margin-top:10px" class="hinweis">„${esc(b.notiz)}“</p>`:''}</div>
      <div class="karte"><h2>${ab?'Abholung':'Lieferadresse'}</h2><p>${ab?esc(b.abholort_titel||'Sportplatz'):`${esc(k.vorname+' '+k.nachname)}<br>${esc(b.adresse.strasse)}${b.adresse.zusatz?'<br>'+esc(b.adresse.zusatz):''}<br>${esc(b.adresse.plz+' '+b.adresse.ort)}`}</p></div></div>
    <div class="karte nodruck"><h2>Zahlung</h2>${b.gutschein?`<p class="hinweis" style="margin-bottom:8px">Vereinsausstattung (Code ${esc(b.gutschein)}): der Verein übernimmt ${eur(b.verein_anteil)}. Lieferung: ${b.lieferziel==='verein'?'an den Verein':b.lieferziel==='veredler'?'zum Veredler':'privat'}.</p>`:''}${b.zahlart==='bar'?`<p>Barzahlung bei Abholung (${eur(b.summe)}).</p>`:b.bezahlt_at?`<p class="hinweis ok">Bezahlt am ${datum(b.bezahlt_at,true)}${b.zahlart==='online'?` · online${b.zahl_info&&b.zahl_info.methode?' ('+esc(b.zahl_info.methode)+')':''}`:' · Überweisung'}</p>`:b.zahlart==='online'?`<p>Online-Zahlung (${eur(b.summe)}) noch nicht abgeschlossen. Ohne Zahlung wird die Bestellung nach drei Stunden storniert.</p>`:`<p>Überweisung: ${eur(b.summe)} mit Zweck „Bestellung ${esc(b.nummer)}“ noch nicht eingegangen.</p>`}${b.sammel_id?'<p style="margin-top:8px"><span class="pill ok">Beim Partner</span> Steht in einer Sammelbestellung (siehe Verlauf).</p>':''}
      <div class="btnreihe" style="margin-top:10px">${b.status!=='storniert'?(b.bezahlt_at?`<button class="btn rand klein" data-a='{"bezahlt":false}'>Zahlung zurücknehmen</button>`:`<button class="btn ok" data-a='{"bezahlt":true}'>${b.zahlart==='bar'?'Bar kassiert':'Zahlung ist da'}</button>${b.zahlart==='vorkasse'?'<small style="color:var(--ink3);align-self:center">Die Kundin bekommt dann automatisch eine Bestätigung.</small>':''}`):''}</div></div>
    ${b.status!=='storniert'?`<div class="karte nodruck"><h2>Nächster Schritt</h2><div class="btnreihe">
      ${['neu','bezahlt'].includes(b.status)&&!b.sammel_id?'<span style="color:var(--ink3);font-size:13.5px;align-self:center">Bezahlte Bestellungen gehen mit der nächsten Sammelbestellung an den Partner.</span>':''}
      ${!ab&&b.status!=='versendet'&&b.status!=='abgeschlossen'?`<input class="suche" id="trk" placeholder="Sendungsnummer (optional)" value="${esc(b.tracking||'')}" style="width:220px"><button class="btn" id="versandt">Versendet</button>`:''}
      ${ab&&b.status!=='abholbereit'&&b.status!=='abgeschlossen'?`<button class="btn" data-a='{"status":"abholbereit"}'>Liegt bereit</button>`:''}
      ${b.status!=='abgeschlossen'?`<button class="btn rand" data-a='{"status":"abgeschlossen"}'>${ab?'Abgeholt':'Angekommen'} · abschließen</button>`:''}
      <a class="btn rand" href="mailto:${esc(k.email)}?subject=${encodeURIComponent('Deine Bestellung '+b.nummer)}&body=${mailText}">Kunde anschreiben</a></div></div>`:''}
    <div class="karte"><h2>Interne Notiz</h2><textarea id="intern" class="suche" style="width:100%;min-height:80px;padding:10px" placeholder="Nur für uns sichtbar">${esc(b.intern||'')}</textarea><div class="btnreihe nodruck" style="margin-top:8px"><button class="btn rand klein" id="internSp">Notiz speichern</button></div></div>
    <div class="karte"><h2>Verlauf</h2><div class="verlauf">${(b.verlauf||[]).slice().reverse().map(v=>`<div><b>${datum(v.at,true)}</b> ${esc(v.was)}${v.von?' · '+esc(v.von):''}</div>`).join('')}</div></div>
    <div class="btnreihe nodruck"><button class="btn rand klein" onclick="print()">Packzettel drucken</button><button class="btn rand klein" id="lk">Kundenlink kopieren</button>${b.status!=='storniert'?`<button class="btn weg klein" id="storno">Stornieren</button>`:''}</div><div id="stornoBox"></div>
    </div>`,f=>{
    const tun=async p=>{ try{ await rpc('shop_bo_bestellung_aendern',{p_id:id,p}); if(p.bezahlt===true)fn('shop-zahlung',{token:b.link_token}).catch(()=>{}); toast('Gespeichert'); zu(); if(nachher)nachher(); bestellung(id,nachher); }catch(e){ toast(e.message); } };
    $$('[data-a]',f).forEach(x=>x.onclick=()=>tun(JSON.parse(x.dataset.a)));
    const v=$('#versandt',f); if(v)v.onclick=async()=>{ await tun({status:'versendet',tracking:$('#trk',f).value}); fn('shop-agenten',{aktion:'lauf',nur:'versand'}).catch(()=>{}); };
    $('#internSp',f).onclick=()=>tun({intern:$('#intern',f).value});
    $('#lk',f).onclick=()=>kopie(link);
    const st=$('#storno',f); if(st)st.onclick=()=>{ $('#stornoBox',f).innerHTML=`<div class="bestaetigen"><span>Wirklich stornieren? Die Teile gehen zurück in den Bestand.</span><button class="btn weg klein" id="stJa">Ja, stornieren</button><button class="btn rand klein" id="stNein">Doch nicht</button></div>`;
      $('#stJa',f).onclick=()=>tun({status:'storniert'}); $('#stNein',f).onclick=()=>$('#stornoBox',f).innerHTML=''; };
  });
}

/* ---------- Sammelbestellung an den Partner ---------- */
const SST={test:['Test','aus'],gesendet:['Gesendet','neu'],bestaetigt:['Bestätigt','neu'],rechnung:['Rechnung da','warn'],bezahlt:['Bezahlt','ok'],storniert:['Storniert','aus']};
const TAGE=['','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
function csvLaden(name,csv){ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})); a.download=name+'.csv'; document.body.appendChild(a); a.click(); a.remove(); }
function mailVorschau(html){ return `<iframe class="mailvorschau" sandbox="" title="Vorschau der Mail" srcdoc="${esc(html)}"></iframe>`; }
/* Rückvergütung beim Partner: Freiware zu UVP nach Saison, Stufen laut 11teamsports (alle Umsätze zählen) */
async function rueckvergutung(box){ if(!box)return; let u; try{ u=await rpc('shop_bo_partner_umsatz'); }catch(e){ return; }
  const max=Math.max(...(u.staffel||[]).map(x=>x[0]),u.gesamt,1); const pos=v=>Math.min(100,v/max*100);
  box.innerHTML=`<div class="karte rueck" style="margin-bottom:14px"><h2>Saison ${esc(u.saison)} beim Partner <small>${datum(u.ab)} bis ${datum(u.bis)}</small></h2>
    <div class="raster r3"><div class="kpi"><small>Umsatz in der Saison</small><b>${eur(u.gesamt)}</b><span>Shop ${eur(u.shop)}${u.weitere?` · sonstige ${eur(u.weitere)}`:''}</span></div>
      <div class="kpi"><small>Rückvergütung</small><b>${u.prozent?String(u.prozent).replace('.',',')+' %':'noch keine'}</b><span>${u.prozent?`≈ ${eur(u.freiware)} Freiware (UVP)`:'ab '+eur((u.staffel[0]||[0])[0])}</span></div>
      <div class="kpi"><small>Nächste Stufe</small><b>${u.naechste?String(u.naechste[1]).replace('.',',')+' %':'erreicht'}</b><span>${u.naechste?`noch ${eur(u.fehlt)}`:'höchste Stufe'}</span></div></div>
    <div class="stufen"><i style="width:${pos(u.gesamt)}%"></i>${(u.staffel||[]).map(x=>`<span style="left:${pos(x[0])}%"><b>${String(x[1]).replace('.',',')} %</b>${eur(x[0]).replace(',00','')}</span>`).join('')}</div>
    <p style="font-size:12.5px;color:var(--ink3);margin-top:28px">Zählt alles: Shop-Sammelbestellungen (Rechnungsbetrag, sonst EK) plus Bestellungen über Teamportal, Clubshop oder von Hand. Die trägst du unter Einstellungen › Partner ein. ${u.rabatt} % Nachlass auf Teamsport-Artikel gelten immer.</p></div>`; }
S.sammel=async m=>{
  const d=await rpc('shop_bo_sammel_liste'); const P=d.partner||{}, O=d.offen, test=P.testmodus!==false;
  const marge=O.summe_vk&&O.summe_ek?Math.round(O.summe_vk/1.19)-O.summe_ek:null;
  m.innerHTML=`<div class="kopfz"><div><h1>Sammelbestellung</h1><p>${P.aktiv?`Jeden ${TAGE[P.tag||5]} um ${P.stunde??10} Uhr automatisch an ${esc(P.kontakt||'')} (${esc(P.name||'Partner')})`:'Automatischer Versand ist aus'} ${P.aktiv?`<span class="pill ${test?'warn':'ok'}">${test?'Testmodus':'aktiv'}</span>`:'<span class="pill aus">aus</span>'}</p></div><button class="btn rand" data-zu="einstellungen">Einstellungen</button></div>
  ${test?`<div class="hinweis" style="margin-bottom:14px"><b>Testmodus:</b> Mails gehen nur an ${(P.kopie||[]).length?esc(P.kopie.join(', ')):'dich'}. Die Bestellungen bleiben offen. Zum echten Start Partner-Mail eintragen und den Testmodus ausschalten.</div>`:''}
  <div id="rueck"></div>
  <div class="raster r4" style="margin-bottom:14px">
    <div class="karte kpi"><small>Offen für die nächste</small><b>${O.bestellungen}</b><span>Bestellungen · ${O.teile} Teile</span></div>
    <div class="karte kpi"><small>Einkauf (Rechnung erwartet)</small><b>${eur(O.summe_ek)}</b><span>${O.ohne_ek?`<span class="pill warn">${O.ohne_ek} Positionen ohne EK</span>`:'netto laut Produkten'}</span></div>
    <div class="karte kpi"><small>Umsatz</small><b>${eur(O.summe_vk)}</b><span>brutto, von Kunden bezahlt</span></div>
    <div class="karte kpi"><small>Bleibt grob</small><b>${marge==null?'–':eur(marge)}</b><span>Umsatz ohne 19 % MwSt. minus EK, vor Zahlungsgebühren</span></div></div>
  <div class="karte" style="margin-bottom:14px"><h2>Nächste Sammelbestellung</h2><p style="color:var(--ink3);margin-bottom:12px">Enthält alle bezahlten Bestellungen, die noch nicht beim Partner sind.${d.unbezahlt?` ${d.unbezahlt} Bestellung${d.unbezahlt>1?'en warten':' wartet'} noch auf die Zahlung.`:''}</p>
    <div class="btnreihe"><button class="btn" id="sVor" ${O.bestellungen?'':'disabled'}>Vorschau ansehen</button><button class="btn rand" id="sTest" ${O.bestellungen?'':'disabled'}>Testmail an ${(P.kopie||[]).length?'Kopie-Adressen':'mich'}</button>${!test&&P.email?`<button class="btn hi" id="sJetzt" ${O.bestellungen?'':'disabled'}>Jetzt an ${esc(P.kontakt||P.email)} senden</button>`:''}</div><div id="sBox"></div></div>
  <div class="karte"><h2>Bisher</h2><div class="scroll">${d.liste.length?`<table class="tabelle"><thead><tr><th>Nummer</th><th>Gesendet</th><th class="r">Best.</th><th class="r">Teile</th><th class="r">EK</th><th class="r">Rechnung</th><th>Status</th></tr></thead><tbody>${d.liste.map(x=>`<tr class="klick" data-sm="${x.id}"><td class="num"><b>${esc(x.nummer)}</b></td><td>${datum(x.gesendet||x.erstellt,true)}${x.fehler?' <span class="pill warn">Mail fehlgeschlagen</span>':''}</td><td class="r">${x.bestellungen}</td><td class="r">${x.teile}</td><td class="r">${eur(x.summe_ek)}</td><td class="r">${x.rechnung_betrag!=null?eur(x.rechnung_betrag)+(x.rechnung_betrag!==x.summe_ek?` <span class="pill warn">${x.rechnung_betrag>x.summe_ek?'+':'−'}${eur(Math.abs(x.rechnung_betrag-x.summe_ek))}</span>`:''):'–'}</td><td><span class="pill ${SST[x.status][1]}">${SST[x.status][0]}</span></td></tr>`).join('')}</tbody></table>`:'<div class="leer">Noch keine Sammelbestellung verschickt</div>'}</div></div>`;
  $$('[data-zu]',m).forEach(b=>b.onclick=()=>geh(b.dataset.zu));
  rueckvergutung($('#rueck',m));
  $$('[data-sm]',m).forEach(r=>r.onclick=()=>sammelDetail(r.dataset.sm));
  const box=$('#sBox',m);
  const senden=async(test,knopf)=>{ knopf.disabled=true; const t=knopf.textContent; knopf.textContent='Wird gesendet …';
    try{ const r=await fn('shop-sammel',{aktion:'senden',test}); if(r.leer){ toast('Nichts offen'); }else if(!r.ok){ toast('Gespeichert, aber die Mail ging nicht raus: '+(r.fehler||'')); }else toast(r.test?'Testmail verschickt an '+r.an.join(', '):`Sammelbestellung ${r.nummer} an ${r.an.join(', ')} verschickt`); geh('sammel'); }
    catch(e){ toast(e.message); knopf.disabled=false; knopf.textContent=t; } };
  if($('#sVor',m))$('#sVor',m).onclick=async()=>{ box.innerHTML='<div class="leer">Lade …</div>'; try{ const v=await fn('shop-sammel',{aktion:'vorschau'}); if(v.leer){ box.innerHTML='<div class="leer">Nichts offen</div>'; return; }
    box.innerHTML=`<div class="btnreihe" style="margin:14px 0 10px"><b>${esc(v.nummer)}</b><span style="color:var(--ink3)">${v.bestellungen} Bestellungen · ${v.teile} Teile · EK ${eur(v.ek)}</span><button class="btn rand klein" id="sCsv">CSV laden</button></div>${mailVorschau(v.html)}`; $('#sCsv',box).onclick=()=>csvLaden(v.nummer,v.csv); }catch(e){ box.innerHTML=`<div class="hinweis">${esc(e.message)}</div>`; } };
  if($('#sTest',m))$('#sTest',m).onclick=e=>senden(true,e.currentTarget);
  if($('#sJetzt',m))$('#sJetzt',m).onclick=e=>{ const k=e.currentTarget; box.innerHTML=`<div class="bestaetigen" style="margin-top:12px"><span>${O.bestellungen} Bestellungen jetzt an ${esc(P.email)} schicken? Danach stehen sie als „Beim Partner“.</span><button class="btn hi klein" id="sJa">Ja, senden</button><button class="btn rand klein" id="sNein">Doch nicht</button></div>`;
    $('#sJa',box).onclick=()=>{ box.innerHTML=''; senden(false,k); }; $('#sNein',box).onclick=()=>box.innerHTML=''; };
};
async function sammelDetail(id){
  const s=await rpc('shop_bo_sammel',{p_id:id}); const echt=s.status!=='test';
  const f=fenster(`<span class="pill ${SST[s.status][1]}">${SST[s.status][0]}</span><h2 class="t num">${esc(s.nummer)}</h2><p style="color:var(--ink3)">${datum(s.gesendet_at||s.created_at,true)} an ${esc((s.empfaenger||[]).join(', '))}${s.fehler?` · <b style="color:#B3261E">Mail fehlgeschlagen: ${esc(s.fehler)}</b>`:''}</p>
    <div class="stack">
    <div class="raster r3"><div class="karte kpi"><small>Bestellungen</small><b>${s.bestellungen}</b><span>${s.teile} Teile</span></div><div class="karte kpi"><small>Einkauf erwartet</small><b>${eur(s.summe_ek)}</b><span>laut Produkten</span></div><div class="karte kpi"><small>Rechnung</small><b>${s.rechnung_betrag!=null?eur(s.rechnung_betrag):'–'}</b><span>${s.rechnung_nr?esc(s.rechnung_nr):'noch nicht erfasst'}</span></div></div>
    ${echt?`<div class="karte form nodruck"><h2>Rechnung vom Partner</h2><div class="f2"><div class="feld"><label>Rechnungsnummer</label><input id="rNr" value="${esc(s.rechnung_nr||'')}" maxlength="60"></div><div class="feld"><label>Betrag (€)</label><input id="rBe" inputmode="decimal" value="${zuEur(s.rechnung_betrag)}"></div></div>
      ${s.rechnung_betrag!=null&&s.rechnung_betrag!==s.summe_ek?`<p class="hinweis">Die Rechnung weicht um ${eur(Math.abs(s.rechnung_betrag-s.summe_ek))} vom erwarteten Einkauf ab. EK der Produkte prüfen.</p>`:''}
      <div class="feld"><label>Notiz</label><input id="rNo" value="${esc(s.notiz||'')}" maxlength="1000"></div>
      <div class="btnreihe">${s.status==='gesendet'?'<button class="btn rand" data-st="bestaetigt">Partner hat bestätigt</button>':''}<button class="btn" data-st="${s.status==='bezahlt'?'':'rechnung'}" id="rSp">${s.status==='bezahlt'||s.status==='rechnung'?'Speichern':'Rechnung erfasst'}</button>${s.status!=='bezahlt'&&s.status!=='storniert'?'<button class="btn ok" data-st="bezahlt">Überwiesen</button>':''}</div></div>`:'<div class="hinweis">Testmail. Die Bestellungen sind dadurch nicht beim Partner.</div>'}
    ${s.bestell_liste.length?`<div class="karte"><h2>Bestellungen darin</h2><table class="tabelle"><tbody>${s.bestell_liste.map(b=>`<tr><td class="num"><b>${esc(b.nummer)}</b></td><td>${esc(b.name)}</td><td><span class="pill ${ST[b.status][1]}">${ST[b.status][0]}</span></td><td class="r">${eur(b.summe)}</td></tr>`).join('')}</tbody></table></div>`:''}
    <div class="karte"><h2>Mail an den Partner</h2>${mailVorschau(s.html||'')}</div>
    <div class="karte"><h2>Verlauf</h2><div class="verlauf">${(s.verlauf||[]).slice().reverse().map(v=>`<div><b>${datum(v.at,true)}</b> ${esc(v.was)}${v.wer?' · '+esc(v.wer):''}</div>`).join('')}</div></div>
    ${echt&&s.bestell_liste.some(b=>b.status==='in_arbeit')?`<div class="karte form nodruck"><h2>Partner hat verschickt?</h2><p style="font-size:13.5px;color:var(--ink2)">Markiert alle ${s.bestell_liste.filter(b=>b.status==='in_arbeit').length} offenen Bestellungen als versendet. Die Kunden bekommen automatisch eine Mail, mit Sendungsnummer, wenn du sie hier einträgst.</p>
      <div class="stack">${s.bestell_liste.filter(b=>b.status==='in_arbeit').map(b=>`<div class="f2" style="align-items:center"><span><b class="num">${esc(b.nummer)}</b> ${esc(b.name)}</span><input class="suche" data-trk="${esc(b.nummer)}" placeholder="Sendungsnummer (optional)" value="${esc(b.tracking||'')}"></div>`).join('')}</div>
      <div class="btnreihe" style="margin-top:10px"><button class="btn ok" id="sdVers">Alle als versendet markieren</button></div></div>`:''}
    <div class="btnreihe nodruck"><button class="btn rand klein" id="sdCsv">CSV laden</button><button class="btn rand klein" id="sdNeu">${echt?'Erneut senden':'Testmail erneut senden'}</button>${echt&&s.status!=='storniert'?'<button class="btn weg klein" id="sdSt">Stornieren</button>':''}</div><div id="sdBox"></div></div>`,f=>{
    const tun=async p=>{ try{ await rpc('shop_bo_sammel_aendern',{p_id:id,p}); toast('Gespeichert'); zu(); geh('sammel'); sammelDetail(id); }catch(e){ toast(e.message); } };
    $$('[data-st]',f).forEach(b=>b.onclick=()=>{ const p={}; if(b.dataset.st)p.status=b.dataset.st; if($('#rNr',f)){ p.rechnung_nr=$('#rNr',f).value; const c=cent($('#rBe',f).value); p.rechnung_betrag=c==null?'':c; p.notiz=$('#rNo',f).value; } tun(p); });
    $('#sdCsv',f).onclick=()=>csvLaden(s.nummer,s.csv||'');
    const sv=$('#sdVers',f); if(sv)sv.onclick=async()=>{ sv.disabled=true; const tracking={}; $$('[data-trk]',f).forEach(i=>{ if(i.value.trim())tracking[i.dataset.trk]=i.value.trim(); });
      try{ const n=await rpc('shop_bo_sammel_versendet',{p_id:id,p:{tracking}}); fn('shop-agenten',{aktion:'lauf',nur:'versand'}).catch(()=>{}); toast(n+' Bestellungen versendet, Kunden werden informiert'); zu(); geh('sammel'); sammelDetail(id); }catch(x){ toast(x.message); sv.disabled=false; } };
    $('#sdNeu',f).onclick=async e=>{ e.currentTarget.disabled=true; try{ await fn('shop-sammel',{aktion:'erneut',id}); toast('Erneut gesendet'); zu(); sammelDetail(id); }catch(x){ toast(x.message); e.currentTarget.disabled=false; } };
    const st=$('#sdSt',f); if(st)st.onclick=()=>{ $('#sdBox',f).innerHTML=`<div class="bestaetigen"><span>Stornieren? Die Bestellungen kommen dann in die nächste Sammelbestellung. Sag dem Partner Bescheid.</span><button class="btn weg klein" id="sdJa">Ja, stornieren</button><button class="btn rand klein" id="sdNein">Doch nicht</button></div>`;
      $('#sdJa',f).onclick=()=>tun({status:'storniert'}); $('#sdNein',f).onclick=()=>$('#sdBox',f).innerHTML=''; };
  });
}

/* ---------- Produkte ---------- */
S.produkte=async m=>{
  const P=A.produkte=await rpc('shop_bo_produkte'); if(!A.drops)A.drops=await rpc('shop_bo_drops'); A.partner=await rpc('shop_bo_partner_daten').catch(()=>({}));
  const lf=A.lf||'alle';
  m.innerHTML=`<div class="kopfz"><div><h1>Produkte</h1><p>${P.filter(p=>p.status==='aktiv').length} aktiv · ${P.length} gesamt</p></div><button class="btn hi" id="pNeu">+ Neues Produkt</button></div>
    <div class="chips">${[['alle','Alle'],['mannschaft','Mannschaft'],['1896','1896'],['merch','Merch'],['archiv','Archiv']].map(([k,t])=>`<button data-l="${k}" class="${lf===k?'on':''}">${t}</button>`).join('')}</div>
    <div class="karte"><div class="scroll"><table class="tabelle"><thead><tr><th>Produkt</th><th>Linie</th><th>Status</th><th class="r">Preis</th><th class="r">EK</th><th class="r">Bestand</th><th class="r">Verkauft</th></tr></thead><tbody>
    ${P.filter(p=>lf==='alle'?p.status!=='archiv':lf==='archiv'?p.status==='archiv':p.linie===lf&&p.status!=='archiv').map(p=>{ const va=p.varianten.filter(v=>v.aktiv); const unb=va.some(v=>v.bestand==null); const best=va.reduce((a,v)=>a+(v.bestand||0),0); const leer=va.filter(v=>v.bestand===0).length;
      return `<tr class="klick" data-p="${p.id}"><td><div class="prod-z"><img src="${klein(p.bilder[0])}" alt=""><div><b>${esc(p.titel)}</b><small>${esc(p.drop?'Drop: '+p.drop:(p.untertitel||''))}</small></div></div></td><td><span class="pill l-${p.linie}">${LIN[p.linie]}</span></td>
      <td><span class="pill ${p.status==='aktiv'?'ok':p.status==='entwurf'?'':'aus'}">${{aktiv:'Aktiv',entwurf:'Entwurf',archiv:'Archiv'}[p.status]}</span></td><td class="r">${eur(p.preis)}</td><td class="r">${(A.partner[p.id]||{}).einkauf!=null?eur(A.partner[p.id].einkauf):'<span class="pill">fehlt</span>'}</td>
      <td class="r">${unb?'auf Bestellung':best}${leer?` <span class="pill warn">${leer} Gr. leer</span>`:''}</td><td class="r"><b>${p.verkauft}</b></td></tr>`; }).join('')}</tbody></table></div></div>`;
  $$('[data-l]',m).forEach(b=>b.onclick=()=>{ A.lf=b.dataset.l; S.produkte(m); });
  $$('[data-p]',m).forEach(r=>r.onclick=()=>produktEditor(P.find(p=>p.id===r.dataset.p)));
  $('#pNeu').onclick=()=>produktEditor(null);
};
const SETS={erw:['S','M','L','XL','XXL'],kids:['116','128','140','152','164'],eins:['Einheitsgröße']};
function produktEditor(p){
  const neu=!p; p=p||{titel:'',slug:'',linie:'1896',status:'entwurf',preis:0,mwst:19,bilder:[],details:[],varianten:[],max_pro_bestellung:10,personalisierung:null,tags:[]};
  let bilder=[...(p.bilder||[])], vars=(p.varianten||[]).map(v=>({...v}));
  const pers=p.personalisierung||{}; const PD=(!neu&&A.partner&&A.partner[p.id])||{einkauf:null,partner_artikel:'',varianten:{}};
  vars.forEach(v=>{ v.partner_sku=v.id?(PD.varianten||{})[v.id]||'':''; });
  const f=fenster(`<h2 class="t">${neu?'Neues Produkt':esc(p.titel)}</h2>${!neu?`<p><a href="${BASE}p/${esc(p.slug)}" target="_blank">Im Shop ansehen ↗</a></p>`:''}
  <form class="stack" id="pf">
    <div class="karte form"><div class="f2"><div class="feld"><label>Titel</label><input name="titel" value="${esc(p.titel)}" required maxlength="80"></div><div class="feld"><label>Adresse (Slug)</label><input name="slug" value="${esc(p.slug)}" pattern="[a-z0-9\-]{2,60}" required><small>Teil der Adresse: /p/…</small></div></div>
      <div class="feld"><label>Untertitel</label><input name="untertitel" value="${esc(p.untertitel||'')}" maxlength="120"></div>
      <div class="feld"><label>Beschreibung</label><textarea name="beschreibung" rows="4" maxlength="4000">${esc(p.beschreibung||'')}</textarea></div>
      <div class="feld"><label>Details (eine Zeile pro Punkt)</label><textarea name="details" rows="4">${esc((p.details||[]).join('\n'))}</textarea></div></div>
    <div class="karte form"><div class="f2"><div class="feld"><label>Linie</label><select name="linie">${Object.entries(LIN).map(([k,t])=>`<option value="${k}" ${p.linie===k?'selected':''}>${t}</option>`).join('')}</select></div>
      <div class="feld"><label>Status</label><select name="status">${[['entwurf','Entwurf (unsichtbar)'],['aktiv','Aktiv (im Shop)'],['archiv','Archiv']].map(([k,t])=>`<option value="${k}" ${p.status===k?'selected':''}>${t}</option>`).join('')}</select></div>
      <div class="feld"><label>Drop</label><select name="drop"><option value="">kein Drop</option>${(A.drops||[]).map(d=>`<option value="${esc(d.slug)}" ${p.drop===d.slug?'selected':''}>${esc(d.titel)}</option>`).join('')}</select><small>Im Drop: kaufbar erst ab Start</small></div></div>
      <div class="f2"><div class="feld"><label>Preis (€)</label><input name="preis" inputmode="decimal" value="${zuEur(p.preis)}" required></div><div class="feld"><label>Statt-Preis (€, optional)</label><input name="vergleichspreis" inputmode="decimal" value="${zuEur(p.vergleichspreis)}"></div>
        <div class="feld"><label>MwSt.</label><select name="mwst">${[19,7,0].map(s=>`<option ${p.mwst===s?'selected':''}>${s}</option>`).join('')}</select></div></div>
      <div class="f2"><div class="feld"><label>Etikett</label><input name="badge" value="${esc(p.badge||'')}" maxlength="24" placeholder="z. B. Limitiert"></div><div class="feld"><label>Höchstens pro Bestellung</label><input name="max_pro_bestellung" type="number" min="1" max="99" value="${p.max_pro_bestellung}"></div>
        <div class="feld"><label>Saison</label><select name="saison"><option value="">automatisch (${({kalt:'kalt',warm:'warm',ganzjahr:'ganzjährig'})[p.saison_auto]||'aus dem Namen'})</option>${[['kalt','kalt: steht vorne, wenn es kalt ist'],['warm','warm: steht vorne, wenn es warm ist'],['ganzjahr','ganzjährig']].map(([v,t])=>`<option value="${v}" ${p.saison===v?'selected':''}>${t}</option>`).join('')}</select></div><div class="feld"><label>Größentabelle</label><select name="groessen"><option value="">keine</option>${['trikot','anzug','hoodie','crew','shirt'].map(g=>`<option ${p.groessen===g?'selected':''}>${g}</option>`).join('')}</select></div><div class="feld"><label>Reihenfolge</label><input name="sort" type="number" value="${p.sort||100}"></div></div>
      <div class="feld"><label>Lieferhinweis</label><input name="lieferhinweis" value="${esc(p.lieferhinweis||'')}" maxlength="120" placeholder="z. B. Lieferung ab Juli"></div>
      <div class="f2"><label class="chk"><input type="checkbox" name="pName" ${pers.name?'checked':''}> Name aufdrucken, Aufpreis</label><div class="feld"><input name="pNameP" inputmode="decimal" value="${zuEur(pers.name?pers.name.preis:600)}"></div>
        <label class="chk"><input type="checkbox" name="pNr" ${pers.nummer?'checked':''}> Nummer aufdrucken, Aufpreis</label><div class="feld"><input name="pNrP" inputmode="decimal" value="${zuEur(pers.nummer?pers.nummer.preis:500)}"></div></div></div>
    <div class="karte form"><h2>Partner <small>Eleven Teamsports, nur intern</small></h2><div class="f2"><div class="feld"><label>UVP laut Katalog (€)</label><input name="uvp" inputmode="decimal" value="${zuEur(PD.uvp)}" placeholder="z. B. 54,95"><small>Grundlage für EK (${A.partnerRabatt||45} % Nachlass) und Freiware-Wert</small></div><div class="feld"><label>Einkaufspreis (€, netto laut Partner)</label><div style="display:flex;gap:8px"><input name="ek" inputmode="decimal" value="${zuEur(PD.einkauf)}" placeholder="z. B. 30,00"><button type="button" class="btn rand klein" id="ekUvp" title="UVP minus Nachlass">aus UVP</button></div><small>Steht in der Sammelbestellung und dient zum Abgleich mit der Rechnung</small></div><div class="feld"><label>Artikelnummer beim Partner</label><input name="partnerArt" value="${esc(PD.partner_artikel||'')}" maxlength="60"><small>Gilt für alle Größen, außer unten ist eine eigene eingetragen</small></div></div>
      <div class="f2" id="ekInfo"></div></div>
    <div class="karte"><h2>Bilder <small>erstes = Titelbild</small></h2><div class="bilder" id="pB"></div>
      <div class="btnreihe" style="margin-top:10px"><input class="suche" id="pBneu" placeholder="img/datei.webp oder https://…"><button type="button" class="btn rand klein" id="pBadd">Hinzufügen</button><label class="btn rand klein">Hochladen<input type="file" accept="image/*" id="pBup" hidden multiple></label></div></div>
    <div class="karte"><h2>Größen und Bestand <small>Bestand leer = ohne Grenze</small></h2><div class="scroll"><table class="tabelle var-tab"><thead><tr><th>Größe</th><th>Farbe</th><th>Preis (€) abweichend</th><th>Bestand</th><th>Art.-Nr. Partner</th><th>Verkauft</th><th>Aktiv</th><th></th></tr></thead><tbody id="pV"></tbody></table></div>
      <div class="btnreihe" style="margin-top:10px"><button type="button" class="btn rand klein" data-set="erw">+ S bis XXL</button><button type="button" class="btn rand klein" data-set="kids">+ 116 bis 164</button><button type="button" class="btn rand klein" data-set="eins">+ Einheitsgröße</button><button type="button" class="btn rand klein" id="pVneu">+ Größe</button></div></div>
    <div id="pFeh"></div>
    <div class="fusszeile"><button type="button" class="btn rand" id="pAbbr">Abbrechen</button><button class="btn hi" type="submit">Speichern</button></div>
  </form>`);
  const zB=()=>{ $('#pB',f).innerHTML=bilder.map((b,i)=>`<figure><img src="${klein(b)}" alt=""><div><button type="button" data-bl="${i}" title="nach vorn">←</button><button type="button" data-bx="${i}" title="entfernen">✕</button></div></figure>`).join('')||'<span style="color:var(--ink3)">Noch keine Bilder</span>';
    $$('[data-bl]',f).forEach(b=>b.onclick=()=>{ const i=+b.dataset.bl; if(i>0){ [bilder[i-1],bilder[i]]=[bilder[i],bilder[i-1]]; zB(); } });
    $$('[data-bx]',f).forEach(b=>b.onclick=()=>{ bilder.splice(+b.dataset.bx,1); zB(); }); };
  const zV=()=>{ $('#pV',f).innerHTML=vars.map((v,i)=>`<tr><td><input data-vi="${i}" data-k="groesse" value="${esc(v.groesse)}" style="width:110px"></td><td><input data-vi="${i}" data-k="farbe" value="${esc(v.farbe||'')}" style="width:90px"></td><td><input data-vi="${i}" data-k="preis" inputmode="decimal" value="${zuEur(v.preis)}" style="width:90px"></td>
    <td><input data-vi="${i}" data-k="bestand" type="number" min="0" value="${v.bestand??''}" style="width:80px"></td><td><input data-vi="${i}" data-k="partner_sku" value="${esc(v.partner_sku||'')}" style="width:130px" maxlength="60"></td><td class="r">${v.verkauft||0}</td><td><input type="checkbox" data-vi="${i}" data-k="aktiv" ${v.aktiv!==false?'checked':''}></td><td><button type="button" class="btn rand klein" data-vx="${i}">✕</button></td></tr>`).join('');
    $$('[data-vi]',f).forEach(e=>e.oninput=e.onchange=()=>{ const v=vars[+e.dataset.vi], k=e.dataset.k; v[k]=k==='aktiv'?e.checked:k==='preis'?cent(e.value):k==='bestand'?(e.value===''?null:+e.value):e.value; });
    $$('[data-vx]',f).forEach(b=>b.onclick=()=>{ vars.splice(+b.dataset.vx,1); zV(); }); };
  zB(); zV();
  const fo=$('#pf',f);
  if($('#ekUvp',fo))$('#ekUvp',fo).onclick=()=>{ const u=cent(fo.uvp.value); if(u==null){ toast('Erst die UVP eintragen'); return; } fo.ek.value=zuEur(Math.round(u*(100-(A.partnerRabatt||45))/100)); toast('EK = UVP minus '+(A.partnerRabatt||45)+' %'); };
  const ekInfo=()=>{ const vk=cent(fo.preis.value), ek=cent(fo.ek.value); $('#ekInfo',f).innerHTML=vk&&ek!=null?`<p style="font-size:13.5px;color:var(--ink3)">Verkauf ${eur(vk)} brutto = ${eur(Math.round(vk/1.19))} netto. Abzüglich EK bleiben <b style="color:${Math.round(vk/1.19)-ek<300?'#B3261E':'inherit'}">${eur(Math.round(vk/1.19)-ek)}</b> pro Stück, davon gehen noch Zahlungsgebühren ab (online etwa 0,25 € plus 1,5 bis 3 %).</p>`:''; };
  fo.preis.addEventListener('input',ekInfo); fo.ek.addEventListener('input',ekInfo); ekInfo();
  if(neu)fo.titel.oninput=()=>{ fo.slug.value=fo.titel.value.toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60); };
  $$('[data-set]',f).forEach(b=>b.onclick=()=>{ SETS[b.dataset.set].forEach((g,i)=>{ if(!vars.some(v=>v.groesse===g))vars.push({groesse:g,farbe:'',preis:null,bestand:null,aktiv:true,sort:(b.dataset.set==='kids'?i:10+i)}); }); zV(); });
  $('#pVneu',f).onclick=()=>{ vars.push({groesse:'',farbe:'',preis:null,bestand:null,aktiv:true,sort:vars.length}); zV(); };
  $('#pBadd',f).onclick=()=>{ const v=$('#pBneu',f).value.trim(); if(v){ bilder.push(v); $('#pBneu',f).value=''; zB(); } };
  $('#pBup',f).onchange=async e=>{ for(const file of e.target.files){ try{ const path='produkte/'+Date.now()+'-'+file.name.toLowerCase().replace(/[^a-z0-9.]+/g,'-');
      const {error}=await sb.storage.from('shop').upload(path,file,{cacheControl:'31536000',contentType:file.type}); if(error)throw error;
      bilder.push(sb.storage.from('shop').getPublicUrl(path).data.publicUrl); zB(); toast('Bild hochgeladen'); }catch(x){ toast('Hochladen ging nicht: '+(x.message||x)); } } };
  $('#pAbbr',f).onclick=zu;
  fo.onsubmit=async e=>{ e.preventDefault(); const g=n=>fo[n].value;
    const body={id:neu?null:p.id,titel:g('titel'),slug:g('slug'),untertitel:g('untertitel'),beschreibung:g('beschreibung'),details:g('details').split('\n').map(s=>s.trim()).filter(Boolean),
      linie:g('linie'),status:g('status'),drop:g('drop'),preis:cent(g('preis')),vergleichspreis:cent(g('vergleichspreis')),mwst:+g('mwst'),badge:g('badge'),max_pro_bestellung:+g('max_pro_bestellung'),
      groessen:g('groessen'),saison:g('saison'),sort:+g('sort'),lieferhinweis:g('lieferhinweis'),bilder,
      personalisierung:(fo.pName.checked||fo.pNr.checked)?Object.assign({},fo.pName.checked?{name:{max:12,preis:cent(g('pNameP'))||0}}:{},fo.pNr.checked?{nummer:{max:2,preis:cent(g('pNrP'))||0}}:{}):null,
      varianten:vars.filter(v=>v.groesse||v.farbe).map((v,i)=>({id:v.id||null,groesse:v.groesse,farbe:v.farbe||'',preis:v.preis??'',bestand:v.bestand??'',aktiv:v.aktiv!==false,sort:v.sort??i}))};
    if(body.preis==null){ $('#pFeh',f).innerHTML='<div class="hinweis">Bitte einen Preis eintragen.</div>'; return; }
    if(!body.varianten.length){ $('#pFeh',f).innerHTML='<div class="hinweis">Bitte mindestens eine Größe anlegen (oder „Einheitsgröße“).</div>'; return; }
    try{ const pid=await rpc('shop_bo_produkt_speichern',{p:body});
      const L=await rpc('shop_bo_produkte'); const np=L.find(x=>x.id===pid)||{varianten:[]}; const skus={};
      np.varianten.forEach(v=>{ const alt=vars.find(x=>(x.id&&x.id===v.id)||(!x.id&&x.groesse===v.groesse&&(x.farbe||'')===(v.farbe||''))); skus[v.id]=alt?alt.partner_sku||'':''; });
      const ek=cent(g('ek')); const uvp=cent(g('uvp')); await rpc('shop_bo_produkt_partner',{p_id:pid,p:{einkauf:ek==null?'':ek,uvp:uvp==null?'':uvp,partner_artikel:g('partnerArt'),varianten:skus}});
      toast('Produkt gespeichert'); zu(); geh('produkte'); }
    catch(x){ $('#pFeh',f).innerHTML=`<div class="hinweis">${esc(/slug/.test(x.message)?'Diese Adresse (Slug) gibt es schon.':x.message)}</div>`; } };
}

/* ---------- Drops ---------- */
S.drops=async m=>{
  const D=A.drops=await rpc('shop_bo_drops');
  m.innerHTML=`<div class="kopfz"><div><h1>Drops</h1><p>Limitierte Ware mit Startzeit. Bestand bleibt geheim, der Shop zeigt nur „Limitiert“ und „Ausverkauft“.</p></div><button class="btn hi" id="dNeu">+ Neuer Drop</button></div>
  <div class="raster r2">${D.map(d=>{ const g=d.verkauft+d.rest; const zuk=new Date(d.start_at)>new Date(); return `<div class="karte" style="display:flex;gap:14px"><img src="${klein(d.bild)}" alt="" style="width:96px;height:120px;object-fit:cover;border-radius:8px;background:#eee">
    <div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><b style="font:800 20px/1.1 var(--cond);text-transform:uppercase">${esc(d.titel)}</b><span class="pill ${d.live?'warn':d.status==='entwurf'?'':zuk?'neu':'aus'}">${d.status==='entwurf'?'Entwurf':d.live?'live':zuk?'geplant':'vorbei'}</span></div>
    <p style="font-size:13.5px;color:var(--ink3);margin:4px 0 8px">Start ${datum(d.start_at,true)}${d.ende_at?' · Ende '+datum(d.ende_at,true):''}</p>
    <div style="height:10px;background:#EEECE8;border-radius:5px;overflow:hidden"><i style="display:block;height:100%;width:${g?d.verkauft/g*100:0}%;background:var(--acc)"></i></div>
    <p style="font-size:13px;margin-top:6px">${d.verkauft} von ${g} verkauft · ${d.produkte.length} Produkte · <b>${d.merkliste}</b> auf der Liste${d.ausverkauft_um?` · ausverkauft ${datum(d.ausverkauft_um,true)}`:''}</p>
    <div class="btnreihe" style="margin-top:10px"><button class="btn rand klein" data-de="${d.id}">Bearbeiten</button><button class="btn rand klein" data-dm="${esc(d.slug)}">Erinnerungsliste</button><a class="btn rand klein" href="${BASE}drop/${esc(d.slug)}" target="_blank">Ansehen ↗</a></div></div></div>`; }).join('')||'<div class="leer">Noch keine Drops</div>'}</div>`;
  $('#dNeu').onclick=()=>dropEditor(null);
  $$('[data-de]',m).forEach(b=>b.onclick=()=>dropEditor(D.find(d=>d.id===b.dataset.de)));
  $$('[data-dm]',m).forEach(b=>b.onclick=async()=>{ const L=await rpc('shop_bo_merkliste',{p_drop:b.dataset.dm}); const mails=L.map(x=>x.email).join(', ');
    fenster(`<h2 class="t">Erinnerungsliste</h2><p>${L.length} Personen wollen Bescheid bekommen. Am besten als BCC verschicken, damit niemand die anderen Adressen sieht.</p><div class="stack"><div class="btnreihe"><button class="btn" id="mk">Alle Adressen kopieren</button><a class="btn rand" href="mailto:?bcc=${encodeURIComponent(L.map(x=>x.email).join(','))}&subject=${encodeURIComponent('Der Drop startet')}">Mail mit BCC öffnen</a></div>
      <div class="karte"><table class="tabelle"><tbody>${L.map(x=>`<tr><td>${esc(x.email)}</td><td class="r">${datum(x.am,true)}</td></tr>`).join('')||'<tr><td class="leer">Noch niemand</td></tr>'}</tbody></table></div></div>`,f=>{ $('#mk',f).onclick=()=>kopie(mails); }); });
};
function lokal(t){ if(!t)return ''; const d=new Date(t); const p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; }
function dropEditor(d){
  const neu=!d; d=d||{titel:'',slug:'',linie:'1896',status:'entwurf',start_at:new Date(Date.now()+14*864e5).toISOString()};
  const f=fenster(`<h2 class="t">${neu?'Neuer Drop':esc(d.titel)}</h2><form class="stack" id="df"><div class="karte form">
    <div class="f2"><div class="feld"><label>Titel</label><input name="titel" value="${esc(d.titel)}" required></div><div class="feld"><label>Adresse (Slug)</label><input name="slug" value="${esc(d.slug)}" pattern="[a-z0-9\-]{2,60}" required></div></div>
    <div class="f2"><div class="feld"><label>Linie</label><select name="linie">${Object.entries(LIN).map(([k,t])=>`<option value="${k}" ${d.linie===k?'selected':''}>${t}</option>`).join('')}</select></div>
      <div class="feld"><label>Status</label><select name="status">${[['entwurf','Entwurf (unsichtbar)'],['geplant','Geplant / live'],['beendet','Beendet']].map(([k,t])=>`<option value="${k}" ${d.status===k?'selected':''}>${t}</option>`).join('')}</select></div></div>
    <div class="f2"><div class="feld"><label>Start</label><input name="start_at" type="datetime-local" value="${lokal(d.start_at)}" required></div><div class="feld"><label>Ende (optional)</label><input name="ende_at" type="datetime-local" value="${lokal(d.ende_at)}"></div></div>
    <div class="feld"><label>Kurztext</label><input name="teaser" value="${esc(d.teaser||'')}" maxlength="300"></div><div class="feld"><label>Text</label><textarea name="text" rows="4" maxlength="3000">${esc(d.text||'')}</textarea></div>
    <div class="feld"><label>Bild</label><input name="bild" value="${esc(d.bild||'')}" placeholder="img/datei.webp oder https://…"></div>
    <p class="hinweis">Produkte kommen über „Produkte“ in den Drop (Feld „Drop“). Bestand pro Größe dort eintragen, der Shop zeigt keine Stückzahlen.</p></div>
    <div id="dFeh"></div><div class="fusszeile"><button type="button" class="btn rand" id="dAbbr">Abbrechen</button><button class="btn hi" type="submit">Speichern</button></div></form>`);
  const fo=$('#df',f); $('#dAbbr',f).onclick=zu;
  if(neu)fo.titel.oninput=()=>{ fo.slug.value=fo.titel.value.toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60); };
  fo.onsubmit=async e=>{ e.preventDefault(); const g=n=>fo[n].value;
    try{ await rpc('shop_bo_drop_speichern',{p:{id:neu?null:d.id,titel:g('titel'),slug:g('slug'),linie:g('linie'),status:g('status'),start_at:new Date(g('start_at')).toISOString(),ende_at:g('ende_at')?new Date(g('ende_at')).toISOString():'',teaser:g('teaser'),text:g('text'),bild:g('bild')}});
      toast('Drop gespeichert'); zu(); A.drops=null; geh('drops'); }catch(x){ $('#dFeh',f).innerHTML=`<div class="hinweis">${esc(x.message)}</div>`; } };
}

/* ---------- Rabattcodes ---------- */
S.rabatte=async m=>{
  const R=await rpc('shop_bo_rabatte');
  m.innerHTML=`<div class="kopfz"><div><h1>Rabattcodes</h1><p>Zum Beispiel für die Jahreshauptversammlung, Mitglieder oder eine Instagram-Aktion.</p></div><button class="btn hi" id="rNeu">+ Neuer Code</button></div>
  <div class="karte"><div class="scroll"><table class="tabelle"><thead><tr><th>Code</th><th>Rabatt</th><th>Gilt für</th><th>Zeitraum</th><th class="r">Genutzt</th><th class="r">Umsatz</th><th>Status</th></tr></thead><tbody>
  ${R.map(r=>`<tr class="klick" data-r="${esc(r.code)}"><td><b class="num">${esc(r.code)}</b>${r.notiz?`<br><small style="color:var(--ink3)">${esc(r.notiz)}</small>`:''}</td><td>${r.typ==='prozent'?r.wert+' %':r.typ==='betrag'?eur(r.wert):'Versand frei'}</td><td>${r.linie?LIN[r.linie]:'alles'}${r.min_wert?' ab '+eur(r.min_wert):''}</td>
    <td>${r.gueltig_von||r.gueltig_bis?`${datum(r.gueltig_von)||'…'} bis ${datum(r.gueltig_bis)||'…'}`:'immer'}</td><td class="r">${r.genutzt}${r.max_nutzungen?' / '+r.max_nutzungen:''}</td><td class="r">${eur(r.umsatz)}</td><td><span class="pill ${r.aktiv?'ok':'aus'}">${r.aktiv?'aktiv':'aus'}</span></td></tr>`).join('')||'<tr><td colspan="7" class="leer">Noch keine Codes</td></tr>'}</tbody></table></div></div>`;
  const ed=r=>{ r=r||{code:'',typ:'prozent',wert:10,aktiv:true,min_wert:0};
    const f=fenster(`<h2 class="t">${r.code?esc(r.code):'Neuer Code'}</h2><form class="stack" id="rf"><div class="karte form">
      <div class="f2"><div class="feld"><label>Code</label><input name="code" value="${esc(r.code)}" ${r.code?'readonly':''} pattern="[A-Za-z0-9\-]{3,30}" required style="text-transform:uppercase"></div>
        <div class="feld"><label>Art</label><select name="typ">${[['prozent','Prozent'],['betrag','Betrag in €'],['versand','Versand kostenlos']].map(([k,t])=>`<option value="${k}" ${r.typ===k?'selected':''}>${t}</option>`).join('')}</select></div>
        <div class="feld"><label>Wert</label><input name="wert" inputmode="decimal" value="${r.typ==='betrag'?zuEur(r.wert):r.wert}"><small>Prozent oder Euro</small></div></div>
      <div class="f2"><div class="feld"><label>Nur für Linie</label><select name="linie"><option value="">alle</option>${Object.entries(LIN).map(([k,t])=>`<option value="${k}" ${r.linie===k?'selected':''}>${t}</option>`).join('')}</select></div>
        <div class="feld"><label>Mindestbestellwert (€)</label><input name="min_wert" inputmode="decimal" value="${zuEur(r.min_wert)}"></div><div class="feld"><label>Höchstens so oft</label><input name="max" type="number" min="1" value="${r.max_nutzungen||''}"></div></div>
      <div class="f2"><div class="feld"><label>Gültig ab</label><input name="von" type="datetime-local" value="${lokal(r.gueltig_von)}"></div><div class="feld"><label>Gültig bis</label><input name="bis" type="datetime-local" value="${lokal(r.gueltig_bis)}"></div></div>
      <div class="feld"><label>Notiz</label><input name="notiz" value="${esc(r.notiz||'')}" maxlength="200"></div><label class="chk"><input type="checkbox" name="aktiv" ${r.aktiv?'checked':''}> aktiv</label></div>
      <div id="rFeh"></div><div class="fusszeile"><button type="button" class="btn rand" id="rAb">Abbrechen</button><button class="btn hi">Speichern</button></div></form>`);
    const fo=$('#rf',f); $('#rAb',f).onclick=zu;
    fo.onsubmit=async e=>{ e.preventDefault(); const typ=fo.typ.value;
      try{ await rpc('shop_bo_rabatt_speichern',{p:{code:fo.code.value.toUpperCase(),typ,wert:typ==='betrag'?cent(fo.wert.value):Math.round(+String(fo.wert.value).replace(',','.')||0),linie:fo.linie.value,min_wert:cent(fo.min_wert.value)||0,
        max_nutzungen:fo.max.value,gueltig_von:fo.von.value?new Date(fo.von.value).toISOString():'',gueltig_bis:fo.bis.value?new Date(fo.bis.value).toISOString():'',aktiv:fo.aktiv.checked,notiz:fo.notiz.value}});
        toast('Gespeichert'); zu(); geh('rabatte'); }catch(x){ $('#rFeh',f).innerHTML=`<div class="hinweis">${esc(x.message)}</div>`; } }; };
  $('#rNeu').onclick=()=>ed(null); $$('[data-r]',m).forEach(t=>t.onclick=()=>ed(R.find(r=>r.code===t.dataset.r)));
};

/* ---------- Kunden ---------- */
S.kunden=async m=>{
  const K=await rpc('shop_bo_kunden');
  m.innerHTML=`<div class="kopfz"><div><h1>Kunden</h1><p>${K.length} Personen haben bestellt · ${K.filter(k=>k.bestellungen>1).length} davon mehrfach</p></div><div class="btnreihe"><input class="suche" id="kS" placeholder="Suchen"><button class="btn rand" id="kCsv">Als Tabelle (CSV)</button></div></div><div class="karte"><div class="scroll" id="kL"></div></div>`;
  const z=q=>{ const L=K.filter(k=>!q||(k.name+' '+k.email).toLowerCase().includes(q.toLowerCase()));
    $('#kL').innerHTML=`<table class="tabelle"><thead><tr><th>Name</th><th>E-Mail</th><th class="r">Bestellungen</th><th class="r">Umsatz</th><th>Linien</th><th>Zuletzt</th></tr></thead><tbody>${L.map(k=>`<tr><td><b>${esc(k.name)}</b></td><td><a href="mailto:${esc(k.email)}">${esc(k.email)}</a></td><td class="r">${k.bestellungen}</td><td class="r"><b>${eur(k.umsatz)}</b></td><td>${[...new Set((k.linien||[]).join(',').split(',').filter(Boolean))].map(l=>`<span class="pill l-${l}">${LIN[l]}</span>`).join(' ')}</td><td>${datum(k.letzte)}</td></tr>`).join('')||'<tr><td colspan="6" class="leer">Noch keine Kunden</td></tr>'}</tbody></table>`; };
  z(''); $('#kS').oninput=e=>z(e.target.value);
  $('#kCsv').onclick=()=>{ const csv='Name;E-Mail;Bestellungen;Umsatz;Zuletzt\n'+K.map(k=>[k.name,k.email,k.bestellungen,(k.umsatz/100).toFixed(2).replace('.',','),datum(k.letzte)].map(x=>`"${String(x).replace(/"/g,'""')}"`).join(';')).join('\n');
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob(['﻿'+csv],{type:'text/csv'})); a.download='store-kunden.csv'; a.click(); };
};

/* ---------- Auswertung ---------- */
S.auswertung=async m=>{
  const [d,alt]=await Promise.all([rpc('shop_bo_analyse',{p_tage:A.tage}),rpc('shop_bo_auswertung',{p_tage:A.tage}).catch(()=>({heatmap_seiten:[]}))]); const k=d.kpi;
  const delta=(a,b)=>{ if(!b)return a?'<em class="d plus">neu</em>':''; const x=Math.round((a-b)/b*100); return `<em class="d ${x>=0?'plus':'minus'}">${x>=0?'+':''}${x} %</em>`; };
  const pr=v=>v==null||isNaN(v)?'–':String(Math.round(v*10)/10).replace('.',',')+' %';
  const conv=k.besuche?k.bestellungen/k.besuche*100:null, convVor=k.besuche_vor?k.bestellungen_vor/k.besuche_vor*100:null;
  const F=d.funnel, stufen=[['Besuche',F.besuche],['Produkt angesehen',F.produkt],['In den Warenkorb',F.warenkorb],['Kasse geöffnet',F.kasse],['Bestellt',F.kauf]];
  const W=['Mo','Di','Mi','Do','Fr','Sa','So'], z=Array.from({length:7},()=>Array(24).fill(0)); (d.zeiten||[]).forEach(([w,h,n])=>{ z[w-1][h]=n; }); const zmax=Math.max(1,...z.flat());
  const kt=Array(7).fill(0); (d.kaufzeiten||[]).forEach(([w,n])=>{ kt[w-1]=n; });
  const QN={direkt:'Direkt / Lesezeichen',app:'App (Homescreen)',newsletter:'Newsletter',whatsapp:'WhatsApp',push:'Push',instagram:'Instagram','instagram.com':'Instagram','facebook.com':'Facebook','google.com':'Google',tiktok:'TikTok'};
  const C=d.community||{}, AP=d.app||{};
  m.innerHTML=`<div class="kopfz"><div><h1>Analyse</h1><p>Ohne Cookies gemessen. ${k.live?`<span class="pill ok">${k.live} gerade im Shop</span>`:''}</p></div>${periode()}</div>
  <div class="raster r4" style="margin-bottom:14px">
    <div class="karte kpi"><small>Umsatz (bezahlt)</small><b>${eur(k.umsatz)}</b><span>${delta(k.umsatz,k.umsatz_vor)} zum Zeitraum davor</span></div>
    <div class="karte kpi"><small>Bestellungen</small><b>${k.bestellungen}</b><span>${delta(k.bestellungen,k.bestellungen_vor)} · ${k.bezahlt} bezahlt</span></div>
    <div class="karte kpi"><small>Conversion</small><b>${pr(conv)}</b><span>${k.besuche} Besuche ${delta(k.besuche,k.besuche_vor)}</span></div>
    <div class="karte kpi"><small>Ø Warenkorb</small><b>${eur(k.warenkorb)}</b><span>${k.teile} Teile verkauft</span></div>
    <div class="karte kpi"><small>Bleibt (netto − EK)</small><b>${eur(k.marge)}</b><span>${k.ohne_ek?`<span class="pill warn">${k.ohne_ek} ohne EK</span>`:'vor Zahlungsgebühren'}</span></div>
    <div class="karte kpi"><small>Kunden</small><b>${k.kunden}</b><span>${k.wiederkehrend} kommen wieder (${pr(k.kunden?k.wiederkehrend/k.kunden*100:null)})</span></div>
    <div class="karte kpi"><small>Community</small><b>${(C.email||0)+(C.whatsapp||0)+(C.push||0)}</b><span>${C.email||0} Mail · ${C.whatsapp||0} WhatsApp · ${C.push||0} Push</span></div>
    <div class="karte kpi"><small>App</small><b>${AP.installiert||0}</b><span>installiert · ${AP.app_starts||0} App-Starts · ${AP.push_an||0}× Push an</span></div></div>
  <div class="raster r2" style="margin-bottom:14px">
    <div class="karte"><h2>Umsatz je Tag</h2>${saeulen(d.reihe,x=>x.umsatz,v=>v>=100000?Math.round(v/100)+' €':eur(v).replace(',00',''),'#1D1D20')}</div>
    <div class="karte"><h2>Besuche je Tag</h2>${saeulen(d.reihe,x=>x.besuche,v=>String(v),'#2B43A8')}</div></div>
  <div class="raster r2" style="margin-bottom:14px">
    <div class="karte"><h2>Vom Besuch zur Bestellung</h2><div class="balken trichter">${stufen.map(([t,n],i)=>`<div class="z"><span>${t}</span><i style="width:${Math.max(2,n/Math.max(1,F.besuche)*100)}%"></i><span>${n}${i?` · ${stufen[i-1][1]?Math.round(n/stufen[i-1][1]*100):0} %`:''}</span></div>`).join('')}</div>
      <p class="tipp">${F.warenkorb&&F.kasse/F.warenkorb<.5?'Viele legen in den Warenkorb, aber nur wenige gehen zur Kasse. Versandkostenfrei und Zahlarten noch deutlicher zeigen.':F.produkt&&F.warenkorb/F.produkt<.08?'Produkte werden angesehen, aber selten in den Warenkorb gelegt. Bilder, Größenhilfe und Preis prüfen.':'Der Weg zur Bestellung sieht gesund aus.'}</p></div>
    <div class="karte"><h2>Woher Besucher und Umsatz kommen</h2><div class="scroll"><table class="tabelle"><thead><tr><th>Kanal</th><th class="r">Besuche</th><th class="r">Best.</th><th class="r">Umsatz</th><th class="r">Conv.</th></tr></thead><tbody>${(d.kanaele||[]).map(q=>`<tr><td><b>${esc(QN[q.quelle]||q.quelle)}</b></td><td class="r">${q.besuche}</td><td class="r">${q.bestellungen}</td><td class="r">${eur(q.umsatz)}</td><td class="r">${q.besuche?pr(q.bestellungen/q.besuche*100):'–'}</td></tr>`).join('')||'<tr><td colspan="5" class="leer">Noch keine Besuche</td></tr>'}</tbody></table></div></div></div>
  <div class="karte" style="margin-bottom:14px"><h2>Kampagnen <small>Newsletter, WhatsApp, Push</small></h2>${(d.kampagnen||[]).length?`<div class="scroll"><table class="tabelle"><thead><tr><th>Kampagne</th><th>Kanäle</th><th class="r">Empfänger</th><th class="r">Klicks</th><th class="r">Best.</th><th class="r">Umsatz</th><th class="r">pro Empfänger</th></tr></thead><tbody>${d.kampagnen.map(x=>`<tr><td><b>${esc(x.titel)}</b><br><small style="color:var(--ink3)">${datum(x.gesendet_at,true)}</small></td><td>${(x.kanaele||[]).map(c=>`<span class="pill">${KN[c]}</span>`).join(' ')}</td><td class="r">${x.empfaenger}</td><td class="r">${x.klicks}${x.empfaenger?` <small>(${pr(x.klicks/x.empfaenger*100)})</small>`:''}</td><td class="r">${x.bestellungen}</td><td class="r"><b>${eur(x.umsatz)}</b></td><td class="r">${x.empfaenger?eur(Math.round(x.umsatz/x.empfaenger)):'–'}</td></tr>`).join('')}</tbody></table></div>`:'<div class="leer">Noch keine Kampagne in diesem Zeitraum. Unter Community schreibst du die erste.</div>'}</div>
  <div class="karte" style="margin-bottom:14px"><h2>Produkte <small>Ansichten, Warenkorb, Verkauf, Marge</small></h2><div class="scroll"><table class="tabelle"><thead><tr><th>Produkt</th><th class="r">Ansichten</th><th class="r">Warenkorb</th><th class="r">Kaufrate</th><th class="r">Stück</th><th class="r">Umsatz</th><th class="r">Bleibt</th></tr></thead><tbody>
    ${(d.produkte||[]).filter(x=>x.ansichten||x.stueck||x.status==='aktiv').map(x=>`<tr><td><b>${esc(x.titel)}</b> <span class="pill l-${x.linie}">${LIN[x.linie]}</span>${x.status!=='aktiv'?' <span class="pill">noch nicht im Verkauf</span>':''}</td><td class="r">${x.ansichten}</td><td class="r">${x.warenkorb}</td><td class="r">${x.ansichten?pr(x.stueck/x.ansichten*100):'–'}</td><td class="r"><b>${x.stueck}</b></td><td class="r">${eur(x.umsatz)}</td><td class="r">${eur(x.marge)}</td></tr>`).join('')||'<tr><td colspan="7" class="leer">Noch keine Daten</td></tr>'}</tbody></table></div>
    <p class="tipp">${(()=>{ const nf=(d.produkte||[]).filter(x=>x.status!=='aktiv'&&x.ansichten>=5).sort((a,b)=>b.ansichten-a.ansichten)[0]; return nf?`<b>${esc(nf.titel)}</b> wurde ${nf.ansichten}-mal angesehen, ist aber noch nicht im Verkauf. Freischalten lohnt sich vielleicht.`:'Produkte, die oft angesehen werden, aber noch nicht im Verkauf sind, tauchen hier als Tipp auf.'; })()}</p></div>
  <div class="raster r2" style="margin-bottom:14px">
    <div class="karte"><h2>Wann im Shop gestöbert wird</h2><div class="zeitgitter">${z.map((r,w)=>`<span class="tg">${W[w]}</span>${r.map((n,h)=>`<i style="opacity:${n?Math.max(.12,n/zmax):.04}" title="${W[w]} ${h} Uhr: ${n}"></i>`).join('')}`).join('')}<span></span>${[0,6,12,18].map(h=>`<span class="hz" style="grid-column:${h+2}">${h}</span>`).join('')}</div>
      <h2 style="margin-top:18px">Bestellungen nach Wochentag</h2>${balken(W.map((t,i)=>({t,n:kt[i]})),x=>x.t,x=>x.n,String)}</div>
    <div class="karte"><h2>Danach wird gesucht</h2>${(d.suche||[]).length?`<table class="tabelle"><tbody>${d.suche.map(x=>`<tr><td><b>${esc(x.begriff)}</b></td><td class="r">${x.n}×</td><td class="r">${x.treffer===0?'<span class="pill warn">nichts gefunden</span>':(x.treffer||0)+' Treffer'}</td></tr>`).join('')}</tbody></table><p class="tipp">Begriffe ohne Treffer zeigen, was Leute bei euch kaufen wollen.</p>`:'<div class="leer">Noch keine Suchen</div>'}
      <h2 style="margin-top:18px">Geräte</h2>${balken(d.geraete||[],x=>({mobil:'Handy',tablet:'Tablet',desktop:'Computer'}[x.geraet]||(x.geraet==='?'||!x.geraet?'Unbekannt':x.geraet)),x=>x.besuche,String)}
      <h2 style="margin-top:18px">Größen</h2>${balken(d.groessen||[],x=>esc(x.groesse),x=>x.stueck,String)}</div></div>
  <div class="raster r2" style="margin-bottom:14px">
    <div class="karte"><h2>Community wächst <small>bestätigte Abonnenten und Push</small></h2>${saeulen(C.reihe||[],x=>x.n,v=>String(v),'#1FAF5A')}<p class="tipp">${C.neu||0} neue im Zeitraum. Unter Community schickst du Neuigkeiten an alle.</p></div>
    <div class="karte"><h2>Meistbesuchte Seiten</h2><table class="tabelle"><tbody>${(d.seiten||[]).map(x=>`<tr><td>${esc(x.pfad)}</td><td class="r">${x.aufrufe}</td></tr>`).join('')||'<tr><td class="leer">Noch keine Aufrufe</td></tr>'}</tbody></table></div></div>
  <div class="karte"><h2>Heatmap <small>wohin geklickt wird</small></h2><div class="btnreihe" style="margin-bottom:12px"><select class="suche" id="hmP">${(alt.heatmap_seiten||[]).map(s=>`<option value="${esc(s.pfad)}">${esc(s.pfad)} (${s.klicks} Klicks)</option>`).join('')||'<option value="/">/</option>'}</select>
    <div class="periode" id="hmG"><button data-g="mobil" class="on">Handy</button><button data-g="desktop">Computer</button></div><button class="btn rand klein" id="hmGo">Anzeigen</button></div><div id="hm"></div></div>`;
  periodeVerdrahten(m,()=>geh('auswertung'));
  let gr='mobil'; $$('#hmG button',m).forEach(b=>b.onclick=()=>{ gr=b.dataset.g; $$('#hmG button',m).forEach(x=>x.classList.toggle('on',x===b)); });
  $('#hmGo',m).onclick=()=>heatmap($('#hmP',m).value,gr);
};
const KN={email:'E-Mail',whatsapp:'WhatsApp',push:'Push'};

/* ---------- Community: Newsletter, WhatsApp, Push ---------- */
S.community=async m=>{
  const [d,cfg]=await Promise.all([rpc('shop_bo_community',{p:{suche:A.csuche||''}}),rpc('shop_bo_einstellungen')]); const Z=d.zahlen; const K=cfg.kanaele||{};
  if(!A.produkte)A.produkte=await rpc('shop_bo_produkte').catch(()=>[]);
  const ziele=[['/','Startseite'],['/mannschaft','Mannschaft'],['/1896','1896'],['/merch','Merch'],['/drops','Drops'],['/dabei','Dabei sein'],...(A.produkte||[]).filter(p=>p.status==='aktiv').map(p=>['/p/'+p.slug,'Produkt: '+p.titel])];
  const bilder=[...new Set((A.produkte||[]).flatMap(p=>p.bilder||[]).filter(b=>/^[a-z0-9-]+$/.test(b)))];
  const entwurf=d.kampagnen.find(k=>k.status==='entwurf'&&k.id===A.kid)||null;
  const k=entwurf||{titel:'',betreff:'',text:'',bild:'',knopf:'Jetzt ansehen',link:'/',kanaele:['email','push']};
  const ST2={offen:['offen','warn'],bestaetigt:['bestätigt','ok'],abgemeldet:['abgemeldet','aus']};
  m.innerHTML=`<div class="kopfz"><div><h1>Community</h1><p>Newsletter, WhatsApp und Push an alle, die dabei sein wollen. Jede Kampagne bekommt ihren eigenen Link, so siehst du Klicks und Umsatz.</p></div><button class="btn rand" data-zu="einstellungen" data-anker="kanaele">Kanäle einrichten</button></div>
  <div class="raster r4" style="margin-bottom:14px">
    <div class="karte kpi"><small>E-Mail</small><b>${Z.email}</b><span>bestätigt · ${Z.email_offen} warten auf Klick</span></div>
    <div class="karte kpi"><small>WhatsApp</small><b>${Z.whatsapp}</b><span>bestätigt · ${Z.whatsapp_offen} offen</span></div>
    <div class="karte kpi"><small>Push</small><b>${Z.push_news}</b><span>für Neuigkeiten · ${Z.push_bestellung} für Bestellstatus</span></div>
    <div class="karte kpi"><small>Neu diese Woche</small><b>${Z.neu_7}</b><span>${Z.abgemeldet_30} Abmeldungen in 30 Tagen</span></div></div>
  ${(()=>{ const meta=(K.anbieter||(K.meta_phone_id?'meta':'superchat'))==='meta'; const fehlt=[!K.wa_nummer&&'die WhatsApp-Nummer des Vereins',meta?!K.meta_phone_id&&'die Meta Phone-Number-ID':!K.sc_channel&&'der Superchat-Kanal',meta?!K.meta_template&&'die freigegebene Vorlage':!K.sc_template&&'die freigegebene Vorlage'].filter(Boolean);
    return fehlt.length?`<div class="hinweis" style="margin-bottom:14px"><b>WhatsApp ist vorbereitet.</b> Zum Verschicken fehlen ${fehlt.join(', ')}. Einrichten unter <a href="#einstellungen">Einstellungen › Kanäle</a>.</div>`:''; })()}
  <div class="raster r2" style="margin-bottom:14px;align-items:start">
    <form class="karte form" id="kf"><h2>${entwurf?'Entwurf bearbeiten':'Neue Kampagne'}</h2>
      <div class="feld"><label>Titel (Überschrift)</label><input name="titel" value="${esc(k.titel)}" maxlength="120" required placeholder="z. B. Das neue Heimtrikot ist da"></div>
      <div class="feld"><label>Betreff der Mail</label><input name="betreff" value="${esc(k.betreff||'')}" maxlength="160" placeholder="Leer = Titel"></div>
      <div class="feld"><label>Text</label><textarea name="text" rows="6" maxlength="4000" placeholder="Kurz und herzlich. Leerzeile = neuer Absatz.">${esc(k.text||'')}</textarea><small><span id="kLen">0</span> Zeichen · WhatsApp und Push zeigen eine Kurzfassung</small></div>
      <div class="f2"><div class="feld"><label>Bild</label><select name="bild"><option value="">kein Bild</option>${bilder.map(b=>`<option ${k.bild===b?'selected':''}>${esc(b)}</option>`).join('')}</select></div>
        <div class="feld"><label>Knopf</label><input name="knopf" value="${esc(k.knopf||'')}" maxlength="60"></div></div>
      <div class="feld"><label>Link führt zu</label><select name="link">${ziele.map(([v,t])=>`<option value="${esc(v)}" ${k.link===v?'selected':''}>${esc(t)}</option>`).join('')}</select></div>
      <div class="feld"><label>Kanäle</label><div class="btnreihe">${[['email','E-Mail',Z.email],['whatsapp','WhatsApp',Z.whatsapp],['push','Push',Z.push_news]].map(([c,t,n])=>`<label class="chk"><input type="checkbox" name="kanal" value="${c}" ${(k.kanaele||[]).includes(c)?'checked':''}> ${t} <small>(${n})</small></label>`).join('')}</div></div>
      <div id="kFeh"></div>
      <div class="btnreihe"><button class="btn rand" type="submit">Speichern</button><button class="btn rand" type="button" id="kVor">Vorschau</button><button class="btn rand" type="button" id="kTest">Testmail an mich</button><button class="btn hi" type="button" id="kSend">Senden …</button>${entwurf?'<button class="btn rand" type="button" id="kNeu">Neu</button>':''}</div><div id="kBox"></div></form>
    <div class="karte"><h2>Vorschau</h2><div id="kVorschau"><div class="leer">Erst speichern, dann „Vorschau“.</div></div></div></div>
  <div class="karte" style="margin-bottom:14px"><h2>Kampagnen</h2>${d.kampagnen.length?`<div class="scroll"><table class="tabelle"><thead><tr><th>Kampagne</th><th>Kanäle</th><th>Status</th><th class="r">Empfänger</th><th class="r">Klicks</th><th class="r">Best.</th><th class="r">Umsatz</th></tr></thead><tbody>${d.kampagnen.map(x=>`<tr class="${x.status==='entwurf'?'klick':''}" data-kid="${x.status==='entwurf'?x.id:''}"><td><b>${esc(x.titel)}</b><br><small style="color:var(--ink3)">${x.gesendet_at?datum(x.gesendet_at,true):'Entwurf vom '+datum(x.created_at,true)}</small></td><td>${(x.kanaele||[]).map(c=>`<span class="pill">${KN[c]}</span>`).join(' ')}</td><td>${x.status==='gesendet'?'<span class="pill ok">gesendet</span>':'<span class="pill">Entwurf</span>'}</td><td class="r">${(x.ergebnis||{}).empfaenger??'–'}</td><td class="r">${x.klicks}</td><td class="r">${x.bestellungen}</td><td class="r"><b>${eur(x.umsatz)}</b></td></tr>`).join('')}</tbody></table></div>`:'<div class="leer">Noch keine Kampagne</div>'}</div>
  <div class="karte"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:10px"><h2 style="margin:0">Abonnenten</h2><div class="btnreihe"><input class="suche" id="aS" placeholder="Suchen" value="${esc(A.csuche||'')}"><button class="btn rand klein" id="aCsv">Als Tabelle (CSV)</button></div></div>
    <div class="scroll"><table class="tabelle"><thead><tr><th>Kontakt</th><th>E-Mail</th><th>WhatsApp</th><th>Interessen</th><th>Seit</th><th></th></tr></thead><tbody>${d.liste.map(a=>`<tr><td><b>${esc(a.vorname||'')}</b> ${esc(a.email||'')}${a.whatsapp?`<br><small>${esc(a.whatsapp)}</small>`:''}</td><td>${a.email_status?`<span class="pill ${ST2[a.email_status][1]}">${ST2[a.email_status][0]}</span>`:''}</td>
      <td>${a.wa_status?`<span class="pill ${ST2[a.wa_status][1]}">${ST2[a.wa_status][0]}</span>${a.wa_status==='offen'?` <small class="mono">${esc(a.wa_code||'')}</small>`:''}`:''}</td><td><small>${esc((a.interessen||[]).join(', '))}</small></td><td><small>${datum(a.am)}</small></td>
      <td class="r">${a.wa_status==='offen'?`<button class="btn rand klein" data-wab="${a.id}">WhatsApp bestätigt</button> `:''}<button class="btn rand klein" data-weg="${a.id}">Entfernen</button></td></tr>`).join('')||'<tr><td colspan="6" class="leer">Noch niemand angemeldet</td></tr>'}</tbody></table></div>
    <p style="font-size:12.5px;color:var(--ink3);margin-top:10px">„WhatsApp bestätigt“ nur drücken, wenn die Nachricht mit dem Code wirklich von dieser Nummer kam. Mit eingerichtetem Webhook (Meta oder Superchat) passiert das automatisch.</p></div>`;
  $$('[data-zu]',m).forEach(b=>b.onclick=()=>{ A.anker=b.dataset.anker||""; geh(b.dataset.zu); });
  const f=$('#kf',m); const len=()=>$('#kLen',m).textContent=f.text.value.length; f.text.oninput=len; len();
  const daten=()=>({id:A.kid||'',titel:f.titel.value,betreff:f.betreff.value,text:f.text.value,bild:f.bild.value,knopf:f.knopf.value,link:f.link.value,kanaele:$$('[name=kanal]:checked',f).map(x=>x.value)});
  const speichern=async()=>{ try{ A.kid=await rpc('shop_bo_kampagne_speichern',{p:daten()}); $('#kFeh',m).innerHTML=''; return A.kid; }catch(x){ $('#kFeh',m).innerHTML=`<div class="hinweis">${esc(x.message)}</div>`; return null; } };
  f.onsubmit=async e=>{ e.preventDefault(); if(await speichern()){ toast('Gespeichert'); geh('community'); } };
  $('#kVor',m).onclick=async()=>{ if(!await speichern())return; const v=await fn('shop-kanaele',{aktion:'vorschau',id:A.kid});
    $('#kVorschau',m).innerHTML=`<div class="vk"><small>E-Mail · Betreff: <b>${esc(v.betreff)}</b></small><iframe class="mailvorschau" sandbox="" srcdoc="${esc(v.html)}"></iframe></div><div class="vk"><small>WhatsApp</small><div class="wa-blase">${esc(v.whatsapp)}</div></div><div class="vk"><small>Push</small><div class="push-blase"><b>${esc(v.push.titel)}</b><span>${esc(v.push.text)}</span></div></div>`; };
  $('#kTest',m).onclick=async e=>{ if(!await speichern())return; const b=e.currentTarget; b.disabled=true; try{ const r=await fn('shop-kanaele',{aktion:'test',id:A.kid}); toast('Testmail an '+r.an); }catch(x){ toast(x.message); } b.disabled=false; };
  $('#kSend',m).onclick=async()=>{ if(!await speichern())return; const ks=daten().kanaele; if(!ks.length){ $('#kFeh',m).innerHTML='<div class="hinweis">Bitte mindestens einen Kanal wählen.</div>'; return; }
    const n={email:Z.email,whatsapp:Z.whatsapp,push:Z.push_news}; const sum=ks.reduce((a,c)=>a+n[c],0);
    $('#kBox',m).innerHTML=`<div class="bestaetigen" style="margin-top:12px"><span>Jetzt an ${sum} Empfänger schicken (${ks.map(c=>KN[c]+' '+n[c]).join(', ')})? Das lässt sich nicht zurückholen.</span><button class="btn hi klein" id="kJa" type="button">Ja, senden</button><button class="btn rand klein" id="kNein" type="button">Doch nicht</button></div>`;
    $('#kNein',m).onclick=()=>$('#kBox',m).innerHTML=''; $('#kJa',m).onclick=async e=>{ e.currentTarget.disabled=true; try{ const r=await fn('shop-kanaele',{aktion:'senden',id:A.kid});
      toast(`Verschickt: ${[r.email&&r.email.ok+' Mails',r.whatsapp&&r.whatsapp.ok+' WhatsApp',r.push&&r.push.ok+' Push'].filter(Boolean).join(', ')}`); A.kid=null; geh('community'); }catch(x){ toast(x.message); $('#kBox',m).innerHTML=''; } }; };
  const nb=$('#kNeu',m); if(nb)nb.onclick=()=>{ A.kid=null; geh('community'); };
  $$('[data-kid]',m).forEach(r=>{ if(r.dataset.kid)r.onclick=()=>{ A.kid=r.dataset.kid; geh('community'); }; });
  let t; $('#aS',m).oninput=e=>{ clearTimeout(t); t=setTimeout(()=>{ A.csuche=e.target.value; geh('community'); },400); };
  $$('[data-wab]',m).forEach(b=>b.onclick=async()=>{ await rpc('shop_bo_abonnent',{p_id:b.dataset.wab,p:{aktion:'wa_bestaetigen'}}); toast('Bestätigt'); geh('community'); });
  $$('[data-weg]',m).forEach(b=>b.onclick=()=>{ b.outerHTML=`<button class="btn weg klein" data-wegja="${b.dataset.weg}">Wirklich entfernen</button>`; $$('[data-wegja]',m).forEach(x=>x.onclick=async()=>{ await rpc('shop_bo_abonnent',{p_id:x.dataset.wegja,p:{aktion:'loeschen'}}); toast('Entfernt'); geh('community'); }); });
  $('#aCsv',m).onclick=()=>{ const csv='Vorname;E-Mail;E-Mail-Status;WhatsApp;WhatsApp-Status;Interessen;Seit\n'+d.liste.map(a=>[a.vorname,a.email,a.email_status,a.whatsapp,a.wa_status,(a.interessen||[]).join(','),datum(a.am)].map(x=>`"${String(x??'').replace(/"/g,'""')}"`).join(';')).join('\n');
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob(['﻿'+csv],{type:'text/csv'})); a.download='store-community.csv'; a.click(); };
};

async function heatmap(pfad,gr){
  const box=$('#hm'); box.innerHTML='<div class="leer">Lade …</div>';
  const pkt=await rpc('shop_bo_heatmap',{p_pfad:pfad,p_geraet:gr==='mobil'?'mobil':'desktop',p_tage:A.tage});
  const W=gr==='mobil'?390:1280; const breite=box.clientWidth||600; const sk=Math.min(1,breite/W);
  box.innerHTML=`<p style="font-size:13px;color:var(--ink3);margin-bottom:8px">${pkt.length} Klicks auf ${esc(pfad)}. Die Seite wird live geladen, ältere Klicks können an Stellen liegen, die sich inzwischen geändert haben.</p><div class="hm-wrap" style="width:${W*sk}px;max-width:100%"><div class="hm-in" style="width:${W}px;transform:scale(${sk})"><iframe src="${BASE}${pfad.replace(/^\//,'')}?heatmap=1" width="${W}" height="1200" title="Seite"></iframe><canvas></canvas></div></div>`;
  const ifr=$('iframe',box), cv=$('canvas',box), inn=$('.hm-in',box), wrap=$('.hm-wrap',box);
  ifr.onload=()=>setTimeout(()=>{ let h=1200; try{ const dd=ifr.contentDocument; h=Math.max(dd.documentElement.scrollHeight,dd.body.scrollHeight); dd.querySelectorAll('.consent').forEach(x=>x.remove()); }catch(e){}
    h=Math.min(h,12000); ifr.height=h; cv.width=W; cv.height=h; cv.style.width=W+'px'; cv.style.height=h+'px'; wrap.style.height=h*sk+'px';
    const c=cv.getContext('2d'); c.globalCompositeOperation='lighter';
    pkt.forEach(([x,y])=>{ const px=x*W, g=c.createRadialGradient(px,y,0,px,y,28); g.addColorStop(0,'rgba(232,116,31,.38)'); g.addColorStop(1,'rgba(232,116,31,0)'); c.fillStyle=g; c.fillRect(px-28,y-28,56,56); });
  },1500);
}

/* ---------- Marketing ---------- */
S.marketing=async m=>{
  if(!A.produkte)A.produkte=await rpc('shop_bo_produkte'); if(!A.drops)A.drops=await rpc('shop_bo_drops');
  const c=await rpc('shop_bo_einstellungen'); const P=c.pixel||{};
  const ziele=[['','Startseite'],['mannschaft','Linie Mannschaft'],['1896','Linie 1896'],['merch','Linie Merch'],...A.drops.map(d=>['drop/'+d.slug,'Drop: '+d.titel]),...A.produkte.filter(p=>p.status==='aktiv').map(p=>['p/'+p.slug,'Produkt: '+p.titel])];
  m.innerHTML=`<div class="kopfz"><div><h1>Marketing</h1><p>Links für Instagram, WhatsApp und Plakate, damit du siehst, was wirklich verkauft.</p></div></div>
  <div class="raster r2"><div class="karte form"><h2>Link-Baukasten</h2>
    <div class="feld"><label>Wohin soll der Link führen?</label><select id="uZ">${ziele.map(([v,t])=>`<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select></div>
    <div class="f2"><div class="feld"><label>Wo wird er gepostet?</label><select id="uQ">${[['instagram','Instagram'],['tiktok','TikTok'],['facebook','Facebook'],['whatsapp','WhatsApp'],['plakat','Plakat / QR-Code'],['newsletter','E-Mail'],['website','Vereinswebsite']].map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select></div>
      <div class="feld"><label>Wie?</label><select id="uM">${[['bio','Link in Bio'],['story','Story'],['post','Post'],['anzeige','Bezahlte Anzeige'],['gruppe','Gruppe / Chat'],['qr','QR-Code']].map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select></div></div>
    <div class="feld"><label>Kampagne</label><input id="uK" placeholder="z. B. drop-02-teaser"><small>Taucht so unter Auswertung → Kampagnen auf.</small></div>
    <div class="feld"><label>Fertiger Link</label><input id="uL" readonly></div><div class="btnreihe"><button class="btn" id="uC">Link kopieren</button></div></div>
  <div class="karte"><h2>Werbe-Pixel</h2><p style="margin-bottom:10px">Die Pixel laden nur, wenn Besucher im Cookie-Banner „Marketing“ erlauben. Ohne eingetragene ID gibt es gar kein Banner.</p>
    <table class="tabelle"><tbody><tr><td>Meta (Facebook, Instagram)</td><td>${P.meta?`<span class="pill ok">${esc(P.meta)}</span>`:'<span class="pill">nicht eingetragen</span>'}</td></tr><tr><td>TikTok</td><td>${P.tiktok?`<span class="pill ok">${esc(P.tiktok)}</span>`:'<span class="pill">nicht eingetragen</span>'}</td></tr><tr><td>Google Analytics</td><td>${P.ga4?`<span class="pill ok">${esc(P.ga4)}</span>`:'<span class="pill">nicht eingetragen</span>'}</td></tr></tbody></table>
    <p style="margin-top:12px"><button class="btn rand klein" data-zu="einstellungen">In den Einstellungen ändern</button></p>
    <h2 style="margin-top:20px">So kommt Instagram-Werbung rein</h2><ol style="padding-left:18px;font-size:14px;color:var(--ink2);display:flex;flex-direction:column;gap:6px"><li>Im Meta-Werbemanager unter „Datenquellen“ ein Pixel anlegen und die Pixel-ID hier eintragen.</li><li>Für jeden Post oder jede Anzeige einen Link mit dem Baukasten bauen.</li><li>Unter Auswertung siehst du Besuche, Bestellungen und Umsatz je Quelle und Kampagne.</li></ol></div></div>`;
  const bau=()=>{ const u=new URL(location.origin+BASE+$('#uZ').value); u.searchParams.set('utm_source',$('#uQ').value); u.searchParams.set('utm_medium',$('#uM').value); const k=$('#uK').value.trim().toLowerCase().replace(/[^a-z0-9-]+/g,'-'); if(k)u.searchParams.set('utm_campaign',k); $('#uL').value=u.toString(); };
  ['#uZ','#uQ','#uM','#uK'].forEach(s=>$(s).oninput=$(s).onchange=bau); bau(); $('#uC').onclick=()=>kopie($('#uL').value);
  $$('[data-zu]',m).forEach(b=>b.onclick=()=>geh(b.dataset.zu));
};

/* ---------- Agenten ---------- */
const AG=[
  ['erinnerung','Zahlungs-Erinnerer','Erinnert Kunden einmal freundlich, wenn die Überweisung nach ein paar Tagen noch fehlt. Mit Bankdaten und Frist.',[['erinnerung_tage','nach Tagen',1,7]]],
  ['versand','Versand-Info','Sobald eine Bestellung auf „versendet“ steht, bekommt der Kunde eine Mail, mit Sendungsnummer, wenn eingetragen.',[]],
  ['nachhaken','Partner-Nachhaker','Meldet sich bei dir, wenn der Partner eine Sammelbestellung nicht bestätigt, die Lieferung hängt oder eine Rechnung offen ist. Schreibt nie selbst an den Partner.',[['nachhaken_tage','unbestätigt nach Tagen',1,7],['lieferung_tage','Lieferung prüfen nach Tagen',7,40],['rechnung_tage','Rechnung offen nach Tagen',3,30]]],
  ['waechter','Wächter','Prüft stündlich: Mails, die nicht rausgingen, Sammelmail-Fehler, Produkte ohne EK, Freitags-Mail aus obwohl Bestellungen warten, fehlende IBAN, hängende Online-Zahlung. Jeder Punkt kommt höchstens alle drei Tage.',[]],
  ['bericht','Montagsbericht','Jeden Montag die Zahlen der Woche: Bestellungen, Umsatz, Teile, Einkauf, was übrig bleibt, was offen ist.',[['bericht_stunde','Uhrzeit',5,12]]],
  ['wetter','Wetter & Saison','Holt alle drei Stunden das Wetter für Mörlenbach vom Deutschen Wetterdienst. Ist es kalt, stehen Hoodies, Schals und Mützen vorne, ist es warm, Shirts, Caps und Trikots. Schreibt den Wetter-Bereich auf der Startseite.',[]],
  ['tagesdeal','Glockenschlag','Schlägt jeden Abend den Artikel des Tages für morgen vor. Der Rabatt fällt nie unter Einkauf plus Marge. Live geht er erst, wenn du freigibst. Morgens Push an alle, die Push an haben.',[]],
  ['kampagnen','Kampagnen-Team','Plant Drops und Aktionen: Anlässe im Jahr, Saisonwechsel, zu lange Drop-Pause, Ladenhüter. Meldet sich morgens um 9 mit fertigem Vorschlag, Zeitplan und Texten.',[]],
  ['seo','SEO-Agent','Prüft jede Woche die Live-Seite für Google (Titel, Beschreibungen, Produktdaten, Sitemap) und liest die Google Search Console, sobald sie verbunden ist.',[['seo_tag','Wochentag (1 = Montag)',1,7]]],
];
const AGN={erinnerung:'Zahlungs-Erinnerer',versand:'Versand-Info',hinweise:'Wächter & Nachhaker',bericht:'Montagsbericht',wetter:'Wetter & Saison',tagesdeal:'Glockenschlag-Vorschlag',glockenschlag:'Glockenschlag-Push',kampagnen:'Kampagnen-Team',seo:'SEO-Agent',push:'Push zur Bestellung'};
const agWas=(k,e)=>{ e=e||{}; if(e.fehler&&e.ok===false)return 'Fehler: '+esc(e.fehler);
  if(k==='wetter')return e.tmax!=null?`${e.tmax}° / ${e.tmin}°, ${e.fokus==='kalt'?'Winter vorne':'Sommer vorne'}${e.gewechselt?' · gewechselt '+esc(e.gewechselt):''}`:'aktuell';
  if(k==='tagesdeal')return e.produkt?`${esc(e.produkt)} −${e.rabatt} % für ${esc(e.datum)}${e.gemeldet?' · gemeldet':''}`:esc(e.grund||'nichts zu tun');
  if(k==='glockenschlag')return e.geraete!=null?`Push an ${e.geraete} Gerät${e.geraete===1?'':'e'}`:'nichts zu tun';
  if(k==='kampagnen')return e.neu?`${e.neu} Idee${e.neu>1?'n':''}: ${esc((e.titel||[]).join(' · '))}`:'keine neue Idee';
  if(k==='seo')return `${e.seiten||0} Seiten geprüft, ${e.wichtig||0} wichtige Punkte${e.google?' · Google gelesen':''}`;
  if(k==='push')return `${(e.geschickt||[]).length} Push`;
  return ''; };
const agentenBasis=async m=>{
  const d=await rpc('shop_bo_agenten'); const A=Object.assign({aktiv:true},d.agenten||{}); const c=await rpc('shop_bo_einstellungen'); const darf=c._darf_aendern; const ro=darf?'':'disabled';
  const zuletzt=k=>{ const x=(d.letzte||{})[k]; if(!x)return '<span style="color:var(--ink3)">noch nicht gelaufen</span>'; const e=x.ergebnis||{};
    const was=k==='erinnerung'||k==='versand'?((e.geschickt||[]).length?`${e.geschickt.length} Mail${e.geschickt.length>1?'s':''}: ${esc(e.geschickt.join(', '))}`:'nichts zu tun'):k==='bericht'?(e.ok?'verschickt':'nicht verschickt'+(e.fehler?' ('+esc(e.fehler)+')':'')):agWas(k,e); return `${datum(x.at,true)}${was?' · '+was:''}`; };
  m.innerHTML=`<div class="kopfz"><div><h1>Shop-Agenten</h1><p>Kümmern sich rund um die Uhr um den Shop. Laufen auf eurem Supabase, ohne KI, kosten nichts. Meldungen gehen an <b>${esc(d.melden_an||'niemanden, bitte Adresse eintragen')}</b>.</p></div>
    <div class="btnreihe"><button class="btn rand" id="agLauf">Jetzt laufen lassen</button><button class="btn rand" id="agBer">Wochenbericht jetzt</button></div></div>
  <form class="stack" id="agF" style="max-width:980px">
  <div class="karte form"><div class="f2"><label class="chk" style="font-weight:700"><input type="checkbox" name="aktiv" ${A.aktiv!==false?'checked':''} ${ro}> Agenten laufen (stündlich)</label><div class="feld"><label>Meldungen und Bericht an</label><input name="melden_an" type="email" value="${esc(A.melden_an||'')}" placeholder="${esc((c.verkaeufer||{}).email||'')}" ${ro}><small>Leer = Verkäufer-Adresse aus den Einstellungen</small></div></div></div>
  <div class="raster r2">${AG.map(([k,t,txt,par])=>`<div class="karte form" style="align-content:start"><div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><h2 style="margin:0">${t}</h2><label class="chk"><input type="checkbox" name="${k}" ${A[k]!==false?'checked':''} ${ro}> an</label></div>
    <p style="font-size:13.5px;color:var(--ink2)">${txt}</p>${par.length?`<div class="f2">${par.map(([pk,pl,mi,ma])=>`<div class="feld"><label>${pl}</label><input name="${pk}" type="number" min="${mi}" max="${ma}" value="${A[pk]??''}" ${ro}></div>`).join('')}</div>`:''}
    <small style="color:var(--ink3)">Zuletzt: ${zuletzt(k==='nachhaken'||k==='waechter'?'hinweise':k)}</small></div>`).join('')}
    <div class="karte" style="align-content:start"><h2 style="margin:0 0 6px">KI-Shop-Coach</h2><p style="font-size:13.5px;color:var(--ink2)">Läuft jeden Montag als geplante Aufgabe in Claude über dein Abo, ohne Extrakosten. Liest die Zahlen der Woche (ohne Kundendaten), schreibt eine kurze Analyse mit drei konkreten Tipps und drei Instagram-Posts als Entwurf. Gepostet wird nichts automatisch.</p><small style="color:var(--ink3)">Einstellen und pausieren in der Claude-App unter geplante Aufgaben.</small></div></div>
  <div id="agFeh"></div>${darf?'<div class="btnreihe"><button class="btn hi">Speichern</button></div>':''}</form>
  <div class="karte" style="margin-top:14px"><h2>Protokoll</h2><div class="scroll">${(d.protokoll||[]).length?`<table class="tabelle"><tbody>${d.protokoll.map(x=>{ const e=x.ergebnis||{}; const t=AGN[x.agent]||x.agent;
      const was=x.agent==='hinweise'?`${e.anzahl} Hinweis${e.anzahl===1?'':'e'}, ${e.neu} neu${e.gemeldet?' · gemeldet':''}${e.fehler?' · '+esc(e.fehler):''}`:x.agent==='bericht'?(e.ok?`verschickt an ${esc(e.an||'')}`:'nicht verschickt'):['erinnerung','versand'].includes(x.agent)?`${(e.geschickt||[]).length} Mail${(e.geschickt||[]).length===1?'':'s'} ${esc((e.geschickt||[]).join(', '))}`:agWas(x.agent,e);
      return `<tr><td style="white-space:nowrap">${datum(x.at,true)}</td><td><b>${t}</b></td><td>${was}</td><td><small style="color:var(--ink3)">${esc(e.wer||'')}</small></td></tr>`; }).join('')}</tbody></table>`:'<div class="leer">Noch nichts passiert</div>'}</div></div>`;
  const los=async(body,b)=>{ b.disabled=true; const t=b.textContent; b.textContent='Läuft …'; try{ const r=await fn('shop-agenten',body); const n=[r.erinnerung&&r.erinnerung.geschickt.length?r.erinnerung.geschickt.length+' Erinnerungen':'',r.versand&&r.versand.geschickt.length?r.versand.geschickt.length+' Versandinfos':'',r.hinweise?r.hinweise.alle+' Hinweise':'',r.bericht?'Bericht '+(r.bericht.ok?'verschickt':'nicht verschickt'):''].filter(Boolean).join(' · '); toast(n||'Alles erledigt, nichts zu tun'); geh('agenten'); }catch(e){ toast(e.message); b.disabled=false; b.textContent=t; } };
  $('#agLauf',m).onclick=e=>los({aktion:'lauf'},e.currentTarget); $('#agBer',m).onclick=e=>los({aktion:'bericht',nur:'bericht'},e.currentTarget);
  if(!darf)return;
  $('#agF',m).onsubmit=async e=>{ e.preventDefault(); const f=e.target; const neuA=Object.assign({},A,{aktiv:f.aktiv.checked,melden_an:f.melden_an.value.trim().toLowerCase()});
    AG.forEach(([k,,,par])=>{ neuA[k]=f[k].checked; par.forEach(([pk])=>{ const v=+f[pk].value; if(v)neuA[pk]=v; }); });
    try{ await rpc('shop_bo_einstellungen_speichern',{p:{agenten:neuA}}); toast('Gespeichert'); geh('agenten'); }catch(x){ $('#agFeh',m).innerHTML=`<div class="hinweis">${esc(x.message)}</div>`; } };
};


/* ---------- Vorschläge: Postfach der Agenten, Glockenschlag freigeben ---------- */
const VART={box:['Mystery Box','box'],tagesdeal:['Glockenschlag','glocke'],drop:['Drop-Idee','drop2'],kampagne:['Kampagne','kamp'],saison:['Saison','saison'],seo:['SEO','seo'],hinweis:['Hinweis','idee']};
const tagLang=d=>new Date(d+'T12:00:00Z').toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'});
async function vBadge(){ try{ const d=await rpc('shop_bo_vorschlaege'); const n=d.neu.length; const e=$('#vBadge'); if(e){ e.textContent=n; e.hidden=!n; } return d; }catch(e){ return null; } }
S.vorschlaege=async m=>{
  const [d,cfg]=await Promise.all([rpc('shop_bo_vorschlaege'),rpc('shop_bo_einstellungen')]); const e=$('#vBadge'); if(e){ e.textContent=d.neu.length; e.hidden=!d.neu.length; }
  if(!A.produkte)A.produkte=await rpc('shop_bo_produkte').catch(()=>[]);
  const T=Object.assign({name:'Glockenschlag',max_rabatt:25,min_marge:10,stunde:17,bekanntgeben:true,aktiv:true},cfg.tagesdeal||{}); const st=d.stimmung||null;
  const aktiv=(A.produkte||[]).filter(p=>p.status==='aktiv'&&p.slug!=='gutschein');
  const kommend=d.tagesdeals.filter(t=>t.datum>=d.heute).sort((a,b)=>a.datum<b.datum?-1:1); const alt=d.tagesdeals.filter(t=>t.datum<d.heute);
  const heute=kommend.find(t=>t.datum===d.heute&&t.status==='freigegeben');
  const STD={vorschlag:['wartet auf dich','warn'],freigegeben:['freigegeben','ok'],abgelehnt:['abgelehnt','aus']};
  const rab=t=>Array.from({length:10},(_,i)=>(i+1)*5).map(r=>`<option value="${r}" ${t.rabatt===r?'selected':''}>${r} %</option>`).join('');
  const dealKarte=t=>`<form class="karte form deal ${t.status}" data-deal="${t.id}"><div class="deal-kopf">${t.produkt.bild?`<img src="${klein(t.produkt.bild)}" alt="">`:''}<div><small>${t.datum===d.heute?'Heute':tagLang(t.datum)} · von ${esc(t.von||'Agent')}</small><b>${esc(t.produkt.titel)}</b>
      <span class="deal-preis">${eur(t.neu_preis)} <s>${eur(t.produkt.preis)}</s> <em>−${t.rabatt} %</em>${t.produkt.einkauf!=null?` <small>EK ${eur(t.produkt.einkauf)}, bleibt ${eur(t.neu_preis-t.produkt.einkauf)}</small>`:''}</span></div><span class="pill ${STD[t.status][1]}">${STD[t.status][0]}</span></div>
    ${t.grund?`<p class="deal-grund">${I.idee}<span>${esc(t.grund)}</span></p>`:''}
    ${t.status!=='freigegeben'||t.datum>d.heute?`<div class="f2"><div class="feld"><label>Artikel</label><select name="produkt">${aktiv.map(p=>`<option value="${p.slug}" ${p.slug===t.produkt.slug?'selected':''}>${esc(p.titel)} · ${eur(p.preis)}</option>`).join('')}</select></div><div class="feld"><label>Rabatt</label><select name="rabatt">${rab(t)}</select></div></div>
    <div class="feld"><label>Text (Startseite und Push)</label><textarea name="text" rows="2" maxlength="600">${esc(t.text||'')}</textarea></div>
    <label class="chk"><input type="checkbox" name="bekanntgeben" ${t.bekanntgeben?'checked':''}> Morgens Push an alle mit „Neuigkeiten“</label>
    <div class="btnreihe">${t.status!=='freigegeben'?'<button class="btn ok" data-a="freigeben">Freigeben</button>':''}<button class="btn rand" data-a="speichern">Speichern</button>${t.status!=='abgelehnt'?'<button class="btn weg" data-a="ablehnen">Ablehnen</button>':''}</div><div class="dfeh"></div>`
      :`<p style="font-size:13.5px;color:var(--ink2)">${esc(t.text||'')}</p><p style="font-size:13px;color:var(--ink3)">Freigegeben von ${esc(t.freigegeben_von||'')} · ${t.bestellungen} Bestellung${t.bestellungen===1?'':'en'} heute${t.bekanntgeben?' · Push morgens':''}</p>`}</form>`;
  const ideen=d.neu.filter(v=>v.art!=='tagesdeal');
  m.innerHTML=`<div class="kopfz"><div><h1>Vorschläge</h1><p>Die Agenten melden sich hier mit Ideen. Live geht nichts ohne dich.</p></div>
    <div class="btnreihe"><button class="btn rand" id="vDeal">${I.glocke} Vorschlag für morgen</button><button class="btn rand" id="vKamp">${I.idee} Kampagnen-Team fragen</button></div></div>
  <div class="raster r3 heute-bo" style="margin-bottom:14px">
    <div class="karte kpi"><small>${esc(T.name)} heute</small>${heute?`<b style="font-size:24px">${esc(heute.produkt.titel)}</b><span>−${heute.rabatt} % · ${eur(heute.neu_preis)} · ${heute.bestellungen} Bestellung${heute.bestellungen===1?'':'en'}</span>`:'<b style="font-size:24px">keiner</b><span>Heute kein Artikel des Tages</span>'}</div>
    <div class="karte kpi wetter-bo"><small>Wetter in Mörlenbach</small>${st?`<b>${I.wetter}${st.tmax}° <span style="font-size:15px;color:var(--ink3)">/ ${st.tmin}°</span></b><span>${esc(st.titel||'')} Startseite zeigt ${st.fokus==='kalt'?'Hoodies, Schals, Mützen':'Shirts, Caps, Trikots'} vorne.</span>`:'<b>–</b><span>Noch kein Wetter geholt</span>'}<button class="btn rand klein" id="vWetter" style="justify-self:start;margin-top:6px">Jetzt aktualisieren</button></div>
    <div class="karte kpi"><small>Offene Ideen</small><b>${ideen.length}</b><span>${ideen.length?'Unten ansehen, übernehmen oder verwerfen':'Alles erledigt'}</span></div></div>
  <div class="karte" style="margin-bottom:14px"><h2>${I.glocke} ${esc(T.name)} <small>Artikel des Tages, gilt bis Mitternacht</small></h2>
    ${kommend.length?`<div class="deals">${kommend.map(dealKarte).join('')}</div>`:`<div class="leer">Noch nichts geplant. Der Agent schlägt jeden Abend um ${T.stunde} Uhr etwas für den nächsten Tag vor.</div>`}
    <details class="eigen"><summary>${I.drop} Selbst planen</summary><form class="form" id="dNeu"><div class="f2"><div class="feld"><label>Tag</label><input type="date" name="datum" min="${d.heute}" value="${d.heute}" required></div>
      <div class="feld"><label>Artikel</label><select name="produkt">${aktiv.map(p=>`<option value="${p.slug}">${esc(p.titel)} · ${eur(p.preis)}</option>`).join('')}</select></div><div class="feld"><label>Rabatt</label><select name="rabatt">${rab({rabatt:20})}</select></div></div>
      <div class="feld"><label>Text</label><textarea name="text" rows="2" maxlength="600" placeholder="Leer = Standardtext"></textarea></div><div class="btnreihe"><button class="btn hi">Anlegen</button></div><div id="dNeuFeh"></div></form></details>
    ${alt.length?`<details class="eigen"><summary>Letzte Tage</summary><div class="scroll"><table class="tabelle"><tbody>${alt.map(t=>`<tr><td>${datum(t.datum)}</td><td><b>${esc(t.produkt.titel)}</b></td><td>−${t.rabatt} %</td><td><span class="pill ${STD[t.status][1]}">${STD[t.status][0]}</span></td><td class="r">${t.bestellungen} Best.</td></tr>`).join('')}</tbody></table></div></details>`:''}
    <details class="eigen"><summary>${I.einst} Einstellungen</summary><form class="form" id="dCfg"><div class="f2"><label class="chk" style="font-weight:700"><input type="checkbox" name="aktiv" ${T.aktiv!==false?'checked':''}> Agent schlägt jeden Abend vor</label><label class="chk"><input type="checkbox" name="bekanntgeben" ${T.bekanntgeben!==false?'checked':''}> Push standardmäßig an</label></div>
      <div class="f2"><div class="feld"><label>Name der Aktion</label><input name="name" value="${esc(T.name)}" maxlength="30"></div><div class="feld"><label>Vorschlag um</label><select name="stunde">${[15,16,17,18,19,20].map(h=>`<option value="${h}" ${+T.stunde===h?'selected':''}>${h}:00 Uhr</option>`).join('')}</select></div>
      <div class="feld"><label>Höchstens Rabatt ohne EK</label><select name="max_rabatt">${[10,15,20,25,30].map(r=>`<option value="${r}" ${+T.max_rabatt===r?'selected':''}>${r} %</option>`).join('')}</select></div><div class="feld"><label>Mindestmarge über EK</label><select name="min_marge">${[0,5,10,15,20,25].map(r=>`<option value="${r}" ${+T.min_marge===r?'selected':''}>${r} %</option>`).join('')}</select></div></div>
      <div class="btnreihe"><button class="btn hi">Speichern</button></div></form></details></div>
  <div class="karte" style="margin-bottom:14px"><h2>${I.idee} Ideen der Agenten <small>${ideen.length} offen</small></h2>
    ${ideen.length?`<div class="ideen">${ideen.map(v=>`<article class="idee prio${v.prio}" data-v="${v.id}"><div class="idee-kopf"><span class="idee-ic">${I[(VART[v.art]||VART.hinweis)[1]]}</span><div><small>${(VART[v.art]||VART.hinweis)[0]} · ${datum(v.created_at,true)}</small><b>${esc(v.titel)}</b></div></div>
      <div class="idee-text">${esc(v.text||'')}</div><div class="btnreihe">${v.art==='box'?'<button class="btn hi klein" data-vbox>Box anlegen</button>':''}${['drop','saison','kampagne'].includes(v.art)?'<button class="btn hi klein" data-va="kampagne">Als Kampagne entwerfen</button>':''}<button class="btn rand klein" data-va="erledigt">Erledigt</button><button class="btn weg klein" data-va="verworfen">Verwerfen</button></div></article>`).join('')}</div>`:'<div class="leer">Keine offenen Ideen. Das Kampagnen-Team meldet sich, sobald ein Anlass naht.</div>'}
    ${d.erledigt.length?`<details class="eigen"><summary>Erledigt und verworfen</summary><div class="scroll"><table class="tabelle"><tbody>${d.erledigt.map(v=>`<tr><td>${datum(v.erledigt_at||v.created_at)}</td><td><b>${esc(v.titel)}</b></td><td><span class="pill ${v.status==='erledigt'?'ok':'aus'}">${v.status}</span></td><td><small>${esc(v.erledigt_von||'')}</small></td><td><button class="btn rand klein" data-wieder="${v.id}">zurückholen</button></td></tr>`).join('')}</tbody></table></div></details>`:''}</div>`;
  const agent=async(body,b,txt)=>{ b.disabled=true; try{ const r=await fn('shop-agenten',body); toast(txt(r)); geh('vorschlaege'); }catch(x){ toast(x.message); b.disabled=false; } };
  $('#vDeal',m).onclick=e=>agent({aktion:'tagesdeal',nur:['tagesdeal']},e.currentTarget,r=>r.tagesdeal&&r.tagesdeal.produkt?`Vorschlag: ${r.tagesdeal.produkt} −${r.tagesdeal.rabatt} %`:'Für morgen ist schon etwas geplant');
  $('#vKamp',m).onclick=e=>agent({aktion:'kampagnen',nur:['kampagnen']},e.currentTarget,r=>r.kampagnen&&r.kampagnen.neu?`${r.kampagnen.neu} neue Idee${r.kampagnen.neu>1?'n':''}`:'Gerade keine neue Idee');
  $('#vWetter',m).onclick=e=>agent({aktion:'wetter',nur:['wetter']},e.currentTarget,r=>r.wetter&&r.wetter.ok?`${r.wetter.tmax}° in Mörlenbach, ${r.wetter.fokus==='kalt'?'Winter':'Sommer'} vorne`:'Wetter gerade nicht erreichbar');
  $$('form.deal',m).forEach(f=>f.onsubmit=e=>e.preventDefault());
  $$('form.deal [data-a]',m).forEach(b=>b.onclick=async e=>{ e.preventDefault(); const f=b.closest('form'); const a=b.dataset.a; b.disabled=true;
    const p={id:f.dataset.deal,aktion:a}; if(f.produkt){ p.produkt=f.produkt.value; p.rabatt=+f.rabatt.value; p.text=f.text.value; p.bekanntgeben=f.bekanntgeben.checked; }
    try{ await rpc('shop_bo_tagesdeal',{p}); toast(a==='freigeben'?'Freigegeben. Geht pünktlich live.':a==='ablehnen'?'Abgelehnt':'Gespeichert'); geh('vorschlaege'); }catch(x){ $('.dfeh',f).innerHTML=`<div class="hinweis">${esc(x.message)}</div>`; b.disabled=false; } });
  $('#dNeu',m).onsubmit=async e=>{ e.preventDefault(); const f=e.target; const pr=aktiv.find(x=>x.slug===f.produkt.value);
    const text=f.text.value.trim()||`${pr?pr.titel:'Ein Lieblingsteil'} nur heute ${f.rabatt.value} % günstiger. Bis Mitternacht.`;
    try{ await rpc('shop_bo_tagesdeal',{p:{datum:f.datum.value,produkt:f.produkt.value,rabatt:+f.rabatt.value,text,titel:`${T.name}: ${f.rabatt.value} % auf ${pr?pr.titel:''}`,bekanntgeben:T.bekanntgeben!==false}}); toast('Angelegt. Jetzt noch freigeben.'); geh('vorschlaege'); }
    catch(x){ $('#dNeuFeh',m).innerHTML=`<div class="hinweis">${esc(x.message)}</div>`; } };
  $('#dCfg',m).onsubmit=async e=>{ e.preventDefault(); const f=e.target;
    try{ await rpc('shop_bo_einstellungen_speichern',{p:{tagesdeal:Object.assign({},cfg.tagesdeal||{},{aktiv:f.aktiv.checked,bekanntgeben:f.bekanntgeben.checked,name:f.name.value.trim()||'Glockenschlag',stunde:+f.stunde.value,max_rabatt:+f.max_rabatt.value,min_marge:+f.min_marge.value})}}); toast('Gespeichert'); geh('vorschlaege'); }
    catch(x){ toast(x.message); } };
  $$('[data-vbox]',m).forEach(b=>b.onclick=async()=>{ const v=ideen.find(x=>x.id===b.closest('[data-v]').dataset.v); A.boxVorlage=v.daten||{}; A.aktTab='boxen'; A.akt=null; await geh('aktionen'); });
  $$('[data-va]',m).forEach(b=>b.onclick=async()=>{ const id=b.closest('[data-v]').dataset.v; const v=ideen.find(x=>x.id===id); b.disabled=true;
    try{
      if(b.dataset.va==='kampagne'){ const tx=(v.daten&&v.daten.texte)||{}; const art=(v.daten&&v.daten.artikel)||[];
        A.kid=await rpc('shop_bo_kampagne_speichern',{p:{titel:v.titel.replace(/^.*?Idee „(.+)“$/,'$1').slice(0,120),betreff:v.titel.slice(0,160),text:tx.kurz||v.text.split('\n')[0],knopf:'Jetzt ansehen',link:art.length===1?'/p/'+art[0]:'/',kanaele:['email','push']}});
        await rpc('shop_bo_vorschlag',{p_id:id,p:{aktion:'erledigt'}}); toast('Kampagnen-Entwurf angelegt'); geh('community'); return; }
      await rpc('shop_bo_vorschlag',{p_id:id,p:{aktion:b.dataset.va}}); toast(b.dataset.va==='erledigt'?'Erledigt':'Verworfen'); geh('vorschlaege');
    }catch(x){ toast(x.message); b.disabled=false; } });
  $$('[data-wieder]',m).forEach(b=>b.onclick=async()=>{ await rpc('shop_bo_vorschlag',{p_id:b.dataset.wieder,p:{aktion:'neu'}}); geh('vorschlaege'); });
};

/* ---------- Agenten: Anlässe und Google ---------- */
const ANL=[['fastnacht','Fastnacht'],['ostern','Ostern'],['muttertag','Muttertag'],['vatertag','Vatertag'],['sommer','Sommeranfang'],['saisonstart','Saisonstart (Mitte August)'],['blackfriday','Black Friday'],['weihnachten','Weihnachten']];
async function agentenExtra(m){
  const [c,seo]=await Promise.all([rpc('shop_bo_einstellungen'),rpc('shop_bo_seo').catch(()=>({}))]); const darf=c._darf_aendern; const ro=darf?'':'disabled';
  const AN=Object.assign({aus:[],eigene:[]},c.anlaesse||{}); const S2=Object.assign({keywords:[],gsc_site:'sc-domain:1896shop.de'},c.seo||{}); const g=(seo.google||[])[0];
  const zeile=(e,i)=>`<div class="f2 anl-zeile"><div class="feld"><label>Anlass</label><input name="en${i}" value="${esc(e.name||'')}" maxlength="60" placeholder="z. B. Kerwe" ${ro}></div><div class="feld"><label>Datum (TT.MM.)</label><input name="ed${i}" value="${e.datum?esc(e.datum.split('-').reverse().join('.')):''}" placeholder="24.08." ${ro}></div><div class="feld"><label>Vorlauf (Tage)</label><input name="ev${i}" type="number" min="7" max="60" value="${e.vorlauf||21}" ${ro}></div></div>`;
  m.insertAdjacentHTML('beforeend',`<div class="raster r2" style="margin-top:14px;align-items:start">
    <form class="karte form" id="anF"><h2>${I.idee} Anlässe fürs Kampagnen-Team</h2><p style="font-size:13.5px;color:var(--ink2)">Rechtzeitig vor jedem Anlass kommt ein fertiger Vorschlag mit Zeitplan und Texten. Abwählen, was nicht passt, und eigene Termine ergänzen (Kerwe, Sportfest, Jubiläum).</p>
      <div class="chips-w">${ANL.map(([k,t])=>`<label class="chk"><input type="checkbox" name="a_${k}" ${AN.aus.includes(k)?'':'checked'} ${ro}> ${t}</label>`).join('')}</div>
      <div id="anE">${[...AN.eigene,{}].map(zeile).join('')}</div>${darf?'<div class="btnreihe"><button class="btn hi">Anlässe speichern</button></div>':''}<div id="anFeh"></div></form>
    <form class="karte form" id="seoF"><h2>${I.seo} Google <small>${g?'verbunden':'noch nicht verbunden'}</small></h2>
      ${g?`<div class="raster r3"><div class="kpi"><small>Klicks</small><b>${g.daten.klicks}</b></div><div class="kpi"><small>Gesehen</small><b>${g.daten.impressionen}</b></div><div class="kpi"><small>Ø Platz</small><b>${g.daten.position}</b></div></div>`
        :`<p style="font-size:13.5px;color:var(--ink2)">So siehst du, bei welchen Suchen der Store auftaucht: 1896shop.de in der <b>Google Search Console</b> anlegen (Domain-Eigenschaft, TXT-Eintrag beim Domain-Anbieter), dann in der Google Cloud ein Dienstkonto mit JSON-Schlüssel erstellen, die Search Console API aktivieren und das Dienstkonto in der Search Console als Nutzer hinzufügen. Den JSON-Schlüssel in Supabase unter Edge Functions › Secrets als <code>GSC_SERVICE_ACCOUNT</code> speichern. Ab dann liest der SEO-Agent jede Woche mit.</p>`}
      <div class="feld"><label>Suchbegriffe, die beobachtet werden (einer pro Zeile)</label><textarea name="kw" rows="5" ${ro}>${esc((S2.keywords||[]).join('\n'))}</textarea></div>
      <div class="feld"><label>Search-Console-Eigenschaft</label><input name="site" value="${esc(S2.gsc_site||'')}" ${ro}></div>
      ${seo.pruefung?`<p style="font-size:13px;color:var(--ink3)">Letzte Prüfung ${datum(seo.pruefung.at,true)}: ${seo.pruefung.daten.seiten} Seiten, ${(seo.pruefung.daten.probleme||[]).length} Hinweise</p>`:''}
      <div class="btnreihe">${darf?'<button class="btn hi">Speichern</button>':''}<button type="button" class="btn rand" id="seoLos">SEO-Prüfung jetzt</button></div></form></div>`);
  $('#seoLos',m).onclick=async e=>{ const b=e.currentTarget; b.disabled=true; b.textContent='Prüft …'; try{ const r=await fn('shop-agenten',{aktion:'seo',nur:['seo']}); toast(`${r.seo.seiten} Seiten geprüft, ${r.seo.wichtig} wichtige Punkte`); geh('agenten'); }catch(x){ toast(x.message); b.disabled=false; } };
  if(!darf)return;
  $('#anF',m).onsubmit=async e=>{ e.preventDefault(); const f=e.target; const eigene=[];
    for(let i=0;f['en'+i];i++){ const n=f['en'+i].value.trim(); const dm=f['ed'+i].value.trim().match(/^(\d{1,2})\.(\d{1,2})\.?$/); if(!n)continue;
      if(!dm){ $('#anFeh',m).innerHTML=`<div class="hinweis">Bitte das Datum für „${esc(n)}“ als TT.MM. eintragen.</div>`; return; }
      eigene.push({id:n.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,30),name:n,datum:`${dm[2].padStart(2,'0')}-${dm[1].padStart(2,'0')}`,vorlauf:Math.min(60,Math.max(7,+f['ev'+i].value||21))}); }
    try{ await rpc('shop_bo_einstellungen_speichern',{p:{anlaesse:{aus:ANL.filter(([k])=>!f['a_'+k].checked).map(([k])=>k),eigene}}}); toast('Anlässe gespeichert'); geh('agenten'); }catch(x){ $('#anFeh',m).innerHTML=`<div class="hinweis">${esc(x.message)}</div>`; } };
  $('#seoF',m).onsubmit=async e=>{ e.preventDefault(); const f=e.target;
    try{ await rpc('shop_bo_einstellungen_speichern',{p:{seo:Object.assign({},c.seo||{},{keywords:f.kw.value.split('\n').map(x=>x.trim().toLowerCase()).filter(Boolean).slice(0,20),gsc_site:f.site.value.trim()})}}); toast('Gespeichert'); }catch(x){ toast(x.message); } };
}

S.agenten=async m=>{ await agentenBasis(m); await agentenExtra(m); await agentenBilder(m); await agentenBildpruefer(m); };
// Bild-Agent: Bericht aus der GitHub-Aktion (bildcheck.json im Store), prüft alle Seiten auf Handy, Tablet, Laptop, großem Bildschirm
const BC_ART={kern:'Wichtiges angeschnitten',text:'Text über dem Motiv',motiv:'Motiv stark beschnitten',unscharf:'unscharf',unbekannt:'neues Foto ohne Motiv-Daten'};
async function agentenBilder(m){
  let b=null; try{ const r=await fetch(BASE+'bildcheck.json?'+Date.now(),{cache:'no-store'}); if(r.ok)b=await r.json(); }catch(e){}
  const P=b?b.probleme||[]:[]; const fehler=P.filter(x=>x.schwere==='fehler');
  m.insertAdjacentHTML('beforeend',`<div class="karte" id="bildAgent" style="margin-top:14px"><h2>${I.idee} Bild-Agent <small>${b?`${b.bilder} Bilder auf ${b.seiten} Seiten · ${(b.geraete||[]).join(', ')} · ${datum(b.stand,true)}`:'noch kein Bericht'}</small></h2>
    <p style="color:var(--ink3);font-size:14px;max-width:72ch">Prüft wöchentlich und nach jedem Ausrollen, ob jedes Foto auf jedem Gerät gut aussieht: Wappen, Gesichter und Produkt nie angeschnitten, kein Text über dem Motiv, nichts unscharf. Der Shop schneidet jedes Foto selbst passend zum Rahmen zu.</p>
    ${!b?'<p class="leer">Der erste Bericht kommt nach dem nächsten Ausrollen.</p>':!P.length?'<p class="hinweis ok">Alles gut. Kein Bild ist angeschnitten oder unscharf.</p>':`<p class="${fehler.length?'hinweis':'hinweis ok'}">${fehler.length?`${fehler.length} Bild${fehler.length>1?'er':''} mit Fehlern`:'Keine Fehler'}${P.length-fehler.length?` · ${P.length-fehler.length} Hinweis${P.length-fehler.length>1?'e':''}`:''}</p>
    <div class="scroll" style="margin-top:10px"><table class="tabelle"><thead><tr><th>Bild</th><th>Gerät</th><th>Was</th><th>Seiten</th></tr></thead><tbody>${P.slice(0,60).map(x=>`<tr><td><img src="${klein(x.bild)}" alt="" style="width:44px;height:54px;object-fit:cover;border-radius:4px;vertical-align:middle;margin-right:8px"><small>${esc(x.bild)}</small></td><td>${esc(x.geraet)}<br><small style="color:var(--ink3)">${esc(x.rahmen||'')}</small></td>
      <td><span class="pill ${x.schwere==='fehler'?'warn':''}">${esc(BC_ART[x.art]||x.art)}</span><br><small>${esc(x.text||'')}</small></td><td><small>${(x.seiten||[]).slice(0,4).map(esc).join(', ')}</small></td></tr>`).join('')}</tbody></table></div>`}</div>`);
}
/* Bild-Prüfer: schaut jedes Foto an wie ein Mensch (Schrift, Wappen, Hände, Fremdmarken, Stil, passt zum Produkt). Läuft auf dem Mac, Werkstatt baut Ersatz. */
const BP_U={ok:['in Ordnung','ok'],nachbessern:['nachbessern','neu'],neu:['neu machen','warn']};
async function agentenBildpruefer(m){
  let b=null; try{ const r=await fetch(BASE+'bildpruefung.json?'+Date.now(),{cache:'no-store'}); if(r.ok)b=await r.json(); }catch(e){}
  const L=b?Object.entries(b.bilder||{}).map(([n,v])=>({n,...v})):[]; const zahl=u=>L.filter(x=>x.urteil===u).length;
  const rang={neu:0,nachbessern:1,ok:2}; L.sort((a,c)=>(rang[a.urteil]??3)-(rang[c.urteil]??3)||(a.note||0)-(c.note||0));
  const fragen=L.filter(x=>x.rueckfrage); const W=b&&b.werkstatt||{}; const wj=Object.values(W.jobs||{});
  m.insertAdjacentHTML('beforeend',`<div class="karte" id="bildPruefer" style="margin-top:14px"><h2>${I.idee} Bild-Prüfer <small>${b?`${L.length} Fotos · ${datum(b.stand,true)}`:'noch kein Bericht'}</small></h2>
    <p style="color:var(--ink3);font-size:14px;max-width:72ch">Schaut sich jedes Foto an wie ein kritischer Mensch: Schrift Buchstabe für Buchstabe, Wappen mit drei Glocken, Hände und Gesichter, Fremdmarken, ob es eine echte Street-Momentaufnahme ist und ob es zum Produkt passt. Die Bild-Werkstatt baut für Fehler und Lücken neue Fotos im Store-Stil, und nur was die Prüfung besteht, kommt in den Shop.</p>
    ${!b?'<p class="leer">Noch kein Bericht.</p>':`<p class="hinweis${zahl('neu')?'':' ok'}">${zahl('ok')} in Ordnung · ${zahl('nachbessern')} nachbessern · ${zahl('neu')} neu machen${fragen.length?` · ${fragen.length} Rückfragen an den Verein`:''}</p>
    ${W.guthaben==='leer'?'<p class="hinweis">Die Bild-Werkstatt wartet: Das OpenAI-Guthaben ist leer. Nach dem Aufladen baut sie alle offenen Fotos, prüft sie und übernimmt nur die guten.</p>':wj.length?`<p class="hinweis ok">Werkstatt: ${wj.filter(j=>j.status==='angenommen'||j.status==='uebernommen').length} neue Fotos fertig, ${wj.filter(j=>j.status==='abgelehnt').length} verworfen.</p>`:''}
    <div class="scroll" style="margin-top:10px"><table class="tabelle"><thead><tr><th>Foto</th><th>Urteil</th><th>Was auffällt</th></tr></thead><tbody>${L.map(x=>{ const u=BP_U[x.urteil]||[x.urteil||'?',''];
      const f=(x.fehler||[]).filter(y=>y.schwere!=='leicht').slice(0,4);
      return `<tr><td><img src="${klein(x.n)}" alt="" style="width:44px;height:54px;object-fit:cover;border-radius:4px;vertical-align:middle;margin-right:8px"><small>${esc(x.n)}</small></td>
      <td><span class="pill ${u[1]}">${esc(u[0])}</span><br><small style="color:var(--ink3)">Note ${x.note??'–'} · Stil ${x.stil??'–'}</small></td>
      <td>${f.length?f.map(y=>`<small>${y.schwere==='kritisch'?'<b>':''}${esc(y.was)}${y.schwere==='kritisch'?'</b>':''}${y.wo?' <span style="color:var(--ink3)">('+esc(y.wo)+')</span>':''}</small>`).join('<br>'):`<small>${esc(x.begruendung||'')}</small>`}${x.rueckfrage?`<br><small style="color:var(--blau,#1E355E)">Frage: ${esc(x.rueckfrage)}</small>`:''}</td></tr>`; }).join('')}</tbody></table></div>`}</div>`);
}
/* ---------- Einstellungen ---------- */
/* ---------- Aktionen mit Countdown, Vereinsausstattung, Mystery Boxen (075) ---------- */
const AK_JETZT={laeuft:['läuft','ok'],geplant:['geplant','neu'],vorbei:['vorbei','aus'],entwurf:['Entwurf','']};
const LIEF_T={privat:'Privat nach Hause',verein:'An den Verein',veredler:'Zum Veredler (MacroFlock)',wahl:'Person wählt selbst'};
const GT_ST={offen:['offen','neu'],eingeloest:['eingelöst','ok'],gesperrt:['gesperrt','aus']};
const shopUrl=()=>(CFG.domain?'https://'+CFG.domain+'/':location.origin+BASE);
function akTeileWahl(D,gewaehlt,name,nurNormal){ const G=new Set(gewaehlt||[]); const L={mannschaft:'Mannschaft',1896:'1896',merch:'Merch'};
  return `<div class="ak-teile">${['mannschaft','1896','merch'].map(l=>{ const P=D.produkte.filter(p=>p.linie===l&&(!nurNormal||p.art!=='box')); return P.length?`<fieldset><legend>${L[l]}</legend>${P.map(p=>`<label class="chk"><input type="checkbox" name="${name}" value="${p.id}" ${G.has(p.id)?'checked':''}> ${esc(p.titel)}${p.art==='box'?' (Box)':''}${p.status!=='aktiv'?' <small style="color:var(--ink3)">('+esc(p.status)+')</small>':''}</label>`).join('')}</fieldset>`:''; }).join('')}</div>`; }
S.aktionen=async m=>{
  const D=A.akt=await rpc('shop_bo_aktionen'); const tab=A.aktTab||'aktionen';
  const offen=D.packen.filter(x=>!x.inhalt.length).length;
  m.innerHTML=`<div class="kopfz"><div><h1>Aktionen</h1><p style="max-width:70ch">Rabatte auf Zeit mit Countdown, Codes für Trainer, Helfer und Vorstand, Mystery Boxen. Preise und Codes prüft die Kasse selbst.</p></div></div>
    <div class="btnreihe ak-tabs" style="margin-bottom:18px">${[['aktionen','Aktionen mit Countdown'],['ausstattung','Vereinsausstattung'],['boxen','Mystery Boxen'+(offen?` (${offen} packen)`:'')]].map(([k,t])=>`<button class="btn ${k===tab?'hi':'rand'}" data-ak="${k}">${t}</button>`).join('')}</div><div id="akI"></div>`;
  $$('[data-ak]',m).forEach(b=>b.onclick=()=>{ A.aktTab=b.dataset.ak; geh('aktionen'); });
  const i=$('#akI',m); if(tab==='ausstattung')akAusstattung(i,D); else if(tab==='boxen')akBoxen(i,D); else akAktionen(i,D);
  if(tab==='boxen'&&A.boxVorlage){ const v=A.boxVorlage; A.boxVorlage=null; boxEditor(null,v); }
};
function akAktionen(i,D){
  i.innerHTML=`<div class="btnreihe" style="margin-bottom:14px"><button class="btn hi" id="akNeu">+ Neue Aktion</button></div>
  <div class="raster r2">${D.aktionen.map(a=>{ const j=AK_JETZT[a.jetzt]||['','']; return `<div class="karte"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;flex-wrap:wrap"><b style="font:800 22px/1.1 var(--cond);text-transform:uppercase">${esc(a.titel)} · −${a.rabatt} %</b><span class="pill ${j[1]}">${j[0]}</span></div>
    <p style="font-size:13.5px;color:var(--ink3);margin:6px 0">${datum(a.start_at,true)} bis ${datum(a.ende_at,true)} · ${a.geltung==='alle'?'alle Teile':a.geltung==='linie'?'Linie '+esc(a.linie):a.geltung==='drop'?'Drop '+esc(a.drop||''):a.anzahl+' Teile'}${a.zeigen?' · mit Banner':''}</p>
    ${a.text?`<p style="font-size:13.5px;margin:0 0 6px">${esc(a.text)}</p>`:''}<p style="font-size:13px;margin:0">${a.verkauft} Teile im Aktionszeitraum verkauft</p>
    <div class="btnreihe" style="margin-top:10px"><button class="btn rand klein" data-ake="${a.id}">Bearbeiten</button>${a.jetzt==='laeuft'?`<button class="btn rand klein" data-akstop="${a.id}">Jetzt beenden</button>`:''}</div></div>`; }).join('')||'<div class="leer">Noch keine Aktion. Zum Beispiel: Wochenende −20 % auf alle Hoodies, mit Countdown im Shop.</div>'}</div>`;
  $('#akNeu',i).onclick=()=>aktionEditor(null,D);
  $$('[data-ake]',i).forEach(b=>b.onclick=()=>aktionEditor(D.aktionen.find(a=>a.id===b.dataset.ake),D));
  $$('[data-akstop]',i).forEach(b=>b.onclick=async()=>{ const a=D.aktionen.find(x=>x.id===b.dataset.akstop); if(b.dataset.sicher!=='1'){ b.dataset.sicher='1'; b.textContent='Wirklich beenden?'; return; }
    try{ await rpc('shop_bo_aktion_speichern',{p:Object.assign({},a,{status:'beendet',produkte:a.produkte})}); toast('Beendet'); geh('aktionen'); }catch(x){ toast(x.message); } });
}
function aktionEditor(a,D){ const neu=!a; const jetzt=new Date(); a=a||{titel:'',rabatt:15,start_at:jetzt.toISOString(),ende_at:new Date(jetzt.getTime()+3*864e5).toISOString(),geltung:'produkte',produkte:[],zeigen:true,status:'aktiv'};
  fenster(`<h2 class="t">${neu?'Neue Aktion':esc(a.titel)}</h2><form class="stack" id="af"><div class="karte form">
    <div class="f2"><div class="feld"><label>Titel (steht im Shop)</label><input name="titel" value="${esc(a.titel)}" maxlength="80" required placeholder="Hoodie-Wochenende"></div><div class="feld"><label>Rabatt in %</label><input name="rabatt" type="number" min="5" max="70" value="${a.rabatt}" required></div></div>
    <div class="feld"><label>Satz dazu (optional)</label><input name="text" value="${esc(a.text||'')}" maxlength="400" placeholder="Nur bis Sonntag: alle Hoodies günstiger."></div>
    <div class="f2"><div class="feld"><label>Start</label><input name="start_at" type="datetime-local" value="${lokal(a.start_at)}" required></div><div class="feld"><label>Ende</label><input name="ende_at" type="datetime-local" value="${lokal(a.ende_at)}" required></div></div>
    <div class="btnreihe">${[['Ab jetzt 24 Std.',1],['3 Tage',3],['7 Tage',7]].map(([t,d])=>`<button type="button" class="btn rand klein" data-dauer="${d}">${t}</button>`).join('')}</div>
    <div class="feld"><label>Gilt für</label><select name="geltung">${[['produkte','ausgewählte Teile'],['linie','eine ganze Linie'],['drop','einen Drop'],['alle','den ganzen Store']].map(([k,t])=>`<option value="${k}" ${a.geltung===k?'selected':''}>${t}</option>`).join('')}</select></div>
    <div class="feld g-linie"><label>Linie</label><select name="linie">${[['mannschaft','Mannschaft'],['1896','1896'],['merch','Merch']].map(([k,t])=>`<option value="${k}" ${a.linie===k?'selected':''}>${t}</option>`).join('')}</select></div>
    <div class="feld g-drop"><label>Drop</label><select name="drop">${D.drops.map(d=>`<option value="${esc(d.slug)}" ${a.drop===d.slug?'selected':''}>${esc(d.titel)}</option>`).join('')||'<option value="">Noch kein Drop</option>'}</select></div>
    <div class="g-produkte">${akTeileWahl(D,a.produkte,'pr')}</div>
    <div class="f2"><label class="chk"><input type="checkbox" name="zeigen" ${a.zeigen!==false?'checked':''}> Im Shop groß zeigen (Startseite und Laufband)</label><label class="chk"><input type="checkbox" name="entwurf" ${a.status==='entwurf'?'checked':''}> Nur Entwurf</label></div>
    <p class="hinweis afeh" hidden></p></div><div class="btnreihe"><button class="btn hi">Speichern</button>${neu?'':'<button type="button" class="btn weg" id="afx">Löschen</button>'}</div></form>`,f=>{
    const fo=$('#af',f); const sicht=()=>{ const g=fo.geltung.value; $('.g-linie',f).hidden=g!=='linie'; $('.g-drop',f).hidden=g!=='drop'; $('.g-produkte',f).hidden=g!=='produkte'; }; fo.geltung.onchange=sicht; sicht();
    $$('[data-dauer]',f).forEach(b=>b.onclick=()=>{ const s=new Date(); fo.start_at.value=lokal(s.toISOString()); fo.ende_at.value=lokal(new Date(s.getTime()+(+b.dataset.dauer)*864e5).toISOString()); });
    fo.onsubmit=async e=>{ e.preventDefault(); const p={id:a.id||null,titel:fo.titel.value,rabatt:+fo.rabatt.value,text:fo.text.value,start_at:new Date(fo.start_at.value).toISOString(),ende_at:new Date(fo.ende_at.value).toISOString(),
        geltung:fo.geltung.value,linie:fo.linie.value,drop:fo.drop.value,produkte:$$('[name=pr]:checked',f).map(x=>x.value),zeigen:fo.zeigen.checked,status:fo.entwurf.checked?'entwurf':'aktiv'};
      try{ await rpc('shop_bo_aktion_speichern',{p}); zu(); toast('Gespeichert'); geh('aktionen'); }catch(x){ const h=$('.afeh',f); h.textContent=x.message; h.hidden=false; } };
    const x=$('#afx',f); if(x) x.onclick=async()=>{ if(x.dataset.s!=='1'){ x.dataset.s='1'; x.textContent='Wirklich löschen?'; return; } try{ await rpc('shop_bo_aktion_loeschen',{p_id:a.id}); zu(); toast('Gelöscht'); geh('aktionen'); }catch(e){ toast(e.message); } };
  }); }
function akAusstattung(i,D){
  const Z=D.lieferziele||{}; const zText=z=>{ const x=Z[z]||{}; return x.strasse&&x.plz&&x.ort?[x.name,x.strasse,x.plz+' '+x.ort].filter(Boolean).join(', '):''; };
  const summe=D.auswertung.reduce((a,x)=>a+(+x.verein||0),0);
  i.innerHTML=`<div class="btnreihe" style="margin-bottom:14px"><button class="btn hi" id="auNeu">+ Neue Ausstattung</button><button class="btn rand" id="auZiele">Lieferadressen</button></div>
  ${!zText('verein')?'<p class="hinweis" style="margin-bottom:14px">Die Vereinsadresse fehlt noch. Ohne sie geht „An den Verein“ nicht. Unter „Lieferadressen“ eintragen.</p>':''}
  <div class="stack">${D.ausstattung.map(au=>{ const c=au.codes; const n={offen:c.filter(x=>x.status==='offen').length,ein:c.filter(x=>x.status==='eingeloest').length};
    return `<div class="karte"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:flex-start"><div><b style="font:800 22px/1.1 var(--cond);text-transform:uppercase">${esc(au.titel)}</b>
      <p style="font-size:13.5px;color:var(--ink3);margin:4px 0 0">Verein übernimmt ${au.anteil} % · ${au.max_teile?'höchstens '+au.max_teile+' Teile':'ohne Stücklimit'} · ${au.produkte.length||au.linien.length?'Auswahl: '+[...au.linien,au.produkte.length?au.produkte.length+' Teile':''].filter(Boolean).join(', '):'ganzer Store'} · ${LIEF_T[au.lieferung]}${au.gueltig_bis?' · bis '+datum(au.gueltig_bis,true):''}</p></div>
      <span class="pill ${au.aktiv?'ok':'aus'}">${au.aktiv?'aktiv':'aus'}</span></div>
      <p style="font-size:13.5px;margin:8px 0">${c.length} Codes · ${n.ein} eingelöst · ${n.offen} offen · Verein bisher ${eur(au.verein_summe)}</p>
      <div class="btnreihe"><button class="btn hi klein" data-aucode="${au.id}">Codes für Personen</button><button class="btn rand klein" data-aue="${au.id}">Bearbeiten</button></div>
      ${c.length?`<details style="margin-top:10px" ${A.auOffen===au.id?'open':''}><summary style="cursor:pointer;font-weight:700;font-size:13.5px">Codes anzeigen</summary><div class="scroll"><table class="tabelle"><thead><tr><th>Person</th><th>Code</th><th>Stand</th><th>Weitergeben</th><th></th></tr></thead><tbody>${c.map(g=>{ const link=shopUrl()+'g/'+g.code; const s=GT_ST[g.status]||['',''];
        const txt=`Hallo ${g.name.split(' ')[0]}, hier ist dein persönlicher Link für die Vereinsausstattung „${au.titel}“ im SV Mörlenbach Store: ${link} (gilt für eine Bestellung)`;
        return `<tr><td><b>${esc(g.name)}</b>${g.rolle?`<br><small style="color:var(--ink3)">${esc(g.rolle)}</small>`:''}</td><td class="mono">${esc(g.code)}</td><td><span class="pill ${s[1]}">${s[0]}</span>${g.bestellung?`<br><small>${esc(g.bestellung)} · ${eur(g.verein)}</small>`:''}</td>
        <td><div class="btnreihe"><button class="btn rand klein" data-kopie="${esc(link)}">Link kopieren</button><a class="btn rand klein" href="https://wa.me/?text=${encodeURIComponent(txt)}" target="_blank" rel="noopener">WhatsApp</a>${g.email?`<a class="btn rand klein" href="mailto:${esc(g.email)}?subject=${encodeURIComponent('Deine Vereinsausstattung')}&body=${encodeURIComponent(txt)}">Mail</a>`:''}</div></td>
        <td>${g.status==='offen'?`<button class="btn weg klein" data-gsp="${g.code}">Sperren</button>`:g.status==='gesperrt'?`<button class="btn rand klein" data-gfr="${g.code}">Freigeben</button>`:''}</td></tr>`; }).join('')}</tbody></table></div></details>`:''}</div>`; }).join('')||'<div class="leer">Noch keine Ausstattung. Zum Beispiel: „Trainer-Outfit 2026“, Verein zahlt 100 %, höchstens 3 Teile.</div>'}</div>
  <div class="karte" style="margin-top:14px"><h2>Was der Verein übernommen hat <small>${eur(summe)} gesamt</small></h2>${D.auswertung.length?`<div class="scroll"><table class="tabelle"><thead><tr><th>Jahr</th><th>Person</th><th class="r">Bestellungen</th><th class="r">Teile</th><th class="r">Warenwert</th><th class="r">Verein</th></tr></thead><tbody>${D.auswertung.map(x=>`<tr><td>${x.jahr}</td><td>${esc(x.name)}${x.rolle?` <small style="color:var(--ink3)">${esc(x.rolle)}</small>`:''}</td><td class="r">${x.bestellungen}</td><td class="r">${x.teile}</td><td class="r">${eur(x.waren)}</td><td class="r"><b>${eur(x.verein)}</b></td></tr>`).join('')}</tbody></table></div>
    <p style="font-size:13px;color:var(--ink3);margin-top:8px">Für den Kassenwart: Kleidung, die der Verein Ehrenamtlichen bezahlt, kann steuerlich relevant sein. Diese Liste zeigt je Person und Jahr, was übernommen wurde.</p>`:'<p class="leer">Noch nichts eingelöst.</p>'}</div>`;
  $('#auNeu',i).onclick=()=>ausEditor(null,D); $('#auZiele',i).onclick=()=>zieleEditor(D);
  $$('[data-aue]',i).forEach(b=>b.onclick=()=>ausEditor(D.ausstattung.find(x=>x.id===b.dataset.aue),D));
  $$('[data-aucode]',i).forEach(b=>b.onclick=()=>codesEditor(D.ausstattung.find(x=>x.id===b.dataset.aucode)));
  $$('[data-kopie]',i).forEach(b=>b.onclick=()=>kopie(b.dataset.kopie));
  $$('[data-gsp],[data-gfr]',i).forEach(b=>b.onclick=async()=>{ const sp=!!b.dataset.gsp; try{ await rpc('shop_bo_gutschein_aendern',{p_code:b.dataset.gsp||b.dataset.gfr,p_status:sp?'gesperrt':'offen'}); toast(sp?'Gesperrt':'Freigegeben'); A.auOffen=D.ausstattung.find(a=>a.codes.some(c=>c.code===(b.dataset.gsp||b.dataset.gfr)))?.id; geh('aktionen'); }catch(x){ toast(x.message); } });
}
function ausEditor(au,D){ const neu=!au; au=au||{titel:'',anteil:100,max_teile:3,produkte:[],linien:[],lieferung:'wahl',aktiv:true};
  fenster(`<h2 class="t">${neu?'Neue Vereinsausstattung':esc(au.titel)}</h2><form class="stack" id="uf"><div class="karte form">
    <div class="f2"><div class="feld"><label>Titel</label><input name="titel" value="${esc(au.titel)}" maxlength="80" required placeholder="Trainer-Outfit 2026"></div>
      <div class="feld"><label>Verein übernimmt</label><select name="anteil">${[100,75,50,25].map(x=>`<option value="${x}" ${au.anteil===x?'selected':''}>${x} %</option>`).join('')}${[100,75,50,25].includes(au.anteil)?'':`<option value="${au.anteil}" selected>${au.anteil} %</option>`}</select></div></div>
    <div class="f2"><div class="feld"><label>Höchstens Teile pro Person</label><input name="max_teile" type="number" min="1" max="50" value="${au.max_teile??''}" placeholder="leer = unbegrenzt"></div>
      <div class="feld"><label>Gültig bis (optional)</label><input name="gueltig_bis" type="datetime-local" value="${lokal(au.gueltig_bis)}"></div></div>
    <div class="feld"><label>Lieferung</label><select name="lieferung">${Object.entries(LIEF_T).map(([k,t])=>`<option value="${k}" ${au.lieferung===k?'selected':''}>${t}</option>`).join('')}</select><small>„Zum Veredler“: Ware geht vom Partner direkt zu MacroFlock nach Kirschhausen.</small></div>
    <div class="feld"><label>Satz für die Person (optional)</label><input name="text" value="${esc(au.text||'')}" maxlength="400" placeholder="Danke für deinen Einsatz! Such dir dein Outfit aus."></div>
    <div class="feld"><label>Erlaubt sind</label><div class="btnreihe">${[['mannschaft','ganze Linie Mannschaft'],['1896','ganze Linie 1896'],['merch','ganzes Merch']].map(([k,t])=>`<label class="chk"><input type="checkbox" name="li" value="${k}" ${au.linien.includes(k)?'checked':''}> ${t}</label>`).join('')}</div><small>Nichts angehakt (auch unten nicht) = der ganze Store.</small></div>
    <details><summary style="cursor:pointer;font-weight:700">Einzelne Teile auswählen</summary>${akTeileWahl(D,au.produkte,'pr',true)}</details>
    <label class="chk"><input type="checkbox" name="aktiv" ${au.aktiv?'checked':''}> Aktiv (Codes funktionieren)</label>
    <p class="hinweis ufeh" hidden></p></div><button class="btn hi">Speichern</button></form>`,f=>{ const fo=$('#uf',f);
    fo.onsubmit=async e=>{ e.preventDefault(); const p={id:au.id||null,titel:fo.titel.value,anteil:+fo.anteil.value,max_teile:fo.max_teile.value,gueltig_bis:fo.gueltig_bis.value?new Date(fo.gueltig_bis.value).toISOString():'',
        lieferung:fo.lieferung.value,text:fo.text.value,linien:$$('[name=li]:checked',f).map(x=>x.value),produkte:$$('[name=pr]:checked',f).map(x=>x.value),aktiv:fo.aktiv.checked};
      try{ const id=await rpc('shop_bo_ausstattung_speichern',{p}); zu(); toast('Gespeichert'); if(neu){ A.akt=await rpc('shop_bo_aktionen'); codesEditor(A.akt.ausstattung.find(x=>x.id===id)); } else geh('aktionen'); }catch(x){ const h=$('.ufeh',f); h.textContent=x.message; h.hidden=false; } }; }); }
async function codesEditor(au){ let P=[]; try{ P=await rpc('shop_bo_personen'); }catch(e){}
  const hat=new Set(au.codes.filter(c=>c.status!=='gesperrt').map(c=>(c.email||'').toLowerCase()));
  fenster(`<h2 class="t">Codes: ${esc(au.titel)}</h2><p style="color:var(--ink3);font-size:14px">Jede Person bekommt einen eigenen Code, der genau einmal geht. Wer schon einen offenen Code hat, bekommt keinen zweiten.</p>
    <form class="stack" id="cf"><div class="karte form"><div class="feld"><label>Personen aus der Sportzentrale</label><input id="cfSuch" placeholder="Suchen …"></div>
      <div class="ak-teile" id="cfP" style="max-height:300px;overflow:auto">${P.map(x=>`<label class="chk" data-such="${esc((x.name+' '+x.rolle+' '+x.email).toLowerCase())}"><input type="checkbox" name="pe" value="${x.id}" ${hat.has((x.email||'').toLowerCase())?'disabled':''}> ${esc(x.name)} <small style="color:var(--ink3)">${esc(x.rolle)}${hat.has((x.email||'').toLowerCase())?' · hat schon einen':''}</small></label>`).join('')||'<p class="leer">Keine Personen gefunden.</p>'}</div>
      <div class="feld"><label>Weitere Personen (eine pro Zeile: Name, E-Mail optional, Rolle optional)</label><textarea name="frei" rows="4" placeholder="Paula Platzwart, paula@example.com, Helferin"></textarea></div>
      <p class="hinweis cfeh" hidden></p></div><button class="btn hi">Codes erzeugen</button></form>`,f=>{
    $('#cfSuch',f).oninput=e=>{ const q=e.target.value.toLowerCase(); $$('[data-such]',f).forEach(l=>l.hidden=q&&!l.dataset.such.includes(q)); };
    $('#cf',f).onsubmit=async e=>{ e.preventDefault(); const L=$$('[name=pe]:checked',f).map(c=>{ const x=P.find(p=>p.id===c.value); return {name:x.name,email:x.email,rolle:x.rolle,profil_id:x.id}; });
      e.target.frei.value.split('\n').map(z=>z.trim()).filter(Boolean).forEach(z=>{ const t=z.split(',').map(s=>s.trim()); L.push({name:t[0],email:(t.find(s=>s.includes('@'))||''),rolle:t.filter(s=>!s.includes('@'))[1]||''}); });
      if(!L.length){ const h=$('.cfeh',f); h.textContent='Bitte mindestens eine Person auswählen oder eintragen.'; h.hidden=false; return; }
      try{ const r=await rpc('shop_bo_gutscheine_erzeugen',{p_ausstattung:au.id,p_personen:L}); zu(); toast(r.neu?`${r.neu} Code${r.neu>1?'s':''} erzeugt`:'Alle hatten schon einen offenen Code'); A.auOffen=au.id; geh('aktionen'); }catch(x){ const h=$('.cfeh',f); h.textContent=x.message; h.hidden=false; } }; }); }
function zieleEditor(D){ const Z=D.lieferziele||{}; const fl=(z,t,hint)=>{ const x=Z[z]||{}; return `<div class="karte form"><h2>${t}</h2>${hint?`<p style="font-size:13.5px;color:var(--ink3)">${hint}</p>`:''}
    <div class="feld"><label>Name</label><input name="${z}_name" value="${esc(x.name||'')}" maxlength="80"></div><div class="feld"><label>Zusatz (z. B. z. Hd.)</label><input name="${z}_zusatz" value="${esc(x.zusatz||'')}" maxlength="80"></div>
    <div class="feld"><label>Straße und Hausnummer</label><input name="${z}_strasse" value="${esc(x.strasse||'')}" maxlength="120"></div><div class="f2"><div class="feld"><label>PLZ</label><input name="${z}_plz" value="${esc(x.plz||'')}" maxlength="5" inputmode="numeric"></div><div class="feld"><label>Ort</label><input name="${z}_ort" value="${esc(x.ort||'')}" maxlength="80"></div></div></div>`; };
  fenster(`<h2 class="t">Lieferadressen</h2><form class="stack" id="zf">${fl('verein','An den Verein','Zum Beispiel Geschäftsstelle oder Sportheim. Dorthin geht Ausstattung, die gesammelt verteilt wird.')}${fl('veredler','Veredler','MacroFlock in Heppenheim-Kirschhausen. 11teamsports liefert unveredelte Ware direkt dorthin.')}<p class="hinweis zfeh" hidden></p><button class="btn hi">Speichern</button></form>`,f=>{
    $('#zf',f).onsubmit=async e=>{ e.preventDefault(); const fo=e.target; const o={}; ['verein','veredler'].forEach(z=>{ o[z]={}; ['name','zusatz','strasse','plz','ort'].forEach(k=>o[z][k]=fo[z+'_'+k].value); });
      try{ await rpc('shop_bo_lieferziele_speichern',{p:o}); zu(); toast('Gespeichert'); geh('aktionen'); }catch(x){ const h=$('.zfeh',f); h.textContent=x.message; h.hidden=false; } }; }); }
function akBoxen(i,D){
  i.innerHTML=`<div class="btnreihe" style="margin-bottom:14px"><button class="btn hi" id="bxNeu">+ Neue Mystery Box</button></div>
  <p style="font-size:13.5px;color:var(--ink3);max-width:72ch;margin-bottom:14px">Der Warenwert in jeder Box ist immer mindestens so hoch wie der Preis, sonst wäre es ein Glücksspiel. Boxen packt der Verein selbst aus dem Lager, sie gehen nicht in die Sammelbestellung. Was drin ist, sehen Kunden erst nach dem Versand.</p>
  ${D.packen.length?`<div class="karte" style="margin-bottom:14px"><h2>Zu packen <small>${D.packen.length}</small></h2><div class="scroll"><table class="tabelle"><thead><tr><th>Bestellung</th><th>Box</th><th>Größe</th><th class="r">Anzahl</th><th>Inhalt</th><th></th></tr></thead><tbody>${D.packen.map(x=>`<tr><td><b>${esc(x.nummer)}</b><br><small>${esc(x.name)}${x.bezahlt?'':' · noch nicht bezahlt'}</small></td><td>${esc(x.titel)}</td><td>${esc(x.groesse||'')}</td><td class="r">${x.menge}</td>
    <td><small>${x.inhalt.length?x.inhalt.map(c=>esc(c.titel)+(c.groesse?' '+esc(c.groesse):'')).join(', '):'noch leer'}</small></td><td><button class="btn ${x.inhalt.length?'rand':'hi'} klein" data-pack="${x.position_id}">${x.inhalt.length?'Ändern':'Packen'}</button></td></tr>`).join('')}</tbody></table></div></div>`:''}
  <div class="raster r2">${D.boxen.map(b=>`<div class="karte" style="display:flex;gap:14px"><img src="${klein(b.bilder[0]||'mystery-box')}" alt="" style="width:96px;height:120px;object-fit:cover;border-radius:8px;background:#222">
    <div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font:800 20px/1.1 var(--cond);text-transform:uppercase">${esc(b.titel)}</b><span class="pill ${b.status==='aktiv'?'ok':''}">${b.status}</span></div>
    <p style="font-size:13.5px;color:var(--ink3);margin:4px 0 6px">${eur(b.preis)} · Warenwert mind. ${eur(b.box_wert)} · ${b.box_teile} Teile${b.einkauf?' · Selbstkosten '+eur(b.einkauf):''}</p>
    <p style="font-size:13px;margin:0">${b.varianten.map(v=>esc(v.groesse)+(v.bestand!=null?' ('+v.bestand+')':'')).join(' · ')} · ${b.verkauft} verkauft</p>
    <div class="btnreihe" style="margin-top:10px"><button class="btn rand klein" data-bxe="${b.id}">Bearbeiten</button><a class="btn rand klein" href="${BASE}p/${esc(b.slug)}" target="_blank">Ansehen ↗</a></div></div></div>`).join('')||'<div class="leer">Noch keine Box. Der Agent schlägt eine vor, wenn Ware länger liegen bleibt.</div>'}</div>`;
  $('#bxNeu',i).onclick=()=>boxEditor(null);
  $$('[data-bxe]',i).forEach(b=>b.onclick=()=>boxEditor(D.boxen.find(x=>x.id===b.dataset.bxe)));
  $$('[data-pack]',i).forEach(b=>b.onclick=()=>packEditor(D.packen.find(x=>String(x.position_id)===b.dataset.pack),D));
}
function boxEditor(b,vorlage){ const D=A.akt; const neu=!b; const v=vorlage||{};
  b=b||{titel:'Mystery Box',slug:'mystery-box-'+new Date().toISOString().slice(2,7).replace('-',''),preis:v.preis||2900,box_wert:v.wert||(v.preis?v.preis*1.6:4900),box_teile:v.teile||3,box_pool:v.produkte||[],status:'entwurf',
    beschreibung:'Drei Teile aus dem Store, zusammengestellt vom Verein. Was drin ist, weißt du erst beim Auspacken. Garantiert mehr Warenwert als du zahlst.',varianten:[{groesse:'S',bestand:5},{groesse:'M',bestand:5},{groesse:'L',bestand:5},{groesse:'XL',bestand:5}]};
  const gr=(b.varianten||[]).map(x=>x.groesse+':'+(x.bestand??'')).join(', ');
  fenster(`<h2 class="t">${neu?'Neue Mystery Box':esc(b.titel)}</h2><form class="stack" id="bf"><div class="karte form">
    <div class="f2"><div class="feld"><label>Titel</label><input name="titel" value="${esc(b.titel)}" maxlength="80" required></div><div class="feld"><label>Adresse im Shop</label><input name="slug" value="${esc(b.slug)}" pattern="[a-z0-9\\-]{2,60}" required></div></div>
    <div class="feld"><label>Untertitel</label><input name="untertitel" value="${esc(b.untertitel||'')}" maxlength="120" placeholder="3 Teile · Inhalt geheim"></div>
    <div class="f2"><div class="feld"><label>Preis (€)</label><input name="preis" value="${(b.preis/100).toFixed(2).replace('.',',')}" required inputmode="decimal"></div><div class="feld"><label>Warenwert mindestens (€)</label><input name="wert" value="${(Math.round(b.box_wert)/100).toFixed(2).replace('.',',')}" required inputmode="decimal"><small>muss mindestens der Preis sein</small></div></div>
    <div class="f2"><div class="feld"><label>Teile pro Box</label><input name="teile" type="number" min="1" max="10" value="${b.box_teile}"></div><div class="feld"><label>Selbstkosten (€, optional)</label><input name="ek" value="${b.einkauf?(b.einkauf/100).toFixed(2).replace('.',','):''}" inputmode="decimal"></div></div>
    <div class="feld"><label>Größen und Stückzahl</label><input name="gr" value="${esc(gr)}" placeholder="S:5, M:5, L:5, XL:5"><small>Größe:Anzahl, mit Komma getrennt. Ohne Zahl = unbegrenzt.</small></div>
    <div class="feld"><label>Beschreibung</label><textarea name="beschreibung" rows="3" maxlength="4000">${esc(b.beschreibung||'')}</textarea></div>
    <details ${(b.box_pool||[]).length?'open':''}><summary style="cursor:pointer;font-weight:700">Was darf rein? (leer = alles)</summary>${akTeileWahl(D,b.box_pool,'pool',true)}</details>
    <label class="chk"><input type="checkbox" name="aktiv" ${b.status==='aktiv'?'checked':''}> Im Shop zeigen (aktiv)</label>
    <p class="hinweis bfeh" hidden></p></div><button class="btn hi">Speichern</button></form>`,f=>{ const fo=$('#bf',f); const cent=s=>Math.round(parseFloat(String(s).replace(/\./g,'').replace(',','.'))*100)||0;
    fo.onsubmit=async e=>{ e.preventDefault(); const groessen=fo.gr.value.split(',').map(s=>s.trim()).filter(Boolean).map((s,i)=>{ const [g,n]=s.split(':').map(x=>x.trim()); return {groesse:g,bestand:n===undefined||n===''?'':+n,sort:i,aktiv:true}; });
      const p={id:b.id||null,titel:fo.titel.value,slug:fo.slug.value,untertitel:fo.untertitel.value,beschreibung:fo.beschreibung.value,preis:cent(fo.preis.value),box_wert:cent(fo.wert.value),box_teile:+fo.teile.value,
        einkauf:fo.ek.value?cent(fo.ek.value):'',box_pool:$$('[name=pool]:checked',f).map(x=>x.value),groessen,status:fo.aktiv.checked?'aktiv':'entwurf'};
      try{ await rpc('shop_bo_box_speichern',{p}); zu(); toast('Gespeichert'); A.aktTab='boxen'; geh('aktionen'); }catch(x){ const h=$('.bfeh',f); h.textContent=x.message; h.hidden=false; } }; }); }
function packEditor(x,D){ const box=D.boxen.find(b=>b.id===x.produkt_id)||{box_pool:[]}; const pool=new Set(box.box_pool||[]);
  const teile=D.produkte.filter(p=>p.art!=='box'&&(!pool.size||pool.has(p.id))); const opt=sel=>`<option value="">bitte wählen</option>${teile.map(p=>`<optgroup label="${esc(p.titel)} · ${eur(p.preis)}">${p.varianten.map(v=>`<option value="${v.id}" data-wert="${v.preis}" ${v.id===sel?'selected':''} ${v.bestand===0&&v.id!==sel?'disabled':''}>${esc(p.titel)} ${esc(v.groesse)}${v.bestand!=null?' ('+v.bestand+' da)':''}</option>`).join('')}</optgroup>`).join('')}`;
  const n=x.teile||3; const vorh=nr=>x.inhalt.filter(c=>c.nr===nr);
  fenster(`<h2 class="t">Box packen · ${esc(x.nummer)}</h2><p style="color:var(--ink3);font-size:14px">${esc(x.name)} · ${esc(x.titel)} ${esc(x.groesse||'')} · Warenwert mindestens <b>${eur(x.box_wert)}</b> je Box</p>
    <form class="stack" id="pf">${Array.from({length:x.menge},(_,k)=>k+1).map(nr=>`<div class="karte form" data-box="${nr}"><h2>Box ${nr} <small class="pwert"></small></h2>${Array.from({length:Math.max(n,vorh(nr).length)},(_,j)=>`<div class="feld"><select name="t">${opt((vorh(nr)[j]||{}).variante_id)}</select></div>`).join('')}</div>`).join('')}
    <p class="hinweis pfeh" hidden></p><button class="btn hi">Speichern</button></form>`,f=>{ const fo=$('#pf',f);
    const rechne=()=>$$('[data-box]',f).forEach(k=>{ const w=$$('select',k).reduce((a,s)=>a+(+(s.selectedOptions[0]?.dataset.wert||0)),0); const el=$('.pwert',k); el.textContent=eur(w)+(w<x.box_wert?' · reicht noch nicht':' · passt'); el.style.color=w<x.box_wert?'var(--warn)':'var(--ok)'; });
    $$('select',f).forEach(s=>s.onchange=rechne); rechne();
    fo.onsubmit=async e=>{ e.preventDefault(); const inhalt=[]; $$('[data-box]',f).forEach(k=>$$('select',k).forEach(s=>{ if(s.value)inhalt.push({nr:+k.dataset.box,variante_id:s.value}); }));
      try{ await rpc('shop_bo_box_packen',{p_position:x.position_id,p_inhalt:inhalt}); zu(); toast('Gepackt. Bestand ist umgebucht.'); A.aktTab='boxen'; geh('aktionen'); }catch(er){ const h=$('.pfeh',f); h.textContent=er.message; h.hidden=false; } }; }); }
/* ---------- Vereinsgeschichte & Retro-Linien (074) ---------- */
const RT_ST=[['idee','Idee'],['recherche','In Recherche'],['entwurf','Entwurf'],['freigegeben','Freigegeben'],['verworfen','Verworfen']];
const RT_PILL={idee:'',recherche:'neu',entwurf:'warn',freigegeben:'ok',verworfen:'aus'};
const RT_ARTEN=['Meister','Aufstieg','Pokal','Gründung','Fusion','Sonstiges'];
function rtBeleg(s){ return s==='belegt'?'<span class="pill ok">belegt</span>':'<span class="pill warn">unsicher</span>'; }
function rtUrl(u){ try{ const x=new URL(String(u)); return /^https?:$/.test(x.protocol)?x:null; }catch(e){ return null; } }
function rtQuellen(q){ const L=(Array.isArray(q)?q:[]).map(rtUrl).filter(Boolean); if(!L.length)return '<span style="color:var(--ink3)">keine Quelle</span>';
  return L.map(x=>`<a href="${esc(x.href)}" target="_blank" rel="noopener noreferrer" style="white-space:nowrap">${esc(x.hostname.replace(/^www\./,''))} ↗</a>`).join(' · '); }
function rtZeilen(t){ return String(t||'').split(/\s+/).map(s=>s.trim()).filter(s=>rtUrl(s)); }
S.retro=async m=>{
  const D=A.retro=await rpc('shop_bo_retro'); const offen=D.notizen.filter(n=>!n.erledigt);
  const unsicher=D.erfolge.filter(e=>e.status!=='belegt').length+D.trikots.filter(t=>t.status!=='belegt').length;
  m.innerHTML=`<div class="rt"><div class="kopfz"><div><h1>Retro-Linien</h1><p style="max-width:70ch">Vereinsgeschichte als Grundlage für Kollektionen nach Gründungsjahren und Titeln, von SV, BSC und dem Gesamtverein 1896. Jede Angabe ist <b>belegt</b> oder <b>unsicher</b>. Ein Trikot entsteht erst, wenn seine Vorlage belegt ist.</p></div>
    <div class="btnreihe"><button class="btn rand" id="rtE">+ Erfolg eintragen</button><button class="btn hi" id="rtT">+ Trikot eintragen</button></div></div>
  <div class="raster r4" style="margin-bottom:18px">${[[D.linien.length,'Linien geplant'],[D.erfolge.length,'Erfolge und Daten'],[unsicher,'noch unsicher'],[offen.length,'offene Fragen']].map(([n,t])=>`<div class="karte"><b style="font:800 30px/1 var(--cond)">${n}</b><p style="color:var(--ink3);font-size:13px;margin-top:4px">${t}</p></div>`).join('')}</div>
  <h2 style="font:800 22px/1.1 var(--cond);text-transform:uppercase;margin:6px 0 10px">Kollektionen</h2>
  <div class="raster r2" id="rtLin">${D.linien.map(l=>`<div class="karte"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;flex-wrap:wrap"><b style="font:800 22px/1.1 var(--cond);text-transform:uppercase">${esc(l.name)}</b><span style="display:flex;gap:6px">${rtBeleg(l.belegt)}<span class="pill ${RT_PILL[l.status]||''}">${esc((RT_ST.find(x=>x[0]===l.status)||[,''])[1])}</span></span></div>
    <p style="font-size:13.5px;color:var(--ink2);margin:6px 0">${esc(l.basis||'')}</p><p style="font-size:13px;margin:0"><b>Trikot:</b> ${esc(l.trikot_vorschlag||'offen')}</p>${l.notiz?`<p style="font-size:13px;color:var(--ink3);margin-top:6px;white-space:pre-wrap">${esc(l.notiz)}</p>`:''}
    <div class="btnreihe" style="margin-top:10px"><button class="btn rand klein" data-rtl="${esc(l.key)}">Status und Notiz</button></div></div>`).join('')||'<div class="leer">Noch keine Linien</div>'}</div>
  <h2 style="font:800 22px/1.1 var(--cond);text-transform:uppercase;margin:22px 0 10px">Gründungen</h2>
  <div class="karte"><div class="scroll"><table class="tabelle"><thead><tr><th>Verein</th><th class="r">Gegründet</th><th>Farben</th><th>Stand</th><th>Quellen</th></tr></thead><tbody>${D.vereine.map(v=>`<tr><td><b>${esc(v.name)}</b><br><small style="color:var(--ink3)">${esc(v.gruendung_detail||'')}</small></td><td class="r"><b>${v.gruendung||'offen'}</b></td><td>${esc(v.farben||'offen')}</td><td>${rtBeleg(v.status)}</td><td style="font-size:13px">${rtQuellen(v.quellen)}</td></tr>`).join('')}</tbody></table></div></div>
  <h2 style="font:800 22px/1.1 var(--cond);text-transform:uppercase;margin:22px 0 10px">Zeitleiste: Titel, Aufstiege, Fusion</h2>
  <div class="karte"><div class="scroll"><table class="tabelle" id="rtErf"><thead><tr><th>Saison</th><th>Verein</th><th>Was</th><th>Liga</th><th>Stand</th><th>Quellen</th></tr></thead><tbody>${D.erfolge.map(e=>`<tr class="klick" data-rte="${e.id}"><td class="r" style="text-align:left"><b>${esc(e.saison||e.jahr||'')}</b></td><td>${esc(e.verein)}</td><td><span class="pill ${e.art==='Meister'?'warn':e.art==='Aufstieg'?'neu':''}">${esc(e.art)}</span></td><td>${esc(e.liga||'')}${e.notiz?`<br><small style="color:var(--ink3)">${esc(e.notiz.length>160?e.notiz.slice(0,158)+' …':e.notiz)}</small>`:''}</td><td>${rtBeleg(e.status)}</td><td style="font-size:13px">${rtQuellen(e.quellen)}</td></tr>`).join('')||'<tr><td class="leer" colspan="6">Noch nichts eingetragen</td></tr>'}</tbody></table></div></div>
  <h2 style="font:800 22px/1.1 var(--cond);text-transform:uppercase;margin:22px 0 10px">Trikots von damals</h2>
  <div class="raster r2">${D.trikots.map(t=>`<div class="karte klick" data-rtt="${t.id}" style="cursor:pointer"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b>${esc(t.verein)} · ${esc(t.saison||'')}</b>${rtBeleg(t.status)}</div>
    <p style="font-size:13.5px;color:var(--ink2);margin:6px 0">${esc(t.beschreibung||'')}</p><p style="font-size:13px;margin:0">${[['Farben',t.farben],['Hersteller',t.hersteller],['Sponsor',t.sponsor]].map(([k,v])=>`<b>${k}:</b> ${esc(v||'offen')}`).join(' · ')}</p>
    ${(t.foto_urls||[]).map(rtUrl).filter(Boolean).length?`<p style="font-size:13px;margin-top:6px"><b>Fotos:</b> ${rtQuellen(t.foto_urls)}</p>`:''}</div>`).join('')||'<div class="leer">Noch keine Trikots</div>'}</div>
  <h2 style="font:800 22px/1.1 var(--cond);text-transform:uppercase;margin:22px 0 10px">Nachbau mit heutigen Modellen</h2>
  <div class="raster r3">${D.modelle.map(x=>{ const u=rtUrl(x.url); return `<div class="karte"><b>${esc(x.hersteller)}</b><p style="font-size:14px;margin:2px 0 6px">${u?`<a href="${esc(u.href)}" target="_blank" rel="noopener noreferrer">${esc(x.modell)} ↗</a>`:esc(x.modell)}</p>
    ${x.passt_zu?`<p style="font-size:13px;margin:0 0 6px"><b>Passt zu:</b> ${esc(x.passt_zu)}</p>`:''}<p style="font-size:13px;color:var(--ink2);margin:0">${esc(x.eignung||'')}</p>${x.nachbau_hinweis?`<p style="font-size:13px;color:var(--ink3);margin-top:6px">${esc(x.nachbau_hinweis)}</p>`:''}</div>`; }).join('')}</div>
  <h2 style="font:800 22px/1.1 var(--cond);text-transform:uppercase;margin:22px 0 10px">Offene Fragen und wo es Antworten gibt</h2>
  <div class="raster r2"><div class="karte"><h3 style="margin:0 0 8px">Fragen</h3><div class="stack" id="rtF">${rtNotizen(D.notizen,'frage')}</div></div><div class="karte"><h3 style="margin:0 0 8px">Quellen vor Ort</h3><div class="stack" id="rtQ">${rtNotizen(D.notizen,'quelle')}</div></div></div>
  <form class="karte form" id="rtN" style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end"><div class="feld" style="flex:0 0 160px"><label>Art</label><select name="art"><option value="frage">Frage</option><option value="quelle">Quelle</option></select></div><div class="feld" style="flex:1;min-width:220px"><label>Text</label><input name="text" maxlength="2000" required placeholder="z. B. Festschrift 1996 bei der Geschäftsstelle anfragen"></div><button class="btn">Dazu</button></form></div>`;
  $('#rtE').onclick=()=>rtErfolg(null); $('#rtT').onclick=()=>rtTrikot(null);
  $$('[data-rte]',m).forEach(r=>r.onclick=e=>{ if(e.target.closest('a'))return; rtErfolg(D.erfolge.find(x=>x.id===r.dataset.rte)); });
  $$('[data-rtt]',m).forEach(r=>r.onclick=e=>{ if(e.target.closest('a'))return; rtTrikot(D.trikots.find(x=>x.id===r.dataset.rtt)); });
  $$('[data-rtl]',m).forEach(b=>b.onclick=()=>rtLinie(D.linien.find(x=>x.key===b.dataset.rtl)));
  $$('[data-rtn]',m).forEach(c=>c.onchange=async()=>{ try{ await rpc('shop_bo_retro_save',{p:{tabelle:'notiz',id:c.dataset.rtn,daten:{erledigt:c.checked}}}); toast(c.checked?'Erledigt':'Wieder offen'); }catch(e){ toast(e.message); c.checked=!c.checked; } });
  $('#rtN').onsubmit=async e=>{ e.preventDefault(); const f=new FormData(e.target); try{ await rpc('shop_bo_retro_save',{p:{tabelle:'notiz',daten:{art:f.get('art'),text:f.get('text')}}}); toast('Notiert'); geh('retro'); }catch(x){ toast(x.message); } };
};
function rtNotizen(N,art){ const L=N.filter(n=>n.art===art); return L.map(n=>`<label style="display:flex;gap:10px;align-items:flex-start;font-size:13.5px;${n.erledigt?'color:var(--ink3);text-decoration:line-through':''}"><input type="checkbox" data-rtn="${n.id}" ${n.erledigt?'checked':''} style="margin-top:3px"><span>${esc(n.text)}</span></label>`).join('')||'<p class="leer">Nichts offen</p>'; }
async function rtSpeichern(p,f){ try{ await rpc('shop_bo_retro_save',{p}); zu(); toast('Gespeichert'); geh('retro'); }catch(e){ const h=$('.rtfehl',f); if(h){ h.textContent=e.message; h.hidden=false; } else toast(e.message); } }
function rtErfolg(e){ const neu=!e; e=e||{verein:'SV Mörlenbach',art:'Meister',status:'unsicher',quellen:[]};
  fenster(`<h2 class="t">${neu?'Erfolg eintragen':'Erfolg bearbeiten'}</h2><form class="stack" id="rf"><div class="karte form">
    <div class="f2"><div class="feld"><label>Verein</label><input name="verein" list="rtV" value="${esc(e.verein)}" required><datalist id="rtV"><option>SV Mörlenbach</option><option>BSC Mörlenbach</option><option>SV/BSC Mörlenbach</option><option>SV Mörlenbach 1896 (Gesamtverein)</option></datalist></div>
      <div class="feld"><label>Was</label><select name="art">${RT_ARTEN.map(a=>`<option ${e.art===a?'selected':''}>${a}</option>`).join('')}</select></div></div>
    <div class="f2"><div class="feld"><label>Saison</label><input name="saison" value="${esc(e.saison||'')}" placeholder="1992/93"></div><div class="feld"><label>Jahr</label><input name="jahr" type="number" min="1850" max="2100" value="${e.jahr||''}"></div></div>
    <div class="f2"><div class="feld"><label>Liga</label><input name="liga" value="${esc(e.liga||'')}"></div><div class="feld"><label>Mannschaft</label><input name="mannschaft" value="${esc(e.mannschaft||'')}" placeholder="1. Mannschaft"></div></div>
    <div class="feld"><label>Notiz</label><textarea name="notiz" rows="3" maxlength="3000">${esc(e.notiz||'')}</textarea></div>
    <div class="feld"><label>Quellen (eine Adresse je Zeile)</label><textarea name="quellen" rows="3">${esc((e.quellen||[]).join('\n'))}</textarea></div>
    <div class="feld"><label>Stand</label><select name="status"><option value="unsicher" ${e.status!=='belegt'?'selected':''}>unsicher</option><option value="belegt" ${e.status==='belegt'?'selected':''}>belegt (Quelle vorhanden)</option></select></div>
    <p class="hinweis rtfehl" hidden></p></div><div class="btnreihe"><button class="btn hi">Speichern</button>${neu?'':'<button type="button" class="btn weg" id="rfx">Löschen</button>'}</div></form>`,f=>{
    $('#rf',f).onsubmit=ev=>{ ev.preventDefault(); const d=Object.fromEntries(new FormData(ev.target)); d.quellen=rtZeilen(d.quellen); rtSpeichern({tabelle:'erfolg',id:e.id||null,daten:d},f); };
    const x=$('#rfx',f); if(x){ let sicher=false; x.onclick=()=>{ if(!sicher){ sicher=true; x.textContent='Wirklich löschen?'; return; } rtSpeichern({tabelle:'erfolg',id:e.id,loeschen:'ja',daten:{verein:e.verein,art:e.art}},f); }; } }); }
function rtTrikot(t){ const neu=!t; t=t||{verein:'SV Mörlenbach',status:'unsicher',quellen:[],foto_urls:[]};
  fenster(`<h2 class="t">${neu?'Trikot eintragen':'Trikot bearbeiten'}</h2><form class="stack" id="rf"><div class="karte form">
    <div class="f2"><div class="feld"><label>Verein</label><input name="verein" value="${esc(t.verein)}" required></div><div class="feld"><label>Saison</label><input name="saison" value="${esc(t.saison||'')}" placeholder="1992/93"></div></div>
    <div class="f2"><div class="feld"><label>Farben</label><input name="farben" value="${esc(t.farben||'')}" placeholder="royalblau, weißer Kragen"></div><div class="feld"><label>Hersteller</label><input name="hersteller" value="${esc(t.hersteller||'')}" placeholder="JAKO"></div></div>
    <div class="f2"><div class="feld"><label>Sponsor</label><input name="sponsor" value="${esc(t.sponsor||'')}"></div><div class="feld"><label>Jahr</label><input name="jahr" type="number" min="1850" max="2100" value="${t.jahr||''}"></div></div>
    <div class="feld"><label>Beschreibung</label><textarea name="beschreibung" rows="3" maxlength="3000">${esc(t.beschreibung||'')}</textarea></div>
    <div class="feld"><label>Fotos (eine Adresse je Zeile)</label><textarea name="foto_urls" rows="2">${esc((t.foto_urls||[]).join('\n'))}</textarea></div>
    <div class="feld"><label>Quellen (eine Adresse je Zeile)</label><textarea name="quellen" rows="2">${esc((t.quellen||[]).join('\n'))}</textarea></div>
    <div class="feld"><label>Stand</label><select name="status"><option value="unsicher" ${t.status!=='belegt'?'selected':''}>unsicher</option><option value="belegt" ${t.status==='belegt'?'selected':''}>belegt (Foto oder Quelle)</option></select></div>
    <p class="hinweis rtfehl" hidden></p></div><div class="btnreihe"><button class="btn hi">Speichern</button>${neu?'':'<button type="button" class="btn weg" id="rfx">Löschen</button>'}</div></form>`,f=>{
    $('#rf',f).onsubmit=ev=>{ ev.preventDefault(); const d=Object.fromEntries(new FormData(ev.target)); d.quellen=rtZeilen(d.quellen); d.foto_urls=rtZeilen(d.foto_urls); rtSpeichern({tabelle:'trikot',id:t.id||null,daten:d},f); };
    const x=$('#rfx',f); if(x){ let sicher=false; x.onclick=()=>{ if(!sicher){ sicher=true; x.textContent='Wirklich löschen?'; return; } rtSpeichern({tabelle:'trikot',id:t.id,loeschen:'ja',daten:{verein:t.verein}},f); }; } }); }
function rtLinie(l){ fenster(`<h2 class="t">${esc(l.name)}</h2><form class="stack" id="rf"><div class="karte form">
    <div class="feld"><label>Status</label><select name="status">${RT_ST.map(([k,t])=>`<option value="${k}" ${l.status===k?'selected':''}>${t}</option>`).join('')}</select></div>
    <div class="feld"><label>Trikot-Vorschlag</label><textarea name="trikot_vorschlag" rows="2" maxlength="1000">${esc(l.trikot_vorschlag||'')}</textarea></div>
    <div class="feld"><label>Notiz</label><textarea name="notiz" rows="4" maxlength="3000" placeholder="z. B. Freigabe Vorstand, Gemeinde, Rechte am Wappen">${esc(l.notiz||'')}</textarea></div>
    <p class="hinweis rtfehl" hidden></p></div><button class="btn hi">Speichern</button></form>`,f=>{ $('#rf',f).onsubmit=ev=>{ ev.preventDefault(); rtSpeichern({tabelle:'linie',id:l.key,daten:Object.fromEntries(new FormData(ev.target))},f); }; }); }
S.einstellungen=async m=>{
  const c=await rpc('shop_bo_einstellungen'); const darf=c._darf_aendern; const V=c.versand||{}, Ab=c.abholung||{}, Z=c.zahlarten||{}, B=c.bank||{}, Vk=c.verkaeufer||{}, P=c.pixel||{}, So=c.social||{}, Pt=c.partner||{}, On=Z.online||{}, Kn=Object.assign({newsletter:true,whatsapp:true,push:true},c.kanaele||{});
  const FELDER={sammel:'Sammelbestellung',nummer:'Bestellnummer',datum:'Bestelldatum',vorname:'Vorname',nachname:'Nachname',empfaenger:'Empfänger',strasse:'Straße',hausnr:'Hausnummer',zusatz:'Adresszusatz',plz:'PLZ',ort:'Ort',land:'Land',email:'E-Mail',telefon:'Telefon',artikelnr:'Artikelnummer',artikel:'Artikel',groesse:'Größe',farbe:'Farbe',menge:'Menge',flock_name:'Flock Name',flock_nummer:'Flock Nummer',ek:'EK',hinweis:'Hinweis'};
  const ro=darf?'':'disabled';
  m.innerHTML=`<div class="kopfz"><div><h1>Einstellungen</h1>${darf?'':'<p>Nur ansehen. Ändern darf, wer „Shop-Einstellungen“ hat (Admin).</p>'}</div></div>
  <form class="stack" id="ef" style="max-width:900px">
  <div class="karte form"><h2>Shop</h2><label class="chk" style="font-weight:700"><input type="checkbox" name="offen" ${c.offen?'checked':''} ${ro}> Store ist geöffnet (Bestellungen möglich)</label>${c.offen?'':'<p class="hinweis">Vorher prüfen: Impressum (Anschrift, Vorstand, Registernummer), AGB, Widerruf und Datenschutz vom Verein freigeben lassen, IBAN eintragen.</p>'}<div class="f2"><div class="feld"><label>Name</label><input name="name" value="${esc(c.name||'')}" ${ro}></div><div class="feld"><label>Hinweisleiste oben</label><input name="banner" value="${esc(c.banner||'')}" ${ro}></div></div>
    <div class="f2"><div class="feld"><label>„Nur noch wenige“ ab</label><input name="wenig_ab" type="number" min="0" value="${c.wenig_ab??3}" ${ro}><small>Stück pro Größe (nicht bei Drops)</small></div><label class="chk"><input type="checkbox" name="ku" ${c.kleinunternehmer?'checked':''} ${ro}> Kleinunternehmer (keine MwSt. ausweisen)</label></div></div>
  <div class="karte form"><h2>Versand</h2><label class="chk"><input type="checkbox" name="vA" ${V.aktiv?'checked':''} ${ro}> Versand anbieten</label>
    <div class="f2"><div class="feld"><label>Versandkosten (€)</label><input name="vP" value="${zuEur(V.preis)}" ${ro}></div><div class="feld"><label>Kostenlos ab (€)</label><input name="vF" value="${zuEur(V.frei_ab)}" ${ro}></div><div class="feld"><label>Lieferzeit</label><input name="vD" value="${esc(V.dauer||'')}" ${ro}></div></div></div>
  <div class="karte form"><h2>Abholung</h2><label class="chk"><input type="checkbox" name="aA" ${Ab.aktiv?'checked':''} ${ro}> Abholung anbieten</label>
    ${(Ab.orte||[]).map((o,i)=>`<div class="f2"><div class="feld"><label>Ort ${i+1}</label><input name="oT${i}" value="${esc(o.titel)}" ${ro}></div><div class="feld"><label>Hinweis</label><input name="oH${i}" value="${esc(o.hinweis||'')}" ${ro}></div></div>`).join('')}</div>
  <div class="karte form"><h2>Partner und Sammelbestellung</h2><p style="color:var(--ink3)">Bezahlte Bestellungen gehen gesammelt per Mail mit CSV an den Partner. Er schickt direkt und kostenlos an die Kunden und stellt uns eine Rechnung.</p>
    <div class="f2"><label class="chk" style="font-weight:700"><input type="checkbox" name="ptA" ${Pt.aktiv?'checked':''} ${ro}> Automatisch senden</label><label class="chk"><input type="checkbox" name="ptT" ${Pt.testmodus!==false?'checked':''} ${ro}> Testmodus (Mail nur an Kopie-Adressen)</label></div>
    <div class="f2"><div class="feld"><label>Partner</label><input name="ptN" value="${esc(Pt.name||'')}" ${ro}></div><div class="feld"><label>Ansprechpartner</label><input name="ptK" value="${esc(Pt.kontakt||'')}" ${ro}></div><div class="feld"><label>E-Mail des Partners</label><input name="ptE" type="email" value="${esc(Pt.email||'')}" ${ro}></div><div class="feld"><label>Kopie an (Komma getrennt)</label><input name="ptC" value="${esc((Pt.kopie||[]).join(', '))}" ${ro}><small>Bekommt jede Sammelmail und im Testmodus nur sie</small></div></div>
    <div class="f2"><div class="feld"><label>Tag</label><select name="ptD" ${ro}>${TAGE.slice(1).map((t,i)=>`<option value="${i+1}" ${(Pt.tag||5)===i+1?'selected':''}>${t}</option>`).join('')}</select></div><div class="feld"><label>Uhrzeit</label><select name="ptS" ${ro}>${Array.from({length:24},(_,h)=>`<option value="${h}" ${(Pt.stunde??10)===h?'selected':''}>${h}:00 Uhr</option>`).join('')}</select></div><div class="feld"><label>Lieferzeit (steht im Shop)</label><input name="ptL" value="${esc(Pt.lieferzeit||'')}" maxlength="120" ${ro}></div></div>
    <div class="feld"><label>CSV-Spalten (eine pro Zeile: Spaltenname;Feld)</label><textarea name="ptCsv" rows="8" ${ro} style="font-family:ui-monospace,monospace;font-size:13px">${esc((Pt.csv_spalten||[]).map(x=>x[0]+';'+x[1]).join('\n'))}</textarea><small>Felder: ${Object.keys(FELDER).join(', ')}. Sobald die Muster-CSV vom Partner da ist, hier die Spaltennamen anpassen.</small></div>
    <div class="f2"><div class="feld"><label>Trennzeichen</label><select name="ptTr" ${ro}><option value=";" ${(Pt.csv_trenner||';')===';'?'selected':''}>Semikolon (Excel)</option><option value="," ${Pt.csv_trenner===','?'selected':''}>Komma</option></select></div>
      <div class="feld"><label>Nachlass auf Teamsport-Artikel (%)</label><input name="ptR" type="number" min="0" max="80" step="0.5" value="${Pt.rabatt??45}" ${ro}><small>Für „EK aus UVP“ im Produkt</small></div>
      <div class="feld"><label>Clubshop des Partners (Link im Footer)</label><input name="ptCs" type="url" value="${esc(Pt.clubshop_url||'')}" placeholder="https://www.11teamsports.com/de-de/clubshop/…" ${ro}></div></div>
    <div class="f2"><div class="feld"><label>Rückvergütung (eine Stufe pro Zeile: ab €;Prozent)</label><textarea name="ptSt" rows="4" ${ro} style="font-family:ui-monospace,monospace;font-size:13px">${esc((Pt.staffel||[]).map(x=>(x[0]/100)+';'+x[1]).join('\n'))}</textarea><small>Freiware zu UVP nach der Saison (01.07. bis 30.06.)</small></div>
      <div class="feld"><label>Weitere Umsätze beim Partner (Saison;Betrag €;Notiz)</label><textarea name="ptWu" rows="4" ${ro} style="font-family:ui-monospace,monospace;font-size:13px" placeholder="2026/27;4200;Erstausstattung Teamportal">${esc((Pt.weitere_umsaetze||[]).map(x=>[x.saison,(x.betrag/100),x.notiz||''].join(';')).join('\n'))}</textarea><small>Teamportal, Clubshop, manuelle Bestellungen: zählen alle zur Stufe</small></div></div></div>
  <div class="karte form"><h2>Wer bestellen darf</h2><p style="color:var(--ink3)">Absprache mit dem Partner: Vertragsware wird nicht an Externe verkauft. Für die gewählten Linien fragt die Kasse, wie jemand zum Verein gehört. Die neutrale Merch-Kollektion können alle bestellen.</p>
    <label class="chk" style="font-weight:700"><input type="checkbox" name="zgA" ${(c.zugehoerigkeit||{}).aktiv?'checked':''} ${ro}> Zugehörigkeit in der Kasse abfragen</label>
    <div class="btnreihe">${[['mannschaft','Mannschaft (Teamline)'],['1896','1896'],['merch','Merch']].map(([k,t])=>`<label class="chk"><input type="checkbox" name="zgL" value="${k}" ${((c.zugehoerigkeit||{}).linien||[]).includes(k)?'checked':''} ${ro}> ${t}</label>`).join('')}</div>
    <div class="feld"><label>Auswahl in der Kasse (eine pro Zeile)</label><textarea name="zgO" rows="5" ${ro}>${esc(((c.zugehoerigkeit||{}).optionen||[]).join('\n'))}</textarea></div></div>
  <div class="karte form"><h2>Bezahlung</h2><label class="chk" style="font-weight:700"><input type="checkbox" name="zO" ${On.aktiv?'checked':''} ${ro}> Online bezahlen (Stripe: PayPal, Karte, Apple Pay, Google Pay, Klarna)</label><label class="chk"><input type="checkbox" name="zP" ${On.paypal!==false?'checked':''} ${ro}> PayPal in der Kasse als eigene Zahlart zeigen (in Stripe muss PayPal eingeschaltet sein)</label>
    <p style="font-size:13.5px;color:var(--ink3)">Erst einschalten, wenn das Stripe-Konto des Vereins eingerichtet ist und die Schlüssel in Supabase hinterlegt sind. Welche Zahlarten erscheinen, stellst du im Stripe-Dashboard ein.</p>
    <div class="f2"><label class="chk"><input type="checkbox" name="zV" ${Z.vorkasse&&Z.vorkasse.aktiv?'checked':''} ${ro}> Überweisung (Vorkasse)</label><div class="feld"><label>Zahlungsfrist (Tage)</label><input name="zF" type="number" min="1" max="30" value="${(Z.vorkasse||{}).frist_tage||7}" ${ro}><small>Danach plus 2 Tage Puffer automatisch storniert</small></div><label class="chk"><input type="checkbox" name="zB" ${Z.bar&&Z.bar.aktiv?'checked':''} ${ro}> Bar bei Abholung</label></div>
    <div class="f2"><div class="feld"><label>Kontoinhaber</label><input name="bI" value="${esc(B.inhaber||'')}" ${ro}></div><div class="feld"><label>IBAN</label><input name="bN" value="${esc(B.iban||'')}" ${ro}></div><div class="feld"><label>BIC</label><input name="bB" value="${esc(B.bic||'')}" ${ro}></div><div class="feld"><label>Bank</label><input name="bK" value="${esc(B.bank||'')}" ${ro}></div></div>
    ${!B.iban?'<p class="hinweis">Noch keine IBAN eingetragen. Kunden sehen dann „Bankverbindung kommt per E-Mail“.</p>':''}</div>
  <div class="karte form"><h2>Verkäufer (Impressum, Rechnung)</h2><div class="f2"><div class="feld"><label>Name</label><input name="kN" value="${esc(Vk.name||'')}" ${ro}></div><div class="feld"><label>Abteilung</label><input name="kA" value="${esc(Vk.abteilung||'')}" ${ro}></div><div class="feld"><label>Straße</label><input name="kS" value="${esc(Vk.strasse||'')}" ${ro}></div><div class="feld"><label>PLZ</label><input name="kP" value="${esc(Vk.plz||'')}" ${ro}></div><div class="feld"><label>Ort</label><input name="kO" value="${esc(Vk.ort||'')}" ${ro}></div>
    <div class="feld"><label>E-Mail</label><input name="kE" value="${esc(Vk.email||'')}" ${ro}></div><div class="feld"><label>Telefon</label><input name="kT" value="${esc(Vk.telefon||'')}" ${ro}></div><div class="feld"><label>Vertreten durch</label><input name="kV" value="${esc(Vk.vertreten||'')}" ${ro}></div><div class="feld"><label>Vereinsregister</label><input name="kR" value="${esc(Vk.register||'')}" ${ro}></div><div class="feld"><label>USt-ID</label><input name="kU" value="${esc(Vk.ust_id||'')}" ${ro}></div></div>
    <div class="feld"><label>Antworten auf Shop-Mails gehen an</label><input name="kAw" type="email" value="${esc(c.antwort_an||'')}" placeholder="${esc(Vk.email||'')}" ${ro}><small>Wenn Kunden oder der Partner auf eine Mail antworten. Leer = E-Mail des Verkäufers.</small></div></div>
  <div class="karte form" id="kanaele"><h2>Kanäle: Newsletter, WhatsApp, Push</h2><p style="color:var(--ink3)">Wer sich unter „Dabei sein“ anmeldet, bekommt Neuigkeiten über diese Wege. Kampagnen schreibst du unter Community.</p>
    <div class="f2"><label class="chk"><input type="checkbox" name="knN" ${Kn.newsletter!==false?'checked':''} ${ro}> Newsletter per E-Mail</label><label class="chk"><input type="checkbox" name="knW" ${Kn.whatsapp!==false?'checked':''} ${ro}> WhatsApp</label><label class="chk"><input type="checkbox" name="knP" ${Kn.push!==false?'checked':''} ${ro}> Push in der App</label></div>
    <div class="f2"><div class="feld"><label>Absendername</label><input name="knA" value="${esc(Kn.absender||'')}" maxlength="60" ${ro}></div><div class="feld"><label>WhatsApp-Nummer des Shops</label><input name="knWa" value="${esc(Kn.wa_nummer||'')}" placeholder="+49 …" inputmode="tel" ${ro}><small>Die Business-Nummer bei Superchat. Kunden schicken „START 1896 Code“ dorthin.</small></div></div>
    <div class="feld"><label>WhatsApp läuft über</label><div class="btnreihe"><label class="chk"><input type="radio" name="knAn" value="meta" ${(Kn.anbieter||(Kn.meta_phone_id?'meta':'superchat'))==='meta'?'checked':''} ${ro}> Meta direkt (offizielle WhatsApp Business API)</label><label class="chk"><input type="radio" name="knAn" value="superchat" ${(Kn.anbieter||(Kn.meta_phone_id?'meta':'superchat'))==='superchat'?'checked':''} ${ro}> Superchat</label></div></div>
    <div class="f2 kn-meta"><div class="feld"><label>Meta Phone-Number-ID</label><input name="knMp" value="${esc(Kn.meta_phone_id||'')}" inputmode="numeric" placeholder="1234567890" ${ro}><small>Meta Business › WhatsApp Manager › API-Einrichtung</small></div><div class="feld"><label>Vorlage (Template-Name)</label><input name="knMt" value="${esc(Kn.meta_template||'')}" placeholder="neuigkeiten" ${ro}><small>Freigegebene Marketing-Vorlage mit einer Variable {{1}}</small></div><div class="feld"><label>Sprache der Vorlage</label><input name="knMs" value="${esc(Kn.meta_sprache||'de')}" maxlength="8" ${ro}></div></div>
    <div class="f2"><div class="feld"><label>Superchat Channel-ID</label><input name="knC" value="${esc(Kn.sc_channel||'')}" placeholder="mc_…" ${ro}><small>Superchat › Einstellungen › Kanäle</small></div><div class="feld"><label>Superchat Template-ID</label><input name="knT" value="${esc(Kn.sc_template||'')}" placeholder="tn_…" ${ro}><small>Freigegebene WhatsApp-Vorlage mit einer Variable {{1}}</small></div></div>
    <div class="feld"><label>Text der Einwilligung</label><textarea name="knE" rows="3" maxlength="400" ${ro}>${esc(Kn.einwilligung||'')}</textarea></div>
    <div class="feld"><label>Webhook für eingehende WhatsApp-Nachrichten</label><div class="kanal-url" id="knHook"><small style="color:var(--ink3)">wird geladen …</small></div><small>Meta: im App-Dashboard unter WhatsApp › Konfiguration als Callback-URL eintragen, Prüf-Token wie angezeigt, Feld „messages“ abonnieren. Superchat: unter Integrationen › Webhooks, Ereignis „Nachricht eingegangen“. Dann bestätigt START die Anmeldung automatisch und STOP meldet ab.</small></div></div>
  <div class="karte form"><h2>Werbe-Pixel und Social Media</h2><div class="f2"><div class="feld"><label>Meta-Pixel-ID</label><input name="pM" value="${esc(P.meta||'')}" inputmode="numeric" ${ro}></div><div class="feld"><label>TikTok-Pixel-ID</label><input name="pT" value="${esc(P.tiktok||'')}" ${ro}></div><div class="feld"><label>Google Analytics (G-…)</label><input name="pG" value="${esc(P.ga4||'')}" ${ro}></div></div>
    <div class="f2"><div class="feld"><label>Instagram-Link</label><input name="sI" value="${esc(So.instagram||'')}" ${ro}></div><div class="feld"><label>TikTok-Link</label><input name="sT" value="${esc(So.tiktok||'')}" ${ro}></div><div class="feld"><label>Facebook-Link</label><input name="sF" value="${esc(So.facebook||'')}" ${ro}></div></div></div>
  <div id="eFeh"></div>${darf?'<div class="btnreihe"><button class="btn hi">Einstellungen speichern</button></div>':''}</form>`;
  fn('shop-kanaele',{aktion:'webhook_url'}).then(r=>{ const h=$('#knHook',m); if(!h)return; const meta=r.anbieter==='meta'; const u=meta?r.meta_url:r.url;
    h.innerHTML=`<code>${esc(u)}</code><button type="button" class="btn rand klein" id="knKopie">Kopieren</button> ${meta?`<span class="pill ${r.meta_token?'ok':'warn'}">${r.meta_token?'Zugangs-Token da':'WHATSAPP_TOKEN fehlt'}</span> <span class="pill ${r.meta_secret?'ok':'warn'}">${r.meta_secret?'App-Secret da':'WHATSAPP_APP_SECRET fehlt'}</span>`:`<span class="pill ${r.superchat?'ok':'warn'}">${r.superchat?'API-Schlüssel da':'API-Schlüssel fehlt'}</span>`}
      ${meta?`<div style="flex-basis:100%;font-size:13px;color:var(--ink2)">Prüf-Token für Meta: <code>${esc(r.meta_verify)}</code> <button type="button" class="btn rand klein" id="knKopie2">Kopieren</button></div>`:''}`;
    $('#knKopie',m).onclick=()=>navigator.clipboard.writeText(u).then(()=>toast('Kopiert'),()=>toast('Bitte markieren und kopieren'));
    const k2=$('#knKopie2',m); if(k2)k2.onclick=()=>navigator.clipboard.writeText(r.meta_verify).then(()=>toast('Kopiert'),()=>toast('Bitte markieren und kopieren')); }).catch(x=>{ const h=$('#knHook',m); if(h)h.innerHTML=`<small style="color:var(--ink3)">Nicht erreichbar: ${esc(x.message)}</small>`; });
  if(A.anker){ const z=document.getElementById(A.anker); A.anker=''; if(z)setTimeout(()=>z.scrollIntoView({behavior:'smooth',block:'start'}),60); }
  if(!darf)return;
  const fo=$('#ef',m);
  fo.onsubmit=async e=>{ e.preventDefault(); const g=n=>fo[n]?fo[n].value.trim():'';
    const p={offen:fo.offen.checked,name:g('name'),banner:g('banner'),wenig_ab:+g('wenig_ab')||0,kleinunternehmer:fo.ku.checked,
      versand:Object.assign({},V,{aktiv:fo.vA.checked,preis:cent(g('vP'))||0,frei_ab:cent(g('vF')),dauer:g('vD')}),
      abholung:{aktiv:fo.aA.checked,orte:(Ab.orte||[]).map((o,i)=>({id:o.id,titel:g('oT'+i)||o.titel,hinweis:g('oH'+i)}))},
      zahlarten:Object.assign({},Z,{vorkasse:Object.assign({},Z.vorkasse,{aktiv:fo.zV.checked,frist_tage:+g('zF')||7}),bar:Object.assign({},Z.bar,{aktiv:fo.zB.checked}),online:Object.assign({},On,{aktiv:fo.zO.checked,paypal:fo.zP?fo.zP.checked:On.paypal!==false})}),
      partner:Object.assign({},Pt,{aktiv:fo.ptA.checked,testmodus:fo.ptT.checked,name:g('ptN'),kontakt:g('ptK'),email:g('ptE').toLowerCase(),kopie:g('ptC').split(/[,;\s]+/).map(x=>x.trim().toLowerCase()).filter(Boolean),tag:+g('ptD')||5,stunde:+g('ptS'),lieferzeit:g('ptL'),csv_trenner:g('ptTr')||';',
        csv_spalten:fo.ptCsv.value.split('\n').map(z=>z.split(';').map(x=>x.trim())).filter(z=>z[0]&&z[1]),
        rabatt:+g('ptR')||45,clubshop_url:g('ptCs'),
        staffel:fo.ptSt.value.split('\n').map(z=>z.split(';').map(x=>x.trim().replace(',','.'))).filter(z=>z[0]&&z[1]).map(z=>[Math.round(+z[0]*100),+z[1]]).filter(z=>z[0]>0&&z[1]>0).sort((a,b)=>a[0]-b[0]),
        weitere_umsaetze:fo.ptWu.value.split('\n').map(z=>z.split(';').map(x=>x.trim())).filter(z=>/^\d{4}\/\d{2}$/.test(z[0])&&cent(z[1])).map(z=>({saison:z[0],betrag:cent(z[1]),notiz:(z[2]||'').slice(0,80)}))}),
      zugehoerigkeit:{aktiv:fo.zgA.checked,linien:$$('[name=zgL]:checked',fo).map(x=>x.value),optionen:fo.zgO.value.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,12)},
      bank:{inhaber:g('bI'),iban:g('bN').replace(/\s/g,'').toUpperCase(),bic:g('bB').toUpperCase(),bank:g('bK')},
      verkaeufer:{name:g('kN'),abteilung:g('kA'),strasse:g('kS'),plz:g('kP'),ort:g('kO'),email:g('kE'),telefon:g('kT'),vertreten:g('kV'),register:g('kR'),ust_id:g('kU')},
      antwort_an:g('kAw').toLowerCase(),
      kanaele:Object.assign({},c.kanaele||{},{newsletter:fo.knN.checked,whatsapp:fo.knW.checked,push:fo.knP.checked,absender:g('knA'),wa_nummer:g('knWa'),sc_channel:g('knC'),sc_template:g('knT'),einwilligung:g('knE'),anbieter:(fo.querySelector('[name=knAn]:checked')||{}).value||'meta',meta_phone_id:g('knMp').replace(/\D/g,''),meta_template:g('knMt'),meta_sprache:g('knMs')||'de'}),
      pixel:{meta:g('pM'),tiktok:g('pT').toUpperCase(),ga4:g('pG').toUpperCase()},social:{instagram:g('sI'),tiktok:g('sT'),facebook:g('sF')}};
    const unbek=p.partner.csv_spalten.filter(z=>!FELDER[z[1]]); if(unbek.length){ $('#eFeh').innerHTML=`<div class="hinweis">Unbekanntes CSV-Feld: ${esc(unbek.map(z=>z[1]).join(', '))}</div>`; return; }
    if(!p.partner.csv_spalten.length){ $('#eFeh').innerHTML='<div class="hinweis">Die CSV braucht mindestens eine Spalte.</div>'; return; }
    if(!p.zahlarten.vorkasse.aktiv&&!p.zahlarten.bar.aktiv&&!p.zahlarten.online.aktiv){ $('#eFeh').innerHTML='<div class="hinweis">Mindestens eine Zahlart muss an sein.</div>'; return; }
    if(p.bank.iban&&!/^DE\d{20}$/.test(p.bank.iban.replace(/\s/g,''))){ $('#eFeh').innerHTML='<div class="hinweis">Die IBAN sieht nicht nach einer deutschen IBAN aus (DE + 20 Ziffern).</div>'; return; }
    try{ await rpc('shop_bo_einstellungen_speichern',{p}); toast('Einstellungen gespeichert'); $('#eFeh').innerHTML=''; }catch(x){ $('#eFeh').innerHTML=`<div class="hinweis">${esc(x.message)}</div>`; } };
};

start().catch(e=>{ document.body.innerHTML=`<div class="login"><div class="karte"><h1>Fehler</h1><p>${esc(e.message)}</p></div></div>`; });
})();
