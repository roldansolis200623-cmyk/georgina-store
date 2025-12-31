'use client';

import { motion } from 'framer-motion';
import { ArrowUpAZ, ArrowDownAZ, TrendingUp, TrendingDown, Clock, CalendarDays } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useProductStore } from '@/lib/store/useProductStore';
import { SortCriteria } from '@/types';

interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sortOptions: { value: SortCriteria; label: string; icon: React.ElementType }[] = [
  { value: 'name-asc', label: 'Nombre A-Z', icon: ArrowUpAZ },
  { value: 'name-desc', label: 'Nombre Z-A', icon: ArrowDownAZ },
  { value: 'price-asc', label: 'Precio: Menor a Mayor', icon: TrendingUp },
  { value: 'price-desc', label: 'Precio: Mayor a Menor', icon: TrendingDown },
  { value: 'date-desc', label: 'Más Recientes', icon: Clock },
  { value: 'date-asc', label: 'Más Antiguos', icon: CalendarDays },
];

export function SortModal({ isOpen, onClose }: SortModalProps) {
  const { sortProducts } = useProductStore();

  const handleSort = (criteria: SortCriteria) => {
    sortProducts(criteria);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📊 Ordenar Productos" size="sm">
      <div className="space-y-2">
        {sortOptions.map((option, index) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleSort(option.value)}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-light transition-colors text-left group"
          >
            <div className="w-10 h-10 bg-light-grey rounded-full flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
              <option.icon className="w-5 h-5" />
            </div>
            <span className="font-medium text-primary">{option.label}</span>
          </motion.button>
        ))}
      </div>
    </Modal>
  );
}