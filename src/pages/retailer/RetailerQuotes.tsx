import { Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';

// Mock quote requests
const quoteRequests = [
  {
    id: 'quote-1',
    supplierName: 'Ahmed Mobile Accessories',
    product: 'Samsung A32 silicone case',
    quantity: 100,
    status: 'pending',
    createdAt: '2 hours ago',
  },
  {
    id: 'quote-2',
    supplierName: 'Mobile Hub Trading',
    product: 'iPhone 14 charger',
    quantity: 50,
    status: 'responded',
    createdAt: '1 day ago',
  },
  {
    id: 'quote-3',
    supplierName: 'TechZone Electronics',
    product: 'USB-C cable 2m',
    quantity: 200,
    status: 'declined',
    createdAt: '3 days ago',
  },
];

export default function RetailerQuotes() {
  const pendingQuotes = quoteRequests.filter((q) => q.status === 'pending');
  const respondedQuotes = quoteRequests.filter((q) => q.status === 'responded');
  const closedQuotes = quoteRequests.filter((q) => q.status === 'declined' || q.status === 'accepted');

  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Quote Requests</h1>

      <Tabs defaultValue="pending">
        <TabsList className="w-full">
          <TabsTrigger value="pending" className="flex-1">
            Pending ({pendingQuotes.length})
          </TabsTrigger>
          <TabsTrigger value="responded" className="flex-1">
            Responded ({respondedQuotes.length})
          </TabsTrigger>
          <TabsTrigger value="closed" className="flex-1">
            Closed ({closedQuotes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <QuoteList quotes={pendingQuotes} />
        </TabsContent>

        <TabsContent value="responded" className="mt-4">
          <QuoteList quotes={respondedQuotes} />
        </TabsContent>

        <TabsContent value="closed" className="mt-4">
          <QuoteList quotes={closedQuotes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function QuoteList({ quotes }: { quotes: typeof quoteRequests }) {
  if (quotes.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No quotes here"
        description="Your quote requests will appear here."
      />
    );
  }

  return (
    <div className="space-y-3">
      {quotes.map((quote) => (
        <div
          key={quote.id}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-foreground">{quote.supplierName}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{quote.product}</p>
              <p className="text-sm text-muted-foreground">Qty: {quote.quantity}</p>
            </div>
            <StatusBadge status={quote.status} />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {quote.createdAt}
            </span>
            {quote.status === 'responded' && (
              <Button size="sm">View Response</Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock },
    responded: { label: 'Responded', variant: 'default' as const, icon: CheckCircle },
    accepted: { label: 'Accepted', variant: 'default' as const, icon: CheckCircle },
    declined: { label: 'Declined', variant: 'outline' as const, icon: XCircle },
  };

  const { label, variant, icon: Icon } = config[status as keyof typeof config] || config.pending;

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
