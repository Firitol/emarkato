
'use client';

import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Truck, ShieldCheck, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { customerProductRecommendations } from '@/ai/flows/customer-product-recommendations';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';

export default function HomePage() {
  const { user } = useAppStore();
  const db = useFirestore();
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Fetch featured products from Firestore
  const featuredQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'products_public'), where('featured', '==', true), limit(4));
  }, [db]);
  const { data: featuredProducts, isLoading: productsLoading } = useCollection(featuredQuery);

  const heroBg = PlaceHolderImages.find(img => img.id === 'hero-bg')?.imageUrl;
  const habeshaDress = PlaceHolderImages.find(img => img.id === 'habesha-dress')?.imageUrl;
  const jebena = PlaceHolderImages.find(img => img.id === 'jebena')?.imageUrl;

  useEffect(() => {
    async function loadRecommendations() {
      if (user) {
        try {
          const res = await customerProductRecommendations({
            userId: user.id,
            browsingHistory: ['Traditional Crafts', 'Habesha Dress'],
            recentlyViewedProducts: ['Handcrafted Jebena Coffee Pot']
          });
          setRecommendations(res.recommendations);
        } catch (e) {
          // Error handling managed centrally
        }
      }
    }
    loadRecommendations();
  }, [user]);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroBg && (
            <Image 
              src={heroBg} 
              alt="Hero Background"
              fill
              className="object-cover opacity-20"
              priority
              data-ai-hint="ethiopian textile"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <Badge className="mb-4 bg-primary/10 text-primary border-none text-sm px-4 py-1 rounded-full">
              Ethiopia's #1 Marketplace
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-headline font-bold text-foreground leading-tight mb-6">
              Celebrate the <span className="text-primary italic">Heritage</span> of Ethiopia
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Discover authentic handcrafted goods, traditional spices, and modern essentials delivered from the heart of Ethiopia to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/search">
                <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-lg shadow-xl shadow-primary/20">
                  Shop Now
                </Button>
              </Link>
              <Link href="/seller">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-primary text-primary hover:bg-primary/5 text-lg">
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block relative h-[500px] animate-in fade-in zoom-in duration-1000 delay-200">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-accent/20 rounded-full blur-3xl" />
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="relative w-[320px] h-[450px] transform -rotate-6 transition-transform hover:rotate-0 duration-500 shadow-2xl rounded-2xl overflow-hidden">
                {habeshaDress && (
                  <Image 
                    src={habeshaDress} 
                    alt="Traditional Dress"
                    fill
                    className="object-cover"
                    data-ai-hint="traditional dress"
                  />
                )}
              </div>
              <div className="absolute -bottom-6 -right-6 w-[200px] h-[250px] transform rotate-12 transition-transform hover:rotate-0 duration-500 shadow-2xl rounded-2xl overflow-hidden border-4 border-white">
                {jebena && (
                  <Image 
                    src={jebena} 
                    alt="Jebena"
                    fill
                    className="object-cover"
                    data-ai-hint="coffee pot"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-white rounded-3xl shadow-xl border border-primary/5">
          {[
            { icon: Truck, title: 'Fast Delivery', desc: 'Across Ethiopia' },
            { icon: ShieldCheck, title: 'Secure Payments', desc: 'Telebirr & CBE' },
            { icon: Clock, title: '24/7 Support', desc: "We're here to help" },
            { icon: Star, title: 'Authentic Goods', desc: 'Direct from artisans' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
                <item.icon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm sm:text-base">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-headline font-bold text-foreground mb-2">Shop by Category</h2>
            <p className="text-muted-foreground">Everything you need, organized just for you.</p>
          </div>
          <Link href="/search" className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            See All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.id}`} className="group">
              <div className="aspect-square bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-primary/5 shadow-sm group-hover:shadow-md group-hover:border-primary/20 transition-all">
                <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors relative overflow-hidden">
                   <Image src={`https://picsum.photos/seed/${cat.id}/100/100`} alt={cat.name} width={40} height={40} className="rounded-full grayscale group-hover:grayscale-0" />
                </div>
                <span className="text-xs font-bold text-center group-hover:text-primary transition-colors">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI Recommendations */}
      {user && recommendations.length > 0 && (
        <section className="py-12 bg-accent/10 border-y border-accent/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white fill-white" />
              </div>
              <h2 className="text-2xl font-headline font-bold text-accent-foreground">Recommended For You</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {recommendations.slice(0, 4).map((rec, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-accent/10">
                  <p className="font-medium text-foreground mb-4 line-clamp-2">{rec}</p>
                  <Button variant="link" className="p-0 text-accent font-bold">View Similar <ArrowRight className="w-3 h-3 ml-1" /></Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-headline font-bold text-foreground mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Hand-picked selections of our finest Ethiopian treasures.</p>
          </div>
          <Link href="/search" className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View Gallery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-square bg-white animate-pulse rounded-2xl border border-primary/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground italic">
                No featured products found.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-earth text-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <div className="w-96 h-96 border-8 border-accent rounded-full -mr-48 -mt-48" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-2xl">
          <h2 className="text-4xl font-headline font-bold mb-6">Join the E-Marcato Community</h2>
          <p className="text-lg opacity-80 mb-10">
            Sign up now for exclusive deals on Habesha crafts and traditional coffee beans.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl shadow-accent/20 border-none">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 border-cream text-cream hover:bg-cream/10">
              Browse All
            </Button>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">E</div>
              <span className="text-xl font-headline font-bold">E-Marcato</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              E-Marcato is Ethiopia's premier online marketplace, connecting local artisans and sellers with customers worldwide.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/search" className="hover:text-primary transition-colors">Shop All</Link></li>
              <li><Link href="/seller" className="hover:text-primary transition-colors">Sell on E-Marcato</Link></li>
              <li><Link href="/orders" className="hover:text-primary transition-colors">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Customer Service</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Stay updated with the latest arrivals and offers.</p>
            <div className="flex gap-2">
              <Input placeholder="Email address" className="bg-gray-800 border-none rounded-full text-white placeholder:text-gray-500" />
              <Button size="icon" className="rounded-full bg-primary shrink-0 text-white"><ArrowRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 pt-12 mt-12 border-t border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} E-Marcato Marketplace. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
