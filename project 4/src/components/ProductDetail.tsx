import { useParams } from "react-router-dom";
import { products } from "../data/content";
import Reveal from "../components/Reveal";

const features = [
  "Hydraulic Lift",
  "Premium Leatherette",
  "Powder Coated Steel",
  "Commercial Grade Build",
];

const tabs = [
  { label: "Overview", content: "Premium salon furniture engineered for daily commercial use. Built with heavy-duty materials to withstand the rigors of a busy salon environment." },
  { label: "Specifications", content: "Dimensions: Varies by model. Materials: Premium leatherette, powder-coated steel frame. Weight capacity: 150kg. Color options: Black, White, Gold, Silver." },
  { label: "Customization", content: "Available in custom colors and materials. Brand embroidery and logo options. Bulk order customization available." },
  { label: "Warranty", content: "1-year comprehensive warranty covering manufacturing defects and hydraulic system. Extended warranty options available." },
  { label: "FAQs", content: "Q: What is the delivery timeline? A: 7-14 business days. Q: Do you provide installation? A: Yes, pan India installation support included." },
];

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id) || products[0];

  return (
    <div className="min-h-screen bg-surface pt-24">
      <div className="container-main py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal direction="left">
            <div className="overflow-hidden rounded-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full object-cover"
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[product.image, product.image, product.image, product.image].map((img, i) => (
                <div key={i} className="cursor-pointer overflow-hidden rounded-sm border border-gray-200">
                  <img src={img} alt="" className="h-20 w-full object-cover" />
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal direction="right">
            <div>
              <h1 className="font-heading text-4xl font-semibold text-primary">{product.name}</h1>
              <p className="mt-2 text-lg text-gray-600">{product.description}</p>
              <div className="mt-6 space-y-2">
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-primary">Warranty:</span> {product.warranty}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-primary">Customization:</span> Available
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-primary">Delivery:</span> 7-14 Days
                </p>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold text-primary">Feature Highlights</h3>
                <ul className="mt-3 space-y-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-gray-600">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10 text-xs text-secondary">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="bg-secondary px-8 py-4 font-semibold text-primary transition hover:bg-yellow-400">
                  Get Quote
                </button>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-primary px-8 py-4 font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  Chat On WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="mt-16">
          <Reveal>
            <div className="border-b border-gray-200">
              <nav className="flex gap-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.label}
                    className="whitespace-nowrap border-b-2 border-secondary pb-3 text-sm font-medium text-primary"
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="mt-8 max-w-2xl">
              <p className="text-gray-600">{tabs[0].content}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
