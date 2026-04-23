
'use client';

import { useState, useEffect } from 'react';
import type { User, Product, CartItem, Order } from './types';
import { PlaceHolderImages } from './placeholder-images';

// Note: Products are now primarily fetched from Firestore, 
// but we keep MOCK_PRODUCTS as a fallback or initial state if needed.
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    sellerId: 's1',
    categoryId: 'crafts',
    name: 'Handcrafted Jebena Coffee Pot',
    description: 'Authentic clay coffee pot made by artisans in Jimma.',
    price: 850,
    comparePrice: 1200,
    stock: 15,
    images: [PlaceHolderImages.find(img => img.id === 'jebena')?.imageUrl || 'https://picsum.photos/seed/jebena/600/600'],
    rating: 4.8,
    reviewCount: 24,
    featured: true,
    status: 'approved'
  },
  {
    id: 'p2',
    sellerId: 's1',
    categoryId: 'fashion',
    name: 'Habesha Kemis - Floral Edition',
    description: 'Stunning hand-woven traditional dress with vibrant floral patterns.',
    price: 4500,
    stock: 5,
    images: [PlaceHolderImages.find(img => img.id === 'habesha-dress')?.imageUrl || 'https://picsum.photos/seed/habesha-dress/600/800'],
    rating: 4.9,
    reviewCount: 12,
    featured: true,
    status: 'approved'
  }
];

export function useAppStore() {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('emarcato_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    
    const savedUser = localStorage.getItem('emarcato_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (role: User['role']) => {
    const mockUser: User = {
      id: role === 'seller' ? 's1' : 'u1',
      email: `${role}@e-marcato.com`,
      name: role.charAt(0).toUpperCase() + role.slice(1) + ' User',
      role: role
    };
    setUser(mockUser);
    localStorage.setItem('emarcato_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('emarcato_user');
  };

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      const newCart = existing 
        ? prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prev, { productId, quantity: 1 }];
      localStorage.setItem('emarcato_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.productId !== productId);
      localStorage.setItem('emarcato_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('emarcato_cart');
  };

  const placeOrder = (orderDetails: any) => {
    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerId: user?.id || 'guest',
      status: 'pending',
      total: cart.reduce((acc, item) => {
        const p = products.find(prod => prod.id === item.productId);
        return acc + (p?.price || 0) * item.quantity;
      }, 0),
      createdAt: new Date().toISOString(),
      paymentMethod: orderDetails.paymentMethod,
      shippingAddress: orderDetails.shippingAddress
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  return {
    user,
    cart,
    products,
    orders,
    wishlist,
    login,
    logout,
    addToCart,
    removeFromCart,
    clearCart,
    placeOrder,
    setProducts,
    setOrders
  };
}
