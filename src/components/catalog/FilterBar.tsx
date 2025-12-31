'use client';

import { motion } from 'framer-motion';
import { SearchBox } from './SearchBox';
import { CategoryFilter } from './CategoryFilter';

export function FilterBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-20 z-30 bg-light/95 backdrop-blur-md py-6 border-b border-light-grey"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {/* Search */}
          <div className="flex justify-center">
            <SearchBox />
          </div>
          
          {/* Categories */}
          <CategoryFilter />
        </div>
      </div>
    </motion.div>
  );
}