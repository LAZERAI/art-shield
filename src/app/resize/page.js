"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import FileDropZone from "../components/FileDropZone";

const PRESETS = [
  { label: "Web / Social (1200px)", value: 1200 },
  { label: "Portfolio (1500px)", value: 1500 },
  { label: "Thumbnail (600px)", value: 600 },
  { label: "Custom", value: 0 },
];

export default function ResizePage() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [origWidth, setOrigWidth] = useState(0);
  const [origHeight, setOrigHeight] = useState(0);
  const [preset, setPreset] = useState(1200);
  const [customMax, setCustomMax] = useState(1200);
  const [quality, setQuality] = useState(0.92);
  const [format, setFormat] = useState("jpeg");
  const [outputUrl, setOutputUrl] = useState(null);
  const [outputSize, setOutputSize] = useState(null);
  const [outputDims, setOutputDims] = useState(null);
  const canvasRef = useRef(null);

  const handleFile = useCallback((file) => {
    setImage(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setOutputUrl(null);

    const img = new Image();
    img.onload = () => {
      setOrigWidth(img.width);
      setOrigHeight(img.height);
    };
    img.src = url;
  }, []);

  const maxDim = preset === 0 ? customMax : preset;

  // Calculate output dimensions
  function getOutputDims() {
    if (!origWidth || !origHeight) return { w: 0, h: 0 };
    if (origWidth <= maxDim && origHeight <= maxDim) {
      return { w: origWidth, h: origHeight };
    }
    const ratio = origWidth / origHeight;
    if (origWidth >= origHeight) {
      return { w: maxDim, h: Math.round(maxDim / ratio) };
    } else {
      return { w: Math.round(maxDim * ratio), h: maxDim };
    }
  }

  const dims = getOutputDims();

  // Auto-resize whenever settings change
  useEffect(() => {
    if (!imageUrl || !origWidth) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      const d = dims;
      canvas.width = d.w;
      canvas.height = d.h;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, d.w, d.h);

      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const dataUrl = canvas.toDataURL(mimeType, quality);
      setOutputUrl(dataUrl);
      setOutputDims(`${d.w} x ${d.h}`);
      // Estimate file size from base64
      const base64 = dataUrl.split(",")[1];
      const sizeBytes = Math.round((base64.length * 3) / 4);
      setOutputSize(sizeBytes);
    };
    img.src = imageUrl;
  }, [imageUrl, origWidth, origHeight, maxDim, quality, format]);

  function download() {
    if (!outputUrl) return;
    const link = document.createElement("a");
    const name = image.name.replace(/\.[^.]+$/, "");
    const ext = format === "png" ? "png" : "jpg";
    link.download = `${name}_${dims.w}x${dims.h}.${ext}`;
    link.href = outputUrl;
    link.click();
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function reset() {
    setImage(null);
    setImageUrl(null);
    setOutputUrl(null);
    setOutputSize(null);
    setOutputDims(null);
  }

  const reductionPercent = origWidth && dims.w < origWidth
    ? Math.round((1 - (dims.w * dims.h) / (origWidth * origHeight)) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Image Resizer</h1>
      <p className="text-[var(--muted)] mb-8">
        Downscale your art to web resolution before posting. Never upload full-resolution originals. A 1200px image is enough for social media but useless for prints or commercial theft.
      </p>

      {!imageUrl ? (
        <FileDropZone onFile={handleFile} />
      ) : (
        <div className="space-y-6">
          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 text-center">
              <p className="text-xs text-[var(--muted)]">Original</p>
              <p className="font-mono text-sm">{origWidth} x {origHeight}</p>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 text-center">
              <p className="text-xs text-[var(--muted)]">Output</p>
              <p className="font-mono text-sm">{outputDims || "..."}</p>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 text-center">
              <p className="text-xs text-[var(--muted)]">File Size</p>
              <p className="font-mono text-sm">{outputSize ? formatBytes(outputSize) : "..."}</p>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 text-center">
              <p className="text-xs text-[var(--muted)]">Reduction</p>
              <p className="font-mono text-sm" style={{ color: 'var(--success)' }}>
                {reductionPercent > 0 ? `-${reductionPercent}%` : "No resize needed"}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Max Dimension</label>
                <select
                  value={preset}
                  onChange={(e) => setPreset(Number(e.target.value))}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--accent)] outline-none"
                >
                  {PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                {preset === 0 && (
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    value={customMax}
                    onChange={(e) => setCustomMax(Math.max(100, Number(e.target.value)))}
                    className="w-full mt-2 bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--accent)] outline-none"
                    placeholder="Max width or height in px"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--accent)] outline-none"
                >
                  <option value="jpeg">JPEG (smaller file, slight quality loss)</option>
                  <option value="png">PNG (lossless, larger file)</option>
                </select>
              </div>
              {format === "jpeg" && (
                <div className="md:col-span-2">
                  <label className="block text-sm text-[var(--muted)] mb-1">
                    JPEG Quality: {Math.round(quality * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1"
                    step="0.01"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-[var(--accent)]"
                  />
                  <div className="flex justify-between text-xs text-[var(--muted)] mt-1">
                    <span>Smaller file</span>
                    <span>Better quality</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={download}
                disabled={!outputUrl}
                className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'var(--success-btn)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--success-btn-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--success-btn)'}
              >
                Download Resized
              </button>
              <button onClick={reset} className="px-4 py-2 border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] rounded-lg text-sm transition-colors">
                New Image
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-sm text-[var(--muted)] mb-3">Preview:</p>
            <div className="flex justify-center">
              <img src={outputUrl || imageUrl} alt="Preview" className="max-w-full max-h-[500px] rounded-lg" />
            </div>
          </div>

          {/* Why resize */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 space-y-2">
            <h3 className="font-semibold text-sm">Why Resize Before Posting?</h3>
            <ul className="text-sm text-[var(--muted)] space-y-1.5">
              <li>A 4000px original can be printed on posters, sold as stock, or used in commercial projects. A 1200px version can't.</li>
              <li>Social media platforms compress your uploads anyway. Uploading full-res just gives scrapers a better copy to steal.</li>
              <li>Keep the full-resolution file as your proof of ownership. The fact that you have a higher-res version than anyone else is evidence.</li>
            </ul>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
