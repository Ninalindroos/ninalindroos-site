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


### 0b. The media embeds — done

"Kuuntele ja katso" now holds the real players, from Nina's own list:

| Slot | Player | Source |
|---|---|---|
| Soolo | YouTube, 16:9, own row | Händerna mot himlen, *Ääni ratkaisee*, The Voice of Finland 2026 |
| Jazzbändi | Spotify, 352 px | Min evighet, EP *Jag andas in*, 2025 |
| Vieraileva artisti | Spotify, 352 px | L.O.V.E, Acoustic Dixie Six feat. Nina Lindroos, 2023 |

Below, **Muita ääninäytteitä** holds four more Spotify tracks in the compact
152 px player: *Antaa olla* (2021), *Hunajainen – A Taste of Honey* (Riki Sorsa
& Nina Lindroos, 2013), *Den våren* (2021) and *On the Street Where You Live*
(Grani Big Band, live, Åke's Jazz Festival).

Three things to know before editing them:

- **Heights are per type, not a shared ratio.** Spotify only draws the cover art
  at `352px`; below that the card collapses to a thin row with no image. The
  compact player is `152px`. YouTube is `16:9`. The classes are
  `.media__embed--track`, `--mini` and `--video`.
- **`&theme=0` on every Spotify URL.** Without it Spotify tints the whole card
  from the cover art, which put magenta and orange blocks next to the gold.
  With it the card is neutral dark and the artwork reads *better*, not worse.
- **Partybändi and Duo have no player** — the duo recording could not go up on
  YouTube for rights reasons. Nina's act names for them (`Nina & The Party Band`,
  `Nina & Nygge`) sit on the line-up cards instead, as `.ens__act`, since those
  cards already carry the photos.

All seven iframes are `loading="lazy"`, so they cost nothing until scrolled to.
They are third-party frames that set cookies — if a consent banner is ever added,
these are what it has to gate.

### 1. Social and streaming links

Wired up, from Nina's own brand document and verified where possible:

| Platform | Link |
|---|---|
| YouTube | `youtube.com/@NinaLindroos` — confirmed, the channel resolves by name |
| Instagram | `instagram.com/nina_lindroos` |
| TikTok | `tiktok.com/@lindhni` |
| Facebook | `facebook.com/nina.lindroos1` |
| Spotify | `open.spotify.com/artist/6fSB2ETywxqSjTmRN5jZI2` — confirmed by her releases |

All five are live. Note that YouTube points at **`@NinaLindroos`**, her own channel —
not `youtube.com/channel/UCmIDgrLlOhgMCZqA1B4cqNw`, which is the auto-generated
"aihekanava" (Topic) channel YouTube creates from distribution metadata. Her uploads
live on the handle channel.

### 2. Domain

`index.html` has `<link rel="canonical" href="https://ninalindroos.fi/">` and the
`og:image` path. Update the canonical URL to the real domain before launch.

---

## The booking form

The site is static, so the form has no server. On submit, `script.js` opens the
visitor's mail client with every field pre-filled, addressed to
`nina@ninalindroos.fi`. It works everywhere and costs nothing, but it does depend
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

## Testimonials stay in their original language

Each quote is **pinned** to the language the person actually gave it in, and does not
follow the language toggle — translating someone's words and publishing them under their
name is a claim about what they said. Those `<blockquote>` elements carry no `data-fi` /
`data-sv` / `data-en`, just a `lang` attribute so screen readers pronounce them correctly:

| Person | Quote shown in |
|---|---|
| Antti Harsunen, GraniAID | Finnish |
| Tom Gordin, Helsinki Horse Show | Swedish |
| Tomas Malmström, Klobben | Swedish |
| Karin Nylund, Ekenäs Sparbank | Swedish |

The **captions** (name, role, occasion) are our own words, so those still translate.
To change a quote's language, edit the text and the `lang` attribute together.

**The one exception is Hans Rautio's pull quote** in the band strip under the hero. It
*does* follow the toggle, because Nina supplied all three wordings herself — so the
Swedish and English are his approved texts, not our translation of his Finnish. If that
quote is ever reworded, all three `data-*` attributes have to be changed together, and
the new wording has to come from him or from Nina, not from us.

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

## Vercel test environment

`vercel.json` and `.vercelignore` configure this repo as a **test deployment**: no build
step, repo root as the output directory, long cache on `/assets`, and only the ~430 KB
the page actually needs (the source PNGs, the brand PDF and the unused wordmarks are
excluded from the upload, though they stay in the repo).

⚠️ **`vercel.json` sends `X-Robots-Tag: noindex, nofollow` on every response.** That is
correct for a test URL — it stops Google indexing `*.vercel.app` and competing with the
real domain. **Remove that header before ninalindroos.fi points here**, or the live site
will be invisible to search engines.

Note also that Vercel's free Hobby plan is for non-commercial use, and this is a
commercial site — fine for testing, but production on Vercel needs a paid plan. See
"Deploying" below for the Netlify route.

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

---

## Images — one file per screen, not one file for all screens

Every photo ships at two widths and the browser picks. Before this, each was a
single file: 900px shown at 625px, which is 0.72x on a 2x screen — soft on most
phones and laptops — while wasting bytes on a 1x one. A 1x visitor now downloads
**441 KB instead of 739 KB**, and a 2x visitor gets a genuinely sharp image.

| Image | Widths | Source |
|---|---|---|
| hero | 1440, 2880 | `Nina Hero picture 2.png`, 2880x1520 |
| jazzband, duo, guest | 700, 1400 | masters in OneDrive (see below) |
| partyband, solo | 700, 900 | **no master found — 900px is the ceiling** |

The hero also carries `fetchpriority="high"` and a `<link rel="preload">`,
because it is the LCP element and was otherwise not discovered until the parser
reached it.

### Two traps if you regenerate these

**The hero master has Nina's script logo in the bottom right.** It was painted
out once, and regenerating from the raw master puts it back — it lands directly
on top of the `LINDROOS` lettering. The paint-out is a patch over roughly
x 2225-2755, y 780-1380 in the 2880px master, lifted from the previously
published image. Check that corner on any new hero.

**There are two hero PNGs and only `picture 2` is the right one.** `picture 1`
is a different frame entirely. Compare against the published image before
trusting either.

### Masters

```
OneDrive/Totte/Concultancy/Customers/Nina/Hemsida/
  AD6_Nina_Nya_Paviljongen_2019_photo_Thomas_Törnkvist.jpg   -> jazzband
  20230310_095730.jpg                                        -> duo
  IMG-20251129-WA0007.jpg                                    -> guest
  Repo source files/Nina Hero picture 2.png                  -> hero
```

`partyband` and `solo` were not matched to anything in that folder. If their
originals turn up, regenerate them at 1400w the same way and add the candidate
to the `srcset`; nothing else needs touching.

Crops were recovered by scanning each master for the square crop that best
matched the published file — all three landed within 1.0-2.2 mean pixel
difference, so the framing is unchanged.
