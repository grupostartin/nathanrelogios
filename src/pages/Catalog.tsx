import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, Loader2 } from 'lucide-react';

export default function Catalog() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeGender, setActiveGender] = useState<string | null>(null);
  const [activeUsed, setActiveUsed] = useState<boolean | null>(null);

  const { products, loading, error } = useProducts({
    category: activeCategory,
    gender: activeGender,
    isUsed: activeUsed,
  });

  // Para contagens do filtro, buscamos todos os produtos sem filtro
  const { products: allProducts } = useProducts();

  const categories = Array.from(new Set(allProducts.map(p => p.category)));
  const genders = Array.from(new Set(allProducts.map(p => p.gender)));

  return (
    <main className="flex flex-col min-h-screen bg-secondary">
      <div className="bg-offwhite py-16 border-b border-gray-light text-center px-6">
        <h1 className="font-serif text-4xl md:text-5xl tracking-[0.02em] mb-4">Catálogo de Relógios</h1>
        <p className="font-sans text-gray-medium tracking-wide max-w-2xl mx-auto">
          Explore nossa seleção exclusiva de relógios Citizen. Da engenharia avançada Eco-Drive ao clássico automático.
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-16 flex flex-col md:flex-row gap-12 w-full">
        {/* Filters */}
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
                  Todos ({allProducts.length})
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={`text-left text-sm font-sans uppercase tracking-wider transition-colors ${activeCategory === cat ? 'text-primary font-medium' : 'text-gray-medium hover:text-primary'}`}
                  >
                    {cat} ({allProducts.filter(p => p.category === cat).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <h3 className="label-caps text-gray-medium mb-4">Gênero</h3>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setActiveGender(null)}
                  className={`text-left text-sm font-sans uppercase tracking-wider transition-colors ${!activeGender ? 'text-primary font-medium' : 'text-gray-medium hover:text-primary'}`}
                >
                  Todos
                </button>
                {genders.map(g => (
                  <button
                    key={g}
                    onClick={() => setActiveGender(activeGender === g ? null : g)}
                    className={`text-left text-sm font-sans uppercase tracking-wider transition-colors ${activeGender === g ? 'text-primary font-medium' : 'text-gray-medium hover:text-primary'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Novo/Usado Filter */}
            <div>
              <h3 className="label-caps text-gray-medium mb-4">Condição</h3>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setActiveUsed(null)}
                  className={`text-left text-sm font-sans uppercase tracking-wider transition-colors ${activeUsed === null ? 'text-primary font-medium' : 'text-gray-medium hover:text-primary'}`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setActiveUsed(false)}
                  className={`text-left text-sm font-sans uppercase tracking-wider transition-colors ${activeUsed === false ? 'text-primary font-medium' : 'text-gray-medium hover:text-primary'}`}
                >
                  Novos
                </button>
                <button
                  onClick={() => setActiveUsed(true)}
                  className={`text-left text-sm font-sans uppercase tracking-wider transition-colors ${activeUsed === true ? 'text-primary font-medium' : 'text-gray-medium hover:text-primary'}`}
                >
                  Usados / Seminovos
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="w-full flex-1">
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-10 h-10 text-gold animate-spin" />
              <p className="font-sans text-sm text-gray-medium tracking-widest uppercase">Carregando produtos...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <p className="font-sans text-sm text-red-500">Erro ao carregar produtos. Tente novamente.</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <p className="font-serif text-2xl text-gray-medium">Nenhum produto encontrado.</p>
              <button
                onClick={() => { setActiveCategory(null); setActiveGender(null); }}
                className="font-sans text-sm uppercase tracking-widest text-gold hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <p className="font-sans text-xs text-gray-medium uppercase tracking-widest mb-8">
                {products.length} {products.length === 1 ? 'modelo' : 'modelos'} encontrado{products.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
