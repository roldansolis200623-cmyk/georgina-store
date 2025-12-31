'use client';

import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  totalProducts: number;
}

export function FilterBar({ totalProducts }: FilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between py-4 border-b border-gray-200"
    >
      <div className="flex items-center gap-4">
        <p className="text-sm text-grey">
          {totalProducts} productos encontrados
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-grey hover:text-primary transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
        </button>
      </div>
    </motion.div>
  );
}