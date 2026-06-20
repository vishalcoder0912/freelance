import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "CareerVeda AI OS — Your Personal Career Operating System",
  description:
    "The world's first AI-powered Career Operating System. Analyze, plan, mentor, train, and get placed — all through one intelligent platform.",
  keywords:
    "AI career platform, career operating system, AI resume builder, mock interview, job placement, career roadmap",
  openGraph: {
    title: "CareerVeda AI OS",
    description: "Become Irreplaceable. The world's first AI Career Operating System.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="aurora-bg">
        <ThemeProvider>
          <div className="noise-overlay" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
