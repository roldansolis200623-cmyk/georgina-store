'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Home, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartButton } from '@/components/cart/CartButton';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { LoginModal } from '@/components/auth/LoginModal';
import { AdminPanel } from '@/components/admin/AdminPanel';

export default function NosotrosPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
  currentPage="nosotros"
  onOpenLogin={() => setIsLoginOpen(true)}
  onOpenAdmin={() => setIsAdminOpen(true)}
/>

      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] bg-primary flex items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary to-accent" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-4"
          >
            Sobre Nosotros
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Conoce la historia detrás de Georgina Home
          </motion.p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-grey">
            <Link href="/" className="hover:text-secondary">Inicio</Link>
            <span className="mx-2">/</span>
            <span className="text-primary font-medium">Nosotros</span>
          </nav>
        </div>
      </div>

      {/* Nuestra Historia */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-secondary font-medium text-sm tracking-wider">NUESTRA HISTORIA</span>
              <h2 className="font-playfair text-3xl md:text-4xl text-primary font-bold mt-2 mb-6">
                Transformando hogares desde 2020
              </h2>
              <div className="space-y-4 text-grey leading-relaxed">
                <p>
                  <strong className="text-primary">Georgina Home</strong> nació de la pasión por crear espacios únicos y acogedores. 
                  Lo que comenzó como un pequeño emprendimiento familiar se ha convertido en una tienda 
                  de referencia para quienes buscan muebles y decoración de calidad.
                </p>
                <p>
                  Creemos que cada hogar cuenta una historia, y nuestra misión es ayudarte a contar la tuya 
                  a través de piezas cuidadosamente seleccionadas que combinan diseño, funcionalidad y estilo.
                </p>
              </div>
            </motion.div>

            <motion.div
  initial={{ opacity: 0, x: 30 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg"
>
  <img
    src="/images/about/nuestra-historia.jpg"
    alt="Nuestra Historia - Georgina Home"
    className="w-full h-full object-cover"
  />
</motion.div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-secondary font-medium text-sm tracking-wider">LO QUE NOS DEFINE</span>
            <h2 className="font-playfair text-3xl md:text-4xl text-primary font-bold mt-2">
              Nuestros Valores
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: 'Pasión',
                desc: 'Amamos lo que hacemos y eso se refleja en cada producto que seleccionamos.',
              },
              {
                icon: Sparkles,
                title: 'Calidad',
                desc: 'Solo ofrecemos productos que cumplen con nuestros altos estándares.',
              },
              {
                icon: Home,
                title: 'Hogar',
                desc: 'Creemos que un hogar bien decorado mejora la calidad de vida.',
              },
              {
                icon: Users,
                title: 'Servicio',
                desc: 'Cada cliente es importante y merece una atención personalizada.',
              },
            ].map((valor, index) => (
              <motion.div
                key={valor.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <valor.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-playfair text-xl text-primary font-bold mb-2">{valor.title}</h3>
                <p className="text-grey text-sm">{valor.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo o Mensaje */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-40 h-40 mx-auto mb-6">
  <img
    src="/images/about/equipo.jpg"
    alt="Georgina Home Logo"
    className="w-full h-full object-contain"
  />
</div>
            <h2 className="font-playfair text-2xl md:text-3xl text-primary font-bold mb-6">
              "Nuestro compromiso es hacer de tu casa, un verdadero hogar"
            </h2>
            <p className="text-grey mb-8">
              — Equipo Georgina Home
            </p>
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-lg hover:bg-accent transition-colors font-medium"
            >
              Explorar Tienda
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <CartButton />
      <CartDrawer />

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}