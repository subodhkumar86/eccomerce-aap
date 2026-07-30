import React, { createContext, useContext, useState } from 'react';
import { Product, MOCK_PRODUCTS } from '@/constants/MockData';

export interface CartItemType {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItemType[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export interface ToastType {
  message: string;
  type: 'success' | 'info' | 'error';
  visible: boolean;
}

interface StoreContextType {
  cart: CartItemType[];
  wishlist: Product[];
  orders: Order[];
  toast: ToastType;
  addToCart: (product: Product, quantity: number, color: string, size?: string) => void;
  removeFromCart: (productId: string, color: string, size?: string) => void;
  updateQuantity: (productId: string, color: string, size: string | undefined, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  clearCart: () => void;
  addOrder: (items: CartItemType[], total: number) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'LC-892014',
      date: '7/26/2026',
      status: 'Shipped',
      total: 394,
      items: [
        {
          product: MOCK_PRODUCTS[0], // Aura Sound Pro
          quantity: 1,
          selectedColor: '#000000',
        },
        {
          product: MOCK_PRODUCTS[5], // Luxe Drip Coffee Brew
          quantity: 1,
          selectedColor: '#78350F',
        }
      ]
    },
    {
      id: 'LC-582910',
      date: '7/28/2026',
      status: 'Processing',
      total: 79,
      items: [
        {
          product: MOCK_PRODUCTS[32], // Ergo Leather Desk Pad
          quantity: 1,
          selectedColor: '#78350F',
        }
      ]
    },
    {
      id: 'LC-401289',
      date: '6/18/2026',
      status: 'Delivered',
      total: 189,
      items: [
        {
          product: MOCK_PRODUCTS[3], // Keystone Mechanical Board
          quantity: 1,
          selectedColor: '#1F2937',
        }
      ]
    },
    {
      id: 'LC-192038',
      date: '7/10/2026',
      status: 'Delivered',
      total: 149,
      items: [
        {
          product: MOCK_PRODUCTS[4], // AeroBuds Sleek
          quantity: 1,
          selectedColor: '#ffffff',
        }
      ]
    }
  ]);
  const [toast, setToast] = useState<ToastType>({ message: '', type: 'success', visible: false });

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type, visible: true });
    // Reset after animation duration
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2800);
  };

  const addToCart = (product: Product, quantity: number, color: string, size?: string) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }

      return [...prevCart, { product, quantity, selectedColor: color, selectedSize: size }];
    });
    showToast(`Added ${product.name} to Cart`, 'success');
  };

  const removeFromCart = (productId: string, color: string, size?: string) => {
    const item = cart.find(
      (i) =>
        i.product.id === productId &&
        i.selectedColor === color &&
        i.selectedSize === size
    );
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
    if (item) {
      showToast(`Removed ${item.product.name} from Cart`, 'info');
    }
  };

  const updateQuantity = (productId: string, color: string, size: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId &&
        item.selectedColor === color &&
        item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const toggleWishlist = (product: Product) => {
    let isAdded = false;
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id);
      if (exists) {
        isAdded = false;
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      isAdded = true;
      return [...prevWishlist, product];
    });

    // Timeout to coordinate message state
    setTimeout(() => {
      showToast(
        isAdded ? `Saved ${product.name} to Wishlist` : `Removed ${product.name} from Wishlist`,
        isAdded ? 'success' : 'info'
      );
    }, 50);
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (items: CartItemType[], total: number) => {
    const newOrder: Order = {
      id: `LC-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      items,
      total,
      status: 'Processing',
    };
    setOrders((prev) => [newOrder, ...prev]);
    showToast('Payment Completed! Order Placed.', 'success');
  };

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        toast,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        clearCart,
        addOrder,
        showToast,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
