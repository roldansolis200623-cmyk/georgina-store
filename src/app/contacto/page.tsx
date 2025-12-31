'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Instagram, MessageCircle, Paperclip, X } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartButton } from '@/components/cart/CartButton';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { LoginModal } from '@/components/auth/LoginModal';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { useToast } from '@/components/ui/Toast';

export default function ContactoPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('nombre', formData.nombre);
      data.append('email', formData.email);
      data.append('telefono', formData.telefono || 'No proporcionado');
      data.append('mensaje', formData.mensaje);
      
      files.forEach((file, index) => {
        data.append(`archivo_${index + 1}`, file);
      });

      const response = await fetch('https://formspree.io/f/mbdjnypn', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        showToast('Mensaje enviado correctamente!', 'success');
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
        setFiles([]);
      } else {
        throw new Error('Error al enviar');
      }
    } catch (error) {
      showToast('Error al enviar el mensaje', 'error');
    }

    setIsSubmitting(false);
  };

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
        currentPage="contacto"
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <section className="relative h-[40vh] min-h-[300px] bg-primary flex items-center justify-center">
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-4xl md:text-5xl text-white font-bold mb-4"
          >
            Contactanos
          </motion.h1>
        </div>
      </section>

      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-grey">
            <Link href="/" className="hover:text-secondary">Inicio</Link>
            <span className="mx-2">/</span>
            <span className="text-primary font-medium">Contacto</span>
          </nav>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            <div>
              <h2 className="font-playfair text-3xl text-primary font-bold mb-8">
                Como podemos ayudarte?
              </h2>

              <div className="space-y-6 mb-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary">Direccion</h3>
                    <p className="text-grey">Santiago, Chile</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary">Telefono / WhatsApp</h3>
                    <a href="tel:+56985633114" className="text-secondary">+56 9 8563 3114</a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary">Email</h3>
                    <a href="mailto:georginastein08@gmail.com" className="text-secondary">georginastein08@gmail.com</a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary">Horario de Atencion</h3>
                    <p className="text-grey">Lunes a Viernes: 9:00 - 19:00</p>
                    <p className="text-grey">Sabados: 9:00 - 14:00</p>
                    <p className="text-sm text-grey/70">Domingos: Cerrado</p>
                  </div>
                </div>
              </div>

              <h3 className="font-playfair text-xl text-primary font-bold mb-4">Siguenos en Redes</h3>
              <div className="space-y-3">
                <a href="https://www.instagram.com/georginastore.cl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all group">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 group-hover:bg-white rounded-full flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-white group-hover:text-pink-500" />
                  </div>
                  <div>
                    <p className="font-medium">Instagram</p>
                    <p className="text-sm text-grey group-hover:text-white/80">@georginastore.cl</p>
                  </div>
                </a>

                <a href="https://wa.me/56985633114" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-green-500 hover:text-white transition-all group">
                  <div className="w-10 h-10 bg-green-500 group-hover:bg-white rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white group-hover:text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-grey group-hover:text-white/80">+56 9 8563 3114</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="font-playfair text-2xl text-primary font-bold mb-6">Envianos un mensaje</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">Telefono</label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Mensaje *</label>
                  <textarea
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none resize-none"
                    placeholder="En que podemos ayudarte?"
                  />
                </div>

                {/* Archivos adjuntos */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Archivos adjuntos (opcional)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-colors"
                  >
                    <Paperclip className="w-6 h-6 text-grey mx-auto mb-2" />
                    <p className="text-sm text-grey">Clic para adjuntar archivos</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, imagenes (max 5 archivos)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg border">
                          <span className="text-sm text-grey truncate flex-1">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-secondary text-white py-3 rounded-lg font-medium hover:bg-accent transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </form>
            </div>
          </div>
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