'use client';

import { Category, CATEGORIES } from '@/types';

interface CategoryFilterProps {
  selected: Category | 'all';
  onChange: (category: Category | 'all') => void;
}

const categories: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  ...CATEGORIES.map(cat => ({ value: cat.value, label: cat.label }))
];

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onChange(category.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === category.value
              ? 'bg-secondary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}