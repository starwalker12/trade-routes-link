import { useState } from 'react';
import { TrendingUp, TrendingDown, Package, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supplierDashboardStats } from '@/lib/mock-data';

// Mock chart data
const dailyData = [
  { name: 'Mon', sales: 12000 },
  { name: 'Tue', sales: 19000 },
  { name: 'Wed', sales: 15000 },
  { name: 'Thu', sales: 22000 },
  { name: 'Fri', sales: 28000 },
  { name: 'Sat', sales: 35000 },
  { name: 'Sun', sales: 18000 },
];

const weeklyData = [
  { name: 'Week 1', sales: 85000 },
  { name: 'Week 2', sales: 120000 },
  { name: 'Week 3', sales: 95000 },
  { name: 'Week 4', sales: 140000 },
];

const monthlyData = [
  { name: 'Jan', sales: 450000 },
  { name: 'Feb', sales: 380000 },
  { name: 'Mar', sales: 520000 },
  { name: 'Apr', sales: 480000 },
  { name: 'May', sales: 620000 },
  { name: 'Jun', sales: 550000 },
];

export default function SupplierAnalytics() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const stats = supplierDashboardStats;

  const chartData = period === 'day' ? dailyData : period === 'week' ? weeklyData : monthlyData;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Analytics</h1>

      {/* Period Tabs */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)} className="mb-6">
        <TabsList>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Stats Overview */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  PKR {(stats.monthSales / 1000).toFixed(0)}K
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                  <TrendingUp className="h-3 w-3" />
                  12% from last period
                </p>
              </div>
              <div className="rounded-lg bg-accent p-2">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Products Sold</p>
                <p className="mt-1 text-2xl font-bold text-foreground">847</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                  <TrendingUp className="h-3 w-3" />
                  8% from last period
                </p>
              </div>
              <div className="rounded-lg bg-accent p-2">
                <Package className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Customers</p>
                <p className="mt-1 text-2xl font-bold text-foreground">23</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                  <TrendingDown className="h-3 w-3" />
                  3% from last period
                </p>
              </div>
              <div className="rounded-lg bg-accent p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding Credit</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  PKR {(stats.outstandingCredit / 1000).toFixed(0)}K
                </p>
                <p className="mt-1 text-xs text-muted-foreground">from 5 customers</p>
              </div>
              <div className="rounded-lg bg-destructive/10 p-2">
                <DollarSign className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs text-muted-foreground" />
                <YAxis className="text-xs text-muted-foreground" tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [`PKR ${value.toLocaleString()}`, 'Sales']}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-medium text-accent-foreground">
                    {index + 1}
                  </span>
                  <span className="text-foreground">{product.name}</span>
                </div>
                <Badge variant="secondary">{product.sales} units</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
