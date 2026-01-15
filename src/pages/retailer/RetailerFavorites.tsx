import { Link } from 'react-router-dom';
import { ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { suppliers } from '@/lib/mock-data';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { NoFavorites } from '@/components/ui/empty-state';
import { useApp } from '@/contexts/AppContext';

export default function RetailerFavorites() {
  const { selectedCity } = useApp();
  
  // Mock saved suppliers (first 3 from selected city)
  const savedSuppliers = suppliers.filter((s) => s.cityId === selectedCity?.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Saved Suppliers</h1>

      {savedSuppliers.length > 0 ? (
        <div className="space-y-3">
          {savedSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
            >
              <Link
                to={`/retailer/supplier/${supplier.id}`}
                className="flex flex-1 items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                  <span className="font-medium text-accent-foreground">
                    {supplier.shopName.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground">{supplier.shopName}</span>
                    {supplier.isVerified && <VerifiedBadge size="sm" />}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {supplier.marketName}, {supplier.cityName}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
              <Button variant="ghost" size="icon" className="ml-2 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <NoFavorites />
      )}
    </div>
  );
}
