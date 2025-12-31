'use client';

import Link from 'next/link';
import { Instagram, Mail, Phone, MapPin, MessageCircle, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-pink-50">
      {/* Newsletter Section */}
      <div className="border-t border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="font-playfair text-2xl text-primary mb-3">Únete a nuestra comunidad</h3>
            <p className="text-grey text-sm mb-6">Recibe ofertas exclusivas y novedades directamente en tu correo</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-3 border border-pink-200 rounded-full text-sm focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
              />
              <button className="px-6 py-3 bg-secondary text-white rounded-full text-sm font-medium hover:bg-accent transition-colors">
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <Link href="/" className="inline-block mb-4">
                <span className="font-playfair text-2xl">
                  <span className="italic text-primary">Georgina</span>
                  <span className="text-secondary ml-2 text-xs tracking-widest">HOME</span>
                </span>
              </Link>
              <p className="text-grey text-sm leading-relaxed mb-4">
                Transformamos tu hogar en un espacio único con estilo y elegancia.
              </p>
              <div className="flex items-center gap-3">
                <a 
                  href="https://www.instagram.com/georginastore.cl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://wa.me/56985633114" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Enlaces */}
            <div>
              <h4 className="font-playfair text-lg text-primary mb-4">Enlaces</h4>
              <ul className="space-y-2">
                {['Inicio', 'Tienda', 'Nosotros', 'Contacto'].map((item) => (
                  <li key={item}>
                    <Link 
                      href={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`} 
                      className="text-grey text-sm hover:text-secondary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categorías */}
            <div>
              <h4 className="font-playfair text-lg text-primary mb-4">Categorías</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/tienda?categoria=decoracion" className="text-grey text-sm hover:text-secondary transition-colors">
                    Decoración
                  </Link>
                </li>
                <li>
                  <Link href="/tienda?categoria=muebles" className="text-grey text-sm hover:text-secondary transition-colors">
                    Muebles
                  </Link>
                </li>
                <li>
                  <Link href="/tienda?categoria=lashroom" className="text-grey text-sm hover:text-secondary transition-colors">
                    Lashroom
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="font-playfair text-lg text-primary mb-4">Contacto</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-grey text-sm">Santiago, Chile</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                  <a href="tel:+56985633114" className="text-grey text-sm hover:text-secondary transition-colors">
                    +56 9 8563 3114
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                  <a href="mailto:georginastein08@gmail.com" className="text-grey text-sm hover:text-secondary transition-colors">
                    georginastein08@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-pink-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-grey text-sm">
              © {new Date().getFullYear()} Georgina Home. Todos los derechos reservados.
            </p>
            <p className="text-grey text-sm flex items-center gap-1">
              Hecho con <Heart className="w-4 h-4 text-secondary fill-secondary" /> en Chile
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}