
'use client';

import { Navbar } from '@/components/Navbar';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatETB } from '@/lib/constants';

export default function CartPage() {
  const { cart, products, removeFromCart } = useAppStore();
  
  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 0 ? 150 : 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-headline font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Explore our authentic Ethiopian goods!</p>
          <Link href="/">
            <Button size="lg" className="rounded-full px-8 bg-primary shadow-lg shadow-primary/20">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-headline font-bold mb-12">Shopping Bag</h1>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.productId} className="bg-white rounded-2xl p-6 shadow-sm border border-primary/5 flex gap-6">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0">
                  <Image src={item.product!.images[0]} alt={item.product!.name} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/product/${item.productId}`} className="font-headline font-bold text-lg hover:text-primary transition-colors">
                      {item.product!.name}
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{item.product!.description}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-cream rounded-full px-3 py-1 border border-primary/10">
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary">
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <span className="font-bold text-lg">{formatETB(item.product!.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-primary/5 sticky top-28">
              <h2 className="text-2xl font-headline font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatETB(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span>{formatETB(shipping)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold text-foreground">
                  <span>Total</span>
                  <span>{formatETB(total)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Input placeholder="Promo code" className="rounded-full pl-6 pr-24 border-primary/10 focus-visible:ring-primary/20" />
                  <Button className="absolute top-1/2 right-1 -translate-y-1/2 h-8 rounded-full bg-cream text-primary border border-primary/10 hover:bg-primary/5 text-xs">Apply</Button>
                </div>
                <Link href="/checkout">
                  <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg shadow-lg shadow-primary/20">
                    Checkout Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost" className="w-full hover:bg-primary/5 text-muted-foreground">Continue Shopping</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
