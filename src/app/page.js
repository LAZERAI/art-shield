import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">

      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          stop art <span className="text-[var(--accent)]">theft</span>
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-xl mx-auto mb-3">
          tired of people stealing your art on twitter? yeah, us too.
        </p>
        <p className="text-lg text-[var(--muted)] max-w-xl mx-auto mb-6">
          free tools to prove your art is yours, watermark it, and send takedown notices when someone steals it.
        </p>
        <p className="text-sm text-[var(--accent)]/80">
          everything runs in your browser btw. we never see your art.
        </p>
      </section>

      {/* tools */}
      <section className="grid md:grid-cols-2 gap-5 mb-16">
        <Link href="/proof" className="group block p-6 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
            proof of ownership
          </h2>
          <p className="text-sm text-[var(--muted)]">
            upload your art, get a SHA-256 hash certificate with a timestamp.
            basically a digital fingerprint that proves you had the file first. if someone claims it&apos;s theirs, you have the receipt.
          </p>
        </Link>

        <Link href="/watermark" className="group block p-6 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
            watermark
          </h2>
          <p className="text-sm text-[var(--muted)]">
            slap your name on your art before posting. pick where it goes, how big, how visible.
            not bulletproof but it makes thieves think twice.
          </p>
        </Link>

        <Link href="/dmca" className="group block p-6 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
            dmca generator
          </h2>
          <p className="text-sm text-[var(--muted)]">
            someone stole your art? fill out a quick form and we&apos;ll generate a DMCA takedown notice you can send to twitter, instagram, tiktok, wherever.
          </p>
        </Link>

        <Link href="/resources" className="group block p-6 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
            resources
          </h2>
          <p className="text-sm text-[var(--muted)]">
            nightshade, glaze, pixsy, cara, bluesky — all the tools and platforms the art community actually recommends.
          </p>
        </Link>
      </section>

      {/* faq-ish */}
      <section className="max-w-2xl mx-auto space-y-6 text-sm text-[var(--muted)]">
        <h2 className="text-xl font-bold text-[var(--foreground)]">wait, how does this work?</h2>

        <div>
          <h3 className="font-semibold text-[var(--foreground)] mb-1">do you store my images?</h3>
          <p>no. literally everything happens in your browser. your art never touches any server. open devtools if you don&apos;t believe me — zero network requests when you use the tools.</p>
        </div>

        <div>
          <h3 className="font-semibold text-[var(--foreground)] mb-1">can I actually stop people from downloading my art on twitter?</h3>
          <p>honestly? no. twitter serves images as plain files from their CDN. they strip all your metadata too. the only real defense is proving you made it first (proof of ownership) + filing DMCA takedowns when you catch someone stealing.</p>
        </div>

        <div>
          <h3 className="font-semibold text-[var(--foreground)] mb-1">is the proof certificate legit in court?</h3>
          <p>the SHA-256 hash is cryptographically solid — the same tech used in blockchain and digital signatures. it&apos;s not a copyright registration (that&apos;s the US copyright office, ~$65), but it&apos;s strong supplementary evidence. email the certificate to yourself for a third-party timestamp from gmail/outlook.</p>
        </div>

        <div>
          <h3 className="font-semibold text-[var(--foreground)] mb-1">what about AI scraping?</h3>
          <p>check out <Link href="/resources" className="text-[var(--accent)] hover:underline">nightshade and glaze</Link> in our resources page. they poison your images so AI models that train on them produce garbage. use them before posting anywhere.</p>
        </div>
      </section>
    </div>
  );
}
