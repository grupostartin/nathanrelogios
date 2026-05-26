import { useState, useEffect } from 'react';
import { Heart, Shield, Award, Users, Gem, Sparkles, TrendingUp, Clock } from 'lucide-react';

export default function About() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [lineWidth, setLineWidth] = useState(false);

  useEffect(() => {
    // Start line animation slightly after mount
    const lineTimer = setTimeout(() => {
      setLineWidth(true);
    }, 200);

    // Start fading out after 2.2 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2200);

    // Remove from DOM after transition completes (700ms)
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2900);

    return () => {
      clearTimeout(lineTimer);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const valuesList = [
    { text: "Paixão pelo universo relojoeiro", icon: Heart },
    { text: "Honestidade e transparência", icon: Shield },
    { text: "Compromisso com a qualidade", icon: Award },
    { text: "Respeito e confiança com os clientes", icon: Users },
    { text: "Exclusividade e autenticidade nas peças", icon: Gem },
    { text: "Dedicação em cada venda", icon: Sparkles },
    { text: "Crescimento com humildade e responsabilidade", icon: TrendingUp },
    { text: "Valorização da história e tradição dos relógios", icon: Clock },
  ];

  return (
    <div className="relative">
      {/* Splash Screen */}
      {showSplash && (
        <div 
          className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${
            isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Decorative Gold Frame */}
          <div className="absolute inset-4 md:inset-8 border border-gold/15 pointer-events-none" />

          {/* Logo Content */}
          <div className="text-center z-10 px-6">
            <span className="block text-[10px] md:text-xs uppercase tracking-[0.3em] text-gold font-sans font-semibold mb-4 opacity-80">
              Apresentando
            </span>
            <h2 className="font-serif text-white text-4xl md:text-6xl tracking-[0.15em] uppercase leading-none font-light">
              Nathan
            </h2>
            <div className="flex flex-col items-center mt-3">
              <span className="font-sans text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-gold font-medium">
                Relógios & Joias
              </span>
              
              {/* Animated Gold Line */}
              <div 
                className={`h-px bg-gold/60 mt-8 transition-all duration-[1500ms] ease-out ${
                  lineWidth ? 'w-32' : 'w-0'
                }`} 
              />
            </div>
            
            <p className="font-serif text-white/60 text-xs md:text-sm tracking-wider italic mt-8 animate-pulse">
              A excelência encontra o tempo.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex flex-col min-h-screen bg-secondary">
        {/* Hero */}
        <section className="relative h-[55vh] min-h-[400px] w-full bg-primary flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1600&q=80" 
              alt="Citizen Watch Showcase" 
              className="w-full h-full object-cover opacity-40 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
          </div>
          <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center">
            <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-gold font-semibold mb-6 border border-gold/40 px-4 py-1.5">
              Sobre Nós
            </span>
            <h1 className="font-serif text-white text-4xl md:text-6xl tracking-[-0.01em] leading-tight">
              Nossa História e Valores
            </h1>
          </div>
        </section>

        {/* Content Section - Story */}
        <section className="py-24 max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Column 1: A brief introductory highlight */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              <span className="label-caps text-gold mb-4 block">Quem Somos</span>
              <h2 className="font-serif text-3xl md:text-4xl text-primary leading-tight mb-8">
                Nathan Relógios e Joias: paixão, credibilidade e exclusividade.
              </h2>
              <div className="w-16 h-px bg-gold mb-8"></div>
              <p className="font-sans text-gray-medium text-base md:text-lg leading-relaxed italic border-l-2 border-gold pl-6 py-2">
                "Mais do que vender relógios, realizamos sonhos e conectamos pessoas a peças únicas que fazem parte de histórias para toda a vida."
              </p>
            </div>

            {/* Column 2: Detailed story */}
            <div className="lg:col-span-7 space-y-6 font-sans text-gray-medium text-base md:text-lg leading-relaxed">
              <p className="font-medium text-primary text-lg md:text-xl leading-relaxed">
                Tudo começou em meados de 2020, com apenas um relógio Citizen de R$200 e uma grande paixão por relógios — principalmente os modelos de mergulho da marca Citizen.
              </p>
              <p>
                Meu nome é Nathan, fundador da Nathan Relógios e Joias, e desde o início sempre enxerguei os relógios não apenas como acessórios, mas como peças que carregam história, personalidade e exclusividade.
              </p>
              <p>
                Com dedicação, confiança e muito amor pelo que fazemos, fomos crescendo dia após dia. Ao longo desses 6 anos de relojoaria, já vendemos mais de 1.000 relógios para clientes de todo o Brasil, construindo uma trajetória marcada pela credibilidade e pela paixão pelo universo Citizen.
              </p>
              <p>
                Hoje, saímos de um único relógio para oferecer diversas possibilidades e oportunidades aos nossos clientes, sempre buscando peças especiais, raras e diferenciadas para quem valoriza qualidade e exclusividade.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 border-y border-gray-light py-12">
            <div className="text-center group">
              <div className="font-serif text-4xl md:text-5xl text-gold mb-2 transition-transform duration-300 group-hover:scale-105">6 Anos</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-gray-medium font-semibold">De história e dedicação</div>
            </div>
            <div className="text-center group border-y md:border-y-0 md:border-x border-gray-light py-8 md:py-0">
              <div className="font-serif text-4xl md:text-5xl text-gold mb-2 transition-transform duration-300 group-hover:scale-105">1.000+</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-gray-medium font-semibold">Relógios entregues no Brasil</div>
            </div>
            <div className="text-center group">
              <div className="font-serif text-4xl md:text-5xl text-gold mb-2 transition-transform duration-300 group-hover:scale-105">R$ 200</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-gray-medium font-semibold">O início de tudo em 2020</div>
            </div>
          </div>

          {/* Brand pillars: Mission, Vision, Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {/* Missão */}
            <div className="bg-offwhite p-10 border border-gray-light border-t-2 border-t-gold flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
              <div>
                <div className="w-10 h-10 bg-gold/10 flex items-center justify-center mb-6 text-gold font-serif text-lg font-bold">
                  M
                </div>
                <h3 className="font-serif text-2xl text-primary mb-4 uppercase tracking-wide">Missão</h3>
                <p className="text-sm text-gray-medium leading-relaxed">
                  Oferecer relógios e joias de qualidade, autenticidade e exclusividade, proporcionando aos nossos clientes confiança, realização e a oportunidade de adquirir peças especiais que carregam história, estilo e personalidade.
                </p>
              </div>
            </div>

            {/* Visão */}
            <div className="bg-offwhite p-10 border border-gray-light border-t-2 border-t-gold flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
              <div>
                <div className="w-10 h-10 bg-gold/10 flex items-center justify-center mb-6 text-gold font-serif text-lg font-bold">
                  V
                </div>
                <h3 className="font-serif text-2xl text-primary mb-4 uppercase tracking-wide">Visão</h3>
                <p className="text-sm text-gray-medium leading-relaxed">
                  Ser reconhecida como uma das principais referências em relógios Citizen e peças exclusivas no Brasil, construindo uma marca sólida, respeitada e lembrada pela credibilidade, paixão pelo segmento e excelência no atendimento.
                </p>
              </div>
            </div>

            {/* Valores */}
            <div className="bg-offwhite p-10 border border-gray-light border-t-2 border-t-gold transition-all duration-300 hover:shadow-lg">
              <div className="w-10 h-10 bg-gold/10 flex items-center justify-center mb-6 text-gold font-serif text-lg font-bold">
                VA
              </div>
              <h3 className="font-serif text-2xl text-primary mb-4 uppercase tracking-wide">Valores</h3>
              <ul className="space-y-3.5 mt-4">
                {valuesList.map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-medium leading-tight group/item">
                      <IconComponent className="w-4.5 h-4.5 text-gold shrink-0 transition-transform duration-300 group-hover/item:scale-110 mt-0.5" />
                      <span className="transition-colors duration-300 group-hover/item:text-primary">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        <div className="bg-offwhite py-20 flex items-center justify-center border-t border-gray-light">
          <div className="max-w-[1000px] w-full px-6 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1000&q=80" 
              alt="Detalhes e acabamento" 
              className="w-full object-cover aspect-[21/9] transition-transform duration-1000 hover:scale-102"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
