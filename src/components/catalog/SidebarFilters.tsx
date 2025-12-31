'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CategoryConfig } from '@/types';

interface SidebarFiltersProps {
  categories: CategoryConfig[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onCategoryChange: (category: string | null) => void;
  onSubcategoryChange: (subcategory: string | null) => void;
  priceRange: [number, number];
  maxPrice: number;
  onPriceChange: (range: [number, number]) => void;
}

export function SidebarFilters({
  categories,
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  priceRange,
  maxPrice,
  onPriceChange,
}: SidebarFiltersProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([selectedCategory || '']);
  const [minPrice, setMinPrice] = useState(priceRange[0]);
  const [maxPriceValue, setMaxPriceValue] = useState(priceRange[1]);

  useEffect(() => {
    setMinPrice(priceRange[0]);
    setMaxPriceValue(priceRange[1]);
  }, [priceRange]);

  const toggleCategory = (value: string) => {
    setExpandedCategories(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    );
  };

  const handlePriceFilter = () => {
    const min = Math.min(minPrice, maxPriceValue);
    const max = Math.max(minPrice, maxPriceValue);
    onPriceChange([min, max]);
  };

  const handleMinChange = (value: number) => {
    const newMin = Math.max(0, Math.min(value, maxPrice));
    setMinPrice(newMin);
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(0, Math.min(value, maxPrice));
    setMaxPriceValue(newMax);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatInputPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: 0,
    }).format(price);
  };

  const parseInputPrice = (value: string) => {
    return parseInt(value.replace(/\D/g, '')) || 0;
  };

  // Porcentaje para el slider visual
  const minPercent = (minPrice / maxPrice) * 100;
  const maxPercent = (maxPriceValue / maxPrice) * 100;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      {/* Categorías */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-primary mb-4 tracking-wide">CATEGORÍAS</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => {
                onCategoryChange(null);
                onSubcategoryChange(null);
              }}
              className={`text-sm hover:text-secondary transition-colors ${
                selectedCategory === null ? 'text-secondary font-medium' : 'text-grey'
              }`}
            >
              Todos los productos
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.value}>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    onCategoryChange(category.value);
                    onSubcategoryChange(null);
                    if (!expandedCategories.includes(category.value)) {
                      toggleCategory(category.value);
                    }
                  }}
                  className={`text-sm hover:text-secondary transition-colors ${
                    selectedCategory === category.value ? 'text-secondary font-medium' : 'text-grey'
                  }`}
                >
                  {category.label}
                </button>
                {category.subcategories.length > 0 && (
                  <button
                    onClick={() => toggleCategory(category.value)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedCategories.includes(category.value) ? (
                      <ChevronUp className="w-4 h-4 text-grey" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-grey" />
                    )}
                  </button>
                )}
              </div>
              
              {category.subcategories.length > 0 && expandedCategories.includes(category.value) && (
                <ul className="ml-4 mt-2 space-y-1 border-l-2 border-gray-100 pl-3">
                  {category.subcategories.map((sub) => (
                    <li key={sub}>
                      <button
                        onClick={() => {
                          onCategoryChange(category.value);
                          onSubcategoryChange(sub);
                        }}
                        className={`text-sm hover:text-secondary transition-colors ${
                          selectedSubcategory === sub ? 'text-secondary font-medium' : 'text-grey'
                        }`}
                      >
                        {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-gray-200 mb-8" />

      {/* Filtro por Precio */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-primary mb-4 tracking-wide">FILTRO POR PRECIO</h3>
        
        {/* Slider Visual */}
        <div className="relative h-2 bg-gray-200 rounded-full mb-6">
          <div 
            className="absolute h-full bg-secondary rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`
            }}
          />
          
          {/* Slider Min */}
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={minPrice}
            onChange={(e) => handleMinChange(parseInt(e.target.value))}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-secondary
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-webkit-slider-thumb]:transition-transform"
          />
          
          {/* Slider Max */}
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={maxPriceValue}
            onChange={(e) => handleMaxChange(parseInt(e.target.value))}
            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-secondary
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-webkit-slider-thumb]:transition-transform"
          />
        </div>

        {/* Inputs de Precio */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1">
            <label className="block text-xs text-grey mb-1">Mínimo</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-grey text-sm">$</span>
              <input
                type="text"
                value={formatInputPrice(minPrice)}
                onChange={(e) => handleMinChange(parseInputPrice(e.target.value))}
                className="w-full pl-7 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
              />
            </div>
          </div>
          
          <span className="text-grey mt-5">—</span>
          
          <div className="flex-1">
            <label className="block text-xs text-grey mb-1">Máximo</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-grey text-sm">$</span>
              <input
                type="text"
                value={formatInputPrice(maxPriceValue)}
                onChange={(e) => handleMaxChange(parseInputPrice(e.target.value))}
                className="w-full pl-7 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
              />
            </div>
          </div>
        </div>

        {/* Precio actual seleccionado */}
        <p className="text-sm text-grey mb-4 text-center">
          {formatPrice(minPrice)} — {formatPrice(maxPriceValue)}
        </p>

        {/* Botón Filtrar */}
        <button
          onClick={handlePriceFilter}
          className="w-full px-4 py-2.5 bg-secondary text-white text-sm font-medium hover:bg-accent transition-colors rounded-lg"
        >
          APLICAR FILTRO
        </button>

        {/* Botón Limpiar */}
        {(minPrice > 0 || maxPriceValue < maxPrice) && (
          <button
            onClick={() => {
              setMinPrice(0);
              setMaxPriceValue(maxPrice);
              onPriceChange([0, maxPrice]);
            }}
            className="w-full mt-2 px-4 py-2 text-grey text-sm hover:text-secondary transition-colors"
          >
            Limpiar filtro de precio
          </button>
        )}
      </div>

      {/* Rangos rápidos */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-primary mb-4 tracking-wide">RANGOS RÁPIDOS</h3>
        <div className="space-y-2">
          {[
            { label: 'Hasta $50.000', min: 0, max: 50000 },
            { label: '$50.000 - $100.000', min: 50000, max: 100000 },
            { label: '$100.000 - $200.000', min: 100000, max: 200000 },
            { label: '$200.000 - $500.000', min: 200000, max: 500000 },
            { label: 'Más de $500.000', min: 500000, max: maxPrice },
          ].map((range) => (
            <button
              key={range.label}
              onClick={() => {
                setMinPrice(range.min);
                setMaxPriceValue(range.max);
                onPriceChange([range.min, range.max]);
              }}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                minPrice === range.min && maxPriceValue === range.max
                  ? 'bg-secondary/10 text-secondary font-medium'
                  : 'text-grey hover:bg-gray-50 hover:text-primary'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}