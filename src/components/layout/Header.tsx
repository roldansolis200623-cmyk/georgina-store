'use client';

import { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useProductStore } from '@/lib/store/useProductStore';
import { useFavoritesStore } from '@/lib/store/useFavoritesStore';
import { SearchModal } from '@/components/layout/SearchModal';
import { AnimatedBanner } from '@/components/layout/AnimatedBanner';
import Link from 'next/link';

interface HeaderProps {
  currentPage?: 'inicio' | 'tienda' | 'nosotros' | 'contacto';
  onOpenLogin: () => void;
  onOpenAdmin: () => void;
}

export function Header({ currentPage = 'inicio', onOpenLogin, onOpenAdmin }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const { isAuthenticated, logout } = useProductStore();
  const { favorites } = useFavoritesStore();

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;
  const totalFavorites = mounted ? favorites.length : 0;

  const navLinks = [
    { href: '/', label: 'Inicio', page: 'inicio' },
    { href: '/tienda', label: 'Tienda', page: 'tienda' },
    { href: '/nosotros', label: 'Nosotros', page: 'nosotros' },
    { href: '/contacto', label: 'Contacto', page: 'contacto' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40">
        {/* Animated Banner */}
        <AnimatedBanner />

        {/* Main Header */}
        <div className={`transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-soft' 
            : 'bg-white'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center group">
                <span className="font-playfair text-2xl md:text-3xl tracking-wider">
                  <span className="italic text-primary group-hover:text-secondary transition-colors">Georgina</span>
                  <span className="text-secondary ml-2 text-xs md:text-sm tracking-widest font-normal">HOME</span>
                </span>
              </Link>

              {/* Nav Desktop */}
              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium tracking-wide transition-colors relative group ${
                      currentPage === link.page 
                        ? 'text-secondary' 
                        : 'text-primary hover:text-secondary'
                    }`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300 ${
                      currentPage === link.page ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </Link>
                ))}
              </nav>

              {/* Icons */}
              <div className="flex items-center gap-2">
                {mounted && isAuthenticated ? (
                  <button
                    onClick={onOpenAdmin}
                    className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary transition-colors px-3 py-2"
                  >
                    <User className="w-4 h-4" />
                    Admin
                  </button>
                ) : (
                  <button
                    onClick={onOpenLogin}
                    className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary transition-colors px-3 py-2"
                  >
                    <User className="w-4 h-4" />
                  </button>
                )}

                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 text-primary hover:text-secondary hover:bg-pink-50 rounded-full transition-all"
                >
                  <Search className="w-5 h-5" />
                </button>

                <Link 
                  href="/favoritos"
                  className="p-2.5 text-primary hover:text-secondary hover:bg-pink-50 rounded-full transition-all relative"
                >
                  <Heart className="w-5 h-5" />
                  {mounted && totalFavorites > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-secondary text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                      {totalFavorites}
                    </span>
                  )}
                </Link>

                <button 
                  onClick={toggleCart}
                  className="p-2.5 text-primary hover:text-secondary hover:bg-pink-50 rounded-full transition-all relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {mounted && totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-secondary text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                      {totalItems}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2.5 text-primary hover:text-secondary hover:bg-pink-50 rounded-full transition-all"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <nav className="px-4 py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-medium py-2 ${
                      currentPage === link.page ? 'text-secondary' : 'text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="border-gray-100" />
                <Link 
                  href="/favoritos"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-primary flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Favoritos ({totalFavorites})
                </Link>
                {mounted && isAuthenticated ? (
                  <>
                    <button onClick={onOpenAdmin} className="text-sm font-medium text-left text-primary">Panel Admin</button>
                    <button onClick={logout} className="text-sm font-medium text-left text-red-500">Cerrar sesion</button>
                  </>
                ) : (
                  <button onClick={onOpenLogin} className="text-sm font-medium text-left text-primary">Admin</button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}