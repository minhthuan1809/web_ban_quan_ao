import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartState } from '../../../types/cart';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      cartCount: 0,
      
      setCartItems: (items) => {
        set({ cartItems: items });
        get().updateCartCount();
      },
      
      updateCartCount: () => {
        const { cartItems } = get();
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        set({ cartCount: count });
      },
      
      addToCart: (newItem) => {
        const { cartItems } = get();
        const existingItemIndex = cartItems.findIndex(item => item.id === newItem.id);
        
        if (existingItemIndex >= 0) {
          // Nếu sản phẩm đã tồn tại, cập nhật số lượng
          const updatedItems = [...cartItems];
          updatedItems[existingItemIndex].quantity += newItem.quantity;
          set({ cartItems: updatedItems });
        } else {
          // Nếu sản phẩm chưa tồn tại, thêm mới
          set({ cartItems: [...cartItems, newItem] });
        }
        get().updateCartCount();
      },
      
      removeFromCart: (itemId) => {
        const { cartItems } = get();
        const updatedItems = cartItems.filter(item => item.id !== itemId);
        set({ cartItems: updatedItems });
        get().updateCartCount();
      },
      
      updateQuantity: (itemId, quantity) => {
        const { cartItems } = get();
        const updatedItems = cartItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        set({ cartItems: updatedItems });
        get().updateCartCount();
      },
      
      clearCart: () => {
        set({ cartItems: [], cartCount: 0 });
      }
    }),
    {
      name: 'tempOrderData',
      partialize: (state) => ({
        cartItems: state.cartItems,
        cartCount: state.cartCount
      })
    }
  )
); 