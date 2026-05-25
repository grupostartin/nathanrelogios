import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface WhatsAppButtonProps {
  message?: string;
}

export default function WhatsAppButton({ message = 'Olá, tenho interesse em um relógio Citizen. Poderia me ajudar com os modelos disponíveis e formas de pagamento?' }: WhatsAppButtonProps) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/5531986952057?text=${encodedMessage}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center p-4 bg-[#25D366] text-white hover:bg-[#1EBE5A] transition-colors shadow-lg group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      aria-label="Falar pelo WhatsApp"
    >
      <MessageCircle className="w-6 h-6 shrink-0" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-sans text-sm font-semibold tracking-wide ml-0 group-hover:ml-3">
        Falar com especialista
      </span>
    </motion.a>
  );
}
