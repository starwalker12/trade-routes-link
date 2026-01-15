import { Users, CheckCircle, Package, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Suppliers" value="127" icon={Users} />
        <StatCard title="Verified" value="89" icon={CheckCircle} />
        <StatCard title="Pending Verifications" value="12" icon={Package} />
        <StatCard title="Active This Week" value="78" icon={TrendingUp} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/admin/verify" className="block rounded-lg border border-border p-4 transition-colors hover:bg-accent">
              <p className="font-medium text-foreground">Review Verifications</p>
              <p className="text-sm text-muted-foreground">12 suppliers pending review</p>
            </Link>
            <Link to="/admin/categories" className="block rounded-lg border border-border p-4 transition-colors hover:bg-accent">
              <p className="font-medium text-foreground">Manage Categories</p>
              <p className="text-sm text-muted-foreground">Add or edit product categories</p>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">New supplier registration</span>
                <span className="text-muted-foreground">5 min ago</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Verification approved</span>
                <span className="text-muted-foreground">1 hour ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">New category added</span>
                <span className="text-muted-foreground">3 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          </div>
          <div className="rounded-lg bg-accent p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
