export interface CartVariant {
  id: number;
  size: {
    id: number;
    name: string;
  };
  color: {
    id: number;
    name: string;
    hexColor: string;
  };
  product: {
    id: number;
    name: string;
    code: string;
    price: number;
    salePrice?: number;
    imageUrls: string[];
    season: string;
    category: {
      id: number;
      name: string;
    };
    team: {
      id: number;
      name: string;
      league: string;
    };
    material: {
      id: number;
      name: string;
    };
  };
  priceAdjustment: number;
  stockQuantity: number;
}

export interface CartItem {
  id: number;
  quantity: number;
  variant: CartVariant;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cart {
  id: number;
  userId: number;
  cartItems: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartState {
  cartItems: CartItem[];
  cartCount: number;
  setCartItems: (items: CartItem[]) => void;
  updateCartCount: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
} 