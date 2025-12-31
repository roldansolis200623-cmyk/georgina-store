'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Shield, CreditCard, Phone, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartButton } from '@/components/cart/CartButton';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { LoginModal } from '@/components/auth/LoginModal';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { ProductCardHomeline } from '@/components/catalog/ProductCardHomeline';
import { ProductModal } from '@/components/catalog/ProductModal';
import { useSupabaseProducts } from '@/lib/store/useSupabaseProducts';
import { Product } from '@/types';

export default function HomePage() {
  const { products, fetchProducts } = useSupabaseProducts();
  const [mounted, setMounted] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, [fetchProducts]);

  const featuredProducts = products.slice(0, 8);
  const saleProducts = products.filter((p) => p.originalPrice).slice(0, 4);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const categories = [
    { name: 'Decoracion', slug: 'decoracion', desc: 'Accesorios y detalles', color: 'from-pink-100 to-rose-50' },
    { name: 'Muebles', slug: 'muebles', desc: 'Comodidad y estilo', color: 'from-pink-50 to-white' },
    { name: 'Lashroom', slug: 'lashroom', desc: 'Todo para tu espacio', color: 'from-rose-50 to-pink-100' },
  ];

  const features = [
    { icon: Truck, title: 'Envio a Domicilio', desc: 'A todo Chile en 7 dias habiles' },
    { icon: Shield, title: 'Garantia', desc: 'Cubre defectos de fabrica' },
    { icon: CreditCard, title: 'Pago Seguro', desc: 'Multiples metodos' },
    { icon: Phone, title: 'Soporte', desc: 'Atencion personalizada' },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentPage="inicio"
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Hero Section - Desktop y Móvil */}
      <section className="relative h-[100svh] md:h-[80vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          {/* Imagen para MÓVIL */}
          <Image
            src="/images/banners/hero-banner-mobile.jpg"
            alt="Georgina Home - Muebles y Decoracion"
            fill
            className="object-cover object-top md:hidden"
            priority
          />
          {/* Imagen para DESKTOP */}
          <Image
            src="/images/banners/hero-banner.jpg"
            alt="Georgina Home - Muebles y Decoracion"
            fill
            className="object-cover hidden md:block"
            priority
          />
        </div>

        <div className="absolute bottom-24 md:bottom-16 left-1/2 -translate-x-1/2 z-10 w-full px-4 md:px-0 md:w-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-full font-medium hover:bg-accent transition-all hover:shadow-lg shadow-md"
            >
              VER TIENDA
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-20 bg-gradient-to-b from-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 text-secondary text-sm font-medium mb-3">
              <Sparkles className="w-4 h-4" />
              Explora nuestro catalogo
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl text-primary mb-4">
              Nuestras <span className="text-secondary italic">Categorias</span>
            </h2>
            <p className="text-grey max-w-2xl mx-auto">
              Encuentra todo lo que necesitas para transformar tu hogar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/tienda?categoria=${cat.slug}`}
                  className={`group block relative h-48 md:h-64 bg-gradient-to-br ${cat.color} overflow-hidden rounded-2xl border border-pink-100 hover:shadow-lg hover:shadow-pink-100 transition-all`}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="font-playfair text-2xl md:text-3xl text-primary font-bold mb-2 group-hover:text-secondary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-grey text-sm mb-4">{cat.desc}</p>
                    <span className="inline-flex items-center gap-2 text-secondary text-sm font-medium group-hover:gap-3 transition-all">
                      Ver productos <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12"
          >
            <div className="text-center sm:text-left">
              <h2 className="font-playfair text-3xl md:text-4xl text-primary mb-2">
                Productos <span className="text-secondary italic">Destacados</span>
              </h2>
              <p className="text-grey">Los favoritos de nuestras clientas</p>
            </div>
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 text-secondary hover:text-accent font-medium hover:gap-3 transition-all"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCardHomeline
                  product={product}
                  onQuickView={handleQuickView}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-pink-50 border-y border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-secondary" />
                </div>
                <h3 className="font-medium text-primary text-sm md:text-base mb-1">{feature.title}</h3>
                <p className="text-xs md:text-sm text-grey">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos en Oferta */}
      {saleProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block bg-secondary text-white text-sm font-medium px-4 py-1 rounded-full mb-4">
                OFERTAS ESPECIALES
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl text-primary">
                Productos en <span className="text-secondary italic">Oferta</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {saleProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCardHomeline
                    product={product}
                    onQuickView={handleQuickView}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA WhatsApp */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-playfair text-2xl md:text-4xl text-white mb-4">
              Lista para transformar tu hogar?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-8 text-sm md:text-base">
              Contactanos por WhatsApp y te ayudamos a encontrar lo que buscas
            </p>
            <a
              href="https://wa.me/56985633114"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-medium hover:bg-secondary hover:text-white transition-all"
            >
              Contactar por WhatsApp
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <CartButton />
      <CartDrawer />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}