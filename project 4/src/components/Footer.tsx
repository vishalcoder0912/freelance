export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-accent py-16">
      <div className="container-main">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="font-heading text-2xl font-bold text-white">
              Salon <span className="text-secondary">Factory</span>
            </h3>
            <p className="mt-3 max-w-md text-gray-400">
              India's most trusted salon furniture manufacturer. Premium salon infrastructure for luxury spaces across the country.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li><a href="#collections" className="hover:text-secondary transition">Collections</a></li>
              <li><a href="#products" className="hover:text-secondary transition">Products</a></li>
              <li><a href="#projects" className="hover:text-secondary transition">Projects</a></li>
              <li><a href="#quote" className="hover:text-secondary transition">Get Quote</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Contact</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>info@salonfactory.in</li>
              <li>+91 98765 43210</li>
              <li>Delhi, India</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          <p>© {year} Salon Factory. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
