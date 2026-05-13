import { Link } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-secondary border-b border-gray-light transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex flex-col items-center justify-center shrink-0">
            <span className="font-serif text-2xl tracking-[0.05em] uppercase leading-none">Nathan</span>
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-gray-medium mt-1">Relógios</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-12">
            <Link to="/catalogo" className="font-serif tracking-widest uppercase text-sm hover:text-gold transition-colors duration-300 relative group">
              Relógios
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/sobre" className="font-serif tracking-widest uppercase text-sm hover:text-gold transition-colors duration-300 relative group">
              A Boutique
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/contato" className="font-serif tracking-widest uppercase text-sm hover:text-gold transition-colors duration-300 relative group">
              Contato
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Icons & CTA */}
          <div className="flex items-center space-x-6">
            <button className="text-primary hover:text-gold transition-colors" aria-label="Buscar">
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            <a
              href="https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20ajuda%20para%20escolher%20um%20relógio%20Citizen."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center justify-center px-6 py-3 bg-primary text-secondary text-[12px] tracking-widest uppercase font-semibold hover:bg-gold transition-colors duration-300"
            >
              Falar Especialista
            </a>

            <button
              className="md:hidden text-primary"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-secondary border-l border-gray-light transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-light">
          <span className="font-serif text-xl tracking-[0.05em] uppercase">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Fechar menu">
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>
        <div className="flex flex-col p-6 space-y-8">
          <Link to="/catalogo" onClick={() => setIsMobileMenuOpen(false)} className="font-serif tracking-widest uppercase text-xl">Relógios</Link>
          <Link to="/sobre" onClick={() => setIsMobileMenuOpen(false)} className="font-serif tracking-widest uppercase text-xl">A Boutique</Link>
          <Link to="/contato" onClick={() => setIsMobileMenuOpen(false)} className="font-serif tracking-widest uppercase text-xl">Contato</Link>

          <div className="pt-8 mt-8 border-t border-gray-light">
            <a
              href="https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20ajuda%20para%20escolher%20um%20relógio%20Citizen."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full px-6 py-4 border border-gold text-gold text-sm tracking-widest uppercase font-semibold hover:bg-gold hover:text-secondary transition-colors duration-300"
            >
              Atendimento WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
