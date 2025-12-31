'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  Download,
  Upload,
  ArrowUpDown,
  ChevronLeft,
} from 'lucide-react';
import { Product } from '@/types';
import { useProductStore } from '@/lib/store/useProductStore';
import { Button } from '@/components/ui/Button';
import { StatsCards } from './StatsCards';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';
import { TrashModal } from './TrashModal';
import { SortModal } from './SortModal';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type View = 'list' | 'form';

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [view, setView] = useState<View>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { exportToJSON, importFromJSON, trash } = useProductStore();

  const handleAddNew = () => {
    setSelectedProduct(null);
    setView('form');
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setView('form');
  };

  const handleCloseForm = () => {
    setSelectedProduct(null);
    setView('list');
  };

  const handleExport = () => {
    const json = exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `georgina-catalogo-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      const result = importFromJSON(json);
      
      if (result.success) {
        alert(`Se importaron ${result.count} productos correctamente.`);
      } else {
        alert(`Error: ${result.error}`);
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-light-grey px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  {view === 'form' && (
                    <button
                      onClick={handleCloseForm}
                      className="p-2 rounded-full hover:bg-light-grey transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-grey" />
                    </button>
                  )}
                  <h2 className="font-playfair text-xl font-bold text-primary">
                    {view === 'list' 
                      ? 'Panel Admin' 
                      : selectedProduct 
                        ? 'Editar Producto' 
                        : 'Nuevo Producto'
                    }
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-light-grey transition-colors"
                >
                  <X className="w-5 h-5 text-grey" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {view === 'list' ? (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {/* Stats */}
                      <StatsCards />

                      {/* Actions Bar */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <Button onClick={handleAddNew} size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar
                        </Button>
                        <Button onClick={() => setIsSortOpen(true)} variant="outline" size="sm">
                          <ArrowUpDown className="w-4 h-4 mr-1" />
                          Ordenar
                        </Button>
                        <Button 
                          onClick={() => setIsTrashOpen(true)} 
                          variant="outline" 
                          size="sm"
                          className="relative"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Papelera
                          {trash.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                              {trash.length}
                            </span>
                          )}
                        </Button>
                      </div>

                      <div className="flex gap-2 mb-6">
                        <Button onClick={handleExport} variant="ghost" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-1" />
                          Exportar
                        </Button>
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          variant="ghost"
                          size="sm"
                          className="flex-1"
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Importar
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".json"
                          onChange={handleImport}
                          className="hidden"
                        />
                      </div>

                      {/* Product List */}
                      <ProductList onEdit={handleEdit} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <ProductForm
                        product={selectedProduct}
                        onClose={handleCloseForm}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <TrashModal isOpen={isTrashOpen} onClose={() => setIsTrashOpen(false)} />
      <SortModal isOpen={isSortOpen} onClose={() => setIsSortOpen(false)} />
    </>
  );
}