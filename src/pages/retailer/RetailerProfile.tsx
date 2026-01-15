import { User, Settings, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

export default function RetailerProfile() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Profile</h1>

      {/* User Info */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
            <User className="h-8 w-8 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{user?.name || 'User'}</h2>
            <p className="text-sm text-muted-foreground">{user?.phone}</p>
            <p className="text-sm text-muted-foreground capitalize">{user?.role} Account</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        <button className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Settings</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-destructive/10"
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-5 w-5 text-destructive" />
            <span className="font-medium text-destructive">Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
}
