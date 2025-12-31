'use client';

import { motion } from 'framer-motion';
import { Sparkles, Gift, Truck, Star, Heart, Zap } from 'lucide-react';

export function AnimatedBanner() {
  const messages = [
    { text: 'Aprovecha las promos', icon: Truck },
    { text: 'Ofertas exclusivas solo por hoy', icon: Gift },
    { text: 'Nuevos productos cada semana', icon: Sparkles },
  ];

  return (
    <div className="bg-gradient-to-r from-secondary via-pink-500 to-secondary bg-[length:200%_100%] animate-gradient text-white py-2.5 overflow-hidden relative">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: `${Math.random() * 100}%`,
              y: '100%',
              opacity: 0 
            }}
            animate={{ 
              y: '-100%',
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'linear',
            }}
          >
            {i % 3 === 0 ? (
              <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
            ) : i % 3 === 1 ? (
              <Heart className="w-3 h-3 text-pink-200 fill-pink-200" />
            ) : (
              <Sparkles className="w-3 h-3 text-white" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Marquee effect */}
      <div className="relative flex items-center justify-center">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Bouncing icons */}
          <motion.span
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatDelay: 1 
            }}
          >
            🎉
          </motion.span>

          {/* Glowing text */}
          <motion.span 
            className="text-xs sm:text-sm font-medium tracking-wide"
            animate={{
              textShadow: [
                '0 0 4px rgba(255,255,255,0.5)',
                '0 0 8px rgba(255,255,255,0.8)',
                '0 0 4px rgba(255,255,255,0.5)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Aprovecha las promos
          </motion.span>

          <motion.span
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -10, 10, 0]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatDelay: 1,
              delay: 0.2
            }}
          >
            🎉
          </motion.span>
        </motion.div>
      </div>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'linear',
        }}
      />
    </div>
  );
}