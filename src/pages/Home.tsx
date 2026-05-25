import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Loader2, SlidersHorizontal, X, Instagram, ShieldCheck, CreditCard, Award } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { supabase } from '../lib/supabase';
import { Product, normalizeProduct } from '../data/products';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  label: string;
  emoji: string;
  filter_type: 'all' | 'new' | 'bestseller' | 'used' | 'category' | 'gender';
  filter_value?: string | null;
  position: number;
  active: boolean;
}

interface HomeSection {
  id: string;
  type: 'hero' | 'featured_products' | 'category_grid' | 'trust_bar' | 'banner_split' | 'instagram' | 'newsletter' | 'flash_sale' | 'catalog_tabs';
  title?: string | null;
  subtitle?: string | null;
  label?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
  image_url?: string | null;
  bg_color?: string | null;
  config?: any;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────
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

function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('position')
      .then(({ data }) => {
        if (data) setCategories(data as Category[]);
        setLoading(false);
      });
  }, []);

  return { categories, loading };
}

// ─── Helper: Category filter ─────────────────────────────────────────────────
function makeFilter(cat: Category): (p: Product) => boolean {
  switch (cat.filter_type) {
    case 'all':        return () => true;
    case 'new':        return (p) => !!p.isNew;
    case 'bestseller': return (p) => !!p.isBestseller;
    case 'used':       return (p) => !!p.isUsed;
    case 'category':   return (p) => p.category === cat.filter_value;
    case 'gender':     return (p) => p.gender === cat.filter_value;
    default:           return () => true;
  }
}

// ─── Section Components ──────────────────────────────────────────────────────

// 1. Hero
function HeroSection({ s }: { s: HomeSection; key?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const fadePoint = 1; // fade starts 1s before end
    if (video.currentTime > video.duration - fadePoint) {
      setOpacity(0);
    } else if (video.currentTime < fadePoint) {
      setOpacity(0.6);
    }
  };

  return (
    <section 
      className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setOpacity(0.6)}
          style={{ opacity, transition: 'opacity 1s ease-in-out' }}
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-[8px]"
        >
          <source src="/hero_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/90" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        {s.label && (
          <motion.span 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-block text-[11px] uppercase tracking-[0.25em] text-gold font-semibold mb-6 border border-gold/40 px-4 py-1.5"
          >
            {s.label}
          </motion.span>
        )}
        <motion.h1 
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
          className="font-serif text-white text-4xl md:text-6xl lg:text-7xl leading-[1.08] tracking-[-0.02em] mb-6"
        >
          {s.title}
        </motion.h1>
        {s.subtitle && (
          <motion.p 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-white/70 text-base md:text-lg mb-10 max-w-2xl"
          >
            {s.subtitle}
          </motion.p>
        )}
        {s.cta_label && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <a href={s.cta_url || '#'} className="inline-block bg-white text-primary px-10 py-4 font-sans uppercase text-[13px] font-bold tracking-[0.12em] hover:bg-gold hover:text-white transition-all duration-300">
              {s.cta_label}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// 2. Trust Bar
function TrustBar({ s }: { s: HomeSection; key?: string }) {
  const items = s.config?.items || [
    { icon: 'ShieldCheck', text: 'AUTENTICIDADE CITIZEN 100% GARANTIDA' },
    { icon: 'CreditCard', text: 'PARCELAMENTO EM ATÉ 12X NO CARTÃO' },
    { icon: 'Award', text: 'SELEÇÃO CURADA DE MODELOS EXCLUSIVOS' }
  ];

  function getIcon(name: string) {
    switch (name) {
      case 'ShieldCheck': return <ShieldCheck className="w-4.5 h-4.5 text-gold shrink-0" />;
      case 'CreditCard':  return <CreditCard className="w-4.5 h-4.5 text-gold shrink-0" />;
      case 'Award':       return <Award className="w-4.5 h-4.5 text-gold shrink-0" />;
      default:            return <ShieldCheck className="w-4.5 h-4.5 text-gold shrink-0" />;
    }
  }

  return (
    <div className="border-y border-gold/15 bg-gradient-to-r from-primary via-[#0B0D17] to-primary text-secondary overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-4.5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 lg:gap-12 flex-wrap text-center sm:text-left">
          {items.map((item: any, i: number) => (
            <div 
              key={i} 
              className="flex items-center gap-3 font-sans text-[11px] font-semibold tracking-[0.16em] text-white/90 hover:text-gold transition-colors duration-300"
            >
              {getIcon(item.icon)}
              <span>{item.text.toUpperCase()}</span>
            </div>
          ))}
        </div>
        
        <a 
          href="https://wa.me/5531986952057" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-gold hover:text-white transition-all duration-300 flex items-center gap-1.5 group border-b border-gold/40 hover:border-white pb-1"
        >
          Consultoria WhatsApp 
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-300" />
        </a>
      </div>
    </div>
  );
}

// 3. Featured Products (Destaques)
function FeaturedProducts({ s }: { s: HomeSection; key?: string }) {
  const { products: fallbackProducts, loading: fallbackLoading } = useProducts({ isBestseller: true });
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [customLoading, setCustomLoading] = useState(false);

  const hasCustomIds = Array.isArray(s.config?.productIds) && s.config.productIds.length > 0;

  useEffect(() => {
    if (hasCustomIds) {
      setCustomLoading(true);
      supabase
        .from('products')
        .select('*')
        .in('id', s.config.productIds)
        .eq('active', true)
        .then(({ data, error }) => {
          if (data && !error) {
            const normalized = data.map(p => normalizeProduct(p));
            // Sort to match the order in productIds
            normalized.sort((a, b) => {
              return s.config.productIds.indexOf(a.id) - s.config.productIds.indexOf(b.id);
            });
            setCustomProducts(normalized);
          }
          setCustomLoading(false);
        });
    }
  }, [s.config?.productIds, hasCustomIds]);

  const isLoading = hasCustomIds ? customLoading : fallbackLoading;
  if (isLoading) return null;

  const displayProducts = hasCustomIds ? customProducts : fallbackProducts;
  const visible = displayProducts.slice(0, s.config?.columns || 4);

  if (visible.length === 0) return null;

  const cols = s.config?.columns || 4;
  const gridColsClass = cols === 3 ? 'md:grid-cols-3' : cols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-4';

  return (
    <section className="py-24 bg-secondary overflow-hidden border-b border-gray-light">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            {s.label && <span className="label-caps text-gold mb-3 block">{s.label}</span>}
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">{s.title || 'Destaques da Semana'}</h2>
          </div>
          {s.cta_label && (
            <Link to={s.cta_url || '/catalogo'} className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.25em] text-primary hover:text-gold transition-colors font-bold group">
              {s.cta_label} 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
        <div className={`grid grid-cols-2 ${gridColsClass} gap-6 lg:gap-10`}>
          {visible.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

// 4. Flash Sale
function FlashSale({ s }: { s: HomeSection; key?: string }) {
  return (
    <section className="py-16 bg-black text-white relative overflow-hidden group">
      {s.config?.image && (
        <div className="absolute inset-0 opacity-40 group-hover:scale-105 transition-transform duration-1000">
          <img src={s.config.image} alt="Flash Sale" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="max-w-xl">
          {s.label && <span className="label-caps text-gold mb-4 block animate-pulse">{s.label}</span>}
          <h2 className="font-serif text-3xl md:text-5xl mb-4 leading-tight">{s.title}</h2>
          <p className="font-sans text-white/70 text-base md:text-lg mb-8">{s.subtitle}</p>
          {s.cta_label && (
            <Link to={s.cta_url || '#'} className="inline-block bg-gold text-primary px-8 py-4 font-sans uppercase text-xs font-bold tracking-widest hover:bg-white transition-colors">
              {s.cta_label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

// 5. Category Grid
function CategoryGrid({ s }: { s: HomeSection; key?: string }) {
  const items = s.config?.items || [];
  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
          {items.map((item: any, i: number) => (
            <Link key={i} to={item.url} className="relative overflow-hidden group flex-1 h-full">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <h3 className="font-serif text-white text-2xl mb-2 group-hover:translate-y-[-4px] transition-transform">{item.title}</h3>
                <span className="font-sans text-white/80 text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">Explorar</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// 6. Banner Split
function BannerSplit({ s }: { s: HomeSection; key?: string }) {
  const isLeft = s.config?.imagePosition === 'left';
  return (
    <section className="py-20 bg-offwhite">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
          <div className="w-full md:w-1/2 aspect-[4/5] md:aspect-square overflow-hidden shadow-2xl">
            <img src={s.image_url || ''} alt={s.title || ''} className="w-full h-full object-cover" />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            {s.label && <span className="label-caps text-gold">{s.label}</span>}
            <h2 className="font-serif text-3xl md:text-5xl leading-tight">{s.title}</h2>
            <p className="font-sans text-gray-medium text-base md:text-lg leading-relaxed">{s.subtitle}</p>
            {s.cta_label && (
              <Link to={s.cta_url || '#'} className="inline-flex items-center gap-3 text-primary font-sans text-xs uppercase tracking-[0.2em] font-bold border-b-2 border-primary pb-2 hover:text-gold hover:border-gold transition-colors">
                {s.cta_label} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// 7. Instagram
function InstagramFeed({ s }: { s: HomeSection; key?: string }) {
  const embedCode = s.config?.embedCode;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!embedCode || !containerRef.current) return;

    // Clear previous contents
    containerRef.current.innerHTML = '';

    try {
      // Use createContextualFragment to parse and execute scripts inside the embed HTML
      const range = document.createRange();
      const fragment = range.createContextualFragment(embedCode);
      containerRef.current.appendChild(fragment);
    } catch (err) {
      console.error('Error executing Instagram embed scripts:', err);
      // Fallback to dangerouslySetInnerHTML behavior in case of errors
      containerRef.current.innerHTML = embedCode;
    }
  }, [embedCode]);

  return (
    <section className="py-20 bg-secondary border-t border-gray-light">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 text-center">
        {s.label && <span className="label-caps text-gold mb-4 block">{s.label}</span>}
        <h2 className="font-serif text-3xl mb-12">{s.title || 'Nos Siga no Instagram'}</h2>
        
        {embedCode ? (
          <div ref={containerRef} className="instagram-container" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {(s.config?.images || []).map((img: string, i: number) => (
              <div key={i} className="aspect-square overflow-hidden group relative">
                <img src={img} alt="Instagram" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Instagram className="text-white w-6 h-6" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// 8. Newsletter
function NewsletterStrip({ s }: { s: HomeSection; key?: string }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const { error } = await supabase.from('newsletter_subscriptions').insert([{ email }]);
    if (error && error.code !== '23505') console.error(error);
    setSubscribed(true);
    setEmail('');
  };
  return (
    <section className="bg-primary text-secondary py-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-lg">
          <h3 className="font-serif text-3xl mb-3">{s.title || 'Mantenha-se Atualizado'}</h3>
          <p className="font-sans text-secondary/70 text-sm md:text-base">{s.subtitle || 'Cadastre seu e-mail para receber novidades e ofertas exclusivas.'}</p>
        </div>
        <div className="w-full max-w-md">
          {subscribed ? (
            <div className="bg-white/10 px-8 py-4 border border-white/20 text-emerald-400 font-sans text-sm">✓ Inscrição realizada com sucesso!</div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input type="email" required placeholder="Seu melhor e-mail" value={email} onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-transparent border-b border-white/30 focus:border-gold px-2 py-4 font-sans text-sm outline-none transition-colors" />
              <button type="submit" className="bg-gold text-primary px-8 py-4 font-sans uppercase text-[11px] font-bold tracking-[0.2em] hover:bg-white transition-colors">Participar</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// 9. Stock Section (Show all products)
const PAGE_SIZE = 12;
function StockSection({ s }: { s: HomeSection; key?: string }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { products, loading } = useProducts();

  const visible = products.slice(0, visibleCount);
  const hasMore = products.length > visibleCount;

  return (
    <section id="estoque" className="py-24 bg-secondary">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="label-caps text-gold mb-3 block">{s.label || 'Nathan Relógios'}</span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">{s.title || 'Todo o Estoque'}</h2>
            <p className="font-sans text-gray-medium mt-4 max-w-xl text-sm md:text-base leading-relaxed">
              Explore nossa seleção completa de modelos Citizen. Relógios novos e seminovos com garantia de autenticidade.
            </p>
          </div>
          <Link 
            to="/catalogo" 
            className="inline-flex items-center gap-3 px-8 py-4 border border-primary font-sans uppercase text-[11px] font-bold tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300"
          >
            Ver por Categoria
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="w-10 h-10 text-gold animate-spin" />
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-gray-medium">Sincronizando estoque...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-40">
            <p className="font-serif text-2xl text-gray-medium mb-6">Nenhum modelo disponível no momento.</p>
          </div>
        ) : (
          <>
            <p className="font-sans text-[10px] text-gray-medium uppercase tracking-[0.25em] mb-10 border-b border-gray-light pb-4">
              {products.length} Peças Disponíveis
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
              {visible.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
            
            {hasMore && (
              <div className="mt-20 text-center">
                <button 
                  onClick={() => setVisibleCount(c => c + PAGE_SIZE)} 
                  className="inline-flex items-center gap-4 border border-primary px-16 py-5 font-sans uppercase text-xs font-bold tracking-[0.25em] hover:bg-primary hover:text-white transition-all duration-500"
                >
                  Carregar Mais Modelos <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
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
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen">
      {sections.map(s => {
        switch (s.type) {
          case 'hero':              return <HeroSection key={s.id} s={s} />;
          case 'trust_bar':          return <TrustBar key={s.id} s={s} />;
          case 'featured_products': return <FeaturedProducts key={s.id} s={s} />;
          case 'category_grid':     return <CategoryGrid key={s.id} s={s} />;
          case 'banner_split':      return <BannerSplit key={s.id} s={s} />;
          case 'instagram':         return <InstagramFeed key={s.id} s={s} />;
          case 'newsletter':        return <NewsletterStrip key={s.id} s={s} />;
          case 'flash_sale':        return <FlashSale key={s.id} s={s} />;
          case 'catalog_tabs':      return <StockSection key={s.id} s={s} />;
          default:                  return null;
        }
      })}
    </main>
  );
}
