'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useProductStore } from '@/lib/store/useProductStore';
import { translateCategory } from '@/lib/utils/formatters';

interface TrashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrashModal({ isOpen, onClose }: TrashModalProps) {
  const { trash, restoreProduct, emptyTrash } = useProductStore();

  const handleEmptyTrash = () => {
    if (window.confirm('¿Estás seguro? Esta acción no se puede deshacer.')) {
      if (window.confirm('⚠️ ÚLTIMA ADVERTENCIA: Se eliminarán PERMANENTEMENTE todos los productos de la papelera.')) {
        emptyTrash();
        onClose();
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🗑️ Papelera" size="lg">
      {trash.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-light-grey rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-10 h-10 text-grey/40" />
          </div>
          <h3 className="font-playfair text-xl font-bold text-primary mb-2">
            Papelera vacía
          </h3>
          <p className="text-grey">
            Los productos eliminados aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Warning */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-orange-800">
                {trash.length} producto{trash.length !== 1 ? 's' : ''} en la papelera
              </p>
              <p className="text-sm text-orange-600">
                Puedes restaurarlos o eliminarlos permanentemente.
              </p>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto space-y-2">
            <AnimatePresence>
              {trash.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between bg-light rounded-xl p-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-grey">
                      {translateCategory(product.category)} • Eliminado: {formatDate(product.deletedAt)}
                    </p>
                  </div>
                  <Button
                    onClick={() => restoreProduct(product.id)}
                    variant="outline"
                    size="sm"
                    className="ml-4 flex-shrink-0"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Restaurar
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty Trash Button */}
          <div className="pt-4 border-t border-light-grey">
            <Button
              onClick={handleEmptyTrash}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Vaciar Papelera Permanentemente
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}