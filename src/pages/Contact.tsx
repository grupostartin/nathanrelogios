import { MapPin, Phone, Mail, Instagram } from 'lucide-react';

export default function Contact() {
  return (
    <main className="flex flex-col min-h-screen bg-secondary">
      <div className="bg-offwhite py-16 border-b border-gray-light text-center px-6">
        <h1 className="font-serif text-4xl md:text-5xl tracking-[0.02em] mb-4">Contato</h1>
        <p className="font-sans text-gray-medium tracking-wide max-w-xl mx-auto">
          Fale com um especialista e encontre o Citizen ideal para você.
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-24 flex flex-col md:flex-row gap-16 lg:gap-32 w-full">
        <div className="flex-1">
          <h2 className="font-serif text-3xl mb-8">Informações de Atendimento</h2>

          <div className="space-y-10">
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-primary shrink-0 mt-1 stroke-[1.5]" />
              <div>
                <h4 className="label-caps text-gray-medium mb-2">WhatsApp Direto</h4>
                <a href="https://wa.me/5531986952057" target="_blank" rel="noopener noreferrer" className="font-serif text-2xl hover:text-gold transition-colors">
                  (31) 98695-2057
                </a>
                <div className="font-sans text-sm text-gray-medium mt-2 space-y-0.5">
                  <div>Segunda a Sexta: 08:00 às 20:00</div>
                  <div>Sábado: 08:00 às 16:00</div>
                  <div>Domingo: Fechada</div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary shrink-0 mt-1 stroke-[1.5]" />
              <div>
                <h4 className="label-caps text-gray-medium mb-2">E-mail</h4>
                <a href="mailto:nascimentodasilva4@gmail.com" className="font-serif text-xl hover:text-gold transition-colors">
                  nascimentodasilva4@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Instagram className="w-6 h-6 text-primary shrink-0 mt-1 stroke-[1.5]" />
              <div>
                <h4 className="label-caps text-gray-medium mb-2">Instagram</h4>
                <a href="https://instagram.com/nathanrelogios" target="_blank" rel="noopener noreferrer" className="font-serif text-xl hover:text-gold transition-colors">
                  @nathan_relogios
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-primary shrink-0 mt-1 stroke-[1.5]" />
              <div>
                <h4 className="label-caps text-gray-medium mb-2">Nosso Escritório</h4>
                <p className="font-sans text-base text-primary mb-1">
                  Belo Horizonte - MG
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-offwhite p-0 overflow-hidden border border-gray-light h-[500px] flex items-center justify-center">
          {/* Visual map placeholder, or iframe embed if requested */}
          <div className="w-full h-full relative">
            <iframe
              src="https://maps.google.com/maps?q=Belo%20Horizonte,%20MG,%20Brasil&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(1) contrast(1.2)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização"
            ></iframe>
          </div>
        </div>
      </div>
    </main>
  );
}
