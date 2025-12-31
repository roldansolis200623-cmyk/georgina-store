'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Edit, Trash2, Copy, Eye } from 'lucide-react';
import { Product } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { useProductStore } from '@/lib/store/useProductStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { formatPrice } from '@/lib/utils/formatters';

interface ProductCardProps {
  product: Product;
  index: number;
  onEdit?: (product: Product) => void;
  onView?: (product: Product) => void;
}

export function ProductCard({ product, index, onEdit, onView }: ProductCardProps) {
  const { isAuthenticated, deleteProduct, duplicateProduct } = useProductStore();
  const { addItem } = useCartStore();

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      stock: product.stock,
    });
  };

  const handleView = () => {
    onView?.(product);
  };

  const stockStatus = () => {
    if (product.stock === null) return null;
    if (product.stock === 0) return { color: 'bg-red-500', text: 'Agotado' };
    if (product.stock <= 5) return { color: 'bg-orange-500', text: `Ultimas ${product.stock}` };
    return { color: 'bg-green-500', text: 'En stock' };
  };

  const stock = stockStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleView}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-cream/50">
        {product.image ? (
          product.image.startsWith('data:video') ? (
            <video
              src={product.image}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-light-grey">
            <span className="text-grey text-sm">Sin imagen</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <Badge variant="discount">-{discountPercent}%</Badge>
          )}
          {product.badge && (
            <Badge variant="special">{product.badge}</Badge>
          )}
        </div>

        {/* Stock indicator */}
        {stock && (
          <div className="absolute top-3 right-3">
            <span className={`${stock.color} text-white text-xs px-2 py-1 rounded-full`}>
              {stock.text}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleView}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-cream transition-colors"
          >
            <Eye className="w-5 h-5 text-primary" />
          </motion.button>
          
          {product.stock !== 0 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickAdd}
              className="p-3 bg-secondary rounded-full shadow-lg hover:bg-secondary/90 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </div>

        {/* Admin actions */}
        {isAuthenticated && (
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(product);
              }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors"
            >
              <Edit className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateProduct(product.id);
              }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-green-50 transition-colors"
            >
              <Copy className="w-4 h-4 text-green-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('¿Mover al papelera?')) {
                  deleteProduct(product.id);
                }
              }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="text-xs text-secondary font-medium uppercase tracking-wider">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="font-playfair text-lg font-semibold text-primary mt-1 line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-grey mt-1 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xl font-bold text-secondary">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-grey line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>

        {/* Quick add button */}
        <button
          onClick={handleQuickAdd}
          disabled={product.stock === 0}
          className="w-full mt-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:bg-grey disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
        </button>
      </div>
    </motion.div>
  );
}