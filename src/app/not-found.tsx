'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { MapPinOff } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
          <MapPinOff className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-headline font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Oops! The page you are looking for doesn't exist. Let's get you back to the main market.
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-full px-8 bg-primary shadow-lg shadow-primary/20">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
