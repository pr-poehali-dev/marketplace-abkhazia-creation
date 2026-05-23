import { create } from 'zustand';
import { Product } from '@/data/products';

export type Page = 'home' | 'catalog' | 'product' | 'cart' | 'profile' | 'sellers' | 'seller' | 'bookmarks' | 'orders' | 'support' | 'admin';

interface CartItem {
  product: Product;
  quantity: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

interface StoreState {
  currentPage: Page;
  selectedProduct: Product | null;
  selectedSellerId: number | null;
  cartItems: CartItem[];
  bookmarks: number[];
  isCartOpen: boolean;
  isLoggedIn: boolean;
  user: User | null;
  searchQuery: string;
  selectedCategory: string;
  selectedRegion: string;

  setPage: (page: Page) => void;
  setSelectedProduct: (product: Product | null) => void;
  setSelectedSellerId: (id: number | null) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleBookmark: (productId: number) => void;
  setCartOpen: (open: boolean) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (c: string) => void;
  setSelectedRegion: (r: string) => void;

  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useStore = create<StoreState>((set, get) => ({
  currentPage: 'home',
  selectedProduct: null,
  selectedSellerId: null,
  cartItems: [],
  bookmarks: [],
  isCartOpen: false,
  isLoggedIn: false,
  user: null,
  searchQuery: '',
  selectedCategory: '',
  selectedRegion: '',

  setPage: (page) => set({ currentPage: page }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setSelectedSellerId: (id) => set({ selectedSellerId: id }),

  addToCart: (product) => set((state) => {
    const existing = state.cartItems.find(i => i.product.id === product.id);
    if (existing) {
      return {
        cartItems: state.cartItems.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      };
    }
    return { cartItems: [...state.cartItems, { product, quantity: 1 }] };
  }),

  removeFromCart: (productId) => set((state) => ({
    cartItems: state.cartItems.filter(i => i.product.id !== productId)
  })),

  updateQuantity: (productId, quantity) => set((state) => {
    if (quantity <= 0) {
      return { cartItems: state.cartItems.filter(i => i.product.id !== productId) };
    }
    return {
      cartItems: state.cartItems.map(i =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    };
  }),

  clearCart: () => set({ cartItems: [] }),

  toggleBookmark: (productId) => set((state) => ({
    bookmarks: state.bookmarks.includes(productId)
      ? state.bookmarks.filter(id => id !== productId)
      : [...state.bookmarks, productId]
  })),

  setCartOpen: (open) => set({ isCartOpen: open }),

  login: (email, _password) => set({
    isLoggedIn: true,
    user: {
      id: 1,
      name: 'Аслан Кварчия',
      email,
      phone: '+7 (940) 123-45-67',
      avatar: '👤',
    }
  }),

  logout: () => set({ isLoggedIn: false, user: null }),

  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedCategory: (c) => set({ selectedCategory: c }),
  setSelectedRegion: (r) => set({ selectedRegion: r }),

  getTotalPrice: () => {
    return get().cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },

  getTotalItems: () => {
    return get().cartItems.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
