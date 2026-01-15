import { Home, Search, Heart, MessageSquare, User, Package, BarChart3, ShoppingCart, Users, Settings, CheckCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

const retailerNav: NavItem[] = [
  { icon: Home, label: 'Home', path: '/retailer' },
  { icon: Search, label: 'Search', path: '/retailer/search' },
  { icon: Heart, label: 'Saved', path: '/retailer/favorites' },
  { icon: MessageSquare, label: 'Quotes', path: '/retailer/quotes' },
  { icon: User, label: 'Profile', path: '/retailer/profile' },
];

const supplierNav: NavItem[] = [
  { icon: Home, label: 'Home', path: '/supplier' },
  { icon: Package, label: 'Inventory', path: '/supplier/inventory' },
  { icon: ShoppingCart, label: 'POS', path: '/supplier/pos' },
  { icon: Users, label: 'Customers', path: '/supplier/customers' },
  { icon: BarChart3, label: 'Analytics', path: '/supplier/analytics' },
];

const adminNav: NavItem[] = [
  { icon: Home, label: 'Dashboard', path: '/admin' },
  { icon: CheckCircle, label: 'Verify', path: '/admin/verify' },
  { icon: Package, label: 'Categories', path: '/admin/categories' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export function BottomNav() {
  const { user } = useApp();

  const navItems = user?.role === 'supplier' 
    ? supplierNav 
    : user?.role === 'admin' 
    ? adminNav 
    : retailerNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
