
'use client';

import { useState, useEffect } from 'react';
import type { User, Product, CartItem, Order } from './types';
import { PlaceHolderImages } from './placeholder-images';

// Initial Mock Data
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
    images: [PlaceHolderImages.find(img => img.id === 'jebena')?.imageUrl || ''],
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
    images: [PlaceHolderImages.find(img => img.id === 'habesha-dress')?.imageUrl || ''],
    rating: 4.9,
    reviewCount: 12,
    featured: true,
    status: 'approved'
  },
  {
    id: 'p3',
    sellerId: 's2',
    categoryId: 'coffee',
    name: 'Premium Yirgacheffe Coffee Beans',
    description: 'Whole bean organic coffee with distinctive floral and citrus notes.',
    price: 600,
    comparePrice: 750,
    stock: 50,
    images: [PlaceHolderImages.find(img => img.id === 'coffee-beans')?.imageUrl || ''],
    rating: 4.7,
    reviewCount: 45,
    featured: true,
    status: 'approved'
  },
  {
    id: 'p4',
    sellerId: 's3',
    categoryId: 'electronics',
    name: 'Samsung Galaxy S23 Ultra',
    description: 'Latest flagship smartphone with 200MP camera.',
    price: 78000,
    stock: 10,
    images: [PlaceHolderImages.find(img => img.id === 'smartphone')?.imageUrl || ''],
    rating: 4.6,
    reviewCount: 8,
    featured: false,
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
    // Basic persistence mock
    const savedCart = localStorage.getItem('ethio_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    
    const savedUser = localStorage.getItem('ethio_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (role: User['role']) => {
    const mockUser: User = {
      id: 'u1',
      email: `${role}@emarcato.com`,
      name: role.charAt(0).toUpperCase() + role.slice(1) + ' User',
      role: role
    };
    setUser(mockUser);
    localStorage.setItem('ethio_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ethio_user');
  };

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      const newCart = existing 
        ? prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prev, { productId, quantity: 1 }];
      localStorage.setItem('ethio_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.productId !== productId);
      localStorage.setItem('ethio_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('ethio_cart');
  };

  const placeOrder = (orderDetails: any) => {
    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerId: user?.id || 'guest',
      status: 'pending',
      total: cart.reduce((acc, item) => acc + (products.find(p => p.id === item.productId)?.price || 0) * item.quantity, 0),
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
