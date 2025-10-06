import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "./components/Navbar";
import DndTouch from "./utils/dndtouch";
import { SessionProvider } from "./utils/session-provider";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prep Pilot",
  description: "Move from endless planning to focused preparation.",
  keywords: [
    "Kanban board",
    "React",
    "Next.js",
    "drag and drop",
    "Jee",
    "Jee mains",
    "Jee Advance",
    "Prep Pilot",
  ],
  authors: [{ name: "Anmol Gupta" }],
  creator: "Anmol Gupta",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Prep Pilot",
    description: "Move from endless planning to focused preparation.",
    url: "https://prep-pilot-jee.vercel.app/", // URL
    siteName: "Prep Pilot",
    images: [
      {
        url: "https://prep-pilot-jee.vercel.app/open-graph.png", //image
        width: 1200,
        height: 630,
        alt: "Prep Pilot",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@anmol__003",
    title: "Prep Pilot",
    description: "Move from endless planning to focused preparation.",
    creator: "@anmol__003",
    images: ["https://prep-pilot-jee.vercel.app/open-graph.png"], //image
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "mask-icon",
      url: "/safari-pinned-tab.svg",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background antialiased`}
      >
        <SessionProvider>
          <ThemeProvider attribute="class" enableSystem defaultTheme="system">
            <div className="bg-background bgpattern flex h-screen w-full flex-col p-4 max-sm:p-0">
              <Navbar />
              <DndTouch />
              {children}
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
