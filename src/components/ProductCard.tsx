import { Link } from 'react-router-dom';
import { Product, formatPrice } from '../data/products';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const whatsappMessage = `Olá, tenho interesse no relógio Citizen ${product.name} (Ref: ${product.reference}). Poderia me passar mais informações sobre disponibilidade e formas de pagamento?`;
  const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="group flex flex-col h-full bg-secondary border border-transparent hover:border-gray-light transition-colors duration-300">
      <Link to={`/produto/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-offwhite">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out mix-blend-multiply"
          loading="lazy"
        />
        {(product.isNew || product.isBestseller) && (
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && <span className="px-3 py-1 bg-primary text-secondary text-[10px] uppercase tracking-widest font-semibold border border-primary">Novo</span>}
            {product.isBestseller && <span className="px-3 py-1 bg-gold text-secondary text-[10px] uppercase tracking-widest font-semibold border border-gold">Destaque</span>}
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
