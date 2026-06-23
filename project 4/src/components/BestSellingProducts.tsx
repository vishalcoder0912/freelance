import Reveal from "./Reveal";
import { products } from "../data/content";

export default function BestSellingProducts() {
  return (
    <section className="py-24" id="products">
      <div className="container-main">
        <div className="mb-14 text-center">
          <Reveal>
            <h2 className="font-heading text-4xl text-primary md:text-5xl">Best Selling Products</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-3 text-lg text-gray-600">Engineered for performance, designed for luxury.</p>
          </Reveal>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.id} direction="up" delay={i * 0.12}>
              <div className="group cursor-pointer overflow-hidden rounded-sm bg-white shadow-sm transition hover:shadow-lg">
                <div className="overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-primary">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                  <ul className="mt-4 space-y-1">
                    {product.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="h-1 w-1 rounded-full bg-secondary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                      {product.warranty}
                    </span>
                    <button className="text-sm font-semibold text-secondary transition hover:text-yellow-500">
                      Get Quote →
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
