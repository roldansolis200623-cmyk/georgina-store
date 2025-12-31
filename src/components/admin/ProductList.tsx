'use client';

import { AnimatePresence } from 'framer-motion';
import { useProductStore } from '@/lib/store/useProductStore';
import { ProductRow } from './ProductRow';
import { Product } from '@/types';

interface ProductListProps {
  onEdit: (product: Product) => void;
}

export function ProductList({ onEdit }: ProductListProps) {
  const { products } = useProductStore();

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-grey">
        <p>No hay productos aún.</p>
        <p className="text-sm">Agrega tu primer producto.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-light-grey text-left">
            <th className="py-3 px-2 text-xs font-semibold text-grey uppercase tracking-wider w-16">
              Img
            </th>
            <th className="py-3 px-2 text-xs font-semibold text-grey uppercase tracking-wider">
              Producto
            </th>
            <th className="py-3 px-2 text-xs font-semibold text-grey uppercase tracking-wider w-24">
              Precio
            </th>
            <th className="py-3 px-2 text-xs font-semibold text-grey uppercase tracking-wider w-16">
              Stock
            </th>
            <th className="py-3 px-2 text-xs font-semibold text-grey uppercase tracking-wider w-28">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {products.map((product) => (
              <ProductRow key={product.id} product={product} onEdit={onEdit} />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}