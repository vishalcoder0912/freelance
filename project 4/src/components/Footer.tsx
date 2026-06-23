import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-premium-black">
      <div className="container-main py-20">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <h3 className="font-heading text-3xl font-bold text-luxury-white">
              Salon <span className="text-gold">Factory</span>
            </h3>
            <p className="mt-4 max-w-md text-gray-500 leading-relaxed">
              India's most trusted salon furniture manufacturer. Premium commercial-grade furniture for luxury salons, barber lounges, and beauty chains across India.
            </p>
            <div className="mt-6 flex gap-3">
              <input
                type="email"
                placeholder="Your email for updates"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border border-white/10 bg-white/5 px-4 py-3 text-sm text-luxury-white placeholder-gray-500 focus:border-gold focus:outline-none"
              />
              <Button size="sm">Subscribe</Button>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-luxury-white">Quick Links</h4>
            <ul className="mt-4 space-y-3">
              {["Collections", "Products", "Projects", "About Us", "Contact"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/\s/g, "-")}`} className="text-sm text-gray-500 transition-colors hover:text-gold">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-luxury-white">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-500">
              <li>info@salonfactory.in</li>
              <li>+91 93355 66771</li>
              <li>Delhi · Lucknow</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-600">© {year} Salon Factory. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gold transition">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
