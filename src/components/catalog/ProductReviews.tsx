'use client';

import { useState } from 'react';
import { Star, User } from 'lucide-react';
import { useReviewStore } from '@/lib/store/useReviewStore';
import { useToast } from '@/components/ui/Toast';

interface ProductReviewsProps {
  productId: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { reviews, addReview, getProductReviews, getAverageRating } = useReviewStore();
  const { showToast } = useToast();
  
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');

  const productReviews = getProductReviews(productId);
  const averageRating = getAverageRating(productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      showToast('Ingresa tu nombre', 'error');
      return;
    }
    if (!comment.trim()) {
      showToast('Escribe un comentario', 'error');
      return;
    }

    addReview({
      productId,
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
    });

    showToast('¡Gracias por tu reseña!', 'success');
    setUserName('');
    setComment('');
    setRating(5);
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (value: number, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
            disabled={!interactive}
          >
            <Star
              className={`${size} ${
                star <= (interactive ? (hoverRating || rating) : value)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Resumen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-primary">
            {averageRating > 0 ? averageRating.toFixed(1) : '—'}
          </div>
          <div>
            {renderStars(averageRating)}
            <p className="text-sm text-grey mt-1">
              {productReviews.length} {productReviews.length === 1 ? 'reseña' : 'reseñas'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-accent transition-colors"
        >
          Escribir reseña
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-8">
          <h4 className="font-medium text-primary mb-4">Tu reseña</h4>
          
          <div className="mb-4">
            <label className="block text-sm text-grey mb-2">Calificación</label>
            {renderStars(rating, true, 'w-8 h-8')}
          </div>

          <div className="mb-4">
            <label className="block text-sm text-grey mb-2">Tu nombre *</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
              placeholder="Ej: María González"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-grey mb-2">Comentario *</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none resize-none"
              placeholder="¿Qué te pareció el producto?"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-accent transition-colors"
            >
              Enviar reseña
            </button>
          </div>
        </form>
      )}

      {/* Lista de reseñas */}
      {productReviews.length > 0 ? (
        <div className="space-y-6">
          {productReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                    <span className="font-medium text-primary">{review.userName}</span>
                    {renderStars(review.rating, false, 'w-4 h-4')}
                  </div>
                  <p className="text-grey mb-2">{review.comment}</p>
                  <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-8 text-grey">
            <p>No hay reseñas aún.</p>
            <p className="text-sm">¡Sé el primero en opinar!</p>
          </div>
        )
      )}
    </div>
  );
}