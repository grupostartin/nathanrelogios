export default function About() {
  return (
    <main className="flex flex-col min-h-screen bg-secondary">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] w-full bg-primary flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1600&q=80" 
            alt="Citizen Watch Showcase" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <span className="label-caps text-gold mb-6 block">Sobre Nós</span>
          <h1 className="font-serif text-secondary text-4xl md:text-6xl tracking-[-0.01em]">A excelência encontra o tempo.</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="font-serif text-3xl tracking-[0.02em] mb-6">Citizen Boutique Especializada</h2>
          <div className="w-16 h-px bg-gold mb-8"></div>
        </div>
        
        <div className="space-y-12 font-sans text-gray-medium text-base md:text-lg leading-relaxed">
          <p>
            Nascida da paixão pela precisão horológica, a Citizen Boutique por Nathan Relógios é uma curadoria de excelência para indivíduos que entendem que um relógio é muito mais do que um instrumento de medição de tempo: é um legado.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8 border-y border-gray-light">
            <div>
              <h3 className="font-serif text-primary text-xl mb-4">Nossa Missão</h3>
              <p className="text-sm">Oferecer uma experiência de aquisição simplificada, segura e profissional, proporcionando acesso direto aos modelos originais mais sofisticados da Citizen através de um atendimento pessoal e exclusivo.</p>
            </div>
            <div>
              <h3 className="font-serif text-primary text-xl mb-4">Nossos Diferenciais</h3>
              <p className="text-sm">Trabalhamos exclusivamente com estoques oficiais, garantindo 100% de originalidade, garantia completa de fábrica, e um serviço de consultoria atenta às suas necessidades de estilo e exigências técnicas.</p>
            </div>
          </div>

          <p>
            Entregamos não apenas relógios, mas confiança. Cada transação é tratada com a máxima discrição e eficiência, seja para adicionar uma nova peça à sua coleção, celebrar um marco importante ou presentear alguém especial. A sofisticação, no final das contas, é uma questão de escolha exata. Escolha Citizen.
          </p>
        </div>
      </section>

      <div className="bg-offwhite py-24 mb-0 flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1000&q=80" 
          alt="Detalhes" 
          className="max-w-[800px] w-full px-6 object-cover aspect-[21/9]"
        />
      </div>
    </main>
  );
}
