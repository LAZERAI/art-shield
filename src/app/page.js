import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">

      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Stop Art <span className="text-[var(--accent)]">Theft</span>
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-xl mx-auto mb-3">
          Free tools to prove your art is yours, watermark it, and send takedown notices when someone steals it.
        </p>
        <p className="text-sm text-[var(--accent)]/80 mt-4">
          Everything runs in your browser. We never see your files.
        </p>
      </section>

      {/* Tools */}
      <section className="grid md:grid-cols-2 gap-5 mb-16">
        <Link href="/proof" className="group block p-6 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
            Proof of Ownership
          </h2>
          <p className="text-sm text-[var(--muted)]">
            Upload your art and get a SHA-256 hash certificate with a timestamp. A unique digital fingerprint that proves you had the file first.
          </p>
        </Link>

        <Link href="/watermark" className="group block p-6 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
            Watermark
          </h2>
          <p className="text-sm text-[var(--muted)]">
            Add visible text, custom signature images, or invisible embedded watermarks to your art. Multiple layers make removal significantly harder.
          </p>
        </Link>

        <Link href="/dmca" className="group block p-6 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
            DMCA Generator
          </h2>
          <p className="text-sm text-[var(--muted)]">
            Generate a proper DMCA takedown notice for Twitter, Instagram, TikTok, YouTube, or Reddit. Fill out the form and send it to the platform.
          </p>
        </Link>

        <Link href="/resources" className="group block p-6 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
            Resources
          </h2>
          <p className="text-sm text-[var(--muted)]">
            Nightshade, Glaze, Pixsy, Cara, BlueSky &mdash; tools and platforms the art community actually recommends for protection.
          </p>
        </Link>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto space-y-6 text-sm text-[var(--muted)]">
        <h2 className="text-xl font-bold text-[var(--foreground)]">Frequently Asked Questions</h2>

        <div>
          <h3 className="font-semibold text-[var(--foreground)] mb-1">Do you store my images?</h3>
          <p>No. Everything happens in your browser using the Canvas API and Web Crypto API. Your art never touches any server. You can verify this in DevTools &mdash; zero network requests when you use the tools.</p>
        </div>

        <div>
          <h3 className="font-semibold text-[var(--foreground)] mb-1">Can I stop people from downloading my art on Twitter?</h3>
          <p>Unfortunately, no. Twitter serves images as plain files from their CDN and strips all metadata. The best defense is proving you created it first (proof of ownership), adding watermarks that are hard to remove, and filing DMCA takedowns when you catch someone stealing.</p>
        </div>

        <div>
          <h3 className="font-semibold text-[var(--foreground)] mb-1">Is the proof certificate valid in court?</h3>
          <p>The SHA-256 hash is cryptographically solid &mdash; the same technology used in blockchain and digital signatures. It&apos;s not a formal copyright registration (US Copyright Office, ~$65), but it serves as strong supplementary evidence. Email the certificate to yourself for a third-party timestamp.</p>
        </div>

        <div>
          <h3 className="font-semibold text-[var(--foreground)] mb-1">What about AI scraping?</h3>
          <p>Check out <Link href="/resources" className="text-[var(--accent)] hover:underline">Nightshade and Glaze</Link> in our Resources page. They add invisible perturbations to your images that corrupt AI model training. Use them before posting anywhere.</p>
        </div>
      </section>
    </div>
  );
}
