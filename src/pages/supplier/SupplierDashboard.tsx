import { TrendingUp, TrendingDown, Package, FileText, AlertTriangle, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supplierDashboardStats } from '@/lib/mock-data';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

export default function SupplierDashboard() {
  const { user } = useApp();
  const stats = supplierDashboardStats;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.name?.split(' ')[0] || 'Supplier'}
        </h1>
        <p className="text-muted-foreground">Here's how your shop is doing today.</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Sales"
          value={`PKR ${stats.todaySales.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="This Month"
          value={`PKR ${(stats.monthSales / 1000).toFixed(0)}K`}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems.toString()}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Pending Quotes"
          value={stats.pendingQuotes.toString()}
          icon={FileText}
          variant="accent"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Link to="/supplier/pos">
          <Button>New Sale</Button>
        </Link>
        <Link to="/supplier/inventory">
          <Button variant="outline">Add Product</Button>
        </Link>
        <Link to="/supplier/inventory?filter=low-stock">
          <Button variant="outline">View Low Stock</Button>
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Products Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-medium text-accent-foreground">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground">{product.name}</span>
                  </div>
                  <Badge variant="secondary">{product.sales} sold</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Credit */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Outstanding Credit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">
                PKR {stats.outstandingCredit.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">from 5 customers</p>
              <Link to="/supplier/customers">
                <Button variant="outline" className="mt-4">
                  View Customer Ledger
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'New quote request', details: 'Samsung A32 case (100 pcs)', time: '10 min ago' },
              { action: 'Sale completed', details: 'PKR 4,500 - 3 items', time: '1 hour ago' },
              { action: 'Product updated', details: 'iPhone 14 charger stock: 50', time: '2 hours ago' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = 'default',
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; isPositive: boolean };
  variant?: 'default' | 'warning' | 'accent';
}) {
  const iconColors = {
    default: 'text-primary',
    warning: 'text-destructive',
    accent: 'text-accent-foreground',
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className={`mt-1 flex items-center gap-1 text-xs ${trend.isPositive ? 'text-primary' : 'text-destructive'}`}>
                {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {trend.value}% from yesterday
              </p>
            )}
          </div>
          <div className={`rounded-lg bg-accent p-2 ${iconColors[variant]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
