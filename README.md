# ArtShield

Free browser-based tools to help artists protect their work from theft.

**Live Site:** [artshield.vercel.app](https://artshield.vercel.app)

---

## About

ArtShield is a collection of tools for artists who want to protect their work online. Everything runs 100% in the browser — images never leave your device. No server uploads, no tracking, no analytics.

## Tools

### Proof of Ownership
Upload your artwork and get a SHA-256 hash certificate with a timestamp. This creates a unique digital fingerprint that proves you had the original file at a specific time. The hash changes if even a single pixel is different.

### Watermark
Add visible text watermarks, overlay custom signature images, or embed invisible watermarks into your art. Supports multiple positions, tiling, opacity control, and LSB steganography for hidden messages that survive casual editing.

### DMCA Takedown Generator
Fill out a form and get a properly formatted DMCA takedown notice. Includes templates for Twitter/X, Instagram, TikTok, YouTube, and Reddit with the correct contact addresses.

### Resources
Curated list of tools and platforms the art community recommends: Nightshade, Glaze, Pixsy, Cara, TinEye, and more.

## Privacy

- **Zero server uploads** — all image processing uses the browser's Canvas API and Web Crypto API
- **No analytics, no cookies, no tracking**
- Verify this yourself — open DevTools Network tab while using any tool

## Run Locally

```bash
git clone https://github.com/LAZERAI/art-shield.git
cd art-shield
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000)

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Web Crypto API (SHA-256 hashing)
- Canvas API (watermarking + certificate generation)

## Contributing

If you know of a tool or resource that should be listed, open an issue or PR. Contributions are welcome.

## License

MIT
