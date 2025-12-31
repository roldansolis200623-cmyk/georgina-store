'use client';

import { motion } from 'framer-motion';
import { Package, TrendingDown, Percent, DollarSign } from 'lucide-react';
import { useProductStore } from '@/lib/store/useProductStore';
import { formatPrice } from '@/lib/utils/formatters';

export function StatsCards() {
  const { products } = useProductStore();

  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (p) => p.stock !== null && p.stock > 0 && p.stock <= 5
  ).length;
  const productsWithOffer = products.filter((p) => p.originalPrice).length;
  const totalValue = products.reduce((acc, p) => acc + p.price * (p.stock || 1), 0);

  const stats = [
    {
      label: 'Total Productos',
      value: totalProducts,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Stock Bajo',
      value: lowStockProducts,
      icon: TrendingDown,
      color: 'from-orange-500 to-orange-600',
    },
    {
      label: 'En Oferta',
      value: productsWithOffer,
      icon: Percent,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Valor Inventario',
      value: formatPrice(totalValue),
      icon: DollarSign,
      color: 'from-secondary to-accent',
      isPrice: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white`}
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className="w-4 h-4 opacity-80" />
            <span className="text-xs opacity-80">{stat.label}</span>
          </div>
          <p className={`font-bold ${stat.isPrice ? 'text-lg' : 'text-2xl'}`}>
            {stat.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}