
export type Role = 'customer' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  phone?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    city: string;
    region: string;
  };
}
