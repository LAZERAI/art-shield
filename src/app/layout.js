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
  metadataBase: new URL("https://art-shield.vercel.app"),
  title: "ArtShield - Protect Your Art",
  description: "Free browser-based tools for artists. Proof of ownership, visible & invisible watermarking, DMCA takedown generation. Your art never leaves your device.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "ArtShield - Protect Your Art",
    description: "Free browser-based tools for artists. Proof of ownership, visible & invisible watermarking, DMCA takedown generation. Your art never leaves your device.",
    url: "https://art-shield.vercel.app",
    siteName: "ArtShield",
    images: [{ url: "/og-image.png", width: 1024, height: 1024 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ArtShield - Protect Your Art",
    description: "Free browser-based tools for artists. Proof of ownership, visible & invisible watermarking, DMCA takedown generation.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t){document.documentElement.setAttribute('data-theme',t)}else if(window.matchMedia('(prefers-color-scheme:light)').matches){document.documentElement.setAttribute('data-theme','light')}else{document.documentElement.setAttribute('data-theme','dark')}}catch(e){document.documentElement.setAttribute('data-theme','dark')}})()`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--muted)]">
          <p>Your art stays on your device. Always.</p>
          <p className="mt-2">ArtShield is free and <a href="https://github.com/LAZERAI/art-shield" className="text-[var(--accent)] underline hover:text-[var(--accent-hover)]" target="_blank" rel="noopener noreferrer">open source</a>.</p>
        </footer>
      </body>
    </html>
  );
}
