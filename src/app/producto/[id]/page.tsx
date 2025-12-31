'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Minus, Plus, ShoppingCart, Heart, Share2, MessageCircle, 
  ChevronLeft, ChevronRight, Check, Truck, Shield, RotateCcw,
  Facebook, Twitter, Mail, ZoomIn
} from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartButton } from '@/components/cart/CartButton';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { LoginModal } from '@/components/auth/LoginModal';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { ProductCardHomeline } from '@/components/catalog/ProductCardHomeline';
import { ProductReviews } from '@/components/catalog/ProductReviews';
import { StarRating } from '@/components/catalog/StarRating';
import { useProductStore } from '@/lib/store/useProductStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { useFavoritesStore } from '@/lib/store/useFavoritesStore';
import { useToast } from '@/components/ui/Toast';
import { Product } from '@/types';

type TabType = 'descripcion' | 'informacion' | 'valoraciones' | 'envios';

export default function ProductoPage() {
  const params = useParams();
  const router = useRouter();
  const { products, loadFromStorage } = useProductStore();
  const { addItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { showToast } = useToast();

  const [mounted, setMounted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('descripcion');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (mounted && products.length > 0 && params.id) {
      const found = products.find(p => p.id === Number(params.id));
      setProduct(found || null);
    }
  }, [mounted, products, params.id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header currentPage="tienda" onOpenLogin={() => setIsLoginOpen(true)} onOpenAdmin={() => setIsAdminOpen(true)} />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Producto no encontrado</h1>
          <Link href="/tienda" className="text-secondary hover:underline">Volver a la tienda</Link>
        </div>
        <Footer />
      </div>
    );
  }

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
    const message = `Hola! Me interesa el producto: ${product.name} - ${formatPrice(product.price)}. Quiero consultar stock.`;
    window.open(`https://wa.me/56985633114?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleFavorite = () => {
    toggleFavorite(product);
    showToast(isProductFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos', 'success');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch (err) {
        console.log('Error sharing');
      }
    } else {
      navigator.clipboard.writeText(url);
      showToast('Link copiado', 'success');
    }
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'descripcion', label: 'DESCRIPCION' },
    { id: 'informacion', label: 'INFORMACION' },
    { id: 'valoraciones', label: 'VALORACIONES' },
    { id: 'envios', label: 'ENVIOS' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="tienda" onOpenLogin={() => setIsLoginOpen(true)} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-pink-50 to-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-grey flex flex-wrap items-center gap-1">
            <Link href="/" className="hover:text-secondary">Inicio</Link>
            <span>/</span>
            <Link href="/tienda" className="hover:text-secondary">Tienda</Link>
            <span>/</span>
            <Link href={`/tienda?categoria=${product.category}`} className="hover:text-secondary capitalize">{product.category}</Link>
            <span>/</span>
            <span className="text-primary font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Gallery */}
            <div>
              <div 
                className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                {discount > 0 && (
                  <span className="absolute top-4 left-4 z-10 bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{discount}%
                  </span>
                )}

                <div className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full">
                  <ZoomIn className="w-5 h-5 text-grey" />
                </div>
                
                {images.length > 0 ? (
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={images[currentImageIndex]}
                      alt={product.name}
                      className={`w-full h-full object-contain p-8 transition-transform duration-300 ${
                        isZoomed ? 'scale-150' : 'scale-100'
                      }`}
                      style={isZoomed ? {
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                      } : undefined}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-playfair text-6xl text-gray-200">Georgina</span>
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white shadow-lg rounded-full hover:bg-pink-50 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white shadow-lg rounded-full hover:bg-pink-50 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        currentImageIndex === index 
                          ? 'border-secondary shadow-lg' 
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <span className="text-secondary text-sm font-medium uppercase tracking-wide">
                {product.category}
              </span>
              
              <h1 className="font-playfair text-2xl sm:text-3xl lg:text-4xl text-primary font-bold mt-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mt-3">
                <StarRating productId={product.id} size="md" showCount />
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="text-3xl font-bold text-secondary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-pink-100 text-secondary text-sm font-medium px-3 py-1 rounded-full">
                    Ahorras {formatPrice(product.originalPrice! - product.price)}
                  </span>
                )}
              </div>

              {product.description && (
                <p className="text-grey mt-6 leading-relaxed">{product.description}</p>
              )}

              <div className="flex items-center gap-2 mt-6">
                {isOutOfStock ? (
                  <span className="text-red-500 font-medium">Agotado</span>
                ) : (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-green-600">
                      {product.stock && product.stock <= 5 
                        ? `¡Solo quedan ${product.stock} unidades!` 
                        : `${product.stock} disponibles`
                      }
                    </span>
                  </>
                )}
              </div>

              {!isOutOfStock && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-6">
                  <div className="flex items-center border border-gray-200 rounded-full overflow-hidden w-fit">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      className="px-4 py-3 hover:bg-pink-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-3 font-medium min-w-[50px] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))} 
                      className="px-4 py-3 hover:bg-pink-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white py-3.5 px-6 rounded-full font-medium hover:bg-accent transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    AGREGAR AL CARRITO
                  </button>
                </div>
              )}

              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3.5 rounded-full font-medium hover:bg-green-600 transition-colors mt-3"
              >
                <MessageCircle className="w-5 h-5" />
                CONSULTAR POR WHATSAPP
              </button>

              <div className="flex flex-wrap items-center gap-6 mt-6">
                <button 
                  onClick={handleFavorite} 
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isProductFavorite ? 'text-secondary' : 'text-grey hover:text-secondary'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isProductFavorite ? 'fill-secondary' : ''}`} />
                  {isProductFavorite ? 'En favoritos' : 'Agregar a favoritos'}
                </button>
                <button 
                  onClick={handleShare} 
                  className="flex items-center gap-2 text-sm text-grey hover:text-secondary font-medium transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Compartir
                </button>
              </div>

              {/* Meta */}
              <div className="border-t border-gray-100 mt-6 pt-6 space-y-2 text-sm">
                <p>
                  <span className="text-grey">SKU:</span>{' '}
                  <span className="text-primary">{product.sku || `GH-${product.id.toString().padStart(4, '0')}`}</span>
                </p>
                <p>
                  <span className="text-grey">Categoria:</span>{' '}
                  <Link href={`/tienda?categoria=${product.category}`} className="text-secondary hover:underline capitalize">
                    {product.category}
                  </Link>
                </p>
                {product.tags && product.tags.length > 0 && (
                  <p>
                    <span className="text-grey">Etiquetas:</span>{' '}
                    <span className="text-primary">{product.tags.join(', ')}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-1 border-b border-gray-100 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-secondary'
                    : 'text-grey hover:text-primary'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            <AnimatePresence mode="wait">
              {activeTab === 'descripcion' && (
                <motion.div
                  key="descripcion"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="prose max-w-none"
                >
                  <p className="text-grey leading-relaxed">{product.description || 'Sin descripcion disponible.'}</p>
                </motion.div>
              )}

              {activeTab === 'informacion' && (
                <motion.div
                  key="informacion"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="overflow-x-auto"
                >
                  <table className="w-full max-w-2xl">
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="py-4 text-grey w-1/3">SKU</td><td className="py-4 font-medium">{product.sku || `GH-${product.id.toString().padStart(4, '0')}`}</td></tr>
                      <tr><td className="py-4 text-grey">Categoria</td><td className="py-4 font-medium capitalize">{product.category}</td></tr>
                      {product.material && <tr><td className="py-4 text-grey">Material</td><td className="py-4 font-medium">{product.material}</td></tr>}
                      {product.dimensions && <tr><td className="py-4 text-grey">Dimensiones</td><td className="py-4 font-medium">{product.dimensions}</td></tr>}
                      {product.weight && <tr><td className="py-4 text-grey">Peso</td><td className="py-4 font-medium">{product.weight}</td></tr>}
                      {product.color && <tr><td className="py-4 text-grey">Color</td><td className="py-4 font-medium">{product.color}</td></tr>}
                      <tr><td className="py-4 text-grey">Stock</td><td className="py-4 font-medium">{product.stock ? `${product.stock} unidades` : 'Consultar'}</td></tr>
                    </tbody>
                  </table>
                </motion.div>
              )}

              {activeTab === 'valoraciones' && (
                <motion.div
                  key="valoraciones"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ProductReviews productId={product.id} />
                </motion.div>
              )}

              {activeTab === 'envios' && (
                <motion.div
                  key="envios"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                >
                  {[
                    { icon: Truck, title: 'Envio a domicilio', desc: 'Despacho a todo Chile en 7 dias habiles' },
                    { icon: Shield, title: 'Garantia', desc: 'Productos garantizados contra defectos' },
                    { icon: RotateCcw, title: 'Devoluciones', desc: '30 dias para cambios y devoluciones' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4 p-6 bg-pink-50 rounded-2xl">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary">{item.title}</h4>
                        <p className="text-sm text-grey mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-white to-pink-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-playfair text-2xl text-primary font-bold mb-8">
              Productos <span className="text-secondary italic">Relacionados</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCardHomeline key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <WhatsAppButton />
      <CartButton />
      <CartDrawer />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}