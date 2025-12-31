'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingCart, Heart, Share2, MessageCircle, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/lib/store/useCartStore';
import { useFavoritesStore } from '@/lib/store/useFavoritesStore';
import { useToast } from '@/components/ui/Toast';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { addItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setCurrentImageIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!product || !mounted) return null;

  // Usar array de imágenes o crear uno con la imagen principal
  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : [];

  const isProductFavorite = isFavorite(product.id);
  const isOutOfStock = product.stock === 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    showToast(`${quantity} ${quantity > 1 ? 'productos agregados' : 'producto agregado'} al carrito`, 'success');
  };

  const handleWhatsApp = () => {
    const message = `Hola! Me interesa el producto: ${product.name} - ${formatPrice(product.price)}`;
    window.open(`https://wa.me/56985633114?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleFavorite = () => {
    toggleFavorite(product);
    if (!isProductFavorite) {
      showToast('Agregado a favoritos', 'success');
    } else {
      showToast('Eliminado de favoritos', 'info');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Mira este producto: ${product.name} - ${formatPrice(product.price)}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copiado al portapapeles', 'success');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 max-h-[90vh] overflow-y-auto">
              {/* Images Section */}
              <div className="relative bg-gray-50 p-4">
                {/* Badge */}
                {discount > 0 && (
                  <span className="absolute top-6 left-6 z-10 bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{discount}%
                  </span>
                )}

                {/* Main Image */}
                <div className="relative aspect-square bg-white rounded-xl overflow-hidden mb-4">
                  {images.length > 0 ? (
                    <img
                      src={images[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-playfair text-4xl text-gray-300">Georgina</span>
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 justify-center">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                            ? 'border-secondary shadow-md'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="p-6 lg:p-8 flex flex-col">
                {/* Category */}
                <span className="text-secondary text-sm font-medium uppercase tracking-wider">
                  {product.category}
                </span>

                {/* Name */}
                <h2 className="font-playfair text-2xl lg:text-3xl text-primary font-bold mt-2">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-2xl lg:text-3xl font-bold text-secondary">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="bg-pink-100 text-secondary text-sm font-medium px-2 py-1 rounded">
                        -{discount}%
                      </span>
                    </>
                  )}
                </div>

                {/* Stock */}
                <div className="flex items-center gap-2 mt-4">
                  {isOutOfStock ? (
                    <span className="text-red-500 font-medium">Agotado</span>
                  ) : (
                    <>
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 font-medium">
                        {product.stock} disponibles
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div className="mt-6">
                    <h3 className="font-medium text-primary mb-2">Descripcion</h3>
                    <p className="text-grey leading-relaxed">{product.description}</p>
                  </div>
                )}

                {/* Quantity */}
                {!isOutOfStock && (
                  <div className="mt-6">
                    <h3 className="font-medium text-primary mb-3">Cantidad</h3>
                    <div className="flex items-center gap-1 w-fit border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                        className="p-3 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-8 space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white py-4 rounded-xl font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {isOutOfStock ? 'AGOTADO' : 'AGREGAR AL CARRITO'}
                    </button>

                    <button
                      onClick={handleFavorite}
                      className={`p-4 rounded-xl border transition-colors ${
                        isProductFavorite
                          ? 'bg-secondary text-white border-secondary'
                          : 'border-gray-200 hover:border-secondary hover:text-secondary'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isProductFavorite ? 'fill-white' : ''}`} />
                    </button>

                    <button
                      onClick={handleShare}
                      className="p-4 rounded-xl border border-gray-200 hover:border-secondary hover:text-secondary transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Consultar por WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}