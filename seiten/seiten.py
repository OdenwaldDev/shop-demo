#!/usr/bin/env python3
"""Seiten für Google: Titel, Beschreibung, strukturierte Daten (Store, Verein, Produkt mit Preis), Sitemap.
Wird von build.py benutzt UND liegt im Live-Repo unter seiten/seiten.py: Eine GitHub-Aktion ruft es jede Nacht auf,
holt den aktuellen Katalog und legt für neue Artikel eigene Seiten an (Agent „Seiten“).
Aufruf im Repo: python3 seiten/seiten.py   (liest seiten/vorlage.html und seiten/konfig.json)"""
import json, os, sys, html as H_, datetime, urllib.request

LINIEN = {'mannschaft': 'Mannschaft', '1896': '1896', 'merch': 'Merch'}
esc = lambda s: H_.escape(str(s or ''), quote=True)

def store_ld(domain):
    return {'@type': 'OnlineStore', '@id': f'https://{domain}/#store', 'name': 'SV Mörlenbach Store',
            'alternateName': ['1896 Store', 'SV Moerlenbach Store', 'Fanshop SV Mörlenbach'], 'url': f'https://{domain}/',
            'logo': f'https://{domain}/img/icon-512.png', 'image': f'https://{domain}/img/og/start.jpg', 'areaServed': 'DE',
            'description': 'Offizieller Fanshop des SV Mörlenbach 1896 e.V.: Trikots, Hoodies, Schals, Mützen und limitierte 1896-Drops.',
            'parentOrganization': {'@type': 'SportsOrganization', '@id': f'https://{domain}/#verein', 'name': 'SV Mörlenbach 1896 e.V.', 'alternateName': 'SV Moerlenbach',
                                   'foundingDate': '1896', 'sport': 'Fußball',
                                   'address': {'@type': 'PostalAddress', 'addressLocality': 'Mörlenbach', 'postalCode': '69509', 'addressRegion': 'Hessen', 'addressCountry': 'DE'}}}

def website_ld(domain):
    return {'@type': 'WebSite', '@id': f'https://{domain}/#web', 'name': 'SV Mörlenbach Store', 'url': f'https://{domain}/', 'inLanguage': 'de-DE', 'publisher': {'@id': f'https://{domain}/#store'}}

def brot_ld(domain, teile):
    return {'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': f'https://{domain}/{p}'} for i, (n, p) in enumerate(teile)]}

def bild_url(domain, b):
    if not b: return f'https://{domain}/img/og/start.jpg'
    if b.startswith('http'): return b
    return f'https://{domain}/img/{b}.webp'

def produkt_ld(domain, d):
    """d = Eintrag aus shop_katalog (Preise in Cent)."""
    verfuegbar = any(v.get('verfuegbar') for v in d.get('varianten') or [])
    avail = 'https://schema.org/PreOrder' if d.get('drop') and d.get('live') else 'https://schema.org/InStock' if verfuegbar else 'https://schema.org/OutOfStock'
    preise = sorted({int(v.get('preis') or d['preis']) for v in d.get('varianten') or []} or {int(d['preis'])})
    offer = {'@type': 'Offer', 'url': f"https://{domain}/p/{d['slug']}", 'priceCurrency': 'EUR', 'price': f'{preise[0] / 100:.2f}', 'availability': avail,
             'itemCondition': 'https://schema.org/NewCondition', 'seller': {'@id': f'https://{domain}/#store'},
             'shippingDetails': {'@type': 'OfferShippingDetails', 'shippingRate': {'@type': 'MonetaryAmount', 'value': '0', 'currency': 'EUR'},
                                 'shippingDestination': {'@type': 'DefinedRegion', 'addressCountry': 'DE'}},
             'hasMerchantReturnPolicy': {'@type': 'MerchantReturnPolicy', 'applicableCountry': 'DE', 'returnPolicyCategory': 'https://schema.org/MerchantReturnFiniteReturnWindow',
                                         'merchantReturnDays': 14, 'returnMethod': 'https://schema.org/ReturnByMail'}}
    if len(preise) > 1:
        offer = {'@type': 'AggregateOffer', 'lowPrice': f'{preise[0] / 100:.2f}', 'highPrice': f'{preise[-1] / 100:.2f}', 'priceCurrency': 'EUR', 'offerCount': len(preise), 'offers': [offer]}
    return {'@type': 'Product', 'name': d['titel'], 'sku': d['slug'], 'description': (d.get('beschreibung') or d.get('untertitel') or d['titel'])[:500],
            'image': [bild_url(domain, b) for b in (d.get('bilder') or [])[:4]] or [bild_url(domain, '')],
            'brand': {'@type': 'Brand', 'name': 'SV Mörlenbach'}, 'category': LINIEN.get(d.get('linie'), 'Merch'), 'offers': offer}

def ld_html(teile):
    return '<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': teile}, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + '</script>'

def seite(tpl, titel, text, pfad, og, ld, h1=None):
    return (tpl.replace('__TITLE__', esc(titel)).replace('__DESC__', esc(text)).replace('__PFAD__', pfad).replace('__OG__', og)
            .replace('__LD__', ld_html(ld)).replace('__H1__', esc(h1 or titel.split(' · ')[0])))

def produkt_seite(tpl, domain, d, og_da):
    titel = f"{d['titel']} · SV Mörlenbach Store"
    text = (d.get('beschreibung') or d.get('untertitel') or f"{d['titel']} vom SV Mörlenbach. Kostenloser Versand nach Hause.").replace('\n', ' ')
    if len(text) > 158: text = text[:155].rsplit(' ', 1)[0] + ' …'
    ld = [store_ld(domain), produkt_ld(domain, d), brot_ld(domain, [('Start', ''), (LINIEN.get(d.get('linie'), 'Merch'), d.get('linie') or 'merch'), (d['titel'], 'p/' + d['slug'])])]
    return seite(tpl, titel, text, 'p/' + d['slug'], 'p-' + d['slug'] if og_da('p-' + d['slug']) else 'start', ld, d['titel'])

def sitemap(domain, pfade, heute=None):
    heute = heute or datetime.date.today().isoformat()
    return ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            + ''.join(f'  <url><loc>https://{domain}/{p}</loc><lastmod>{heute}</lastmod></url>\n' for p in pfade) + '</urlset>\n')

def katalog(url, anon):
    r = urllib.request.Request(url.rstrip('/') + '/rest/v1/rpc/shop_katalog', data=b'{}', method='POST',
                               headers={'Content-Type': 'application/json', 'apikey': anon, 'Authorization': 'Bearer ' + anon})
    with urllib.request.urlopen(r, timeout=30) as x: return json.load(x)

# ---------- Nächtlicher Lauf im Live-Repo (GitHub-Aktion) ----------
if __name__ == '__main__':
    W = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    K = json.load(open(os.path.join(W, 'seiten', 'konfig.json'))); tpl = open(os.path.join(W, 'seiten', 'vorlage.html'), encoding='utf-8').read()
    try: kat = katalog(K['url'], K['anon'])
    except Exception as e: print('Katalog nicht erreichbar:', e); sys.exit(0)
    og_da = lambda n: os.path.exists(os.path.join(W, 'img', 'og', n + '.jpg'))
    os.makedirs(os.path.join(W, 'p'), exist_ok=True); neu = 0
    produkte = [d for d in kat.get('produkte') or [] if d.get('slug')]
    for d in produkte:
        ziel = os.path.join(W, 'p', d['slug'] + '.html'); h = produkt_seite(tpl, K['domain'], d, og_da)
        alt = open(ziel, encoding='utf-8').read() if os.path.exists(ziel) else None
        if alt != h: open(ziel, 'w', encoding='utf-8').write(h); neu += 1
    vorhanden = sorted('p/' + f[:-5] for f in os.listdir(os.path.join(W, 'p')) if f.endswith('.html'))
    pfade = list(dict.fromkeys(K['feste'] + ['p/' + d['slug'] for d in produkte] + vorhanden))
    sm = sitemap(K['domain'], pfade); smp = os.path.join(W, 'sitemap.xml')
    alt = open(smp).read() if os.path.exists(smp) else ''
    if [l for l in alt.splitlines() if '<loc>' in l] != [l for l in sm.splitlines() if '<loc>' in l]: open(smp, 'w').write(sm)
    print(f'{len(produkte)} Produkte, {neu} Seiten neu oder geändert, Sitemap {len(pfade)} Adressen')
