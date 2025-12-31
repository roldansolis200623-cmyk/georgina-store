'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Confetti } from '@/components/ui/Confetti';

export function WhatsAppButton() {
  const [showConfetti, setShowConfetti] = useState(false);
  const phoneNumber = '56985633114';
  const message = 'Hola! Me gustaria hacer una consulta.';

  const handleClick = () => {
    setShowConfetti(true);
    
    // Delay para que se vea el confetti antes de abrir WhatsApp
    setTimeout(() => {
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }, 500);
  };

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center animate-pulse-glow"
        aria-label="Contactar por WhatsApp"
      >
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
          }}
          transition={{ 
            duration: 0.5, 
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <MessageCircle className="w-7 h-7" />
        </motion.div>
        
        {/* Ping effect */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
      </motion.button>
    </>
  );
}