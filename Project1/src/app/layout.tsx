import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import SpotlightCursor from "@/components/SpotlightCursor";
import ParticleCanvas from "@/components/ParticleCanvas";
import { CartProvider } from "@/context/CartContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Darkins | Luxury Bean-to-Bar Chocolate Experience",
  description:
    "Indian Bean-to-Bar Chocolate Crafted for Extraordinary Experiences. Explore single-origin bars, tasting flights, factory tours, workshops, and bespoke luxury gifting.",
  keywords: [
    "Darkins",
    "Chocolate",
    "Luxury Chocolate",
    "Bean-to-bar",
    "Indian Chocolate",
    "Vegan Chocolate",
    "Factory Tour Delhi",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#090605] text-[#f8eadc] selection:bg-[#e5ad6b]/30 selection:text-[#f8eadc]">
        <CartProvider>
          <SmoothScroll>
            <SpotlightCursor />
            <ParticleCanvas />
            {children}
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}

