'use client';

import { motion } from 'framer-motion';
import { Edit2, Trash2, Copy, Package } from 'lucide-react';
import { Product } from '@/types';
import { useProductStore } from '@/lib/store/useProductStore';
import { formatPrice, translateCategory } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
}

export function ProductRow({ product, onEdit }: ProductRowProps) {
  const { deleteProduct, duplicateProduct } = useProductStore();

  const isVideo = product.image?.startsWith('data:video');
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock !== null && product.stock > 0 && product.stock <= 5;

  const handleDelete = () => {
    if (window.confirm('¿Eliminar este producto? Se moverá a la papelera.')) {
      deleteProduct(product.id);
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="border-b border-light-grey hover:bg-light/50 transition-colors"
    >
      {/* Thumbnail */}
      <td className="py-3 px-2">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-light-grey flex-shrink-0">
          {product.image ? (
            isVideo ? (
              <video src={product.image} className="w-full h-full object-cover" muted />
            ) : (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-6 h-6 text-grey/40" />
            </div>
          )}
        </div>
      </td>

      {/* Product Info */}
      <td className="py-3 px-2">
        <p className="font-medium text-primary text-sm line-clamp-1">{product.name}</p>
        <p className="text-xs text-grey">{translateCategory(product.category)}</p>
      </td>

      {/* Price */}
      <td className="py-3 px-2">
        <p className="font-semibold text-accent text-sm">{formatPrice(product.price)}</p>
        {product.originalPrice && (
          <p className="text-xs text-grey line-through">{formatPrice(product.originalPrice)}</p>
        )}
      </td>

      {/* Stock */}
      <td className="py-3 px-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'w-2.5 h-2.5 rounded-full',
              isOutOfStock && 'bg-red-500',
              isLowStock && 'bg-orange-500',
              !isOutOfStock && !isLowStock && product.stock !== null && 'bg-green-500',
              product.stock === null && 'bg-blue-500'
            )}
          />
          <span className="text-sm text-grey">
            {product.stock === null ? '∞' : product.stock}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="py-3 px-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(product)}
            className="p-2 rounded-lg hover:bg-blue-100 text-blue-500 transition-colors"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => duplicateProduct(product.id)}
            className="p-2 rounded-lg hover:bg-secondary/10 text-secondary transition-colors"
            title="Duplicar"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}