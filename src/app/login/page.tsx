
'use client';

import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Store, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAppStore();
  const router = useRouter();

  const handleDemoLogin = (role: 'customer' | 'seller' | 'admin') => {
    login(role);
    if (role === 'seller') router.push('/seller');
    else if (role === 'admin') router.push('/admin');
    else router.push('/');
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-primary/10 overflow-hidden">
          <div className="h-2 bg-primary w-full" />
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-headline font-bold">Welcome Back</CardTitle>
            <CardDescription>Select your account type to continue the demo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Button 
              onClick={() => handleDemoLogin('customer')}
              className="w-full h-16 rounded-2xl bg-white border-2 border-primary/20 text-foreground hover:bg-primary/5 hover:border-primary transition-all flex items-center justify-start gap-4 px-6 shadow-none"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-bold">Customer Portal</div>
                <div className="text-xs text-muted-foreground">Browse and shop products</div>
              </div>
            </Button>

            <Button 
              onClick={() => handleDemoLogin('seller')}
              className="w-full h-16 rounded-2xl bg-white border-2 border-primary/20 text-foreground hover:bg-primary/5 hover:border-primary transition-all flex items-center justify-start gap-4 px-6 shadow-none"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Store className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-bold">Seller Portal</div>
                <div className="text-xs text-muted-foreground">Manage your store and orders</div>
              </div>
            </Button>

            <Button 
              onClick={() => handleDemoLogin('admin')}
              className="w-full h-16 rounded-2xl bg-white border-2 border-primary/20 text-foreground hover:bg-primary/5 hover:border-primary transition-all flex items-center justify-start gap-4 px-6 shadow-none"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-bold">Admin Dashboard</div>
                <div className="text-xs text-muted-foreground">Platform-wide moderation</div>
              </div>
            </Button>

            <div className="pt-8 text-center text-sm text-muted-foreground">
              Don't have an account? <span className="text-primary font-bold cursor-pointer">Register here</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
