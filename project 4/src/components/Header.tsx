import { useState, useEffect } from "react";

const links = [
  { label: "Collections", href: "#collections" },
  { label: "Products", href: "#products" },
  { label: "Projects", href: "#projects" },
  { label: "Get Quote", href: "#quote" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-primary/95 backdrop-blur shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container-main flex items-center justify-between py-4">
        <a href="#" className="font-heading text-xl font-bold text-white">
          Salon <span className="text-secondary">Factory</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-gray-300 transition hover:text-secondary"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#quote"
            className="bg-secondary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-yellow-400"
          >
            Get Quote
          </a>
        </nav>
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-lg transition hover:bg-green-600 md:relative md:bottom-auto md:right-auto md:hidden"
        >
          💬
        </a>
      </div>
    </header>
  );
}
