import { useState } from "react";
import { Button } from "./ui/button";

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-premium-black">
      <div className="container-main py-20">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex flex-col items-start gap-1 group">
              <div className="bg-[#d61b2a] px-4 py-1.5 rounded-[5px] border border-[#b21421]">
                <span className="font-heading text-base font-extrabold tracking-wide text-white uppercase block leading-none">
                  SALON FACTORY
                </span>
              </div>
              <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-[0.2em] font-body mt-1">
                Furniture • Tools • Essentials
              </span>
            </div>
            <p className="mt-6 max-w-md text-gray-500 leading-relaxed text-sm">
              India's most trusted salon furniture manufacturer. Premium commercial-grade furniture for luxury salons, barber lounges, and beauty chains across India.
            </p>
            <div className="mt-6 flex gap-3 max-w-sm">
              <input
                type="email"
                placeholder="Your email for updates"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border border-white/15 bg-white/5 px-4 py-2.5 rounded-full text-sm text-luxury-white placeholder-gray-500 focus:border-gold focus:outline-none font-body"
              />
              <Button size="sm" className="rounded-full">Subscribe</Button>
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
