import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ArtShield — Protect Your Art",
  description: "Free browser-based tools for artists. Proof of ownership, visible & invisible watermarking, DMCA takedown generation. Your art never leaves your device.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--muted)]">
          <p>Your art stays on your device. Always.</p>
          <p className="mt-2">ArtShield is free and <a href="https://github.com/LAZERAI/art-shield" className="text-[var(--accent)] hover:underline">open source</a>.</p>
        </footer>
      </body>
    </html>
  );
}
