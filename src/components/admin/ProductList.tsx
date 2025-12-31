'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Package } from 'lucide-react';
import { Product } from '@/types';
import { useSupabaseProducts } from '@/lib/store/useSupabaseProducts';
import { useToast } from '@/components/ui/Toast';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

export function ProductList({ products, onEdit }: ProductListProps) {
  const { deleteProduct } = useSupabaseProducts();
  const { showToast } = useToast();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    
    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      showToast('Producto eliminado', 'success');
    } catch (error) {
      showToast('Error al eliminar', 'error');
    }
    setDeletingId(null);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <p className="text-grey">No hay productos</p>
        <p className="text-sm text-gray-400">Agrega tu primer producto</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-grey mb-4">{products.length} productos en la base de datos</p>
      
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Package className="w-6 h-6" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-primary text-sm truncate">
              {product.name}
            </h3>
            <p className="text-xs text-grey capitalize">{product.category}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-secondary font-bold text-sm">
                {formatPrice(product.price)}
              </p>
              {product.stock !== null && product.stock <= 5 && (
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">
                  Stock: {product.stock}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(product)}
              disabled={deletingId === product.id}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Eliminar"
            >
              <Trash2 className={`w-4 h-4 ${deletingId === product.id ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}