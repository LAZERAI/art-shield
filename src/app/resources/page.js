const sections = [
  {
    title: "Anti-AI Tools",
    desc: "These mess up AI training data so scrapers can't learn from your work. Use them before you post.",
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
      {
        name: "Fawkes",
        url: "http://sandlab.cs.uchicago.edu/fawkes/",
        desc: "Facial cloaking tool from UChicago. Adds invisible perturbations to photos of faces so AI can't build accurate facial recognition models from them.",
      },
    ],
  },
  {
    title: "Find Your Stolen Art",
    desc: "These help you track down where your art ended up without your permission.",
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
      {
        name: "SauceNao",
        url: "https://saucenao.com/",
        desc: "Reverse image search popular with illustrators and anime artists. Searches Pixiv, DeviantArt, booru sites, and more.",
      },
      {
        name: "IQDB",
        url: "https://iqdb.org/",
        desc: "Multi-site reverse image search that checks Danbooru, Gelbooru, and other art databases simultaneously.",
      },
      {
        name: "CopySeeker",
        url: "https://copyseeker.net/",
        desc: "Reverse image search specifically designed for finding unauthorized copies of your images online.",
      },
      {
        name: "Have I Been Trained?",
        url: "https://haveibeentrained.com/",
        desc: "Check if your art was scraped into AI training datasets like LAION. Search by image to see if your work is being used to train models.",
      },
      {
        name: "Search by Image (Extension)",
        url: "https://github.com/dessant/search-by-image",
        desc: "Browser extension that lets you right-click any image and search it across 30+ search engines at once. Works on Chrome, Firefox, Edge.",
      },
    ],
  },
  {
    title: "Artist-Friendly Platforms",
    desc: "Places that actually try to protect artists instead of feeding your work to AI.",
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
        desc: "Professional art portfolio. Has 'NoAI' meta tag option. Check your settings, it's unchecked by default.",
      },
      {
        name: "Buzzly",
        url: "https://buzzly.art/",
        desc: "Newer artist-focused social platform. Built as an alternative to mainstream social media for sharing and discovering original art.",
      },
      {
        name: "Artfol",
        url: "https://www.artfol.app/",
        desc: "Mobile-first art sharing platform designed specifically for artists. Chronological feed, no algorithm burying your posts.",
      },
    ],
  },
  {
    title: "Photo Forensics and Metadata",
    desc: "Tools to analyze images, prove edits, and manage metadata. Useful for proving your work is original.",
    items: [
      {
        name: "FotoForensics",
        url: "https://www.fotoforensics.com/",
        desc: "Error Level Analysis (ELA) tool. Upload an image to detect edits, composites, and modifications. Useful for proving an image was tampered with.",
      },
      {
        name: "Forensically",
        url: "https://29a.ch/photo-forensics/",
        desc: "Browser-based photo forensics suite. ELA, clone detection, noise analysis, and more. Completely free and runs locally.",
      },
      {
        name: "Aperisolve",
        url: "https://aperisolve.fr/",
        desc: "Steganography analysis tool. Detects hidden data in images across multiple layers. Good for verifying invisible watermarks.",
      },
      {
        name: "ExifTool",
        url: "https://exiftool.org/",
        desc: "The gold standard for reading, writing, and editing image metadata. Command-line tool that works with every image format.",
      },
    ],
  },
  {
    title: "Legal / DMCA Links",
    desc: "Where to file takedowns and what your actual rights are.",
    items: [
      {
        name: "Twitter/X Copyright Policy",
        url: "https://help.x.com/en/rules-and-policies/copyright-policy",
        desc: "File DMCA via their online form or email copyright@x.com. They must respond within 24-48 hours.",
      },
      {
        name: "Instagram/Meta IP Report",
        url: "https://help.instagram.com/contact/552695131608132",
        desc: "Instagram's dedicated form for reporting intellectual property violations. Also works for Facebook content (both are Meta).",
      },
      {
        name: "TikTok Copyright Report",
        url: "https://www.tiktok.com/legal/report/Copyright",
        desc: "File a copyright claim through TikTok's online form. They also accept reports in-app via the video's share menu.",
      },
      {
        name: "YouTube Copyright Form",
        url: "https://support.google.com/youtube/answer/2807622",
        desc: "File DMCA through YouTube's webform or email copyright@youtube.com. Known for fast takedowns.",
      },
      {
        name: "Pinterest Copyright Policy",
        url: "https://policy.pinterest.com/en/copyright",
        desc: "File a copyright report through their online form or email copyright@pinterest.com. They also have a Content Claiming Portal for bulk takedowns.",
      },
      {
        name: "Reddit Report",
        url: "https://www.reddit.com/report",
        desc: "Reddit's general report form handles copyright claims. Select 'Copyright infringement' and fill out the DMCA fields.",
      },
      {
        name: "DMCA.com",
        url: "https://www.dmca.com/",
        desc: "Free DMCA protection badges and monitoring. Paid plans offer automated takedown services. Has protected over 525 million items.",
      },
      {
        name: "Creative Commons",
        url: "https://creativecommons.org/licenses/",
        desc: "If you want to share your art with specific permissions (like 'no commercial use' or 'no AI training'), CC licenses make it legally clear.",
      },
      {
        name: "EFF Fair Use Guide",
        url: "https://www.eff.org/issues/intellectual-property",
        desc: "Know your rights. The EFF has guides on fair use, copyright, and how to navigate IP law as a creator.",
      },
      {
        name: "US Copyright Office",
        url: "https://www.copyright.gov/registration/",
        desc: "Register your work for stronger legal protection. Costs ~$65 but gives you the ability to sue for statutory damages.",
      },
    ],
  },
  {
    title: "Tips from Other Artists",
    desc: "Practical advice from Reddit and artist communities.",
    items: [
      {
        name: "Watermark everything",
        desc: "Put your searchable username (not just initials) in a spot that's hard to crop out. Make it findable.",
      },
      {
        name: "Use both visible and invisible watermarks",
        desc: "Visible ones deter casual theft. Invisible ones (like ArtShield's steganography tool) prove ownership even if someone crops or edits the visible one out.",
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
        name: "Opt out of AI training everywhere",
        desc: "Most platforms now have opt-out settings buried in privacy menus. Check DeviantArt, ArtStation, Instagram, and X. Do it today, they don't apply retroactively.",
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
        name: "Use the same username everywhere",
        desc: "Pick one handle and use it on every platform. Makes it obvious when someone else is posting your work under a different name.",
      },
      {
        name: "Set up Google Alerts for your name",
        desc: "Go to google.com/alerts and add your artist name and username. You'll get email notifications when your name appears on new pages.",
      },
      {
        name: "Keep a portfolio site you control",
        desc: "Social platforms come and go. A personal site (even a free Carrd or Neocities page) is the one place you fully own and can always link to as proof.",
      },
      {
        name: "Split commission sheets into cropped previews",
        desc: "Don't post full-resolution commission examples. Crop them, add your watermark, and link to your portfolio for the full versions.",
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
      <h1 className="text-3xl font-bold mb-2">Resources</h1>
      <p className="text-[var(--muted)] mb-10">
        Curated tools, platforms, and advice from artist communities. If it helps protect your work, it belongs here.
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
          Know a tool or resource that should be on this list? Open an issue on <a href="https://github.com/LAZERAI/art-shield" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline hover:text-[var(--accent-hover)]">GitHub</a>.
        </p>
      </div>
    </div>
  );
}
