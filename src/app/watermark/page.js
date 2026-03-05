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

const TABS = [
  { id: "text", label: "Text Watermark" },
  { id: "image", label: "Signature / Image" },
  { id: "invisible", label: "Invisible Watermark" },
];

// Encode a string into the least significant bits of pixel data
function embedLSB(imageData, message) {
  const pixels = imageData.data;
  const msgBytes = new TextEncoder().encode(message);
  const bits = [];

  // 32-bit length header
  for (let i = 31; i >= 0; i--) {
    bits.push((msgBytes.length >> i) & 1);
  }
  // Message bits
  for (const byte of msgBytes) {
    for (let i = 7; i >= 0; i--) {
      bits.push((byte >> i) & 1);
    }
  }

  // Use RGB channels only (skip alpha)
  const maxBits = Math.floor(pixels.length / 4) * 3;
  if (bits.length > maxBits) {
    return false;
  }

  let bitIdx = 0;
  for (let i = 0; i < pixels.length && bitIdx < bits.length; i++) {
    if (i % 4 === 3) continue;
    pixels[i] = (pixels[i] & 0xFE) | bits[bitIdx];
    bitIdx++;
  }
  return true;
}

// Read an LSB-embedded message from pixel data
function extractLSB(imageData) {
  const pixels = imageData.data;
  const bits = [];

  const maxRead = Math.min(Math.floor(pixels.length / 4) * 3, 32 + 8 * 10000);
  let bitIdx = 0;
  for (let i = 0; i < pixels.length && bitIdx < maxRead; i++) {
    if (i % 4 === 3) continue;
    bits.push(pixels[i] & 1);
    bitIdx++;
  }

  if (bits.length < 32) return null;

  let length = 0;
  for (let i = 0; i < 32; i++) {
    length = (length << 1) | bits[i];
  }

  if (length <= 0 || length > 10000 || 32 + length * 8 > bits.length) return null;

  const bytes = [];
  for (let b = 0; b < length; b++) {
    let byte = 0;
    for (let i = 0; i < 8; i++) {
      byte = (byte << 1) | bits[32 + b * 8 + i];
    }
    bytes.push(byte);
  }

  try {
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    return null;
  }
}

export default function WatermarkPage() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [tab, setTab] = useState("text");
  const [previewUrl, setPreviewUrl] = useState(null);
  const canvasRef = useRef(null);

  // Text watermark state
  const [text, setText] = useState("");
  const [position, setPosition] = useState("bottom-right");
  const [opacity, setOpacity] = useState(0.5);
  const [fontSize, setFontSize] = useState(24);

  // Signature/image watermark state
  const [sigUrl, setSigUrl] = useState(null);
  const [sigPosition, setSigPosition] = useState("bottom-right");
  const [sigOpacity, setSigOpacity] = useState(0.5);
  const [sigScale, setSigScale] = useState(0.2);

  // Invisible watermark state
  const [hiddenMsg, setHiddenMsg] = useState("");
  const [embedStatus, setEmbedStatus] = useState(null);
  const [extractedMsg, setExtractedMsg] = useState(null);

  const handleFile = useCallback((file) => {
    setImage(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setPreviewUrl(null);
    setEmbedStatus(null);
    setExtractedMsg(null);
  }, []);

  function handleSigFile(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSigUrl(URL.createObjectURL(file));
    }
  }

  function applyTextWatermark() {
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

      const wText = text.trim();

      if (position === "tile") {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const stepX = fontSize * wText.length * 0.7;
        const stepY = fontSize * 4;
        for (let y = -img.height; y < img.height * 2; y += stepY) {
          for (let x = -img.width; x < img.width * 2; x += stepX) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(-Math.PI / 6);
            ctx.strokeText(wText, 0, 0);
            ctx.fillText(wText, 0, 0);
            ctx.restore();
          }
        }
      } else {
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

        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.strokeText(wText, x, y);
        ctx.fillText(wText, x, y);
      }

      ctx.globalAlpha = 1;
      setPreviewUrl(canvas.toDataURL("image/png"));
    };
    img.src = imageUrl;
  }

  function applyImageWatermark() {
    if (!image || !sigUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const sig = new Image();
      sig.onload = () => {
        const sw = img.width * sigScale;
        const sh = (sig.height / sig.width) * sw;
        const pad = 20;
        let x, y;

        switch (sigPosition) {
          case "bottom-right":
            x = img.width - sw - pad;
            y = img.height - sh - pad;
            break;
          case "bottom-left":
            x = pad;
            y = img.height - sh - pad;
            break;
          case "top-right":
            x = img.width - sw - pad;
            y = pad;
            break;
          case "top-left":
            x = pad;
            y = pad;
            break;
          case "center":
            x = (img.width - sw) / 2;
            y = (img.height - sh) / 2;
            break;
          case "tile":
            ctx.globalAlpha = sigOpacity;
            const stepX = sw * 1.8;
            const stepY = sh * 2.5;
            for (let ty = -img.height / 2; ty < img.height * 1.5; ty += stepY) {
              for (let tx = -img.width / 2; tx < img.width * 1.5; tx += stepX) {
                ctx.save();
                ctx.translate(tx + sw / 2, ty + sh / 2);
                ctx.rotate(-Math.PI / 6);
                ctx.drawImage(sig, -sw / 2, -sh / 2, sw, sh);
                ctx.restore();
              }
            }
            ctx.globalAlpha = 1;
            setPreviewUrl(canvas.toDataURL("image/png"));
            return;
        }

        ctx.globalAlpha = sigOpacity;
        ctx.drawImage(sig, x, y, sw, sh);
        ctx.globalAlpha = 1;
        setPreviewUrl(canvas.toDataURL("image/png"));
      };
      sig.src = sigUrl;
    };
    img.src = imageUrl;
  }

  function applyInvisibleWatermark() {
    if (!image || !hiddenMsg.trim()) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const success = embedLSB(imageData, hiddenMsg.trim());

      if (success) {
        ctx.putImageData(imageData, 0, 0);
        setPreviewUrl(canvas.toDataURL("image/png"));
        setEmbedStatus("success");
      } else {
        setEmbedStatus("too-large");
      }
    };
    img.src = imageUrl;
  }

  function extractInvisible() {
    if (!image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const msg = extractLSB(imageData);
      setExtractedMsg(msg || "(No hidden message found)");
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

  function reset() {
    setImage(null);
    setImageUrl(null);
    setPreviewUrl(null);
    setSigUrl(null);
    setEmbedStatus(null);
    setExtractedMsg(null);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Watermark</h1>
      <p className="text-[var(--muted)] mb-8">
        Add visible or invisible watermarks to your art before posting. Text, custom signatures, or hidden messages embedded directly into the pixels. The goal is to make removal as hard as possible.
      </p>

      {!imageUrl ? (
        <FileDropZone onFile={handleFile} />
      ) : (
        <div className="space-y-6">
          {/* Tab selector */}
          <div className="flex gap-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setPreviewUrl(null); setEmbedStatus(null); setExtractedMsg(null); }}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--muted)] hover:text-white hover:bg-[var(--background)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Text Watermark */}
          {tab === "text" && (
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
                    type="range" min="12" max="120"
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
                    type="range" min="0.1" max="1" step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-[var(--accent)]"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={applyTextWatermark}
                  disabled={!text.trim()}
                  className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Apply Text Watermark
                </button>
                {previewUrl && (
                  <button onClick={download} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors">
                    Download
                  </button>
                )}
                <button onClick={reset} className="px-4 py-2 border border-[var(--border)] text-[var(--muted)] hover:text-white rounded-lg text-sm transition-colors">
                  New Image
                </button>
              </div>
            </div>
          )}

          {/* Signature / Image Watermark */}
          {tab === "image" && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">Signature / Logo Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSigFile}
                    className="w-full text-sm text-[var(--muted)] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-[var(--accent)] file:text-white file:cursor-pointer hover:file:bg-[var(--accent-hover)]"
                  />
                  {sigUrl && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={sigUrl} alt="Signature preview" className="h-8 rounded" />
                      <span className="text-xs text-[var(--muted)]">Loaded</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">Position</label>
                  <select
                    value={sigPosition}
                    onChange={(e) => setSigPosition(e.target.value)}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--accent)] outline-none"
                  >
                    {POSITIONS.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">
                    Scale: {Math.round(sigScale * 100)}% of image width
                  </label>
                  <input
                    type="range" min="0.05" max="0.5" step="0.01"
                    value={sigScale}
                    onChange={(e) => setSigScale(Number(e.target.value))}
                    className="w-full accent-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">
                    Opacity: {Math.round(sigOpacity * 100)}%
                  </label>
                  <input
                    type="range" min="0.1" max="1" step="0.05"
                    value={sigOpacity}
                    onChange={(e) => setSigOpacity(Number(e.target.value))}
                    className="w-full accent-[var(--accent)]"
                  />
                </div>
              </div>
              <p className="text-xs text-[var(--muted)] mt-3">
                Tip: Use a transparent PNG of your signature or logo for best results. Set to Tile with low opacity for full coverage that&apos;s hard to crop out.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={applyImageWatermark}
                  disabled={!sigUrl}
                  className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Apply Signature
                </button>
                {previewUrl && (
                  <button onClick={download} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors">
                    Download
                  </button>
                )}
                <button onClick={reset} className="px-4 py-2 border border-[var(--border)] text-[var(--muted)] hover:text-white rounded-lg text-sm transition-colors">
                  New Image
                </button>
              </div>
            </div>
          )}

          {/* Invisible Watermark */}
          {tab === "invisible" && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
              <p className="text-sm text-[var(--muted)] mb-4">
                Embeds a hidden message into the pixel data using LSB steganography. The image looks identical to the naked eye, but your message is encoded in the least significant bits of each pixel.
                <strong className="text-[var(--foreground)]"> Important:</strong> You must save as PNG. JPEG compression will destroy the hidden data.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">Hidden Message</label>
                  <textarea
                    value={hiddenMsg}
                    onChange={(e) => setHiddenMsg(e.target.value)}
                    rows={3}
                    maxLength={5000}
                    placeholder="Your name, contact info, copyright notice, or any identifying text..."
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--accent)] outline-none resize-y"
                  />
                  <p className="text-xs text-[var(--muted)] mt-1">{hiddenMsg.length} / 5000 characters</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={applyInvisibleWatermark}
                    disabled={!hiddenMsg.trim()}
                    className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Embed Hidden Message
                  </button>
                  <button
                    onClick={extractInvisible}
                    className="px-4 py-2 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Extract from Image
                  </button>
                  {previewUrl && (
                    <button onClick={download} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors">
                      Download PNG
                    </button>
                  )}
                  <button onClick={reset} className="px-4 py-2 border border-[var(--border)] text-[var(--muted)] hover:text-white rounded-lg text-sm transition-colors">
                    New Image
                  </button>
                </div>

                {embedStatus === "success" && (
                  <div className="p-3 bg-green-900/30 border border-green-700/50 rounded-lg text-sm text-green-400">
                    Message embedded successfully. Download the PNG to keep it.
                  </div>
                )}
                {embedStatus === "too-large" && (
                  <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-sm text-red-400">
                    Message is too large for this image. Try a shorter message or a larger image.
                  </div>
                )}
                {extractedMsg && (
                  <div className="p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg">
                    <p className="text-xs text-[var(--muted)] mb-1">Extracted Message:</p>
                    <p className="text-sm break-all">{extractedMsg}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-sm text-[var(--muted)] mb-3">
              {previewUrl ? "Preview (watermarked):" : "Original:"}
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
