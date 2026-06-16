# Maison Aveline Website Template

Maison Aveline is a responsive, multi-page static website template for a premium beauty salon or beauty studio. It is designed for Etsy buyers who want to customize the content, upload the site to their own hosting, and launch quickly without a framework or build step.

## What This Project Includes

- `index.html` - homepage
- `about.html` - brand story and studio values
- `services.html` - services overview
- `gallery.html` - visual gallery
- `pricing.html` - pricing and packages
- `contact.html` - contact and booking page
- `faq.html` - common questions
- `privacy.html` - privacy policy placeholder
- `imprint.html` - legal imprint placeholder
- `assets/css/style.css` - all layout, responsive, and visual styling
- `assets/js/main.js` - navigation, filtering, forms, language switching, and text translation logic
- `assets/img/` - images, icons, and visual assets
- `robots.txt` - crawl instructions for search engines
- `sitemap.xml` - sitemap for SEO

The site is static HTML, CSS, and JavaScript. There is no framework, no backend, and no build process.

## Requirements

- Node.js 18 or newer
- A code editor such as VS Code, Cursor, or WebStorm
- A static web host such as Netlify, Vercel, Cloudflare Pages, GitHub Pages, or a shared hosting account

You do not need to run `npm install`. There are no third-party dependencies.

## Run the Website Locally

### Start the development server

```bash
npm run dev
```

This starts the local server at:

```text
http://127.0.0.1:4321
```

### Open the browser automatically

```bash
npm run dev:open
```

### Alternative start command

```bash
npm start
```

This runs the same local server on port `4321`.

## How the Site Works

- The website is bilingual: German and English
- It defaults to the browser language
- Visitors can manually switch between `DE` and `EN` in the header
- The selected language is stored in the browser so it stays active across pages
- Internal links keep the selected locale through the `lang` parameter

## What To Change Before Publishing

If you bought this template on Etsy and want to launch it for your own brand, update the following items first.

### 1. Replace the business identity

Search and replace these values across the project:

- `Maison Aveline`
- `Maison Aveline Beauty Lounge`
- `Berlin-Mitte`
- `Rosenthaler Strasse 34`
- `+49 30 5487 2190`
- `hallo@maison-aveline.de`
- `https://www.maison-aveline.de/`

Most of these values appear in the HTML files, the footer, the legal pages, and the SEO metadata.

### 2. Update the page copy

Edit the page content in the HTML files:

- `index.html` for homepage text, hero copy, service summaries, testimonials, pricing teaser, and FAQ teaser
- `about.html` for the brand story, studio philosophy, and team information
- `services.html` for service names, descriptions, durations, and category labels
- `gallery.html` for gallery captions and section copy
- `pricing.html` for package names, prices, add-ons, and pricing notes
- `contact.html` for booking copy, contact details, opening hours, and form text
- `faq.html` for questions and answers
- `privacy.html` and `imprint.html` for the legal content placeholders

If you want another AI to write the text for you, this is the main part to hand over.

### 3. Replace the images

All images live in `assets/img/`.

You can either:

- replace the existing files with your own images using the same filenames, or
- update the `<img src="...">` references in the HTML files to point to your new assets

After changing the images, also update:

- `meta property="og:image"`
- `meta name="twitter:image"`
- the structured data image URLs in the JSON-LD blocks

### 4. Update SEO data

Every page contains SEO metadata that should match your own brand and domain.

Check and update:

- `<title>`
- `<meta name="description">`
- Open Graph tags such as `og:title`, `og:description`, `og:url`, `og:image`
- Twitter card tags
- JSON-LD structured data
- canonical URLs

If you change the domain, update all absolute URLs in the HTML files.

### 5. Update the sitemap and robots file

Before going live on your own domain, replace the template domain in:

- `robots.txt`
- `sitemap.xml`

These files currently point to the Maison Aveline placeholder domain and must match your real website URL.

### 6. Configure the contact form

The contact form is currently a front-end placeholder. It validates input in the browser, but it does not send emails by itself.

Before launch, connect it to one of these:

- a form service such as Formspree, Getform, Netlify Forms, or Basin
- a custom backend endpoint
- an email booking workflow used by your host or CRM

If you do nothing, the form will still look correct, but submissions will not be delivered anywhere.

### 7. Review the legal pages

The privacy policy and imprint are written as professional placeholders. They must be adapted to your own business and local legal requirements before publishing.

If you are not sure what your legal text should be, have it reviewed by a qualified professional.

### 8. Review the language system

The site ships with a browser-language based `DE / EN` switcher.

The translation strings live in:

- `assets/js/main.js`

If you want to change labels, add more copy, or remove the bilingual setup, that is the file to edit.

## Recommended Edit Order

1. Replace your business name, contact details, and address
2. Replace the images
3. Rewrite the page copy
4. Update the SEO metadata
5. Update `robots.txt` and `sitemap.xml`
6. Connect the contact form
7. Test the site locally in both languages
8. Upload the finished files to your host

## How To Upload To Your Host

This is a static website, so deployment is simple.

### Option 1: Static hosting

Upload the entire project root to a static host such as:

- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages
- AWS S3 static hosting
- a shared hosting control panel

Make sure the public web root contains the HTML files directly. Do not put the website inside an extra nested folder unless your host requires it.

### Option 2: Shared hosting or cPanel

Upload all public files to the hosting document root, usually:

- `public_html`
- `www`
- `htdocs`

The browser should be able to open `index.html` as the main landing page.

### Option 3: Upload via ZIP

If your host supports ZIP uploads:

1. Zip the project files
2. Upload the ZIP
3. Extract it into the public root directory
4. Make sure `index.html` is at the top level

## Launch Checklist

Before you publish, verify the following:

- the homepage loads correctly
- all menu links work
- all images render correctly
- the language switcher works for `DE` and `EN`
- the contact form is connected to a real submission destination
- the phone number and email address are correct
- the address and opening hours are correct
- the prices match your real offer
- the legal pages are filled in properly
- `robots.txt` and `sitemap.xml` contain the correct domain
- the live domain matches every canonical URL

## Local Testing Tips

- Open the site in a browser with `npm run dev`
- Test at least the homepage, services page, pricing page, and contact page
- Check mobile and desktop layouts
- Test both `?lang=de` and `?lang=en`
- Review the site after replacing images, because large images can change layout spacing

## Notes

- The template uses relative paths for assets, so it is portable across most hosts
- If you move the site into a subfolder, update the canonical URLs, sitemap, and Open Graph URLs accordingly
- If you remove or rename images, update every HTML reference that points to them
- If you want to remove English or German entirely, adjust the translation logic in `assets/js/main.js`

