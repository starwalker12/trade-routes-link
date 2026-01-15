import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp, UserRole } from '@/contexts/AppContext';

interface AuthFormProps {
  mode: 'login' | 'signup';
  role: UserRole;
}

export function AuthForm({ mode, role }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate auth delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user creation
    setUser({
      id: 'user-1',
      name: name || 'Demo User',
      email: email || undefined,
      phone: phone || '+92 300 1234567',
      role: role,
      shopName: role === 'supplier' ? 'Demo Shop' : undefined,
    });

    setIsLoading(false);

    // Navigate to appropriate portal
    if (role === 'supplier' && mode === 'signup') {
      navigate('/supplier/onboarding');
    } else if (role === 'supplier') {
      navigate('/supplier');
    } else if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/retailer');
    }
  };

  const roleLabels = {
    retailer: 'Retailer',
    supplier: 'Supplier',
    admin: 'Admin',
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === 'login'
            ? `Sign in to your ${roleLabels[role!]} account`
            : `Join SupplyConnect as a ${roleLabels[role!]}`}
        </p>
      </div>

      <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as 'phone' | 'email')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="phone" className="gap-2">
            <Phone className="h-4 w-4" />
            Phone
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <TabsContent value="phone" className="mt-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+92 3XX XXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </TabsContent>

          <TabsContent value="email" className="mt-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </TabsContent>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isLoading}>
            {isLoading ? (
              'Please wait...'
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Tabs>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Button variant="outline" className="w-full gap-2">
        <Phone className="h-4 w-4" />
        Continue with OTP
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <Link
          to={mode === 'login' ? `/auth/${role}/signup` : `/auth/${role}/login`}
          className="font-medium text-primary hover:underline"
        >
          {mode === 'login' ? 'Sign up' : 'Sign in'}
        </Link>
      </p>
    </div>
  );
}
