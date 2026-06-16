# Maison Aveline

Luxuriöse, vollständig responsive Multi-Page-Website für einen Beauty-Salon bzw. Beauty-Shop.

## Lokale Entwicklung

Voraussetzung: Node.js 18+.

### Development Server starten

```bash
npm run dev
```

Die Website läuft dann unter `http://127.0.0.1:4321`.

### Browser automatisch öffnen

```bash
npm run dev:open
```

### Live Reload

Dateiänderungen lösen automatisch ein Neuladen im Browser aus. Der Server nutzt dafür nur Node-Bordmittel und benötigt keine externen Abhängigkeiten.

## Projektstruktur

- `index.html`
- `about.html`
- `services.html`
- `gallery.html`
- `pricing.html`
- `contact.html`
- `faq.html`
- `privacy.html`
- `imprint.html`
- `assets/css/style.css`
- `assets/js/main.js`
- `assets/img/*`
- `scripts/dev-server.js`
- `robots.txt`
- `sitemap.xml`

## Hinweise

- Die juristischen Seiten enthalten professionell strukturierte Platzhaltertexte und sollten vor Veröffentlichung individuell rechtlich geprüft werden.
- Canonicals, Open Graph, Twitter Cards und JSON-LD verwenden aktuell die Platzhalter-Domain `https://www.maison-aveline.de/`.
