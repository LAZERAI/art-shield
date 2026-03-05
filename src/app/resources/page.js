const sections = [
  {
    title: "anti-AI tools",
    desc: "these mess up AI training data so scrapers can't learn from your work. use them before you post.",
    items: [
      {
        name: "Nightshade",
        url: "https://nightshade.cs.uchicago.edu/",
        desc: "Adds invisible perturbations to your images that corrupt AI model training. When scrapers ingest your Nightshaded art, they learn wrong associations.",
      },
      {
        name: "Glaze",
        url: "https://glaze.cs.uchicago.edu/",
        desc: "Protects against AI style mimicry. Adds subtle visual perturbations that prevent AI from learning your specific art style.",
      },
    ],
  },
  {
    title: "find your stolen art",
    desc: "these help you track down where your art ended up without your permission.",
    items: [
      {
        name: "Pixsy",
        url: "https://www.pixsy.com/",
        desc: "Crawls the web to find unauthorized uses of your images. Has legal tools to pursue takedowns and compensation.",
      },
      {
        name: "Google Reverse Image Search",
        url: "https://images.google.com/",
        desc: "Free. Upload your art to find where it appears online. Good first step to discover theft.",
      },
      {
        name: "TinEye",
        url: "https://tineye.com/",
        desc: "Reverse image search engine specialized in finding exact and modified copies of images across the web.",
      },
    ],
  },
  {
    title: "platforms that don't suck",
    desc: "places that actually try to protect artists instead of feeding your work to AI.",
    items: [
      {
        name: "Cara",
        url: "https://cara.app/",
        desc: "Social platform built for artists. Blocks AI scraping, has built-in Glaze integration. Anti-AI by design.",
      },
      {
        name: "BlueSky",
        url: "https://bsky.app/",
        desc: "Decentralized social network with good artist community. Supports block lists and labelers to filter AI content.",
      },
      {
        name: "ArtStation",
        url: "https://www.artstation.com/",
        desc: "Professional art portfolio. Has 'NoAI' meta tag option (CHECK YOUR SETTINGS — it's unchecked by default!).",
      },
    ],
  },
  {
    title: "legal stuff / DMCA links",
    desc: "where to file takedowns and what your actual rights are.",
    items: [
      {
        name: "Twitter/X Copyright Policy",
        url: "https://help.x.com/en/rules-and-policies/copyright-policy",
        desc: "File DMCA directly: copyright@x.com. They must respond within 24-48 hours.",
      },
      {
        name: "Instagram/Meta IP Report",
        url: "https://help.instagram.com/contact/552695131608132",
        desc: "Instagram's dedicated form for reporting intellectual property violations.",
      },
      {
        name: "EFF Artist's Guide",
        url: "https://www.eff.org/issues/intellectual-property",
        desc: "Know your rights. The EFF has guides on copyright, DMCA, and how to protect your creative work.",
      },
      {
        name: "US Copyright Office",
        url: "https://www.copyright.gov/registration/",
        desc: "Register your work for stronger legal protection. Costs ~$65 but gives you the ability to sue for statutory damages.",
      },
    ],
  },
  {
    title: "tips from other artists",
    desc: "stuff people on reddit actually recommend (not just generic advice).",
    items: [
      {
        name: "Watermark everything",
        desc: "Put your searchable username (not just initials) in a spot that's hard to crop out. Make it findable.",
      },
      {
        name: "Post at lower resolution",
        desc: "Upload max ~2000px wide for social media. Keep the full-res original. Nobody needs ultra-res except print buyers.",
      },
      {
        name: "Nightshade + Glaze before posting",
        desc: "Process every image with both tools before uploading anywhere. Even if it's not perfect, it adds friction for AI scrapers.",
      },
      {
        name: "Keep proof of creation",
        desc: "Save PSD/CLIP files with layers, timelapse videos, WIP screenshots. These prove you're the original creator.",
      },
      {
        name: "Email yourself timestamps",
        desc: "Email your finished art to yourself. The email timestamp from a third party (Gmail, etc.) serves as proof of when you had the file.",
      },
      {
        name: "Label art as AI in alt-text",
        desc: "A sneaky trick: AI scrapers try to avoid training on AI-generated images. Label your alt-text as 'AI generated' and scrapers may skip it.",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">resources</h1>
      <p className="text-[var(--muted)] mb-10">
        stuff that actually helps. compiled from reddit threads, artist communities, and a lot of trial and error.
      </p>

      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-bold mb-1">{section.title}</h2>
            <p className="text-sm text-[var(--muted)] mb-4">{section.desc}</p>
            <div className="grid gap-3">
              {section.items.map((item) => (
                <div
                  key={item.name}
                  className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--accent)]/30 transition-colors"
                >
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                    >
                      {item.name} ↗
                    </a>
                  ) : (
                    <span className="font-semibold">{item.name}</span>
                  )}
                  <p className="text-sm text-[var(--muted)] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl text-center">
        <p className="text-sm text-[var(--muted)]">
          know something that should be on this list? hit us up on github.
        </p>
      </div>
    </div>
  );
}
