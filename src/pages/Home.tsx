import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const featuredProducts = products.filter(p => p.isBestseller || p.isNew).slice(0, 3);
  
  return (
    <main className="flex flex-col min-h-screen">
      
      {/* 2. HERO BANNER */}
      <section className="relative h-[85vh] min-h-[600px] w-full bg-primary flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1549972352-7e0e7a8eef3c?w=1600&q=80" 
            alt="Citizen Watch Showcase" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-serif text-secondary text-4xl md:text-6xl lg:text-[64px] leading-[1.1] tracking-[-0.02em] mb-6"
          >
            Relógios Citizen para quem valoriza cada detalhe.
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-sans text-gray-light text-base md:text-lg mb-10 tracking-[0.01em] max-w-2xl"
          >
            Modelos selecionados com elegância, precisão e qualidade para acompanhar todos os momentos.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Link 
              to="/catalogo" 
              className="inline-block bg-secondary text-primary px-10 py-5 font-sans uppercase text-[14px] font-bold tracking-[0.1em] hover:bg-gold hover:text-secondary transition-colors duration-300"
            >
              Explorar Coleção
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 3. PRODUTOS EM DESTAQUE */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="label-caps text-gold mb-4">Seleção Exclusiva</span>
            <h2 className="font-serif text-3xl md:text-4xl tracking-[0.02em]">Obras-Primas do Tempo</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/catalogo" 
              className="inline-block border border-primary px-10 py-4 font-sans uppercase text-sm font-semibold tracking-widest hover:border-gold hover:text-gold transition-colors duration-300"
            >
              Ver Todos os Modelos
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SOBRE A MARCA */}
      <section className="py-24 lg:py-32 bg-offwhite">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="aspect-[3/4] md:aspect-[4/5] bg-gray-light overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=1000&q=80" 
                alt="Detalhe da coroa Citizen" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="label-caps text-gold mb-4">A Essência</span>
              <h2 className="font-serif text-3xl md:text-[40px] leading-[1.2] tracking-[0.02em] mb-8 max-w-md">
                Precisão, elegância e tradição em cada modelo Citizen.
              </h2>
              <div className="font-sans text-base text-gray-medium leading-[1.6] tracking-[0.01em] space-y-6 max-w-lg">
                <p>
                  Design elegante, precisão confiável e acabamento premium em um relógio feito para durar. A verdadeira sofisticação reside na capacidade de transcender tendências passageiras.
                </p>
                <p>
                  Com a tecnologia proprietária Eco-Drive, capturamos não apenas a beleza das horas, mas a luz que as ilumina, criando máquinas do tempo autossuficientes e imponentes.
                </p>
              </div>
              <Link 
                to="/sobre" 
                className="mt-10 inline-block border-b border-primary pb-2 font-sans uppercase text-xs font-semibold tracking-widest hover:border-gold hover:text-gold transition-all duration-300"
              >
                Conheça a Boutique
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CATEGORIAS */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px] mb-8">
            <Link to="/catalogo?linha=Eco-Drive" className="relative group overflow-hidden bg-offwhite flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1548171915-e76a3ff999de?w=800&q=80" alt="Eco-Drive" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
              <div className="relative z-10 text-center">
                <h3 className="font-serif text-secondary text-3xl mb-2">Eco-Drive</h3>
                <span className="font-sans text-white/90 uppercase text-[10px] tracking-[0.2em]">Sustentabilidade de Luxo</span>
              </div>
            </Link>
            <div className="grid grid-rows-2 gap-8 h-full">
              <Link to="/catalogo?categoria=Automático" className="relative group overflow-hidden bg-offwhite flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80" alt="Automático" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
                <div className="relative z-10 text-center">
                  <h3 className="font-serif text-secondary text-2xl mb-1">Automáticos</h3>
                  <span className="font-sans text-white/90 uppercase text-[10px] tracking-[0.2em]">Engenharia Clássica</span>
                </div>
              </Link>
              <Link to="/catalogo?genero=Feminino" className="relative group overflow-hidden bg-offwhite flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80" alt="Feminino" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
                <div className="relative z-10 text-center">
                  <h3 className="font-serif text-secondary text-2xl mb-1">Elegância Feminina</h3>
                  <span className="font-sans text-white/90 uppercase text-[10px] tracking-[0.2em]">Sofisticação Singular</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONFIANÇA */}
      <section className="py-20 border-y border-gray-light bg-offwhite text-center px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
          <div className="flex flex-col items-center">
            <span className="text-gold text-4xl mb-4">✓</span>
            <h4 className="font-serif uppercase tracking-widest text-sm mb-2">Originalidade</h4>
            <p className="font-sans text-xs text-gray-medium max-w-[200px]">Relógios 100% originais com garantia de fábrica.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gold text-4xl mb-4">⛊</span>
            <h4 className="font-serif uppercase tracking-widest text-sm mb-2">Atendimento</h4>
            <p className="font-sans text-xs text-gray-medium max-w-[200px]">Consultoria especializada direta pelo WhatsApp.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gold text-4xl mb-4">♦</span>
            <h4 className="font-serif uppercase tracking-widest text-sm mb-2">Sofisticação</h4>
            <p className="font-sans text-xs text-gray-medium max-w-[200px]">Seleção curada dos melhores modelos de luxo.</p>
          </div>
        </div>
      </section>

      {/* 7. FEED DO INSTAGRAM */}
      <section className="py-24 bg-secondary">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 text-center">
          <span className="label-caps text-gold mb-4 block">@nathanrelogios</span>
          <h2 className="font-serif text-3xl tracking-[0.02em] mb-12">No Pulso do Tempo</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&q=80",
              "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&q=80",
              "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&q=80",
              "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80",
              "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400&q=80",
              "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80"
            ].map((src, idx) => (
              <a 
                key={idx} 
                href="https://instagram.com/nathanrelogios" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block aspect-square relative group overflow-hidden bg-offwhite"
              >
                <img src={src} alt="Instagram" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity uppercase text-xs tracking-widest font-semibold flex items-center gap-2">
                    Visualizar
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
