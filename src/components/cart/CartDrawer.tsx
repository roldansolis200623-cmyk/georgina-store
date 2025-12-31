'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, Tag, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useCouponStore } from '@/lib/store/useCouponStore';
import { generateWhatsAppCartLink } from '@/lib/utils/whatsapp';

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const { isOpen, closeCart, items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const { applyCoupon, appliedCoupon, clearAppliedCoupon, calculateDiscount } = useCouponStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = getTotalPrice();
  const discount = calculateDiscount(subtotal);
  const total = subtotal - discount;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    
    const result = applyCoupon(couponCode, subtotal);
    setCouponMessage({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });
    
    if (result.success) {
      setCouponCode('');
    }
    
    setTimeout(() => setCouponMessage(null), 3000);
  };

  const handleWhatsAppCheckout = () => {
    const whatsappUrl = generateWhatsAppCartLink(items, total, appliedCoupon?.code);
    window.open(whatsappUrl, '_blank');
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-secondary" />
                <h2 className="font-playfair text-xl font-bold text-primary">
                  Carrito ({items.length})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                  <p className="text-grey">Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                      {/* Image */}
                      <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <span className="text-gray-300 text-xs">Sin imagen</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-primary text-sm line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-secondary font-bold mt-1">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 hover:bg-red-50 text-red-500 rounded ml-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 space-y-4">
                {/* Coupon */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Código de cupón"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-secondary focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-gray-100 text-primary text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                  
                  {couponMessage && (
                    <p className={`text-sm ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                      {couponMessage.text}
                    </p>
                  )}
                  
                  {appliedCoupon && (
                    <div className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                      <span className="text-sm text-green-700">
                        Cupón: {appliedCoupon.code}
                      </span>
                      <button
                        onClick={clearAppliedCoupon}
                        className="text-green-700 hover:text-green-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-grey">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-secondary">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleWhatsAppCheckout}
                    className="w-full flex items-center justify-center gap-2 bg-[#25d366] text-white py-3 rounded-lg font-medium hover:bg-[#128c7e] transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Comprar por WhatsApp
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full text-sm text-grey hover:text-red-500 transition-colors"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}