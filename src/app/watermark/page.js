"use client";
import { useState, useRef, useCallback, useEffect } from "react";
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

function embedLSB(imageData, message) {
  const pixels = imageData.data;
  const msgBytes = new TextEncoder().encode(message);
  const bits = [];

  for (let i = 31; i >= 0; i--) {
    bits.push((msgBytes.length >> i) & 1);
  }
  for (const byte of msgBytes) {
    for (let i = 7; i >= 0; i--) {
      bits.push((byte >> i) & 1);
    }
  }

  const maxBits = Math.floor(pixels.length / 4) * 3;
  if (bits.length > maxBits) return false;

  let bitIdx = 0;
  for (let i = 0; i < pixels.length && bitIdx < bits.length; i++) {
    if (i % 4 === 3) continue;
    pixels[i] = (pixels[i] & 0xFE) | bits[bitIdx];
    bitIdx++;
  }
  return true;
}

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

function removeBackground(canvas, ctx, threshold) {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i] > threshold && d[i + 1] > threshold && d[i + 2] > threshold) {
      d[i + 3] = 0;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

export default function WatermarkPage() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [tab, setTab] = useState("text");
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const sigBgCanvasRef = useRef(null);
  const [loadedImg, setLoadedImg] = useState(null);

  const [text, setText] = useState("");
  const [position, setPosition] = useState("bottom-right");
  const [opacity, setOpacity] = useState(0.5);
  const [fontSize, setFontSize] = useState(24);

  const [sigUrl, setSigUrl] = useState(null);
  const [sigPosition, setSigPosition] = useState("bottom-right");
  const [sigOpacity, setSigOpacity] = useState(0.5);
  const [sigScale, setSigScale] = useState(0.2);
  const [loadedSig, setLoadedSig] = useState(null);
  const [removeBg, setRemoveBg] = useState(false);
  const [bgThreshold, setBgThreshold] = useState(220);

  const [hiddenMsg, setHiddenMsg] = useState("");
  const [embedStatus, setEmbedStatus] = useState(null);
  const [extractedMsg, setExtractedMsg] = useState(null);
  const [invisibleOutputUrl, setInvisibleOutputUrl] = useState(null);

  const handleFile = useCallback((file) => {
    setImage(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setEmbedStatus(null);
    setExtractedMsg(null);
    setInvisibleOutputUrl(null);

    const img = new Image();
    img.onload = () => setLoadedImg(img);
    img.src = url;
  }, []);

  function handleSigFile(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setSigUrl(url);
      const sig = new Image();
      sig.onload = () => setLoadedSig(sig);
      sig.src = url;
    }
  }

  // Real-time text watermark
  useEffect(() => {
    if (tab !== "text" || !loadedImg) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = loadedImg.width;
    canvas.height = loadedImg.height;
    ctx.drawImage(loadedImg, 0, 0);

    if (!text.trim()) return;

    ctx.globalAlpha = opacity;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "rgba(0,0,0,0.7)";
    ctx.lineWidth = Math.max(1, fontSize / 12);
    ctx.font = `bold ${fontSize}px system-ui, sans-serif`;

    const wText = text.trim();

    if (position === "tile") {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const stepX = Math.max(fontSize * 3, fontSize * wText.length * 0.7);
      const stepY = fontSize * 4;
      for (let y = -loadedImg.height; y < loadedImg.height * 2; y += stepY) {
        for (let x = -loadedImg.width; x < loadedImg.width * 2; x += stepX) {
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
          x = loadedImg.width - pad;
          y = loadedImg.height - pad;
          break;
        case "bottom-left":
          ctx.textAlign = "left";
          x = pad;
          y = loadedImg.height - pad;
          break;
        case "top-right":
          ctx.textAlign = "right";
          x = loadedImg.width - pad;
          y = pad + fontSize;
          break;
        case "top-left":
          ctx.textAlign = "left";
          x = pad;
          y = pad + fontSize;
          break;
        case "center":
          ctx.textAlign = "center";
          x = loadedImg.width / 2;
          y = loadedImg.height / 2 + fontSize / 2;
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
  }, [tab, loadedImg, text, position, opacity, fontSize]);

  // Real-time signature/image watermark
  useEffect(() => {
    if (tab !== "image" || !loadedImg) return;
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = loadedImg.width;
    canvas.height = loadedImg.height;
    ctx.drawImage(loadedImg, 0, 0);

    if (!loadedSig) return;

    let sigSource = loadedSig;
    if (removeBg) {
      const tmpCanvas = sigBgCanvasRef.current;
      const tmpCtx = tmpCanvas.getContext("2d");
      tmpCanvas.width = loadedSig.width;
      tmpCanvas.height = loadedSig.height;
      tmpCtx.drawImage(loadedSig, 0, 0);
      removeBackground(tmpCanvas, tmpCtx, bgThreshold);
      sigSource = tmpCanvas;
    }

    const sw = loadedImg.width * sigScale;
    const sh = (loadedSig.height / loadedSig.width) * sw;
    const pad = 20;

    if (sigPosition === "tile") {
      ctx.globalAlpha = sigOpacity;
      const stepX = sw * 1.8;
      const stepY = sh * 2.5;
      for (let ty = -loadedImg.height / 2; ty < loadedImg.height * 1.5; ty += stepY) {
        for (let tx = -loadedImg.width / 2; tx < loadedImg.width * 1.5; tx += stepX) {
          ctx.save();
          ctx.translate(tx + sw / 2, ty + sh / 2);
          ctx.rotate(-Math.PI / 6);
          ctx.drawImage(sigSource, -sw / 2, -sh / 2, sw, sh);
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
      return;
    }

    let x, y;
    switch (sigPosition) {
      case "bottom-right": x = loadedImg.width - sw - pad; y = loadedImg.height - sh - pad; break;
      case "bottom-left": x = pad; y = loadedImg.height - sh - pad; break;
      case "top-right": x = loadedImg.width - sw - pad; y = pad; break;
      case "top-left": x = pad; y = pad; break;
      case "center": x = (loadedImg.width - sw) / 2; y = (loadedImg.height - sh) / 2; break;
    }

    ctx.globalAlpha = sigOpacity;
    ctx.drawImage(sigSource, x, y, sw, sh);
    ctx.globalAlpha = 1;
  }, [tab, loadedImg, loadedSig, sigPosition, sigOpacity, sigScale, removeBg, bgThreshold]);

  function applyInvisibleWatermark() {
    if (!loadedImg || !hiddenMsg.trim()) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = loadedImg.width;
    canvas.height = loadedImg.height;
    ctx.drawImage(loadedImg, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const success = embedLSB(imageData, hiddenMsg.trim());

    if (success) {
      ctx.putImageData(imageData, 0, 0);
      setInvisibleOutputUrl(canvas.toDataURL("image/png"));
      setEmbedStatus("success");
    } else {
      setEmbedStatus("too-large");
    }
  }

  function extractInvisible() {
    if (!loadedImg) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = loadedImg.width;
    canvas.height = loadedImg.height;
    ctx.drawImage(loadedImg, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const msg = extractLSB(imageData);
    setExtractedMsg(msg || "(No hidden message found)");
  }

  function download() {
    if (tab === "invisible") {
      if (!invisibleOutputUrl) return;
      const link = document.createElement("a");
      const name = image.name.replace(/\.[^.]+$/, "");
      link.download = `${name}_hidden.png`;
      link.href = invisibleOutputUrl;
      link.click();
      return;
    }

    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    const name = image.name.replace(/\.[^.]+$/, "");
    const suffix = tab === "text" ? "watermarked" : "signed";
    link.download = `${name}_${suffix}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function reset() {
    setImage(null);
    setImageUrl(null);
    setLoadedImg(null);
    setSigUrl(null);
    setLoadedSig(null);
    setRemoveBg(false);
    setEmbedStatus(null);
    setExtractedMsg(null);
    setInvisibleOutputUrl(null);
  }

  const canDownload =
    (tab === "text" && loadedImg && text.trim()) ||
    (tab === "image" && loadedImg && loadedSig) ||
    (tab === "invisible" && invisibleOutputUrl);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Watermark</h1>
      <p className="text-[var(--muted)] mb-8">
        Add visible or invisible watermarks to your art before posting. Changes preview in real-time as you adjust settings.
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
                onClick={() => { setTab(t.id); setEmbedStatus(null); setExtractedMsg(null); }}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)]"
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
                {canDownload && (
                  <button onClick={download} className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors" style={{ background: 'var(--success-btn)' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--success-btn-hover)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--success-btn)'}>
                    Download
                  </button>
                )}
                <button onClick={reset} className="px-4 py-2 border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] rounded-lg text-sm transition-colors">
                  New Image
                </button>
              </div>
            </div>
          )}

          {/* Signature / Image */}
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

              {/* Background removal */}
              {sigUrl && (
                <div className="mt-4 p-4 bg-[var(--background)] border border-[var(--border)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setRemoveBg(!removeBg)}
                      className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
                        removeBg ? "bg-[var(--accent)]" : "bg-[var(--border)]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          removeBg ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                    <div>
                      <p className="text-sm font-medium">Remove Background</p>
                      <p className="text-xs text-[var(--muted)]">
                        Strips white/light backgrounds from signature photos. Works best with pen on paper.
                      </p>
                    </div>
                  </div>
                  {removeBg && (
                    <div className="mt-3">
                      <label className="block text-sm text-[var(--muted)] mb-1">
                        Threshold: {bgThreshold} <span className="text-xs">(lower = keeps more background, higher = removes more)</span>
                      </label>
                      <input
                        type="range" min="150" max="250"
                        value={bgThreshold}
                        onChange={(e) => setBgThreshold(Number(e.target.value))}
                        className="w-full accent-[var(--accent)]"
                      />
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-[var(--muted)] mt-3">
                Tip: Use a transparent PNG for best results. If you photographed your signature on paper, toggle &quot;Remove Background&quot; above.
              </p>
              <div className="mt-4 flex gap-3">
                {canDownload && (
                  <button onClick={download} className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors" style={{ background: 'var(--success-btn)' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--success-btn-hover)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--success-btn)'}>
                    Download
                  </button>
                )}
                <button onClick={reset} className="px-4 py-2 border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] rounded-lg text-sm transition-colors">
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
                  {invisibleOutputUrl && (
                    <button onClick={download} className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors" style={{ background: 'var(--success-btn)' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--success-btn-hover)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--success-btn)'}>
                      Download PNG
                    </button>
                  )}
                  <button onClick={reset} className="px-4 py-2 border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] rounded-lg text-sm transition-colors">
                    New Image
                  </button>
                </div>

                {embedStatus === "success" && (
                  <div className="p-3 rounded-lg text-sm" style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', color: 'var(--success)' }}>
                    Message embedded successfully. Download the PNG to keep it.
                  </div>
                )}
                {embedStatus === "too-large" && (
                  <div className="p-3 rounded-lg text-sm" style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', color: 'var(--error)' }}>
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

          {/* Live Preview */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-sm text-[var(--muted)] mb-3">
              {tab === "invisible"
                ? (invisibleOutputUrl ? "Preview (embedded):" : "Original:")
                : "Live Preview:"}
            </p>
            <div className="flex justify-center">
              {tab === "invisible" ? (
                <img
                  src={invisibleOutputUrl || imageUrl}
                  alt="Preview"
                  className="max-w-full max-h-[600px] rounded-lg"
                />
              ) : (
                <canvas
                  ref={previewCanvasRef}
                  className="max-w-full max-h-[600px] rounded-lg"
                  style={{ objectFit: "contain" }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={sigBgCanvasRef} className="hidden" />
    </div>
  );
}
