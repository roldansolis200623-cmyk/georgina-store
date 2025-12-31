import { create } from 'zustand';
import { Product, DeletedProduct, Category, SortCriteria, Session } from '@/types';

const SESSION_TIMEOUT = 3600000; // 1 hora
const SESSION_KEY = 'georgina_admin_session';
const PRODUCTS_KEY = 'georgina_products';
const TRASH_KEY = 'georgina_trash';

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Sofa Moderno 3 Cuerpos',
    category: 'muebles',
    price: 899990,
    originalPrice: 1199990,
    description: 'Elegante sofa de 3 cuerpos con diseno moderno. Tapizado en tela premium color gris.',
    badge: 'bestseller',
    stock: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Lampara Colgante Dorada',
    category: 'decoracion',
    price: 159990,
    description: 'Lampara colgante con acabado en oro mate. Perfecta para comedores y living.',
    badge: 'nuevo',
    stock: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Espejo Decorativo Circular',
    category: 'decoracion',
    price: 79990,
    originalPrice: 99990,
    description: 'Espejo circular con marco de metal dorado. Diametro 60cm.',
    badge: 'oferta',
    stock: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Mesa de Centro Madera',
    category: 'muebles',
    price: 249990,
    description: 'Mesa de centro en madera de roble con patas metalicas negras.',
    stock: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Set de Jarrones Ceramica',
    category: 'decoracion',
    price: 45990,
    description: 'Set de 3 jarrones de ceramica en tonos neutros. Incluye 3 tamanos.',
    badge: 'nuevo',
    stock: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'Camilla Profesional',
    category: 'lashroom',
    price: 189990,
    originalPrice: 239990,
    description: 'Camilla profesional para tratamientos de belleza. Altura ajustable.',
    badge: 'oferta',
    stock: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 7,
    name: 'Sillon Individual Nordico',
    category: 'muebles',
    price: 349990,
    description: 'Sillon individual con diseno nordico. Tela boucle color crema.',
    badge: 'exclusivo',
    stock: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 8,
    name: 'Cuadro Abstracto Grande',
    category: 'decoracion',
    price: 129990,
    description: 'Cuadro abstracto en tonos rosa y dorado. Medidas 100x80cm.',
    stock: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 9,
    name: 'Lampara Aro Lashroom',
    category: 'lashroom',
    price: 69990,
    description: 'Lampara de aro LED profesional para lashroom. Luz fria y calida.',
    badge: 'nuevo',
    stock: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 10,
    name: 'Mesa Comedor 6 Personas',
    category: 'muebles',
    price: 599990,
    originalPrice: 749990,
    description: 'Mesa de comedor rectangular para 6 personas. Madera y metal.',
    badge: 'oferta',
    stock: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 11,
    name: 'Reloj de Pared Vintage',
    category: 'decoracion',
    price: 54990,
    description: 'Reloj de pared estilo vintage con numeros romanos. Diametro 40cm.',
    stock: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 12,
    name: 'Organizador Lashroom',
    category: 'lashroom',
    price: 49990,
    description: 'Organizador acrilico para herramientas de lashroom. 5 compartimentos.',
    stock: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface ProductStore {
  products: Product[];
  trash: DeletedProduct[];
  isAuthenticated: boolean;
  searchQuery: string;
  categoryFilter: Category | 'all';
  isLoaded: boolean;
  
  addProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: number, data: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  duplicateProduct: (id: number) => void;
  restoreProduct: (id: number) => void;
  emptyTrash: () => void;
  
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: Category | 'all') => void;
  getFilteredProducts: () => Product[];
  
  sortProducts: (criteria: SortCriteria) => void;
  
  login: (password: string) => boolean;
  logout: () => void;
  checkSession: () => void;
  
  exportToJSON: () => string;
  importFromJSON: (json: string) => { success: boolean; count?: number; error?: string };
  
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  trash: [],
  isAuthenticated: false,
  searchQuery: '',
  categoryFilter: 'all',
  isLoaded: false,

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedProducts = localStorage.getItem(PRODUCTS_KEY);
      const savedTrash = localStorage.getItem(TRASH_KEY);
      
      set({
        products: savedProducts ? JSON.parse(savedProducts) : initialProducts,
        trash: savedTrash ? JSON.parse(savedTrash) : [],
        isLoaded: true,
      });
      
      get().checkSession();
    } catch (error) {
      console.error('Error loading from storage:', error);
      set({ products: initialProducts, isLoaded: true });
    }
  },

  saveToStorage: () => {
    if (typeof window === 'undefined') return;
    
    const { products, trash } = get();
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    localStorage.setItem(TRASH_KEY, JSON.stringify(trash));
  },

  addProduct: (data) => {
    const newProduct: Product = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set((state) => ({
      products: [...state.products, newProduct],
    }));
    
    get().saveToStorage();
  },

  updateProduct: (id, data) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id
          ? { ...p, ...data, updatedAt: new Date().toISOString() }
          : p
      ),
    }));
    
    get().saveToStorage();
  },

  deleteProduct: (id) => {
    const product = get().products.find((p) => p.id === id);
    if (!product) return;

    const deletedProduct: DeletedProduct = {
      ...product,
      deletedAt: new Date().toISOString(),
    };

    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
      trash: [...state.trash, deletedProduct],
    }));
    
    get().saveToStorage();
  },

  duplicateProduct: (id) => {
    const product = get().products.find((p) => p.id === id);
    if (!product) return;

    const duplicated: Product = {
      ...product,
      id: Date.now(),
      name: `${product.name} (Copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      products: [...state.products, duplicated],
    }));
    
    get().saveToStorage();
  },

  restoreProduct: (id) => {
    const product = get().trash.find((p) => p.id === id);
    if (!product) return;

    const { deletedAt, ...restoredProduct } = product;

    set((state) => ({
      trash: state.trash.filter((p) => p.id !== id),
      products: [...state.products, restoredProduct as Product],
    }));
    
    get().saveToStorage();
  },

  emptyTrash: () => {
    set({ trash: [] });
    get().saveToStorage();
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),

  getFilteredProducts: () => {
    const { products, searchQuery, categoryFilter } = get();
    
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        categoryFilter === 'all' || product.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  },

  sortProducts: (criteria) => {
    set((state) => {
      const sorted = [...state.products].sort((a, b) => {
        switch (criteria) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'date-asc':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'date-desc':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          default:
            return 0;
        }
      });
      
      return { products: sorted };
    });
    
    get().saveToStorage();
  },

  login: (password) => {
    if (password === 'Stein272316$') {
      const session: Session = {
        timestamp: Date.now(),
        expiresAt: Date.now() + SESSION_TIMEOUT,
      };
      
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    sessionStorage.removeItem(SESSION_KEY);
    set({ isAuthenticated: false });
  },

  checkSession: () => {
    if (typeof window === 'undefined') return;
    
    try {
      const sessionData = sessionStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const session: Session = JSON.parse(sessionData);
        if (Date.now() < session.expiresAt) {
          set({ isAuthenticated: true });
        } else {
          sessionStorage.removeItem(SESSION_KEY);
          set({ isAuthenticated: false });
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  },

  exportToJSON: () => {
    const { products } = get();
    return JSON.stringify(products, null, 2);
  },

  importFromJSON: (json) => {
    try {
      const parsed = JSON.parse(json);
      
      if (!Array.isArray(parsed)) {
        return { success: false, error: 'El archivo debe contener un array de productos' };
      }
      
      for (const item of parsed) {
        if (!item.name || !item.category || typeof item.price !== 'number') {
          return { success: false, error: 'Estructura de producto invalida' };
        }
      }
      
      const importedProducts: Product[] = parsed.map((p: Partial<Product>) => ({
        ...p,
        id: Date.now() + Math.random(),
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })) as Product[];
      
      set({ products: importedProducts });
      get().saveToStorage();
      
      return { success: true, count: importedProducts.length };
    } catch {
      return { success: false, error: 'JSON invalido' };
    }
  },
}));
