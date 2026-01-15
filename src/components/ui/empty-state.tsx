import { Package, Search, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon = Package, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
        <Icon className="h-8 w-8 text-accent-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-4 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function NoSearchResults() {
  return (
    <EmptyState
      icon={Search}
      title="No suppliers found"
      description="Try adjusting your filters or search in nearby markets for more results."
    />
  );
}

export function NoFavorites() {
  return (
    <EmptyState
      icon={Users}
      title="No saved suppliers yet"
      description="Save your favorite suppliers to quickly find them later."
    />
  );
}

export function NoProducts() {
  return (
    <EmptyState
      icon={Package}
      title="No products added"
      description="Start adding products to your inventory to get discovered by retailers."
    />
  );
}
