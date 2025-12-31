export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-CL').format(num);
}

export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

export function translateCategory(category: string): string {
  const translations: Record<string, string> = {
    'furniture': 'Muebles',
    'decoration': 'Decoración',
    'lighting': 'Iluminación',
    'textiles': 'Textiles',
  };
  return translations[category] || category;
}

export function translateBadge(badge: string | null): string {
  if (!badge) return '';
  const translations: Record<string, string> = {
    'New': 'Nuevo',
    'Bestseller': 'Más Vendido',
    'Exclusive': 'Exclusivo',
  };
  return translations[badge] || badge;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}