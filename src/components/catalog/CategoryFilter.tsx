'use client';

import { motion } from 'framer-motion';
import { useProductStore } from '@/lib/store/useProductStore';
import { Category } from '@/types';
import { cn } from '@/lib/utils/cn';

const categories: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'furniture', label: 'Muebles' },
  { value: 'decoration', label: 'Decoración' },
  { value: 'lighting', label: 'Iluminación' },
  { value: 'textiles', label: 'Textiles' },
];

export function CategoryFilter() {
  const { categoryFilter, setCategoryFilter } = useProductStore();

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => (
        <motion.button
          key={category.value}
          onClick={() => setCategoryFilter(category.value)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'px-6 py-3 rounded-full font-medium text-sm uppercase tracking-wide transition-all duration-300',
            categoryFilter === category.value
              ? 'bg-primary text-white shadow-lg'
              : 'bg-white text-grey border-2 border-light-grey hover:border-secondary hover:text-primary'
          )}
        >
          {category.label}
        </motion.button>
      ))}
    </div>
  );
}