"use client";

import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { cartItems, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Experiences", href: "/experiences" },
    { label: "Bean-to-Bar", href: "/story" },
    { label: "Gifting", href: "/gifting" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#090605]/80 backdrop-blur-md py-4 border-b border-[#e5ad6b]/10"
            : "bg-transparent py-6"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo Left */}
          <a href="/" className="flex flex-col items-start group select-none">
            <span className="font-serif text-xl md:text-2xl font-bold tracking-[0.3em] text-[#f8eadc] group-hover:text-[#e5ad6b] transition-colors duration-500">
              DARKINS
            </span>
            <span className="text-[7px] uppercase tracking-[0.55em] text-[#d4af37]/75 mt-0.5 font-sans">
              Bean-to-Bar India
            </span>
          </a>

          {/* Menu Center (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.25em] text-[#c8b5a4] ml-12">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#e5ad6b] transition-colors duration-300 relative py-2 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#e5ad6b] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Right (Desktop) */}
          <div className="flex items-center gap-4 md:gap-6">
            <a
              href="/experiences"
              className="hidden sm:inline-flex px-5 py-2.5 rounded-sm border border-[#e5ad6b]/30 text-[#f8eadc] text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:bg-[#e5ad6b] hover:text-[#090605] hover:border-[#e5ad6b] hover:scale-105"
            >
              Book Tour
            </a>

            {/* Minimal Cart Icon */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-[#f8eadc] hover:text-[#e5ad6b] transition-colors duration-300 p-2"
              aria-label="Cart"
            >
              <ShoppingBag size={15} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#c58c48] text-[#090605] font-mono text-[7px] font-bold h-3 w-3 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              className="lg:hidden text-[#f8eadc] hover:text-[#e5ad6b] transition-colors duration-300"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={18} />
            </button>
          </div>

        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#090605]/95 backdrop-blur-xl flex flex-col justify-between p-8"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              {/* Mobile Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#e5ad6b]/10">
                <span className="font-serif text-lg font-bold tracking-[0.25em] text-[#f8eadc]">
                  DARKINS
                </span>
                <button
                  className="text-[#f8eadc] hover:text-[#e5ad6b]"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close Menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Links */}
              <nav className="flex flex-col gap-6 mt-12 text-left">
                {navLinks.map((link, idx) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-2xl text-[#f8eadc] hover:text-[#e5ad6b] transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
            </div>

            {/* Mobile Footer CTA */}
            <div className="flex flex-col gap-4">
              <a
                href="/experiences"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-4 bg-[#c58c48] text-[#090605] text-[10px] uppercase tracking-[0.25em] font-bold rounded-sm"
              >
                Book Tour
              </a>
              <div className="text-[9px] tracking-widest text-[#c8b5a4]/40 text-center uppercase">
                Darkins Chocolate © 2026
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shopping Cart Drawer Overlay */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setCartOpen(false);
                setCheckoutSuccess(false);
              }}
              className="fixed inset-0 z-50 bg-[#090605]/70 backdrop-blur-xs"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[450px] bg-[#140d0b] border-l border-[#e5ad6b]/10 p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#e5ad6b]/10">
                <span className="font-serif text-lg font-bold tracking-[0.2em] text-[#f8eadc] uppercase">
                  Your Selection
                </span>
                <button
                  onClick={() => {
                    setCartOpen(false);
                    setCheckoutSuccess(false);
                  }}
                  className="text-[#f8eadc] hover:text-[#e5ad6b] p-1 transition-colors"
                  aria-label="Close Cart"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-grow overflow-y-auto mt-6 pr-1 space-y-4">
                {checkoutSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 flex flex-col items-center gap-6"
                  >
                    <div className="w-16 h-16 rounded-full border border-[#e5ad6b] flex items-center justify-center bg-[#1d120f]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#e5ad6b" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-[#f8eadc] uppercase tracking-wider">Order Placed</h3>
                      <p className="text-xs text-[#c8b5a4] mt-2 max-w-xs leading-relaxed">
                        Thank you for choosing Darkins. Your luxury bean-to-bar order has been processed. Order ID: <span className="text-[#f8eadc] font-mono font-medium">DK-{Math.floor(100000 + Math.random() * 900000)}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        setCheckoutSuccess(false);
                      }}
                      className="px-6 py-2.5 bg-[#c58c48] text-[#090605] text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm hover:bg-[#e5ad6b] transition-all"
                    >
                      Continue Indulging
                    </button>
                  </motion.div>
                ) : cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 gap-4">
                    <ShoppingBag size={36} className="text-[#c8b5a4]/30" />
                    <p className="text-xs text-[#c8b5a4] font-light max-w-[200px] leading-relaxed">
                      Your chocolate selection bag is empty.
                    </p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="mt-2 text-[10px] uppercase tracking-widest text-[#e5ad6b] font-semibold hover:text-[#f8eadc]"
                    >
                      Browse Boutique
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 bg-[#0c0807] border border-[#c58c48]/5 rounded-sm justify-between items-center">
                      <div className="flex gap-3 items-center min-w-0">
                        {/* Small Image */}
                        <div className="w-12 h-15 relative flex-shrink-0 bg-gradient-to-br from-[#1c120f] to-[#090605] rounded-sm overflow-hidden border border-[#c58c48]/10">
                          {item.src && (
                            <img src={item.src} alt={item.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[7.5px] uppercase tracking-wider text-[#d4af37]">
                            {item.category}
                          </span>
                          <h4 className="font-serif text-xs text-[#f8eadc] truncate mt-0.5 font-medium leading-tight">
                            {item.name}
                          </h4>
                          <span className="font-mono text-[10px] text-[#c8b5a4] mt-1 block">
                            ₹{item.price.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
                        <div className="flex items-center gap-2 border border-[#c58c48]/15 bg-[#140d0b] px-2 py-1 rounded-sm scale-90">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-[#c8b5a4] hover:text-[#e5ad6b] transition-colors p-0.5"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="font-mono text-xs text-[#f8eadc] px-1 min-w-[14px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-[#c8b5a4] hover:text-[#e5ad6b] transition-colors p-0.5"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#c8b5a4]/50 hover:text-red-400/80 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Panel */}
              {!checkoutSuccess && cartItems.length > 0 && (
                <div className="pt-6 border-t border-[#e5ad6b]/10 mt-6 bg-[#140d0b]">
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-[10px] uppercase tracking-widest text-[#c8b5a4]">Subtotal</span>
                    <span className="font-mono text-sm text-[#f8eadc] font-bold">
                      ₹{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setCheckoutLoading(true);
                        setTimeout(() => {
                          setCheckoutLoading(false);
                          setCheckoutSuccess(true);
                          clearCart();
                        }, 1500);
                      }}
                      disabled={checkoutLoading}
                      className="w-full py-3.5 bg-[#c58c48] text-[#090605] text-[10px] uppercase tracking-[0.25em] font-bold rounded-sm hover:bg-[#e5ad6b] flex items-center justify-center disabled:opacity-50 transition-all duration-300"
                    >
                      {checkoutLoading ? "Processing Selection..." : "Confirm & Checkout"}
                    </button>
                    <button
                      onClick={clearCart}
                      className="w-full py-2.5 border border-[#c58c48]/10 text-[9px] uppercase tracking-widest text-[#c8b5a4]/50 hover:text-red-400/80 transition-colors rounded-sm"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
