# Nina Lindroos — artistsajt

One-page artist site built on direction **4a** from the design canvas: type-driven,
near-black, champagne gold, `Newsreader` for display + `Karla` for interface.
Bilingual **SV / FI** with a language toggle.

Static HTML/CSS/JS — no build step, no dependencies. Open `index.html` or drop the
folder on any host.

```
index.html      markup + all copy (both languages)
styles.css      design system (colours, type, layout)
script.js       language toggle + booking form
assets/
  wordmark-gold.png       gold knockout of the real wordmark, for dark backgrounds
  wordmark-original.png   the original rose-gold mark, for light backgrounds / print
  nina-portratt.jpg/.webp portrait, 1200×1600, left cell of the band strip
  nina-portratt-original.jpg  full-resolution master (1536×2048) — regenerate from this
  nina-portratt-2.jpg/.webp   second portrait, 1200×1600, middle cell of the band strip
  nina-portratt-2-original.jpg  full-resolution master (1536×2048)
  og-image.jpg            1200×630 social share image
  favicon.svg             NL monogram
```

---

## Before it goes live — 3 things to fill in

### 0. The five testimonials

The third cell of the band strip is a testimonial carousel, currently holding five
**placeholders** ("Här kommer omdöme 1 av 5…" / "Namn Efternamn · Tillfälle, ort").
Replace the `data-sv` and `data-fi` text on each `.tstm__quote` and `.tstm__by`.

Sliding is pure CSS (`scroll-snap`), so it swipes on a phone and works with JavaScript
off; the dots and arrows are an enhancement on top. To change how many there are, add
or remove a `.tstm__item` **and** the matching number of `.tstm__dot` buttons — the
script reads both from the DOM, so nothing else needs touching.


### 0b. The five media embeds

"Lyssna och se" holds five 16:9 **placeholders** — one per line-up plus konferencierskap.
Replace each `<div class="media__embed">…</div>` with a real player and fill in the
caption below it:

```html
<div class="media__embed">
  <iframe src="https://open.spotify.com/embed/track/YOUR-ID" loading="lazy"
          title="Partyband" allow="encrypted-media"></iframe>
</div>
```

`.media__embed iframe` is already styled to fill the box, so nothing else is needed.
The captions (`.media__meta`) are placeholders too — `[låt · tillfälle · plats · år]`.

### 1. Social and streaming links

Placeholder `href="#"` links are marked with `data-platform`. Search `index.html`
for `data-platform` and paste the real URLs:

| Where | Attribute | Put in |
|---|---|---|
| Music section | `data-platform="spotify"` | Spotify artist URL |
| Music section | `data-platform="youtube"` | YouTube channel URL |
| Music section, footer | `data-platform="tiktok"` | TikTok profile |
| Footer | `data-platform="facebook"` | Facebook page |
| Footer | `data-platform="instagram"` | Instagram profile |

### 2. Domain

`index.html` has `<link rel="canonical" href="https://ninalindroos.fi/">` and the
`og:image` path. Update the canonical URL to the real domain before launch.

---

## The booking form

The site is static, so the form has no server. On submit, `script.js` opens the
visitor's mail client with every field pre-filled, addressed to
`ninacharlind@gmail.com`. It works everywhere and costs nothing, but it does depend
on the visitor having a mail client set up.

**To use a real form service instead** (recommended if you want submissions to land
reliably): sign up with Formspree, Netlify Forms or similar, then in `index.html`:

```html
<form class="book__form" id="bokform" action="https://formspree.io/f/YOUR-ID" method="POST">
```

…and delete the `form.addEventListener('submit', …)` block at the bottom of
`script.js` so the browser posts normally.

---

## Languages

Three: **Finnish (default), Swedish, English.** Every translatable string lives in
`index.html` as `data-fi` / `data-sv` / `data-en` attributes on the element. To edit
copy, change **all three** — the text between the tags is only the first paint, and
holds the Finnish wording.

```html
<h2 data-sv="MUSIKEN" data-fi="MUSIIKKI" data-en="THE MUSIC">MUSIIKKI</h2>
```

Screen-reader labels use the same pattern with `-aria`
(`data-fi-aria` / `data-sv-aria` / `data-en-aria`), applied as `aria-label`.

Page title and meta description per language live in the `META` object in `script.js`;
the booking email's field labels live in `MAIL`.

**The site always opens in Finnish.** Browser-language detection is deliberately off, so
a Finnish visitor on an English-language phone still gets Finnish. The order is:
`?lang=sv` / `?lang=en` in the URL → the visitor's last choice (localStorage) → Finnish.
To switch back to detecting the browser language, restore the `navigator.language`
check in `initialLang()`.

Adding a fourth language means: add `data-xx` to every translatable element, add an
entry to `LANGS`, `META` and `MAIL`, and add a button to `.topbar__lang`.

## Design tokens

Change these in `:root` in `styles.css` and the whole site follows:

| Token | Value | Role |
|---|---|---|
| `--ink` | `#17161a` | page background |
| `--ink-2` | `#1e1d22` | booking section |
| `--gold` | `#d9bd86` | the only accent |
| `--paper` | `#f7f4ee` | body text |
| `--display` | Newsreader | headings, names, quotes |
| `--ui` | Karla | navigation, labels, body |

Fonts load from Google Fonts. To self-host, download both families and swap the
`<link>` in `<head>` for local `@font-face` rules.

---

## Deploying

Any static host works — Netlify, Vercel, GitHub Pages, Cloudflare Pages, or plain
FTP to a web hotel. Drag the folder in; there is nothing to build.

To preview locally:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

---

## Notes on content

- Copy, ensembles, releases, venues and contact details come from the design canvas,
  which drew on Nina's CV and brand material.
- The line *"Karismatisk, mångsidig och uttrycksfull…"* is presented as Nina's own
  positioning, not as a press quote. **The Voice of Finland · säsong 15** sits beneath
  it as a separate credential rather than as the source of the quote — worth keeping
  that separation unless there is a real, attributable review to quote.
- The short ensemble descriptions for **Nina & Nygge** and **Grani Big Band** were
  written from the format notes only (`duo · 2 mus.`, guest artist). Worth a read-through
  by Nina.
- Stats (`20+`, `6`, `2`, `15`) are taken from the canvas — check they are still current.
