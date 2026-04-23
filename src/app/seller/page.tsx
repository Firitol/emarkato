
'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Settings, 
  Package, 
  LayoutDashboard,
  LogOut,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { formatETB } from '@/lib/constants';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

const chartData = [
  { month: "Jan", sales: 45000 },
  { month: "Feb", sales: 52000 },
  { month: "Mar", sales: 48000 },
  { month: "Apr", sales: 61000 },
  { month: "May", sales: 55000 },
  { month: "Jun", sales: 67000 },
];

const chartConfig = {
  sales: {
    label: "Sales (ETB)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function SellerDashboard() {
  const { user, products, logout } = useAppStore();
  const sellerProducts = products.filter(p => p.sellerId === 's1'); // Mock seller

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-primary/5 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">E</div>
          <span className="text-xl font-headline font-bold">SellerPortal</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <Link href="/seller">
            <Button variant="secondary" className="w-full justify-start gap-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border-none">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-muted-foreground">
            <Package className="w-5 h-5" />
            My Products
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-muted-foreground">
            <ShoppingBag className="w-5 h-5" />
            Orders
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-muted-foreground">
            <TrendingUp className="w-5 h-5" />
            Analytics
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl text-muted-foreground">
            <Settings className="w-5 h-5" />
            Settings
          </Button>
        </nav>

        <div className="mt-auto">
          <Button variant="ghost" onClick={logout} className="w-full justify-start gap-3 rounded-xl text-destructive hover:bg-destructive/10">
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-headline font-bold">Welcome back, {user?.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground">Here's what's happening with your store today.</p>
          </div>
          <Button className="bg-primary rounded-xl px-6">
            <Plus className="w-5 h-5 mr-2" />
            Add New Product
          </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Revenue', value: formatETB(124500), icon: TrendingUp, color: 'text-success' },
            { label: 'Active Orders', value: '18', icon: ShoppingBag, color: 'text-primary' },
            { label: 'Total Products', value: sellerProducts.length.toString(), icon: Package, color: 'text-accent' },
            { label: 'Store Visitors', value: '1,204', icon: Users, color: 'text-blue-500' },
          ].map((stat, i) => (
            <Card key={i} className="rounded-3xl border-primary/5 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  {stat.label}
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Sales Chart */}
          <Card className="lg:col-span-2 rounded-3xl border-primary/5 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-headline font-bold">Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={chartData}>
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* AI Helper Card */}
          <Card className="rounded-3xl border-accent/20 bg-accent/5 shadow-sm flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-headline font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-muted-foreground mb-6">
                Let AI help you write compelling product descriptions or summarize customer feedback.
              </p>
              <div className="space-y-3 mt-auto">
                <Button variant="outline" className="w-full justify-start border-accent/20 hover:bg-accent/10">Generate Descriptions</Button>
                <Button variant="outline" className="w-full justify-start border-accent/20 hover:bg-accent/10">Analyze Reviews</Button>
                <Button variant="outline" className="w-full justify-start border-accent/20 hover:bg-accent/10">Optimizing Pricing</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Products Table */}
        <Card className="rounded-3xl border-primary/5 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-headline font-bold">Recent Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sellerProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-primary/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden shrink-0">
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.categoryId} • {formatETB(p.price)}</div>
                    </div>
                  </div>
                  <Badge className={p.status === 'approved' ? 'bg-success/10 text-success border-none' : 'bg-warning/10 text-warning border-none'}>
                    {p.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
