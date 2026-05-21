"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import FileDropZone from "../components/FileDropZone";

const ENGINES = [
  {
    id: "google",
    name: "Google Images",
    desc: "Largest index. Best for finding reposts on social media and websites.",
    color: "#4285F4",
    searchUrl: "https://images.google.com/",
  },
  {
    id: "tineye",
    name: "TinEye",
    desc: "Dedicated reverse image search. Shows where your image appears and tracks modifications.",
    color: "#5bc0de",
    searchUrl: "https://tineye.com/",
  },
  {
    id: "yandex",
    name: "Yandex Images",
    desc: "Strong at finding cropped, flipped, and color-shifted copies. Catches what Google misses.",
    color: "#FC3F1D",
    searchUrl: "https://yandex.com/images/",
  },
  {
    id: "bing",
    name: "Bing Visual Search",
    desc: "Microsoft's image search. Different index from Google, can find matches on sites Google doesn't crawl.",
    color: "#00809d",
    searchUrl: "https://www.bing.com/visualsearch",
  },
];

export default function SearchPage() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [status, setStatus] = useState("");
  const engineSectionRef = useRef(null);
  const objectUrlRef = useRef(null);

  const openEngine = useCallback((engine) => {
    const popup = window.open(engine.searchUrl, "_blank", "noopener,noreferrer");

    if (!popup) {
      setStatus(
        `Your browser blocked ${engine.name}. Allow pop-ups for this site or use the individual engine links below.`,
      );
      return false;
    }

    setStatus(`Opened ${engine.name}. Upload the preview image in the new tab.`);
    return true;
  }, []);

  const openAll = useCallback(() => {
    const opened = ENGINES.reduce((count, engine) => {
      const popup = window.open(engine.searchUrl, "_blank", "noopener,noreferrer");
      return popup ? count + 1 : count;
    }, 0);

    if (opened === ENGINES.length) {
      setStatus("Opened all search tabs. Upload the preview image in each tab.");
      return;
    }

    if (opened > 0) {
      setStatus(`Opened ${opened} of ${ENGINES.length} tabs. Your browser blocked the rest.`);
      return;
    }

    setStatus("Your browser blocked the new tabs. Use the engine links below instead.");
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
    setStatus("Image loaded. Choose an engine below to open its search tab.");

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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Reverse Image Search</h1>
      <p className="text-[var(--muted)] mb-8">
        Drop your artwork to preview it, then open a search tab. Reverse-image engines cannot receive a local file automatically, so you will upload or drag the preview into the new tab yourself.
      </p>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">Step 1</p>
          <p className="text-sm font-medium">Drop your artwork here.</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">Step 2</p>
          <p className="text-sm font-medium">Open a search engine in a new tab.</p>
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
              <strong>What happens next:</strong> click a search engine below. It opens in a new tab, and you upload the preview image there. If a tab does not open, your browser likely blocked pop-ups.
            </p>
          </div>

          {status ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)]">
              {status}
            </div>
          ) : null}

          <div ref={engineSectionRef} className="space-y-4">
            <button
              type="button"
              onClick={openAll}
              className="w-full px-4 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl text-sm font-medium transition-colors"
            >
              Open All Search Engines At Once
            </button>

            <div className="grid md:grid-cols-2 gap-4">
              {ENGINES.map((engine) => (
                <a
                  key={engine.id}
                  href={engine.searchUrl}
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
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-sm">Tips for Better Results</h3>
            <ul className="text-sm text-[var(--muted)] space-y-2">
              <li>
                <strong className="text-[var(--foreground)]">Search all four engines.</strong> Each has a different index. Art that does not show up on Google might appear on Yandex.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Try cropping.</strong> If someone cropped your watermark out, search with just the main subject area.
              </li>
              <li>
                <strong className="text-[var(--foreground)]">Search regularly.</strong> Set a monthly reminder to search your most popular pieces.
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
