
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Heart, Shield, Truck, RotateCcw, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { formatETB } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { summarizeProductReviews, type ProductReviewSummaryOutput } from '@/ai/flows/customer-product-review-summaries';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { products, addToCart } = useAppStore();
  const product = products.find(p => p.id === id);
  const { toast } = useToast();
  
  const [reviewSummary, setReviewSummary] = useState<ProductReviewSummaryOutput | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    async function getAISummary() {
      if (!product) return;
      setLoadingAI(true);
      try {
        const summary = await summarizeProductReviews({
          reviews: [
            { rating: 5, comment: "Absolutely love the quality. The traditional feel is amazing!" },
            { rating: 4, comment: "Great product but delivery took a bit longer than expected to Addis." },
            { rating: 5, comment: "The craftsmanship is top-notch. Highly recommend for gift giving." }
          ]
        });
        setReviewSummary(summary);
      } catch (e) {
        console.error('AI summary failed', e);
      } finally {
        setLoadingAI(false);
      }
    }
    getAISummary();
  }, [product]);

  if (!product) return <div>Product not found</div>;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white group">
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-md cursor-pointer border-2 border-transparent hover:border-primary transition-all">
                  <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none">{product.categoryId}</Badge>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-sm font-bold">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-4xl font-headline font-bold text-foreground mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-primary">{formatETB(product.price)}</span>
              {product.comparePrice && (
                <span className="text-xl text-muted-foreground line-through">{formatETB(product.comparePrice)}</span>
              )}
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-white rounded-2xl border border-primary/5 shadow-sm flex items-center gap-3">
                <Truck className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-bold text-sm">Fast Shipping</div>
                  <div className="text-xs text-muted-foreground">2-3 business days</div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-primary/5 shadow-sm flex items-center gap-3">
                <RotateCcw className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-bold text-sm">Easy Returns</div>
                  <div className="text-xs text-muted-foreground">7 day return policy</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-12">
              <Button 
                onClick={() => {
                  addToCart(product.id);
                  toast({ title: "Success", description: "Added to cart" });
                }}
                className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg shadow-lg shadow-primary/20"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-primary/20 hover:bg-primary/5 text-primary">
                <Heart className="w-6 h-6" />
              </Button>
            </div>

            <Separator className="mb-8" />
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Shield className="w-5 h-5 text-success" />
              <span>EthioMart Verified Guarantee. Your satisfaction is our priority.</span>
            </div>
          </div>
        </div>

        {/* AI Review Summary */}
        <section className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-headline font-bold mb-2">Customer Feedback</h2>
              <p className="text-muted-foreground">Smart insights generated from 100+ reviews</p>
            </div>
            {loadingAI ? (
              <Badge variant="outline" className="animate-pulse">Analyzing reviews...</Badge>
            ) : (
              <Badge className="bg-accent text-accent-foreground border-none px-4 py-1">AI-Powered Summary</Badge>
            )}
          </div>

          {reviewSummary ? (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-6 bg-accent/5 rounded-2xl border border-accent/10">
                  <h3 className="font-bold mb-2">The Verdict</h3>
                  <p className="text-sm italic leading-relaxed text-muted-foreground">"{reviewSummary.overallSummary}"</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-bold text-success text-sm">
                    <ThumbsUp className="w-4 h-4" /> Pros
                  </h4>
                  <ul className="space-y-2">
                    {reviewSummary.commonPros.map((pro, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-success mt-1.5 shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-bold text-destructive text-sm">
                    <ThumbsDown className="w-4 h-4" /> Cons
                  </h4>
                  <ul className="space-y-2">
                    {reviewSummary.commonCons.map((con, i) => (
                      <li key={i} className="text-sm flex items-start gap-2 text-muted-foreground">
                        <span className="w-1 h-1 rounded-full bg-destructive mt-1.5 shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground italic">Gathering insights from the community...</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
