'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { useProductStore } from '@/lib/store/useProductStore';

interface ProductGridProps {
  onEditProduct?: (product: Product) => void;
}

export function ProductGrid({ onEditProduct }: ProductGridProps) {
  const { getFilteredProducts } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = getFilteredProducts();

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const handleEditProduct = (product: Product) => {
    onEditProduct?.(product);
  };

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="w-24 h-24 bg-light-grey rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-12 h-12 text-grey" />
        </div>
        <h3 className="font-playfair text-2xl font-bold text-primary mb-2">
          No hay productos
        </h3>
        <p className="text-grey">
          No se encontraron productos con los filtros seleccionados
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onEdit={handleEditProduct}
              onView={handleViewProduct}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}