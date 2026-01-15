import { useState } from 'react';
import { Search, Plus, Filter, Edit2, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { products, categories, brands } from '@/lib/mock-data';
import { NoProducts } from '@/components/ui/empty-state';

export default function SupplierInventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  // Mock inventory for current supplier
  const inventory = products.slice(0, 6);

  const filteredInventory = inventory.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground">{inventory.length} products</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <AddProductForm onClose={() => setAddProductOpen(false)} />
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="gap-2">
            <Package className="h-4 w-4" />
            Bulk Import
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Product List */}
      {filteredInventory.length > 0 ? (
        <div className="space-y-3">
          {filteredInventory.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
            >
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{product.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.brand} • {product.category}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <Badge variant={product.quantity > 10 ? 'secondary' : 'destructive'}>
                    {product.quantity} in stock
                  </Badge>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Updated {product.lastUpdated}
                  </p>
                </div>
                
                <Dialog open={editingProduct === product.id} onOpenChange={(open) => setEditingProduct(open ? product.id : null)}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Quantity</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Stock Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          defaultValue={product.quantity}
                          min="0"
                        />
                      </div>
                      <Button className="w-full" onClick={() => setEditingProduct(null)}>
                        Update Stock
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoProducts />
      )}
    </div>
  );
}

function AddProductForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="mt-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product-name">Product Name</Label>
        <Input id="product-name" placeholder="e.g., Samsung A32 Silicone Case" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Brand</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Model (optional)</Label>
        <Input id="model" placeholder="e.g., A32, iPhone 14" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Initial Stock</Label>
        <Input id="quantity" type="number" placeholder="0" min="0" />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" className="flex-1" onClick={onClose}>
          Add Product
        </Button>
      </div>
    </form>
  );
}
