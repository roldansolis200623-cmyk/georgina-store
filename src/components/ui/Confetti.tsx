'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
}

interface ConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

export function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const colors = ['#e91e63', '#ff4081', '#f8bbd9', '#fce4ec', '#ffeb3b', '#ff9800', '#4caf50', '#2196f3'];

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < 50; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.3,
          rotation: Math.random() * 360,
        });
      }
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{ 
                y: -20, 
                x: `${piece.x}vw`,
                rotate: 0,
                opacity: 1,
                scale: 1
              }}
              animate={{ 
                y: '110vh',
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0],
                scale: [1, 1.2, 0.8]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 2.5 + Math.random(),
                delay: piece.delay,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="absolute"
              style={{
                width: Math.random() * 10 + 8,
                height: Math.random() * 10 + 8,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
            />
          ))}
          
          {/* Sparkles/Stars */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              initial={{ 
                scale: 0,
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 50}vh`,
              }}
              animate={{ 
                scale: [0, 1.5, 0],
                rotate: [0, 180],
              }}
              transition={{ 
                duration: 1,
                delay: Math.random() * 0.5,
                repeat: 2,
              }}
              className="absolute text-2xl"
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}