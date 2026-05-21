"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import FileDropZone from "../components/FileDropZone";

const SEARCH_GROUPS = [
  {
    id: "general",
    title: "Best general-purpose searches",
    description: "Use these first for broad repost detection.",
    openLabel: "Open all general searches",
    engines: [
      {
        id: "google-lens",
        name: "Google Lens",
        desc: "Strong general-purpose reverse-image search.",
        color: "#4285F4",
        href: "https://lens.google.com/",
      },
      {
        id: "yandex",
        name: "Yandex Images",
        desc: "Good for cropped, flipped, and color-shifted copies.",
        color: "#FC3F1D",
        href: "https://yandex.com/images/",
      },
      {
        id: "tineye",
        name: "TinEye",
        desc: "Dedicated reverse-image search with match tracking.",
        color: "#5bc0de",
        href: "https://tineye.com/",
      },
      {
        id: "bing",
        name: "Bing Visual Search",
        desc: "Useful for a different index than Google.",
        color: "#00809d",
        href: "https://bing.com/camera",
      },
      {
        id: "mavink",
        name: "Mavink",
        desc: "Image search helper with a simple visual workflow.",
        color: "#64748b",
        href: "https://mavink.com/",
      },
    ],
  },
  {
    id: "specialized",
    title: "Specialized and niche searches",
    description: "Try these when general engines miss the match.",
    openLabel: "Open specialized searches",
    engines: [
      {
        id: "saucenao",
        name: "SauceNao",
        desc: "Broad reverse-image search with source-finding focus.",
        color: "#8b5cf6",
        href: "https://saucenao.com/",
      },
      {
        id: "copyseeker",
        name: "Copyseeker",
        desc: "Reverse search for reused and mirrored copies.",
        color: "#22c55e",
        href: "https://copyseeker.net/",
      },
      {
        id: "iqdb",
        name: "IQDB",
        desc: "Popular for anime, illustrations, and art reposts.",
        color: "#f97316",
        href: "https://iqdb.org/",
      },
      {
        id: "trained",
        name: "Have I Been Trained?",
        desc: "Checks whether an image appears in AI training datasets.",
        color: "#e11d48",
        href: "https://haveibeentrained.com/",
      },
      {
        id: "infini",
        name: "infini.wtf",
        desc: "Reddit image search and community matches.",
        color: "#fb923c",
        href: "https://infini.wtf/",
      },
      {
        id: "rootabout",
        name: "RootAbout",
        desc: "Archive and OpenLibrary reverse-image search.",
        color: "#6b7280",
        href: "https://rootabout.com/",
      },
      {
        id: "multicolr",
        name: "Multicolr",
        desc: "Color-based image search from TinEye labs.",
        color: "#14b8a6",
        href: "https://labs.tineye.com/multicolr/",
      },
      {
        id: "trace-moe",
        name: "trace.moe",
        desc: "Anime scene recognition and source lookup.",
        color: "#ec4899",
        href: "https://trace.moe/",
      },
      {
        id: "saucekudasai",
        name: "Saucekudasai",
        desc: "Anime reverse-image search helper.",
        color: "#6366f1",
        href: "https://saucekudasai.com/",
      },
      {
        id: "pose-search",
        name: "Pose Search",
        desc: "Search by pose reference and character position.",
        color: "#0ea5e9",
        href: "https://x6ud.github.io/pose-search/",
      },
      {
        id: "maxurl",
        name: "MaxURL",
        desc: "Larger-image search helper for expanded matches.",
        color: "#a855f7",
        href: "https://qsniyg.github.io/maxurl/",
      },
      {
        id: "vise",
        name: "VISE",
        desc: "Image search with search-query support.",
        color: "#475569",
        href: "https://www.robots.ox.ac.uk/~vgg/software/vise/",
      },
    ],
  },
  {
    id: "tools",
    title: "Browser tools and extensions",
    description: "Companion tools that make launching searches easier.",
    openLabel: null,
    engines: [
      {
        id: "search-by-image",
        name: "Search by Image",
        desc: "Browser extension from dessant.",
        color: "#f59e0b",
        href: "https://github.com/dessant/search-by-image",
      },
      {
        id: "smartimage",
        name: "SmartImage",
        desc: "Reverse-image search app by Decimation.",
        color: "#38bdf8",
        href: "https://github.com/Decimation/SmartImage",
      },
      {
        id: "tineye-extensions",
        name: "TinEye Extensions",
        desc: "Browser extension download page for TinEye.",
        color: "#06b6d4",
        href: "https://tineye.com/extensions",
      },
      {
        id: "saucenao-tools",
        name: "SauceNao Tools",
        desc: "Extension and helper links from SauceNao.",
        color: "#a855f7",
        href: "https://saucenao.com/tools/",
      },
    ],
  },
];

const DIRECT_GROUPS = SEARCH_GROUPS.filter((group) => group.openLabel);

export default function SearchPage() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [status, setStatus] = useState("");
  const engineSectionRef = useRef(null);
  const objectUrlRef = useRef(null);

  const openTargets = useCallback((targets, label) => {
    const opened = targets.reduce((count, engine) => {
      const popup = window.open(engine.href, "_blank", "noopener,noreferrer");
      return popup ? count + 1 : count;
    }, 0);

    if (opened === targets.length) {
      setStatus(`Opened ${label}. Upload the preview image in each new tab.`);
      return;
    }

    if (opened > 0) {
      setStatus(`Opened ${opened} of ${targets.length} tabs. Your browser blocked the rest.`);
      return;
    }

    setStatus("Your browser blocked the new tabs. Use the individual engine links below instead.");
  }, []);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    setImage(file);
    setImageUrl(nextUrl);
    setStatus("Image loaded. Pick a search engine below to open its tab.");

    requestAnimationFrame(() => {
      engineSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const reset = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setImage(null);
    setImageUrl(null);
    setStatus("");
  }, []);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Reverse Image Search</h1>
      <p className="text-[var(--muted)] mb-8">
        Drop your artwork to preview it, then open one or more search tabs. Reverse-image engines usually do not expose a public upload API, so the safe browser-only flow is to launch the target site and hand the image off there manually.
      </p>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">Step 1</p>
          <p className="text-sm font-medium">Drop your artwork here.</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">Step 2</p>
          <p className="text-sm font-medium">Open a search tab.</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">Step 3</p>
          <p className="text-sm font-medium">Upload the preview image there.</p>
        </div>
      </div>

      {!imageUrl ? (
        <FileDropZone onFile={handleFile} label="Drop your artwork here to preview it and start reverse search" />
      ) : (
        <div className="space-y-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-sm text-[var(--muted)]">Your image:</p>
              <button
                type="button"
                onClick={reset}
                className="px-3 py-1.5 border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] rounded-lg text-sm transition-colors"
              >
                Change Image
              </button>
            </div>
            <div className="flex justify-center">
              <Image
                src={imageUrl}
                alt="Your artwork"
                width={1024}
                height={1024}
                unoptimized
                className="max-w-full max-h-[300px] rounded-lg object-contain"
              />
            </div>
            <p className="text-xs text-[var(--muted)] mt-3 text-center">
              {image.name} ({(image.size / 1024).toFixed(0)} KB)
            </p>
          </div>

          <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl p-4">
            <p className="text-sm">
              <strong>What happens next:</strong> open a search tab below, then upload the preview image there. If a tab does not open, your browser likely blocked pop-ups.
            </p>
          </div>

          {status ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)]">
              {status}
            </div>
          ) : null}

          <div ref={engineSectionRef} className="space-y-8">
            {DIRECT_GROUPS.map((group) => (
              <section key={group.id} className="space-y-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{group.title}</h2>
                    <p className="text-sm text-[var(--muted)]">{group.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openTargets(group.engines, group.openLabel.toLowerCase())}
                    className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    {group.openLabel}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {group.engines.map((engine) => (
                    <a
                      key={engine.id}
                      href={engine.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setStatus(`Opened ${engine.name}. Upload the preview image in the new tab.`)}
                      className="text-left p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all hover:-translate-y-0.5 group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: engine.color }}
                        />
                        <h3 className="font-semibold group-hover:text-[var(--accent)] transition-colors">
                          {engine.name}
                        </h3>
                        <svg className="w-4 h-4 text-[var(--muted)] ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                        </svg>
                      </div>
                      <p className="text-sm text-[var(--muted)]">{engine.desc}</p>
                    </a>
                  ))}
                </div>
              </section>
            ))}

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Browser tools and extensions</h2>
                <p className="text-sm text-[var(--muted)]">These help you launch searches faster or add one-click search to your browser.</p>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {SEARCH_GROUPS.find((group) => group.id === "tools").engines.map((engine) => (
                  <a
                    key={engine.id}
                    href={engine.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-left p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all hover:-translate-y-0.5 group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: engine.color }}
                      />
                      <h3 className="font-semibold group-hover:text-[var(--accent)] transition-colors">
                        {engine.name}
                      </h3>
                      <svg className="w-4 h-4 text-[var(--muted)] ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                    </div>
                    <p className="text-sm text-[var(--muted)]">{engine.desc}</p>
                  </a>
                ))}
              </div>
            </section>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-sm">Tips for Better Results</h3>
            <ul className="text-sm text-[var(--muted)] space-y-2">
              <li>
                <strong className="text-[var(--foreground)]">Try the general engines first.</strong> Google Lens, Yandex, TinEye, Bing, and Mavink cover the broadest ground.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Then switch to niche search.</strong> SauceNao, Copyseeker, IQDB, and Have I Been Trained? can surface different matches.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Use extensions if you want faster workflow.</strong> Search by Image, SmartImage, and TinEye tools can shorten the handoff.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Found a theft?</strong> Screenshot the page as evidence, then head to our{" "}
                <a href="/dmca" className="text-[var(--accent)] underline hover:text-[var(--accent-hover)]">DMCA Generator</a> to file a takedown.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
