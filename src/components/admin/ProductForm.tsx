'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { Product, Category, Badge, CATEGORIES } from '@/types';
import { useSupabaseProducts } from '@/lib/store/useSupabaseProducts';
import { useToast } from '@/components/ui/Toast';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const badges: { value: Badge; label: string }[] = [
  { value: null, label: 'Sin etiqueta' },
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'bestseller', label: 'Bestseller' },
  { value: 'exclusivo', label: 'Exclusivo' },
  { value: 'oferta', label: 'Oferta' },
];

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const { addProduct, updateProduct } = useSupabaseProducts();
  const { showToast } = useToast();
  const isEditing = !!product;
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'decoracion' as Category,
    subcategory: '',
    stock: '',
    badge: null as Badge,
    sku: '',
    material: '',
    dimensions: '',
    weight: '',
    color: '',
    tags: '',
  });

  const [images, setImages] = useState<string[]>(['', '', '', '']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentCategory = CATEGORIES.find(c => c.value === formData.category);
  const subcategories = currentCategory?.subcategories || [];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        category: product.category,
        subcategory: product.subcategory || '',
        stock: product.stock?.toString() || '',
        badge: product.badge || null,
        sku: product.sku || '',
        material: product.material || '',
        dimensions: product.dimensions || '',
        weight: product.weight || '',
        color: product.color || '',
        tags: product.tags?.join(', ') || '',
      });
      
      const productImages = product.images || (product.image ? [product.image] : []);
      const paddedImages = [...productImages, '', '', '', ''].slice(0, 4);
      setImages(paddedImages);
    }
  }, [product]);

  const handleCategoryChange = (category: Category) => {
    setFormData({ 
      ...formData, 
      category, 
      subcategory: ''
    });
  };

  const handleImageUpload = (index: number, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast('La imagen no debe superar 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImages = [...images];
      newImages[index] = reader.result as string;
      setImages(newImages);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrl = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    setImages(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = '';
    setImages(newImages);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Precio invalido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      showToast('Por favor completa los campos requeridos', 'error');
      return;
    }

    setIsLoading(true);

    const validImages = images.filter(img => img);
    const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      image: validImages[0] || undefined,
      images: validImages.length > 0 ? validImages : undefined,
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      stock: formData.stock ? parseInt(formData.stock) : 10,
      badge: formData.badge || undefined,
      sku: formData.sku.trim() || undefined,
      material: formData.material.trim() || undefined,
      dimensions: formData.dimensions.trim() || undefined,
      weight: formData.weight.trim() || undefined,
      color: formData.color.trim() || undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
    };

    try {
      if (isEditing && product) {
        await updateProduct(product.id, productData);
        showToast('Producto actualizado', 'success');
      } else {
        await addProduct(productData);
        showToast('Producto agregado', 'success');
      }

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      showToast('Error al guardar el producto', 'error');
    }

    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col">
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-primary border-b pb-2">Informacion Basica</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Nombre del producto *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary outline-none ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="Ej: Sofa Moderno 3 Cuerpos"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descripcion</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none resize-none"
              placeholder="Describe el producto..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Categoria *</label>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value as Category)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subcategoria</label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
              >
                <option value="">Sin subcategoria</option>
                {subcategories.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Etiqueta especial</label>
            <select
              value={formData.badge || ''}
              onChange={(e) => setFormData({ ...formData, badge: (e.target.value || null) as Badge })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            >
              {badges.map((badge) => (
                <option key={badge.label} value={badge.value || ''}>{badge.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-primary border-b pb-2">Precios</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Precio de venta *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary outline-none ${errors.price ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="99990"
                />
              </div>
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Precio original</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                  placeholder="149990"
                />
              </div>
              <p className="text-xs text-grey mt-1">Si hay descuento</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
              placeholder="Ej: 10"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-primary border-b pb-2">Informacion Adicional</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                placeholder="Ej: GH-SOFA-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                placeholder="Ej: Gris, Negro"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Material</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                placeholder="Ej: Madera, Tela"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Peso</label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                placeholder="Ej: 25 kg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dimensiones</label>
            <input
              type="text"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
              placeholder="Ej: 200 x 90 x 85 cm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Etiquetas (separadas por coma)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
              placeholder="Ej: sofa moderno, sala, living"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-primary border-b pb-2">
            Imagenes del Producto
          </h3>
          <p className="text-sm text-grey">Puedes agregar hasta 4 imagenes. La primera sera la principal.</p>
          
          <div className="grid grid-cols-2 gap-4">
            {images.map((img, index) => (
              <div key={index}>
                <div className={`aspect-square border-2 border-dashed rounded-xl overflow-hidden ${
                  index === 0 ? 'border-secondary' : 'border-gray-200'
                } ${!img ? 'hover:border-secondary hover:bg-secondary/5' : ''}`}>
                  {img ? (
                    <div className="relative w-full h-full group">
                      <img src={img} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-secondary text-white text-xs px-2 py-1 rounded">
                          Principal
                        </span>
                      )}
                    </div>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4">
                      <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                      <span className="text-sm text-grey text-center">
                        {index === 0 ? 'Imagen principal' : `Imagen ${index + 1}`}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">Click para subir</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(index, e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                {!img && (
                  <input
                    type="text"
                    placeholder="O pega URL de imagen"
                    onChange={(e) => handleImageUrl(index, e.target.value)}
                    className="w-full mt-2 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </form>

      <div className="p-4 border-t flex gap-3 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-white rounded-xl hover:bg-accent transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : isEditing ? 'GUARDAR CAMBIOS' : 'AGREGAR PRODUCTO'}
        </button>
      </div>
    </div>
  );
}