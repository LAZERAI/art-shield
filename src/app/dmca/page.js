"use client";
import { useState } from "react";

const PLATFORMS = [
  { id: "twitter", label: "Twitter / X", email: "copyright@x.com" },
  { id: "instagram", label: "Instagram / Facebook", email: "ip@fb.com" },
  { id: "tiktok", label: "TikTok", email: "copyright@tiktok.com" },
  { id: "youtube", label: "YouTube", email: "Use YouTube's online DMCA form" },
  { id: "reddit", label: "Reddit", email: "Use Reddit's online DMCA form at reddit.com/report" },
  { id: "other", label: "Other (generic)", email: "Find the platform's DMCA/copyright contact" },
];

export default function DmcaPage() {
  const [form, setForm] = useState({
    artistName: "",
    artistEmail: "",
    platform: "twitter",
    infringingUrl: "",
    originalUrl: "",
    description: "",
    artTitle: "",
  });
  const [generated, setGenerated] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const platform = PLATFORMS.find((p) => p.id === form.platform);

  function generate() {
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

    const notice = `DMCA TAKEDOWN NOTICE
${"=".repeat(50)}

Date: ${date}
To: ${platform.label} Copyright/Legal Department
Via: ${platform.email}

Dear Sir/Madam,

I am writing to notify you of copyright infringement on your platform under the Digital Millennium Copyright Act (DMCA), 17 U.S.C. § 512.

IDENTIFICATION OF COPYRIGHTED WORK:
- Title: ${form.artTitle || "[Artwork Title]"}
- Original Artist: ${form.artistName}
${form.originalUrl ? `- Original URL: ${form.originalUrl}` : "- [Original posted at: describe where you first published]"}

IDENTIFICATION OF INFRINGING MATERIAL:
- Infringing URL: ${form.infringingUrl}
- Description: ${form.description || "The above URL contains my original artwork being used without my permission or authorization."}

I have a good faith belief that the use of the copyrighted material described above is not authorized by the copyright owner (myself), its agent, or the law.

I swear, under penalty of perjury, that the information in this notification is accurate, and that I am the copyright owner or am authorized to act on behalf of the copyright owner of an exclusive right that is allegedly infringed.

CONTACT INFORMATION:
- Full Legal Name: ${form.artistName}
- Email: ${form.artistEmail}

Electronic Signature: /s/ ${form.artistName}
Date: ${date}

${"=".repeat(50)}
This notice was generated using ArtShield (artshield.vercel.app)
For informational purposes only — not legal advice.`;

    setGenerated(notice);
  }

  function copyNotice() {
    if (generated) {
      navigator.clipboard.writeText(generated);
    }
  }

  function downloadNotice() {
    if (!generated) return;
    const blob = new Blob([generated], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `DMCA_Takedown_${form.platform}_${Date.now()}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  const isValid = form.artistName && form.artistEmail && form.infringingUrl;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">dmca takedown generator</h1>
      <p className="text-[var(--muted)] mb-8">
        someone stole your art? fill this out and we&apos;ll write the takedown notice for you. just copy-paste it and send it to the platform.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 mb-6">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">Your Full Name *</label>
              <input
                type="text"
                value={form.artistName}
                onChange={(e) => update("artistName", e.target.value)}
                placeholder="Your legal name"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--accent)] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">Your Email *</label>
              <input
                type="email"
                value={form.artistEmail}
                onChange={(e) => update("artistEmail", e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--accent)] outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">Platform</label>
              <select
                value={form.platform}
                onChange={(e) => update("platform", e.target.value)}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--accent)] outline-none"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              <p className="text-xs text-[var(--muted)] mt-1">Send to: {platform.email}</p>
            </div>
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">Artwork Title</label>
              <input
                type="text"
                value={form.artTitle}
                onChange={(e) => update("artTitle", e.target.value)}
                placeholder="Name of your artwork"
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--accent)] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[var(--muted)] mb-1">Infringing URL * (where your stolen art is)</label>
            <input
              type="url"
              value={form.infringingUrl}
              onChange={(e) => update("infringingUrl", e.target.value)}
              placeholder="https://twitter.com/thief/status/123..."
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--accent)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--muted)] mb-1">Your Original Post URL (optional)</label>
            <input
              type="url"
              value={form.originalUrl}
              onChange={(e) => update("originalUrl", e.target.value)}
              placeholder="https://twitter.com/you/status/456... or your portfolio link"
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--accent)] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--muted)] mb-1">Additional Details (optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              placeholder="Any extra details about the theft..."
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:border-[var(--accent)] outline-none resize-y"
            />
          </div>

          <button
            onClick={generate}
            disabled={!isValid}
            className="px-6 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            Generate DMCA Notice
          </button>
        </div>
      </div>

      {generated && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[var(--accent)]">Your DMCA Notice</h2>
            <div className="flex gap-2">
              <button
                onClick={copyNotice}
                className="px-3 py-1 text-xs border border-[var(--border)] rounded-lg text-[var(--muted)] hover:text-white transition-colors"
              >
                Copy
              </button>
              <button
                onClick={downloadNotice}
                className="px-3 py-1 text-xs bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
              >
                Download .txt
              </button>
            </div>
          </div>
          <pre className="text-xs text-[var(--muted)] whitespace-pre-wrap bg-[var(--background)] border border-[var(--border)] rounded-lg p-4 max-h-96 overflow-y-auto">
            {generated}
          </pre>
          <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
            <p className="text-xs text-yellow-300">
              ⚠️ This is a template — not legal advice. Review it before sending. A DMCA notice is a legal document made under penalty of perjury. Make sure all information is accurate.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
