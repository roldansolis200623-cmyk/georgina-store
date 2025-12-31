'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Heart, ShoppingBag, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useToast } from '@/components/ui/Toast';

interface UserMenuProps {
  onOpenFavorites?: () => void;
  onOpenOrders?: () => void;
}

export function UserMenu({ onOpenFavorites, onOpenOrders }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();
  const { showToast } = useToast();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    showToast('Sesion cerrada', 'info');
  };

  if (!user) return null;

  const menuItems = [
    { icon: User, label: 'Mi Perfil', onClick: () => {} },
    { icon: Heart, label: 'Mis Favoritos', onClick: onOpenFavorites },
    { icon: ShoppingBag, label: 'Mis Pedidos', onClick: onOpenOrders },
    { icon: Settings, label: 'Configuracion', onClick: () => {} },
  ];

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full bg-light-grey dark:bg-dark-card hover:bg-secondary/10 dark:hover:bg-secondary/20 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-white font-medium text-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <ChevronDown className={`w-4 h-4 text-grey transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-card rounded-xl shadow-xl border border-light-grey dark:border-dark-border overflow-hidden z-50"
          >
            {/* User Info */}
            <div className="p-4 border-b border-light-grey dark:border-dark-border">
              <p className="font-medium text-primary dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-sm text-grey dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-primary dark:text-white hover:bg-light-grey dark:hover:bg-dark-border transition-colors"
                >
                  <item.icon className="w-4 h-4 text-grey" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-light-grey dark:border-dark-border py-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Cerrar Sesion</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
