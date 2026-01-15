import { Home, Search, Heart, MessageSquare, User, Package, BarChart3, ShoppingCart, Users, Settings, CheckCircle, LogOut, CreditCard } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

const retailerNav: NavItem[] = [
  { icon: Home, label: 'Home', path: '/retailer' },
  { icon: Search, label: 'Search', path: '/retailer/search' },
  { icon: Heart, label: 'Saved Suppliers', path: '/retailer/favorites' },
  { icon: MessageSquare, label: 'Quote Requests', path: '/retailer/quotes' },
  { icon: User, label: 'Profile', path: '/retailer/profile' },
];

const supplierNav: NavItem[] = [
  { icon: Home, label: 'Dashboard', path: '/supplier' },
  { icon: Package, label: 'Inventory', path: '/supplier/inventory' },
  { icon: ShoppingCart, label: 'Point of Sale', path: '/supplier/pos' },
  { icon: Users, label: 'Customers', path: '/supplier/customers' },
  { icon: BarChart3, label: 'Analytics', path: '/supplier/analytics' },
  { icon: CreditCard, label: 'Subscription', path: '/supplier/subscription' },
  { icon: Settings, label: 'Settings', path: '/supplier/settings' },
];

const adminNav: NavItem[] = [
  { icon: Home, label: 'Dashboard', path: '/admin' },
  { icon: CheckCircle, label: 'Verifications', path: '/admin/verify' },
  { icon: Package, label: 'Categories', path: '/admin/categories' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export function Sidebar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const navItems = user?.role === 'supplier' 
    ? supplierNav 
    : user?.role === 'admin' 
    ? adminNav 
    : retailerNav;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card md:flex md:flex-col">
      <div className="flex flex-1 flex-col gap-1 p-4">
        {/* User info */}
        {user && (
          <div className="mb-4 rounded-lg bg-accent p-3">
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/retailer' || item.path === '/supplier' || item.path === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <Button
          variant="ghost"
          className="mt-auto justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
