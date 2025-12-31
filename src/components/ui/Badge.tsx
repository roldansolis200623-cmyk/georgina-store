'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  variant: 'discount' | 'special' | 'stock';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className }: BadgeProps) {
  if (variant === 'discount') {
    return (
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className={cn(
          'absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10',
          className
        )}
      >
        {children}
      </motion.div>
    );
  }

  if (variant === 'special') {
    return (
      <motion.div
        className={cn(
          'absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg z-10',
          'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 bg-[length:200%_100%]',
          className
        )}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        {children}
      </motion.div>
    );
  }

  // Stock badge
  return (
    <span className={cn('text-xs font-medium', className)}>
      {children}
    </span>
  );
}