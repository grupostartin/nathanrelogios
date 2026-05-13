import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useProducts } from '../hooks/useProducts';
import { formatPrice } from '../data/products';

function conditionBadgeClass(condition?: string | null): string {
  switch (condition) {
    case 'Seminovo':     return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Ótimo Estado':  return 'bg-green-100 text-green-800 border-green-300';
    case 'Bom Estado':   return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Com Detalhes': return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Para Revisão': return 'bg-red-100 text-red-800 border-red-300';
    default:             return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}
import { useState } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id);
  const [activeImage, setActiveImage] = useState(0);

  // Produtos relacionados: mesma categoria
  const { products: relatedProducts } = useProducts({
    category: product?.category ?? undefined,
  });
  const related = relatedProducts.filter(p => p.id !== id).slice(0, 4);

  const whatsappMessage = product
    ? `Olá, tenho interesse no relógio Citizen ${product.name} (Ref: ${product.reference}). Poderia me passar mais informações sobre disponibilidade e formas de pagamento?`
    : '';
  const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMessage)}`;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
        <p className="font-sans text-sm text-gray-medium tracking-widest uppercase">Carregando produto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="font-serif text-2xl text-gray-medium">Produto não encontrado.</p>
        <Link
          to="/catalogo"
          className="font-sans text-sm uppercase tracking-widest text-gold hover:underline"
        >
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-secondary">

      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-6 w-full flex items-center text-[10px] uppercase font-sans tracking-widest text-gray-medium">
        <Link to="/catalogo" className="hover:text-primary transition-colors">Catálogo</Link>
        <ChevronRight className="w-3 h-3 mx-2" />
        <span>{product.category}</span>
        <ChevronRight className="w-3 h-3 mx-2" />
        <span className="text-primary">{product.name}</span>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 pt-8 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Gallery */}
        <div className="flex flex-col-reverse lg:flex-row gap-6">
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible no-scrollbar pb-2 lg:pb-0 shrink-0 w-full lg:w-24">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative w-20 h-24 lg:w-full lg:h-32 border shrink-0 transition-colors ${activeImage === idx ? 'border-primary' : 'border-gray-light hover:border-gray-medium'}`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
              </button>
            ))}
          </div>
          <div className="bg-offwhite flex-1 aspect-[4/5] md:aspect-square flex items-center justify-center p-8 relative overflow-hidden group">
            <img src={product.images[activeImage]} alt={product.name} className="w-full max-h-full object-contain mix-blend-multiply" />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-start">
          <span className="label-caps text-gold mb-4">{product.line}</span>
          <h1 className="font-serif text-[40px] leading-[1.1] mb-2">{product.name}</h1>
          {product.isUsed && product.condition && (
            <span className={`inline-block mb-3 px-3 py-1 text-[10px] uppercase tracking-widest font-semibold border ${
              conditionBadgeClass(product.condition)
            }`}>
              Relógio Usado · {product.condition}
            </span>
          )}
          <span className="font-sans text-sm text-gray-medium tracking-widest uppercase mb-8 block">REF: {product.reference}</span>

          <div className="flex items-end gap-4 mb-8">
            <span className="font-sans text-3xl font-medium">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="font-sans text-lg text-gray-medium line-through mb-1.5">{formatPrice(product.oldPrice)}</span>
            )}
          </div>

          <p className="font-sans text-base text-gray-medium leading-relaxed mb-10 max-w-lg">
            {product.description}
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-5 bg-primary text-secondary text-sm uppercase tracking-widest font-semibold hover:bg-gold transition-colors duration-300 text-center mb-16"
          >
            Comprar pelo WhatsApp
          </a>

          {/* Specs */}
          <div>
            <h3 className="font-serif text-xl mb-6 pb-4 border-b border-gray-light">Especificações Técnicas</h3>
            <div className="flex flex-col">
              {[
                { label: 'Marca', value: 'Citizen' },
                { label: 'Gênero', value: product.gender },
                ...(product.isUsed ? [{ label: 'Condição', value: product.condition ?? 'Usado' }] : []),
                { label: 'Mecanismo', value: product.mechanism },
                { label: 'Caixa / Pulseira', value: `${product.caseMaterial} / ${product.strapMaterial}` },
                { label: 'Mostrador', value: product.dialColor },
                { label: 'Resistência à Água', value: product.waterResistance },
                { label: 'Tamanho / Espessura', value: `${product.caseSize} / ${product.thickness}` },
                { label: 'Garantia', value: '2 anos de garantia de fábrica' },
              ].map(spec => (
                <div key={spec.label} className="grid grid-cols-2 py-4 border-b border-gray-light/50">
                  <span className="font-sans text-xs uppercase tracking-widest text-gray-medium">{spec.label}</span>
                  <span className="font-sans text-sm text-primary font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="bg-offwhite py-24 border-t border-gray-light">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
            <h2 className="font-serif text-3xl mb-12 text-center md:text-left">Você também pode gostar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
