'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuthStore();
  const { showToast } = useToast();

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      
      if (mode === 'register') {
        result = register(name, email, password);
      } else {
        result = login(email, password);
      }

      if (result.success) {
        showToast(result.message, 'success');
        resetForm();
        onClose();
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Ocurrio un error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="relative bg-gradient-to-r from-secondary to-accent p-6 text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    {mode === 'login' ? (
                      <LogIn className="w-6 h-6" />
                    ) : (
                      <UserPlus className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-playfair text-2xl font-bold">
                      {mode === 'login' ? 'Iniciar Sesion' : 'Crear Cuenta'}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {mode === 'login' 
                        ? 'Accede a tu cuenta' 
                        : 'Unete a Georgina Store'}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-grey dark:text-gray-300 mb-2">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-light-grey dark:border-dark-border bg-white dark:bg-dark focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-primary dark:text-white"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-grey dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-light-grey dark:border-dark-border bg-white dark:bg-dark focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-primary dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-grey dark:text-gray-300 mb-2">
                    Contrasena
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-light-grey dark:border-dark-border bg-white dark:bg-dark focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-primary dark:text-white"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-light-grey dark:hover:bg-dark-border rounded-full transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-grey" />
                      ) : (
                        <Eye className="w-5 h-5 text-grey" />
                      )}
                    </button>
                  </div>
                  {mode === 'register' && (
                    <p className="text-xs text-grey mt-1">Minimo 6 caracteres</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Procesando...
                    </span>
                  ) : mode === 'login' ? (
                    'Iniciar Sesion'
                  ) : (
                    'Crear Cuenta'
                  )}
                </Button>

                <div className="text-center pt-4 border-t border-light-grey dark:border-dark-border">
                  <p className="text-grey dark:text-gray-400">
                    {mode === 'login' ? (
                      <>
                        No tienes cuenta?{' '}
                        <button
                          type="button"
                          onClick={switchMode}
                          className="text-secondary hover:text-accent font-medium"
                        >
                          Registrate
                        </button>
                      </>
                    ) : (
                      <>
                        Ya tienes cuenta?{' '}
                        <button
                          type="button"
                          onClick={switchMode}
                          className="text-secondary hover:text-accent font-medium"
                        >
                          Inicia sesion
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
