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
  title: "ArtShield",
  description: "free tools to protect your art from theft. proof of ownership, watermarking, DMCA takedowns. runs in your browser.",
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
          <p>your art stays on your device. always.</p>
          <p className="mt-2">artshield is free and <a href="https://github.com" className="text-[var(--accent)] hover:underline">open source</a></p>
        </footer>
      </body>
    </html>
  );
}
