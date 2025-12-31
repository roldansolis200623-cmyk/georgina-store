'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useProductStore } from '@/lib/store/useProductStore';
import { cn } from '@/lib/utils/cn';

export function SearchBox() {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 300);
  const { setSearchQuery } = useProductStore();

  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  const handleClear = () => {
    setValue('');
    setSearchQuery('');
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar productos..."
        className={cn(
          'w-full pl-12 pr-12 py-3 rounded-full border-2 border-light-grey bg-white',
          'font-poppins text-primary placeholder:text-grey/50',
          'focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20',
          'transition-all duration-300'
        )}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-light-grey transition-colors"
        >
          <X className="w-4 h-4 text-grey" />
        </button>
      )}
    </div>
  );
}