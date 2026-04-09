import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutShell } from "@/components/LayoutShell";

/* ─── Font ──────────────────────────────────────────────────────────── */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* ─── SEO Metadata ──────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "Study Express UK — Learn, Connect & Transform",
    template: "%s | Study Express UK",
  },
  description:
    "UK-accredited courses, professional development events, and corporate training solutions. Join 50,000+ learners advancing their careers.",
  keywords: ["UK courses", "online learning", "professional development", "certifications", "study in UK"],
  metadataBase: new URL("https://studyexpressuk.com"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Study Express UK",
  },
};

/* ─── Root layout (server component) ─────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ margin: 0, padding: 0 }}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
