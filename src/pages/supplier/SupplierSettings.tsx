import { User, Store, MapPin, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/contexts/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { VerifiedBadge } from '@/components/ui/verified-badge';

export default function SupplierSettings() {
  const { user, logout, isDarkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Settings</h1>

      {/* Profile Section */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
            <User className="h-8 w-8 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">{user?.name || 'Supplier'}</h2>
              <VerifiedBadge size="sm" />
            </div>
            <p className="text-sm text-muted-foreground">{user?.shopName || 'Your Shop'}</p>
            <p className="text-sm text-muted-foreground">{user?.phone}</p>
          </div>
          <Button variant="outline" size="sm">Edit</Button>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="space-y-2">
        <SettingsItem
          icon={Store}
          label="Shop Details"
          description="Name, description, hours"
        />
        <SettingsItem
          icon={MapPin}
          label="Location"
          description="Address and map pin"
        />
        <SettingsItem
          icon={Bell}
          label="Notifications"
          description="Quote alerts, updates"
        />
        <SettingsItem
          icon={Shield}
          label="Verification"
          description="Documents and status"
          badge={<VerifiedBadge size="sm" showLabel />}
        />

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <span className="text-lg">🌙</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Toggle dark theme</p>
            </div>
          </div>
          <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
        </div>

        {/* Subscription Link */}
        <Link to="/supplier/subscription">
          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-lg">👑</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Subscription</p>
                <p className="text-sm text-muted-foreground">Growth Plan • Active</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-destructive/10"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <LogOut className="h-5 w-5 text-destructive" />
            </div>
            <span className="font-medium text-destructive">Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
}

function SettingsItem({
  icon: Icon,
  label,
  description,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  badge?: React.ReactNode;
}) {
  return (
    <button className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
          <Icon className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge}
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </button>
  );
}
