"use client";
import { useState, useCallback } from "react";
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

  const handleFile = useCallback((file) => {
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
  }, []);

  function openEngine(engine) {
    window.open(engine.searchUrl, "_blank", "noopener,noreferrer");
  }

  function openAll() {
    ENGINES.forEach((e) => {
      window.open(e.searchUrl, "_blank", "noopener,noreferrer");
    });
  }

  function reset() {
    setImage(null);
    setImageUrl(null);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Reverse Image Search</h1>
      <p className="text-[var(--muted)] mb-8">
        Find where your art is being used. Upload your image here to preview it, then launch searches across multiple engines. Each opens in a new tab where you drag or upload the same image.
      </p>

      {!imageUrl ? (
        <FileDropZone onFile={handleFile} label="Drop your artwork here to get started" />
      ) : (
        <div className="space-y-6">
          {/* Image preview */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[var(--muted)]">Your image:</p>
              <button onClick={reset} className="px-3 py-1.5 border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] rounded-lg text-sm transition-colors">
                Change Image
              </button>
            </div>
            <div className="flex justify-center">
              <img src={imageUrl} alt="Your artwork" className="max-w-full max-h-[300px] rounded-lg" />
            </div>
            <p className="text-xs text-[var(--muted)] mt-3 text-center">
              {image.name} ({(image.size / 1024).toFixed(0)} KB)
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl p-4">
            <p className="text-sm">
              <strong>How it works:</strong> Click a search engine below to open it. Then drag your image from above (or re-upload it) into the search engine's upload area. We can't auto-upload to third-party sites because your image never leaves your browser.
            </p>
          </div>

          {/* Open all button */}
          <button
            onClick={openAll}
            className="w-full px-4 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl text-sm font-medium transition-colors"
          >
            Open All Search Engines at Once
          </button>

          {/* Engine cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {ENGINES.map((engine) => (
              <button
                key={engine.id}
                onClick={() => openEngine(engine)}
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
              </button>
            ))}
          </div>

          {/* Tips */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 space-y-3">
            <h3 className="font-semibold text-sm">Tips for Better Results</h3>
            <ul className="text-sm text-[var(--muted)] space-y-2">
              <li>
                <strong className="text-[var(--foreground)]">Search all four engines.</strong> Each has a different index. Art that doesn't show up on Google might appear on Yandex.
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
