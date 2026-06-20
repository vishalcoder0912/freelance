import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mason & Co — Premium Single-Origin Bean-to-Bar Chocolate",
  description: "A world-class luxury cinematic experience tracking South Indian single-origin cacao from misty groves to custom artisan dark chocolate.",
  openGraph: {
    title: "Mason & Co — Premium Single-Origin Bean-to-Bar Chocolate",
    description: "A world-class luxury cinematic experience tracking South Indian single-origin cacao from misty groves to custom artisan dark chocolate.",
    type: "website",
    url: "https://masonandco.in",
    siteName: "Mason & Co Fine Chocolate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mason & Co Fine Chocolate",
    description: "Premium single-origin bean-to-bar chocolate from South Indian agroforestry estates.",
  }
};

export default function RootLayout({
  children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${cormorant.variable} ${inter.variable} bg-brand-black text-brand-cream antialiased`}>
        {children}
        
        {/* Structured SEO Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "Mason & Co Fine Chocolate",
              "url": "https://masonandco.in",
              "image": "https://masonandco.in/images/product_dark.png",
              "description": "Crafting premium organic single-origin chocolate from the Western Ghats.",
              "telephone": "+919319758795",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Auroville Atelier",
                "addressLocality": "Puducherry",
                "addressRegion": "Tamil Nadu",
                "postalCode": "605101",
                "addressCountry": "IN"
              },
              "priceRange": "$$$"
            })
          }}
        />
      </body>
    </html>
  );
}
