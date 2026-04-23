'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatETB } from '@/lib/constants';
import type { Product } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useAppStore();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product.id);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your shopping bag.`
    });
  };

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) 
    : null;

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-primary/5 flex flex-col h-full">
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
        {product.images[0] ? (
          <Image 
            src={product.images[0]} 
            alt={product.name}
            fill
            className="object-cover transform transition-transform duration-500 group-hover:scale-110"
            data-ai-hint="product image"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs text-center p-4">
            No image available
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount && (
            <Badge className="bg-destructive hover:bg-destructive text-white border-none shadow-sm">
              -{discount}%
            </Badge>
          )}
          {product.featured && (
            <Badge className="bg-accent hover:bg-accent text-accent-foreground border-none shadow-sm">
              Featured
            </Badge>
          )}
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Button size="icon" className="rounded-full bg-white text-foreground hover:bg-primary hover:text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Heart className="w-5 h-5" />
          </Button>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 fill-accent text-accent" />
          <span className="text-xs font-medium text-muted-foreground">{product.rating} ({product.reviewCount})</span>
        </div>
        
        <Link href={`/product/${product.id}`} className="block mb-2">
          <h3 className="font-headline font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
        </Link>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">
              {formatETB(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatETB(product.comparePrice)}
              </span>
            )}
          </div>
          <Button 
            onClick={handleAddToCart}
            size="icon" 
            className="rounded-full w-10 h-10 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-none border-none"
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
