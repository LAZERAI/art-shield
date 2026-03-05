"use client";
import { useState, useRef, useCallback } from "react";
import FileDropZone from "../components/FileDropZone";

const POSITIONS = [
  { id: "bottom-right", label: "Bottom Right" },
  { id: "bottom-left", label: "Bottom Left" },
  { id: "top-right", label: "Top Right" },
  { id: "top-left", label: "Top Left" },
  { id: "center", label: "Center" },
  { id: "tile", label: "Tile (Repeat)" },
];

export default function WatermarkPage() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [text, setText] = useState("");
  const [position, setPosition] = useState("bottom-right");
  const [opacity, setOpacity] = useState(0.5);
  const [fontSize, setFontSize] = useState(24);
  const [previewUrl, setPreviewUrl] = useState(null);
  const canvasRef = useRef(null);

  const handleFile = useCallback((file) => {
    setImage(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setPreviewUrl(null);
  }, []);

  function applyWatermark() {
    if (!image || !text.trim()) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      ctx.globalAlpha = opacity;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.lineWidth = Math.max(1, fontSize / 12);
      ctx.font = `bold ${fontSize}px system-ui, sans-serif`;

      const watermarkText = text.trim();

      if (position === "tile") {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Rotate for tiling
        const stepX = fontSize * watermarkText.length * 0.7;
        const stepY = fontSize * 4;
        for (let y = -img.height; y < img.height * 2; y += stepY) {
          for (let x = -img.width; x < img.width * 2; x += stepX) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(-Math.PI / 6);
            ctx.strokeText(watermarkText, 0, 0);
            ctx.fillText(watermarkText, 0, 0);
            ctx.restore();
          }
        }
      } else {
        const metrics = ctx.measureText(watermarkText);
        const tw = metrics.width;
        const pad = fontSize;
        let x, y;

        ctx.textBaseline = "bottom";

        switch (position) {
          case "bottom-right":
            ctx.textAlign = "right";
            x = img.width - pad;
            y = img.height - pad;
            break;
          case "bottom-left":
            ctx.textAlign = "left";
            x = pad;
            y = img.height - pad;
            break;
          case "top-right":
            ctx.textAlign = "right";
            x = img.width - pad;
            y = pad + fontSize;
            break;
          case "top-left":
            ctx.textAlign = "left";
            x = pad;
            y = pad + fontSize;
            break;
          case "center":
            ctx.textAlign = "center";
            x = img.width / 2;
            y = img.height / 2 + fontSize / 2;
            break;
        }

        // Shadow for readability
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.strokeText(watermarkText, x, y);
        ctx.fillText(watermarkText, x, y);
      }

      ctx.globalAlpha = 1;
      setPreviewUrl(canvas.toDataURL("image/png"));
    };
    img.src = imageUrl;
  }

  function download() {
    if (!previewUrl) return;
    const link = document.createElement("a");
    const name = image.name.replace(/\.[^.]+$/, "");
    link.download = `${name}_watermarked.png`;
    link.href = previewUrl;
    link.click();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">watermark</h1>
      <p className="text-[var(--muted)] mb-8">
        put your name on your art before posting it anywhere. pick where it goes, how big, how see-through. won&apos;t stop everyone but it helps.
      </p>

      {!imageUrl ? (
        <FileDropZone onFile={handleFile} />
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Watermark Text</label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="© YourName 2026"
                  maxLength={100}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--accent)] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--accent)] outline-none"
                >
                  {POSITIONS.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="120"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-[var(--accent)]"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">
                  Opacity: {Math.round(opacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-[var(--accent)]"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={applyWatermark}
                disabled={!text.trim()}
                className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                Apply Watermark
              </button>
              {previewUrl && (
                <button
                  onClick={download}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Download
                </button>
              )}
              <button
                onClick={() => { setImage(null); setImageUrl(null); setPreviewUrl(null); }}
                className="px-4 py-2 border border-[var(--border)] text-[var(--muted)] hover:text-white rounded-lg text-sm transition-colors"
              >
                New Image
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-sm text-[var(--muted)] mb-3">
              {previewUrl ? "Watermarked Preview:" : "Original:"}
            </p>
            <div className="flex justify-center">
              <img
                src={previewUrl || imageUrl}
                alt="Preview"
                className="max-w-full max-h-[600px] rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
