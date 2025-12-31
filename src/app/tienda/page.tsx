'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Grid3X3, Grid2X2, LayoutGrid, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SidebarFilters } from '@/components/catalog/SidebarFilters';
import { ProductCardHomeline } from '@/components/catalog/ProductCardHomeline';
import { SortSelect, SortOption } from '@/components/catalog/SortSelect';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartButton } from '@/components/cart/CartButton';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { LoginModal } from '@/components/auth/LoginModal';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { ProductModal } from '@/components/catalog/ProductModal';
import { useProductStore } from '@/lib/store/useProductStore';
import { useReviewStore } from '@/lib/store/useReviewStore';
import { CATEGORIES } from '@/types';
import { Product } from '@/types';

function TiendaContent() {
  const searchParams = useSearchParams();
  const { products, loadFromStorage } = useProductStore();
  const { getAverageRating } = useReviewStore();
  const [mounted, setMounted] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  
  const [gridCols, setGridCols] = useState(4);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    const categoria = searchParams.get('categoria');
    const subcategoria = searchParams.get('subcategoria');
    const buscar = searchParams.get('buscar');
    if (categoria) setSelectedCategory(categoria);
    if (subcategoria) setSelectedSubcategory(subcategoria);
    if (buscar) setSearchQuery(buscar);
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, priceRange, searchQuery, itemsPerPage, sortBy]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      if (selectedCategory) {
        if (product.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }
      if (selectedSubcategory) {
        if (product.subcategory?.toLowerCase() !== selectedSubcategory.toLowerCase()) return false;
      }
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesSubcategory = product.subcategory?.toLowerCase().includes(query);
        const matchesDescription = product.description?.toLowerCase().includes(query);
        const matchesTags = product.tags?.some(tag => tag.toLowerCase().includes(query));
        if (!matchesName && !matchesCategory && !matchesSubcategory && !matchesDescription && !matchesTags) return false;
      }
      return true;
    });

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        filtered.sort((a, b) => getAverageRating(b.id) - getAverageRating(a.id));
        break;
      default:
        filtered.sort((a, b) => {
          if (a.badge === 'bestseller' && b.badge !== 'bestseller') return -1;
          if (b.badge === 'bestseller' && a.badge !== 'bestseller') return 1;
          if (a.badge === 'nuevo' && b.badge !== 'nuevo') return -1;
          if (b.badge === 'nuevo' && a.badge !== 'nuevo') return 1;
          return 0;
        });
    }

    return filtered;
  }, [products, selectedCategory, selectedSubcategory, priceRange, searchQuery, sortBy, getAverageRating]);

  const maxPrice = useMemo(() => {
    return Math.max(...products.map(p => p.price), 2000000);
  }, [products]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentPage="tienda"
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <div className="bg-gradient-to-r from-pink-50 to-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-grey mb-2">
            <a href="/" className="hover:text-secondary transition-colors">Inicio</a>
            <span className="mx-2">/</span>
            <span className="text-primary font-medium">Tienda</span>
            {selectedCategory && (
              <>
                <span className="mx-2">/</span>
                <span className="text-primary font-medium capitalize">{selectedCategory}</span>
              </>
            )}
            {selectedSubcategory && (
              <>
                <span className="mx-2">/</span>
                <span className="text-primary font-medium">{selectedSubcategory}</span>
              </>
            )}
          </nav>
          <h1 className="font-playfair text-3xl text-primary">
            {selectedCategory ? (
              <span className="capitalize">{selectedCategory}</span>
            ) : (
              'Nuestra Tienda'
            )}
          </h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-pink-50 text-primary rounded-full text-sm font-medium hover:bg-pink-100 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </button>

          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/50" 
                onClick={() => setShowMobileFilters(false)} 
              />
              <motion.div 
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                className="absolute left-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-primary">Filtros</h2>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <SidebarFilters
                  categories={CATEGORIES}
                  selectedCategory={selectedCategory}
                  selectedSubcategory={selectedSubcategory}
                  onCategoryChange={handleCategoryChange}
                  onSubcategoryChange={setSelectedSubcategory}
                  priceRange={priceRange}
                  maxPrice={maxPrice}
                  onPriceChange={setPriceRange}
                />
              </motion.div>
            </div>
          )}

          <div className="hidden lg:block">
            <SidebarFilters
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              onCategoryChange={handleCategoryChange}
              onSubcategoryChange={setSelectedSubcategory}
              priceRange={priceRange}
              maxPrice={maxPrice}
              onPriceChange={setPriceRange}
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
              <p className="text-sm text-grey">
                Mostrando {filteredAndSortedProducts.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, filteredAndSortedProducts.length)} de {filteredAndSortedProducts.length} productos
              </p>

              <div className="flex items-center gap-4">
                <SortSelect value={sortBy} onChange={setSortBy} />

                <div className="hidden sm:flex items-center gap-2 text-sm text-grey">
                  <span>ver:</span>
                  {[12, 24, 36].map((num) => (
                    <button
                      key={num}
                      onClick={() => setItemsPerPage(num)}
                      className={`px-2 py-1 rounded transition-colors ${
                        itemsPerPage === num 
                          ? 'bg-secondary text-white' 
                          : 'hover:bg-pink-50'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
                  {[
                    { cols: 4, icon: Grid3X3 },
                    { cols: 3, icon: LayoutGrid },
                    { cols: 2, icon: Grid2X2 },
                  ].map(({ cols, icon: Icon }) => (
                    <button
                      key={cols}
                      onClick={() => setGridCols(cols)}
                      className={`p-2 rounded-lg transition-colors ${
                        gridCols === cols 
                          ? 'bg-secondary text-white' 
                          : 'hover:bg-pink-50 text-grey'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {searchQuery && (
              <div className="mb-6 flex items-center gap-2">
                <span className="text-grey">Resultados para:</span>
                <span className="bg-pink-100 text-secondary px-4 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
                  &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery('')} className="hover:text-accent">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              </div>
            )}

            {paginatedProducts.length > 0 ? (
              <>
                <div
                  className={`grid gap-6 ${
                    gridCols === 4
                      ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                      : gridCols === 3
                      ? 'grid-cols-2 md:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2'
                  }`}
                >
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <ProductCardHomeline
                        product={product}
                        onQuickView={handleQuickView}
                      />
                    </motion.div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2.5 rounded-full border border-gray-200 hover:bg-pink-50 hover:border-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-full font-medium transition-all ${
                          currentPage === page
                            ? 'bg-secondary text-white'
                            : 'border border-gray-200 hover:bg-pink-50 hover:border-secondary'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2.5 rounded-full border border-gray-200 hover:bg-pink-50 hover:border-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SlidersHorizontal className="w-10 h-10 text-secondary" />
                </div>
                <p className="text-grey text-lg mb-4">No se encontraron productos</p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                    setPriceRange([0, maxPrice]);
                    setSearchQuery('');
                    setSortBy('featured');
                  }}
                  className="text-secondary hover:text-accent font-medium hover:underline"
                >
                  Limpiar todos los filtros
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
      <CartButton />
      <CartDrawer />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}

export default function TiendaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    }>
      <TiendaContent />
    </Suspense>
  );
}