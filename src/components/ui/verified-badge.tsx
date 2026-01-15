import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function VerifiedBadge({ className, size = 'md', showLabel = false }: VerifiedBadgeProps) {
  const sizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <span className={cn('inline-flex items-center gap-1 text-primary', className)}>
      <CheckCircle className={cn(sizes[size], 'fill-primary text-primary-foreground')} />
      {showLabel && <span className="text-xs font-medium">Verified</span>}
    </span>
  );
}
