import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, Star, Package, FileText, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { suppliers, products } from '@/lib/mock-data';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { useState } from 'react';

export default function SupplierProfile() {
  const { id } = useParams<{ id: string }>();
  const [isSaved, setIsSaved] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  
  const supplier = suppliers.find((s) => s.id === id);
  const supplierProducts = products.filter((p) => p.supplierId === id);

  if (!supplier) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-muted-foreground">Supplier not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <Link to="/retailer/search" className="flex items-center gap-2 text-foreground">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSaved(!isSaved)}
        >
          <Heart className={`h-5 w-5 ${isSaved ? 'fill-destructive text-destructive' : ''}`} />
        </Button>
      </div>

      {/* Supplier Info */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent">
            <span className="text-xl font-bold text-accent-foreground">
              {supplier.shopName.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">{supplier.shopName}</h1>
              {supplier.isVerified && <VerifiedBadge showLabel />}
            </div>
            <p className="mt-1 text-muted-foreground">{supplier.name}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {supplier.marketName}, {supplier.cityName}
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-primary text-primary" />
            {supplier.rating}
          </span>
          <span className="flex items-center gap-1.5">
            <Package className="h-4 w-4" />
            {supplier.totalProducts} products
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            Active {supplier.lastActive}
          </span>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">{supplier.address}</p>
      </div>

      {/* Actions */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex gap-2">
          <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 gap-2">
                <FileText className="h-4 w-4" />
                Request Quote
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Quote from {supplier.shopName}</DialogTitle>
              </DialogHeader>
              <form className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Product</Label>
                  <Input id="product" placeholder="e.g., Samsung A32 silicone case" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Note (optional)</Label>
                  <Textarea id="note" placeholder="Any specific requirements..." />
                </div>
                <Button type="button" className="w-full" onClick={() => setQuoteOpen(false)}>
                  Send Request
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="icon" className="h-10 w-10">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Phone className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Products List */}
      <div className="p-4">
        <h2 className="mb-4 font-semibold text-foreground">Available Products ({supplierProducts.length})</h2>
        
        {supplierProducts.length > 0 ? (
          <div className="space-y-3">
            {supplierProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{product.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.brand} • {product.category}
                    </p>
                  </div>
                  <Badge variant={product.inStock ? 'secondary' : 'outline'}>
                    {product.inStock ? `${product.quantity} in stock` : 'Out of stock'}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Updated {product.lastUpdated}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No products listed yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
