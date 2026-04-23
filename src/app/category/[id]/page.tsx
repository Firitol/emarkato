'use client';

import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { useAppStore } from '@/lib/store';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

export default function CategoryPage() {
  const { id } = useParams();
  const { products } = useAppStore();
  
  const category = PRODUCT_CATEGORIES.find(c => c.id === id);
  const categoryProducts = products.filter(p => p.categoryId === id);

  if (!category) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-headline font-bold mb-4">Category not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-headline font-bold mb-2">{category.name}</h1>
          <p className="text-muted-foreground">Explore our selection of {category.name.toLowerCase()} items.</p>
        </header>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-primary/5 shadow-sm">
            <h2 className="text-2xl font-headline font-bold mb-2">No products in this category yet</h2>
            <p className="text-muted-foreground">Check back soon for new arrivals!</p>
          </div>
        )}
      </main>
    </div>
  );
}
