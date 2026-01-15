import { useState } from 'react';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { products } from '@/lib/mock-data';

// Mock cart
interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

// Mock retailers
const retailers = [
  { id: 'ret-1', name: 'Ali Mobile Shop', balance: -5000 },
  { id: 'ret-2', name: 'Tech Corner', balance: 0 },
  { id: 'ret-3', name: 'Phone Plaza', balance: -12000 },
];

export default function SupplierPOS() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState<string>('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: typeof products[0]) => {
    const existing = cart.find((item) => item.productId === product.id);
    if (existing) {
      setCart(cart.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        quantity: 1,
        unitPrice: 500, // Mock price
      }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter((item) => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        {/* Products Section */}
        <div className="flex-1 p-4 lg:p-6">
          <h1 className="mb-6 text-2xl font-bold text-foreground">Point of Sale</h1>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Product Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.slice(0, 9).map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-sm"
              >
                <h3 className="font-medium text-foreground">{product.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{product.brand}</p>
                <div className="mt-2 flex items-center justify-between">
                  <Badge variant={product.inStock ? 'secondary' : 'outline'}>
                    {product.quantity} left
                  </Badge>
                  <Plus className="h-5 w-5 text-primary" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="border-t border-border bg-card p-4 lg:w-96 lg:border-l lg:border-t-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5" />
                Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Retailer Selection */}
              <div className="mb-4">
                <Label>Customer</Label>
                <Select value={selectedRetailer} onValueChange={setSelectedRetailer}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Walk-in customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walk-in">Walk-in customer</SelectItem>
                    {retailers.map((retailer) => (
                      <SelectItem key={retailer.id} value={retailer.id}>
                        {retailer.name}
                        {retailer.balance < 0 && (
                          <span className="ml-2 text-destructive">
                            (PKR {Math.abs(retailer.balance).toLocaleString()} due)
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cart Items */}
              {cart.length > 0 ? (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 border-b border-border pb-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          PKR {item.unitPrice.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.productId, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.productId, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-foreground">
                      PKR {total.toLocaleString()}
                    </span>
                  </div>

                  {/* Checkout */}
                  <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
                    <DialogTrigger asChild>
                      <Button className="mt-4 w-full" size="lg">
                        Complete Sale
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Choose Payment Method</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 grid gap-3">
                        <Button
                          variant="outline"
                          className="h-14 justify-start gap-3"
                          onClick={() => {
                            setCheckoutOpen(false);
                            setCart([]);
                          }}
                        >
                          <Banknote className="h-5 w-5" />
                          Cash
                        </Button>
                        <Button
                          variant="outline"
                          className="h-14 justify-start gap-3"
                          onClick={() => {
                            setCheckoutOpen(false);
                            setCart([]);
                          }}
                        >
                          <CreditCard className="h-5 w-5" />
                          Credit / On Account
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <ShoppingCart className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Tap products to add to cart
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
