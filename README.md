# ArtShield

free browser-based tools to help artists protect their work from theft.

**live site:** [artshield.vercel.app](https://artshield.vercel.app)

---

## what is this

a set of tools for artists who are tired of getting their art stolen on twitter/instagram/tiktok/etc. everything runs 100% in your browser — your images never leave your device, no server uploads, no tracking.

built this because the advice on reddit basically boiled down to "watermark everything and file DMCAs" but there wasn't a single place that made it all easy.

## tools

### proof of ownership
drop your art in and get a SHA-256 hash certificate with a timestamp. it's a unique digital fingerprint — if someone claims your art is theirs, this proves you had the original file. the hash changes if even a single pixel is different.

### watermark
put your name on your art before you post it. pick the position, size, and opacity. supports tiling too for full coverage. not foolproof but it adds friction.

### dmca takedown generator
fill out a form and get a proper DMCA takedown notice ready to send. has templates for twitter/x, instagram, tiktok, youtube, and reddit with the correct email addresses.

### resources
curated list of tools the art community actually recommends: nightshade, glaze, pixsy, cara, tineye, etc. pulled from reddit threads and artist communities.

## privacy

- **zero server uploads** — all image processing uses the browser's Canvas API and Web Crypto API
- **no analytics, no cookies, no tracking**
- open your devtools network tab while using it if you don't believe me

## run it locally

```bash
git clone https://github.com/YOUR_USERNAME/art-shield.git
cd art-shield
npm install
npm run dev
```

open [localhost:3000](http://localhost:3000)

## tech

- next.js (app router)
- react
- tailwind css
- web crypto API (SHA-256 hashing)
- canvas API (watermarking + certificate generation)

## contributing

if you know of a tool or resource that should be listed, open an issue or PR. always looking for more stuff that actually helps artists.

## license

MIT — do whatever you want with it.
