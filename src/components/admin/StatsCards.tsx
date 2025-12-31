'use client';

import { motion } from 'framer-motion';
import { Package, DollarSign, Tag, AlertTriangle } from 'lucide-react';
import { Product } from '@/types';

interface StatsCardsProps {
  products: Product[];
}

export function StatsCards({ products }: StatsCardsProps) {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const onSale = products.filter((p) => p.originalPrice).length;
  const lowStock = products.filter((p) => p.stock !== null && p.stock <= 5).length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const stats = [
    { label: 'Productos', value: totalProducts, icon: Package, color: 'from-blue-500 to-blue-600' },
    { label: 'Valor Total', value: formatPrice(totalValue), icon: DollarSign, color: 'from-green-500 to-green-600' },
    { label: 'En Oferta', value: onSale, icon: Tag, color: 'from-orange-500 to-orange-600' },
    { label: 'Stock Bajo', value: lowStock, icon: AlertTriangle, color: 'from-red-500 to-red-600' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white`}
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className="w-4 h-4 opacity-80" />
            <span className="text-xs opacity-80">{stat.label}</span>
          </div>
          <p className="text-xl font-bold">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}