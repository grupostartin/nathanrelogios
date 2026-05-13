import { useState } from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal } from 'lucide-react';

export default function Catalog() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = activeCategory 
    ? products.filter(p => p.category === activeCategory)
    : products;

  return (
    <main className="flex flex-col min-h-screen bg-secondary">
      <div className="bg-offwhite py-16 border-b border-gray-light text-center px-6">
        <h1 className="font-serif text-4xl md:text-5xl tracking-[0.02em] mb-4">Catálogo de Relógios</h1>
        <p className="font-sans text-gray-medium tracking-wide max-w-2xl mx-auto">
          Explore nossa seleção exclusiva de relógios Citizen. Da engenharia avançada Eco-Drive ao clássico automático.
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-16 flex flex-col md:flex-row gap-12 w-full">
        {/* Filters Desktop / Mobile Toggle */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="flex justify-between items-center md:mb-8 mb-4">
            <h2 className="font-serif tracking-widest uppercase text-sm">Filtros</h2>
            <button 
              className="md:hidden text-primary"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block space-y-8`}>
            {/* Category Filter */}
            <div>
              <h3 className="label-caps text-gray-medium mb-4">Coleção</h3>
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => setActiveCategory(null)}
                  className={`text-left text-sm font-sans uppercase tracking-wider transition-colors ${!activeCategory ? 'text-primary font-medium' : 'text-gray-medium hover:text-primary'}`}
                >
                  Todos ({products.length})
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left text-sm font-sans uppercase tracking-wider transition-colors ${activeCategory === cat ? 'text-primary font-medium' : 'text-gray-medium hover:text-primary'}`}
                  >
                    {cat} ({products.filter(p => p.category === cat).length})
                  </button>
                ))}
              </div>
            </div>
            {/* More filters could be added here following the same structural pattern */}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="w-full flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
