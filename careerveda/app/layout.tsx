import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CareerVeda 2.0 – Empower Your Career Journey',
  description: 'Learn, build projects, get mentored, earn certificates, and land your dream job with our AI‑powered career platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-light text-dark min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-primary text-light p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-display">CareerVeda</h1>
            <nav className="space-x-4">
              <a href="#" className="hover:underline">Home</a>
              <a href="#programs" className="hover:underline">Programs</a>
              <a href="#about" className="hover:underline">About</a>
              <a href="#contact" className="hover:underline">Contact</a>
            </nav>
          </div>
        </header>
        <main className="flex-1 container mx-auto py-8">
          {children}
        </main>
        {/* Footer */}
        <footer className="bg-dark text-light p-6 mt-8">
          <div className="container mx-auto text-center">
            © {new Date().getFullYear()} CareerVeda. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
