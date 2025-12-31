import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  
  category: z.enum(['furniture', 'decoration', 'lighting', 'textiles'], {
    errorMap: () => ({ message: 'Debes seleccionar una categoría válida' })
  }),
  
  price: z
    .number({ invalid_type_error: 'El precio debe ser un número' })
    .positive('El precio debe ser mayor a 0')
    .max(999999999, 'El precio es demasiado alto'),
  
  originalPrice: z
    .number({ invalid_type_error: 'El precio original debe ser un número' })
    .positive('El precio original debe ser mayor a 0')
    .optional()
    .nullable(),
  
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede superar 500 caracteres'),
  
  badge: z
    .enum(['New', 'Bestseller', 'Exclusive'])
    .nullable()
    .optional(),
  
  stock: z
    .number({ invalid_type_error: 'El stock debe ser un número' })
    .int('El stock debe ser un número entero')
    .nonnegative('El stock no puede ser negativo')
    .nullable()
    .optional(),
  
  image: z
    .string()
    .optional()
    .nullable(),
    
  hasOffer: z.boolean().default(false),
  
}).refine(
  (data) => {
    if (data.hasOffer && data.originalPrice) {
      return data.originalPrice > data.price;
    }
    return true;
  },
  {
    message: 'El precio original debe ser mayor al precio de oferta',
    path: ['originalPrice'],
  }
).refine(
  (data) => {
    if (data.hasOffer && !data.originalPrice) {
      return false;
    }
    return true;
  },
  {
    message: 'Debes ingresar un precio original para aplicar la oferta',
    path: ['originalPrice'],
  }
);

export type ProductFormSchema = z.infer<typeof productSchema>;