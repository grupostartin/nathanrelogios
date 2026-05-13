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
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="font-serif text-2xl hover:text-gold transition-colors">
                  (11) 99999-9999
                </a>
                <p className="font-sans text-sm text-gray-medium mt-2">Segunda a Sexta, das 9h às 18h</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary shrink-0 mt-1 stroke-[1.5]" />
              <div>
                <h4 className="label-caps text-gray-medium mb-2">E-mail</h4>
                <a href="mailto:contato@citizenboutique.com" className="font-serif text-xl hover:text-gold transition-colors">
                  contato@citizenboutique.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Instagram className="w-6 h-6 text-primary shrink-0 mt-1 stroke-[1.5]" />
              <div>
                <h4 className="label-caps text-gray-medium mb-2">Instagram</h4>
                <a href="https://instagram.com/nathanrelogios" target="_blank" rel="noopener noreferrer" className="font-serif text-xl hover:text-gold transition-colors">
                  @nathanrelogios
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-primary shrink-0 mt-1 stroke-[1.5]" />
              <div>
                <h4 className="label-caps text-gray-medium mb-2">Nosso Escritório</h4>
                <p className="font-sans text-base text-primary mb-1">
                  Av. Paulista, 1000 - Jardins
                </p>
                <p className="font-sans text-sm text-gray-medium">
                  São Paulo - SP, 01310-100<br/>
                  (Apenas com hora marcada)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-offwhite p-0 overflow-hidden border border-gray-light h-[500px] flex items-center justify-center">
            {/* Visual map placeholder, or iframe embed if requested */}
            <div className="w-full h-full relative">
               <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1490218764003!2d-46.654868!3d-23.5630656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59942a781ae7%3A0xbd860be247b94ad4!2sAv.%20Paulista%2C%201000%20-%20Jardins%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001311-000!5e0!3m2!1spt-BR!2sbr!4v1715456789012!5m2!1spt-BR!2sbr" 
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
