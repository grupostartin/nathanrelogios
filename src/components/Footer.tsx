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
            <h4 className="font-serif uppercase tracking-widest text-sm mb-6">Categorias</h4>
            <ul className="space-y-4">
              <li><Link to="/catalogo?categoria=Automático" className="text-gray-medium hover:text-primary transition-colors text-sm">Automáticos</Link></li>
              <li><Link to="/catalogo?linha=Eco-Drive" className="text-gray-medium hover:text-primary transition-colors text-sm">Eco-Drive</Link></li>
              <li><Link to="/catalogo?genero=Feminino" className="text-gray-medium hover:text-primary transition-colors text-sm">Femininos</Link></li>
              <li><Link to="/catalogo?genero=Masculino" className="text-gray-medium hover:text-primary transition-colors text-sm">Masculinos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif uppercase tracking-widest text-sm mb-6">Atendimento</h4>
            <ul className="space-y-4">
              <li className="text-gray-medium text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                WhatsApp: (11) 99999-9999
              </li>
              <li className="text-gray-medium text-sm">Seg - Sex: 9h às 18h</li>
              <li>
                <a href="mailto:contato@citizenboutique.com" className="text-gray-medium hover:text-primary transition-colors text-sm">
                  contato@nathanrelogios.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 pb-8 border-t border-gray-light flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <p className="text-[10px] text-gray-medium uppercase tracking-[0.2em]">Meios de Pagamento</p>
            <div className="flex flex-wrap justify-center gap-4 opacity-60">
              <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" alt="Visa" className="h-3 object-contain" />
              <img src="https://logodownload.org/wp-content/uploads/2014/07/mastercard-logo.png" alt="Mastercard" className="h-5 object-contain" />
              <img src="https://logodownload.org/wp-content/uploads/2020/02/pix-logo-1.png" alt="Pix" className="h-4 object-contain" />
              <img src="https://logodownload.org/wp-content/uploads/2015/05/elo-logo-1.png" alt="Elo" className="h-3 object-contain" />
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-xs text-gray-medium uppercase tracking-wider mb-2">
              &copy; {new Date().getFullYear()} Citizen Boutique. Nathan Relógios.
            </p>
            <p className="text-[10px] text-gray-light uppercase tracking-[0.1em]">
              CNPJ: 00.000.000/0001-00
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

