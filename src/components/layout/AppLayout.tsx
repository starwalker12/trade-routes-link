import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { useApp } from '@/contexts/AppContext';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
