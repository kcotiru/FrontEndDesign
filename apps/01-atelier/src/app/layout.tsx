import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import JsonLd from "@/components/json-ld";
import { restaurant } from "@/content/restaurant";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atelier.example.com"),
  title: { default: "Atelier — Twelve seats, Paris 1er", template: "%s · Atelier" },
  description: restaurant.description,
  openGraph: {
    type: "website",
    title: "Atelier",
    description: restaurant.tagline,
    locale: "en_GB",
    images: [
      {
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=630&fit=crop&crop=entropy&q=80",
        width: 1200,
        height: 630,
        alt: "The counter at Atelier, set for twelve, lit by low pendant lamps before service.",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("atelier-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-raised focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
