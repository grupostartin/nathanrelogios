import { Link } from 'react-router-dom';
import { Product, formatPrice } from '../data/products';

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

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]
    ? (product.images[0].startsWith('http')
        ? product.images[0]
        : `${window.location.origin}${product.images[0].startsWith('/') ? '' : '/'}${product.images[0]}`)
    : '';

  const whatsappMessage = `Olá, tenho interesse no relógio Citizen ${product.name} (Ref: ${product.reference}).\n\nFoto do relógio: ${imageUrl}\n\nPoderia me passar mais informações sobre disponibilidade e formas de pagamento?`;
  const whatsappUrl = `https://wa.me/5531986952057?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="group flex flex-col h-full bg-secondary border border-transparent hover:border-gray-light transition-colors duration-300">
      <Link to={`/produto/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-offwhite">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out mix-blend-multiply"
          loading="lazy"
        />
        {(product.isNew || product.isBestseller || product.isUsed || (product.oldPrice && product.oldPrice > product.price)) && (
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && <span className="px-3 py-1 bg-primary text-secondary text-[10px] uppercase tracking-widest font-semibold border border-primary shadow-sm">Novo</span>}
            {product.isBestseller && <span className="px-3 py-1 bg-gold text-secondary text-[10px] uppercase tracking-widest font-semibold border border-gold shadow-sm">Destaque</span>}
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="px-3 py-1 bg-red-600 text-white text-[10px] uppercase tracking-widest font-bold border border-red-600 shadow-sm">
                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
              </span>
            )}
            {product.isUsed && (
              <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-semibold border shadow-sm ${
                conditionBadgeClass(product.condition)
              }`}>
                {product.condition ?? 'Usado'}
              </span>
            )}
          </div>
        )}
      </Link>
      
      <div className="flex flex-col flex-grow p-6 text-center">
        <span className="label-caps text-gold mb-3">{product.category}</span>
        <Link to={`/produto/${product.id}`} className="hover:opacity-70 transition-opacity">
          <h3 className="font-serif text-xl tracking-wide mb-2 line-clamp-2">{product.name}</h3>
        </Link>
        <span className="font-sans text-xs text-gray-medium tracking-widest mb-4">{product.reference}</span>
        
        <div className="mt-auto pt-4 flex flex-col items-center gap-1">
          {product.oldPrice && (
            <span className="font-sans text-sm text-gray-medium line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          <span className="font-sans text-lg font-medium text-primary">
            {formatPrice(product.price)}
          </span>
        </div>
        
        <div className="mt-6 flex flex-col gap-3 w-full">
          <Link 
            to={`/produto/${product.id}`}
            className="w-full py-3 border border-primary text-primary text-xs uppercase tracking-widest font-semibold hover:border-gold hover:text-gold transition-colors duration-300"
          >
            Ver Detalhes
          </Link>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 border border-gold text-gold text-xs uppercase tracking-widest font-semibold hover:bg-gold hover:text-secondary transition-colors duration-300"
          >
            Comprar pelo WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
