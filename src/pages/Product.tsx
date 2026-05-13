import { useParams } from 'react-router-dom';
import { products, formatPrice } from '../data/products';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-serif text-2xl">
        Produto não encontrado.
      </div>
    );
  }

  const relatedProducts = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  const whatsappMessage = `Olá, tenho interesse no relógio Citizen ${product.name} (Ref: ${product.reference}). Poderia me passar mais informações sobre disponibilidade e formas de pagamento?`;
  const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="flex flex-col min-h-screen bg-secondary">
      
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-6 w-full flex items-center text-[10px] uppercase font-sans tracking-widest text-gray-medium">
        <span>Catálogo</span>
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
              <div className="grid grid-cols-2 py-4 border-b border-gray-light/50">
                <span className="font-sans text-xs uppercase tracking-widest text-gray-medium">Marca</span>
                <span className="font-sans text-sm text-primary font-medium">Citizen</span>
              </div>
              <div className="grid grid-cols-2 py-4 border-b border-gray-light/50">
                <span className="font-sans text-xs uppercase tracking-widest text-gray-medium">Mecanismo</span>
                <span className="font-sans text-sm text-primary font-medium">{product.mechanism}</span>
              </div>
              <div className="grid grid-cols-2 py-4 border-b border-gray-light/50">
                <span className="font-sans text-xs uppercase tracking-widest text-gray-medium">Caixa / Pulseira</span>
                <span className="font-sans text-sm text-primary font-medium">{product.caseMaterial} / {product.strapMaterial}</span>
              </div>
              <div className="grid grid-cols-2 py-4 border-b border-gray-light/50">
                <span className="font-sans text-xs uppercase tracking-widest text-gray-medium">Mostrador</span>
                <span className="font-sans text-sm text-primary font-medium">{product.dialColor}</span>
              </div>
              <div className="grid grid-cols-2 py-4 border-b border-gray-light/50">
                <span className="font-sans text-xs uppercase tracking-widest text-gray-medium">Resistência à Água</span>
                <span className="font-sans text-sm text-primary font-medium">{product.waterResistance}</span>
              </div>
              <div className="grid grid-cols-2 py-4 border-b border-gray-light/50">
                <span className="font-sans text-xs uppercase tracking-widest text-gray-medium">Tamanho / Espessura</span>
                <span className="font-sans text-sm text-primary font-medium">{product.caseSize} / {product.thickness}</span>
              </div>
              <div className="grid grid-cols-2 py-4 border-b border-gray-light/50">
                <span className="font-sans text-xs uppercase tracking-widest text-gray-medium">Garantia</span>
                <span className="font-sans text-sm text-primary font-medium">2 anos de garantia de fábrica</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-offwhite py-24 border-t border-gray-light">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
            <h2 className="font-serif text-3xl mb-12 text-center md:text-left">Você também pode gostar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
