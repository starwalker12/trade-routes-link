import { useParams } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { UserRole } from '@/contexts/AppContext';

export default function AuthPage() {
  const { role, mode } = useParams<{ role: string; mode: string }>();

  const validRole = ['retailer', 'supplier', 'admin'].includes(role || '') 
    ? (role as UserRole) 
    : 'retailer';
  const validMode = mode === 'signup' ? 'signup' : 'login';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <span className="text-lg font-bold text-primary-foreground">SC</span>
        </div>
        <span className="text-xl font-semibold text-foreground">SupplyConnect</span>
      </div>
      
      <AuthForm mode={validMode} role={validRole} />
    </div>
  );
}
