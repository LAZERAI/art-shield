"use client";
import { useCallback, useState } from "react";

export default function FileDropZone({ onFile, accept = "image/*", label = "Drop your artwork here or click to upload" }) {
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback((file) => {
    if (file && file.type.startsWith("image/")) {
      onFile(file);
    }
  }, [onFile]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
        dragging
          ? "border-[var(--accent)] bg-[var(--accent)]/10"
          : "border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--card)]/50"
      }`}
    >
      <input
        type="file"
        accept={accept}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <svg className="mx-auto mb-4 text-[var(--muted)]" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 16V4m0 0l-4 4m4-4 4 4M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" />
      </svg>
      <p className="text-[var(--muted)]">{label}</p>
      <p className="text-xs text-[var(--muted)]/60 mt-2">PNG, JPG, WEBP supported</p>
    </div>
  );
}
