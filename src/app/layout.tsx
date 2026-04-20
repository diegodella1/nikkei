import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Japan Markets — Nikkei Monitor",
  description:
    "Opening and performance — Nikkei 225, TOPIX (ETF proxy), USD/JPY, Metaplanet (3350.T)",
};

/** Embedded browsers (e.g. vMix Web Browser) need explicit viewport + safe scaling. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-[100vh] min-h-dvh flex-col overflow-x-hidden overflow-y-auto bg-[#030306]">
        {children}
      </body>
    </html>
  );
}
