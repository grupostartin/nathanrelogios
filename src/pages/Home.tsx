import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────
interface HomeSection {
  id: string;
  type: 'hero' | 'featured_products' | 'category_grid' | 'trust_bar' | 'banner_split' | 'instagram';
  position: number;
  active: boolean;
  title?: string | null;
  subtitle?: string | null;
  label?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  image_url?: string | null;
  bg_color?: string | null;
  config: Record<string, any>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
function useHomeSections() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('homepage_sections')
      .select('*')
      .eq('active', true)
      .order('position')
      .then(({ data }) => {
        if (data) setSections(data as HomeSection[]);
        setLoading(false);
      });
  }, []);

  return { sections, loading };
}

// ─── Section Renderers ────────────────────────────────────────────────────────

function HeroSection({ s }: { s: HomeSection }) {
  return (
    <section
      className="relative h-[88vh] min-h-[580px] w-full flex items-center justify-center overflow-hidden"
      style={{ background: s.bg_color || '#111' }}
    >
      {s.image_url && (
        <div className="absolute inset-0">
          <img src={s.image_url} alt="Hero" className="w-full h-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      )}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        {s.label && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-[11px] uppercase tracking-[0.25em] text-gold font-semibold mb-6 border border-gold/40 px-4 py-1.5"
          >
            {s.label}
          </motion.span>
        )}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.85, ease: 'easeOut', delay: 0.1 }}
          className="font-serif text-white text-4xl md:text-6xl lg:text-[64px] leading-[1.08] tracking-[-0.02em] mb-6"
        >
          {s.title}
        </motion.h1>
        {s.subtitle && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="font-sans text-white/70 text-base md:text-lg mb-10 tracking-[0.01em] max-w-2xl"
          >
            {s.subtitle}
          </motion.p>
        )}
        {s.cta_label && s.cta_url && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <Link
              to={s.cta_url}
              className="inline-block bg-white text-primary px-10 py-4 font-sans uppercase text-[13px] font-bold tracking-[0.12em] hover:bg-gold hover:text-white transition-all duration-300"
            >
              {s.cta_label}
            </Link>
            <Link
              to="/catalogo"
              className="font-sans text-white/70 text-sm uppercase tracking-widest hover:text-white transition-colors border-b border-white/30 hover:border-white pb-0.5"
            >
              Ver catálogo
            </Link>
          </motion.div>
        )}
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-12 bg-white/30 animate-pulse" />
      </div>
    </section>
  );
}

function FeaturedProductsSection({ s }: { s: HomeSection }) {
  const filter = s.config?.filter || 'bestseller';
  const cols = s.config?.columns || 3;
  const { products } = useProducts();

  const featured = products
    .filter(p => filter === 'new' ? p.isNew : p.isBestseller || p.isNew)
    .slice(0, cols);

  return (
    <section className="py-24 lg:py-32" style={{ background: s.bg_color || '#ffffff' }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="flex flex-col items-center mb-16 text-center">
          {s.label && <span className="label-caps text-gold mb-4">{s.label}</span>}
          {s.title && <h2 className="font-serif text-3xl md:text-4xl tracking-[0.02em]">{s.title}</h2>}
        </div>

        {featured.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-sans text-gray-medium">Nenhum produto em destaque ainda.</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-8`}>
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {s.cta_label && s.cta_url && (
          <div className="mt-16 text-center">
            <Link
              to={s.cta_url}
              className="inline-block border border-primary px-10 py-4 font-sans uppercase text-sm font-semibold tracking-widest hover:border-gold hover:text-gold transition-colors duration-300"
            >
              {s.cta_label}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryGridSection({ s }: { s: HomeSection }) {
  const items: { title: string; subtitle: string; image: string; url: string }[] = s.config?.items || [];

  if (items.length === 0) return null;

  const [main, ...rest] = items;

  return (
    <section className="py-0" style={{ background: s.bg_color || '#ffffff' }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
          {/* Main large card */}
          <Link to={main.url} className="relative group overflow-hidden bg-gray-100 flex items-end justify-start">
            <img src={main.image} alt={main.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative z-10 p-8">
              <h3 className="font-serif text-white text-3xl mb-1">{main.title}</h3>
              <span className="font-sans text-white/70 uppercase text-[10px] tracking-[0.2em]">{main.subtitle}</span>
              <div className="mt-4 inline-flex items-center gap-2 text-white text-xs uppercase tracking-widest border-b border-white/40 pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                Ver coleção →
              </div>
            </div>
          </Link>

          {/* Side cards */}
          <div className="grid grid-rows-2 gap-4 h-full">
            {rest.map(item => (
              <Link key={item.url} to={item.url} className="relative group overflow-hidden bg-gray-100 flex items-end justify-start">
                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="relative z-10 p-6">
                  <h3 className="font-serif text-white text-2xl mb-1">{item.title}</h3>
                  <span className="font-sans text-white/70 uppercase text-[10px] tracking-[0.2em]">{item.subtitle}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBarSection({ s }: { s: HomeSection }) {
  const items: { icon: string; title: string; text: string }[] = s.config?.items || [];
  return (
    <section className="py-16 border-y border-gray-200" style={{ background: s.bg_color || '#f8f8f5' }}>
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center max-w-[200px]">
            <span className="text-gold text-3xl mb-3">{item.icon}</span>
            <h4 className="font-serif uppercase tracking-widest text-sm mb-2">{item.title}</h4>
            <p className="font-sans text-xs text-gray-medium leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BannerSplitSection({ s }: { s: HomeSection }) {
  const imgLeft = s.config?.imagePosition !== 'right';
  return (
    <section className="py-24 lg:py-32" style={{ background: s.bg_color || '#f8f8f5' }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center ${!imgLeft ? 'md:flex-row-reverse' : ''}`}>
          {imgLeft && s.image_url && (
            <div className="aspect-[3/4] md:aspect-[4/5] overflow-hidden">
              <img src={s.image_url} alt={s.title || ''} className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}
          <div className="flex flex-col items-start">
            {s.label && <span className="label-caps text-gold mb-4">{s.label}</span>}
            {s.title && (
              <h2 className="font-serif text-3xl md:text-[40px] leading-[1.2] tracking-[0.02em] mb-8 max-w-md">
                {s.title}
              </h2>
            )}
            {s.subtitle && (
              <p className="font-sans text-base text-gray-medium leading-[1.7] max-w-lg">
                {s.subtitle}
              </p>
            )}
            {s.cta_label && s.cta_url && (
              <Link
                to={s.cta_url}
                className="mt-10 inline-block border-b-2 border-primary pb-1 font-sans uppercase text-xs font-semibold tracking-widest hover:border-gold hover:text-gold transition-all duration-300"
              >
                {s.cta_label} →
              </Link>
            )}
          </div>
          {!imgLeft && s.image_url && (
            <div className="aspect-[3/4] md:aspect-[4/5] overflow-hidden">
              <img src={s.image_url} alt={s.title || ''} className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function InstagramSection({ s }: { s: HomeSection }) {
  const embedCode: string = s.config?.embedCode || '';
  const images: string[] = s.config?.images || [];
  const igUrl: string = s.config?.instagramUrl || 'https://instagram.com/nathan_relogios';

  // Load external scripts from embed code (e.g. Elfsight, Behold)
  useEffect(() => {
    if (!embedCode) return;
    const div = document.createElement('div');
    div.innerHTML = embedCode;
    const scripts = div.querySelectorAll('script');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      if (script.src) {
        newScript.src = script.src;
        newScript.async = true;
      } else {
        newScript.textContent = script.textContent;
      }
      document.body.appendChild(newScript);
    });
  }, [embedCode]);

  return (
    <section className="py-24" style={{ background: s.bg_color || '#ffffff' }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 text-center">
        {s.label && <span className="label-caps text-gold mb-4 block">{s.label}</span>}
        {s.title && <h2 className="font-serif text-3xl tracking-[0.02em] mb-12">{s.title}</h2>}

        {embedCode ? (
          /* Embed externo (Elfsight, Behold, etc.) */
          <div
            className="w-full"
            dangerouslySetInnerHTML={{
              __html: embedCode.replace(/<script[\s\S]*?<\/script>/gi, '')
            }}
          />
        ) : (
          /* Fallback: grade de imagens + link para o Instagram */
          <div className="flex flex-col items-center gap-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4 w-full">
              {images.map((src, idx) => (
                <a key={idx} href={igUrl} target="_blank" rel="noopener noreferrer"
                  className="block aspect-square relative group overflow-hidden bg-gray-100">
                  <img src={src} alt="Instagram" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs tracking-widest uppercase font-semibold">Ver</span>
                  </div>
                </a>
              ))}
            </div>
            <a href={igUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-primary px-8 py-3 font-sans uppercase text-xs tracking-widest hover:border-gold hover:text-gold transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              @nathan_relogios
            </a>
          </div>
        )}
      </div>
    </section>
  );
}


// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const { sections, loading } = useHomeSections();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen">
      {sections.map(section => {
        const el = (() => {
          switch (section.type) {
            case 'hero':              return <HeroSection            s={section} />;
            case 'featured_products': return <FeaturedProductsSection s={section} />;
            case 'category_grid':    return <CategoryGridSection     s={section} />;
            case 'trust_bar':        return <TrustBarSection         s={section} />;
            case 'banner_split':     return <BannerSplitSection      s={section} />;
            case 'instagram':        return <InstagramSection        s={section} />;
            default:                 return null;
          }
        })();
        return el ? <div key={section.id}>{el}</div> : null;
      })}
    </main>
  );
}
