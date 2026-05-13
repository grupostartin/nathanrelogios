import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-gray-light pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex flex-col items-start mb-6">
              <span className="font-serif text-3xl tracking-[0.05em] uppercase leading-none">Nathan</span>
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-gray-medium mt-2">Relógios</span>
            </Link>
            <p className="text-gray-medium text-sm leading-relaxed max-w-sm">
              Cada detalhe foi pensado. Cada segundo, medido com exatidão.
              Vitrine premium para relógios Citizen com atendimento direto via WhatsApp.
            </p>
          </div>

          <div>
            <h4 className="font-serif uppercase tracking-widest text-sm mb-6">Navegação</h4>
            <ul className="space-y-4">
              <li><Link to="/catalogo" className="text-gray-medium hover:text-primary transition-colors text-sm">Catálogo</Link></li>
              <li><Link to="/sobre" className="text-gray-medium hover:text-primary transition-colors text-sm">Sobre Nós</Link></li>
              <li><Link to="/contato" className="text-gray-medium hover:text-primary transition-colors text-sm">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif uppercase tracking-widest text-sm mb-6">Atendimento</h4>
            <ul className="space-y-4">
              <li className="text-gray-medium text-sm">
                Seg - Sex: 9h às 18h
              </li>
              <li>
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-gray-medium hover:text-gold transition-colors text-sm underline underline-offset-4">
                  (11) 99999-9999
                </a>
              </li>
              <li>
                <a href="mailto:contato@citizenboutique.com" className="text-gray-medium hover:text-primary transition-colors text-sm">
                  contato@citizenboutique.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-light flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-medium uppercase tracking-wider">
            &copy; {new Date().getFullYear()} Citizen Boutique. Nathan Relógios. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-xs text-gray-medium hover:text-primary uppercase tracking-wider transition-colors">Termos</a>
            <a href="#" className="text-xs text-gray-medium hover:text-primary uppercase tracking-wider transition-colors">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
