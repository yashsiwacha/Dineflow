'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  isVegetarian: boolean;
  specialInstructions?: string;
  imageUrl: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  updateInstructions: (menuItemId: string, instructions: string) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  total: number;
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  setOrderType: (type: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY') => void;
  tableNumber: number | null;
  setTableNumber: (table: number | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>('TAKEAWAY');
  const [tableNumber, setTableNumber] = useState<number | null>(null);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('dineflow_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        // Clear corrupt storage
        localStorage.removeItem('dineflow_cart');
      }
    }
    const savedOrderType = localStorage.getItem('dineflow_order_type');
    if (savedOrderType) {
      setOrderType(savedOrderType as any);
    }
  }, []);

  // Save cart to LocalStorage on modification
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('dineflow_cart', JSON.stringify(items));
  };

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    const existing = cartItems.find(i => i.menuItemId === newItem.menuItemId);
    if (existing) {
      saveCart(cartItems.map(i =>
        i.menuItemId === newItem.menuItemId ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      saveCart([...cartItems, { ...newItem, quantity: 1 }]);
    }
  };

  const removeFromCart = (menuItemId: string) => {
    saveCart(cartItems.filter(i => i.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    saveCart(cartItems.map(i =>
      i.menuItemId === menuItemId ? { ...i, quantity } : i
    ));
  };

  const updateInstructions = (menuItemId: string, instructions: string) => {
    saveCart(cartItems.map(i =>
      i.menuItemId === menuItemId ? { ...i, specialInstructions: instructions } : i
    ));
  };

  const clearCart = () => {
    saveCart([]);
    localStorage.removeItem('dineflow_cart');
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% GST
  const deliveryCharge = orderType === 'DELIVERY' && subtotal > 0 ? 50 : 0; // Flat INR 50 delivery fee
  const total = subtotal + tax + deliveryCharge;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateInstructions,
      clearCart,
      subtotal,
      tax,
      deliveryCharge,
      total,
      orderType,
      setOrderType: (type) => {
        setOrderType(type);
        localStorage.setItem('dineflow_order_type', type);
      },
      tableNumber,
      setTableNumber
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
