import { User, Store, MapPin, Bell, Shield, LogOut, ChevronRight, Upload, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suppliers, SupplierProfile, BASE_URL } from '@/lib/api';
import { toast } from 'sonner';
import { useState, useRef } from 'react';

export default function SupplierSettings() {
  const { user, logout, isDarkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Fetch supplier profile
  const { data: supplierProfile, isLoading: profileLoading } = useQuery<SupplierProfile>({
    queryKey: ['supplierProfile'],
    queryFn: async () => {
      const response = await suppliers.getMyProfile();
      return response.data;
    },
    enabled: !!user,
  });

  // Logo upload mutation
  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => suppliers.uploadLogo(file),
    onSuccess: (response) => {
      toast.success('Logo uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: ['supplierProfile'] });
      setIsUploading(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload logo');
      setIsUploading(false);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload PNG, JPEG, or WebP image.');
      event.target.value = ''; // Reset input
      return;
    }

    // Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 2MB.');
      event.target.value = ''; // Reset input
      return;
    }

    setIsUploading(true);
    uploadLogoMutation.mutate(file);
    event.target.value = ''; // Reset input to allow re-uploading same file
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
              <h2 className="text-lg font-semibold text-foreground">{supplierProfile?.shopName || user?.name || 'Supplier'}</h2>
              <VerifiedBadge size="sm" />
            </div>
            <p className="text-sm text-muted-foreground">{supplierProfile?.address || 'Your Shop'}</p>
            <p className="text-sm text-muted-foreground">{user?.phone}</p>
          </div>
          <Button variant="outline" size="sm">Edit</Button>
        </div>
      </div>

      {/* Company Logo Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Company Logo</CardTitle>
          <CardDescription>
            Upload your company logo to appear on invoices (PNG, JPEG, or WebP, max 2MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Logo Preview */}
          <div className="flex items-center gap-4">
            {profileLoading ? (
              <div className="flex h-32 w-32 items-center justify-center rounded-lg border border-border bg-muted">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : supplierProfile?.logoUrl ? (
              <div className="relative">
                <img
                  src={`${BASE_URL}${supplierProfile.logoUrl}`}
                  alt="Company logo"
                  className="h-32 w-32 rounded-lg border border-border object-contain bg-white p-2"
                />
              </div>
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-lg border border-dashed border-border bg-muted">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <div className="text-sm text-muted-foreground">No logo uploaded</div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button
                onClick={triggerFileInput}
                disabled={isUploading}
                className="gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    {supplierProfile?.logoUrl ? 'Change Logo' : 'Upload Logo'}
                  </>
                )}
              </Button>
              {supplierProfile?.logoUrl && (
                <p className="text-xs text-muted-foreground">
                  Current logo will be replaced
                </p>
              )}
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

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
