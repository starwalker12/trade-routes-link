import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Clock, Heart, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { recentSearches, popularModels, suppliers, brands, categories } from '@/lib/mock-data';
import { VerifiedBadge } from '@/components/ui/verified-badge';

export default function RetailerHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedCity } = useApp();

  const savedSuppliers = suppliers.filter((s) => s.cityId === selectedCity?.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Search Section */}
      <div className="bg-card px-4 pb-6 pt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search product or phone model (e.g., A32 silicone cover)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-11 pr-4 text-base"
          />
        </div>
        
        <Link to="/retailer/search?ai=true">
          <Button variant="outline" className="mt-3 w-full gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Help me find
          </Button>
        </Link>
      </div>

      <div className="space-y-6 p-4">
        {/* Recent Searches */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-medium text-foreground">Recent Searches</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search) => (
              <Link key={search} to={`/retailer/search?q=${encodeURIComponent(search)}`}>
                <Badge variant="secondary" className="cursor-pointer hover:bg-accent">
                  {search}
                </Badge>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Brand */}
        <section>
          <h2 className="mb-3 font-medium text-foreground">Browse by Brand</h2>
          <div className="flex flex-wrap gap-2">
            {brands.slice(0, 8).map((brand) => (
              <Link key={brand} to={`/retailer/search?brand=${encodeURIComponent(brand)}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  {brand}
                </Badge>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Category */}
        <section>
          <h2 className="mb-3 font-medium text-foreground">Browse by Category</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/retailer/search?category=${encodeURIComponent(category)}`}
                className="rounded-lg border border-border bg-card p-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                {category}
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Models */}
        <section>
          <h2 className="mb-3 font-medium text-foreground">Popular Models</h2>
          <div className="space-y-3">
            {popularModels.map((brandModels) => (
              <div key={brandModels.brand}>
                <p className="mb-2 text-sm text-muted-foreground">{brandModels.brand}</p>
                <div className="flex flex-wrap gap-2">
                  {brandModels.models.map((model) => (
                    <Link
                      key={model}
                      to={`/retailer/search?brand=${encodeURIComponent(brandModels.brand)}&model=${encodeURIComponent(model)}`}
                    >
                      <Badge variant="secondary" className="cursor-pointer hover:bg-accent">
                        {model}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Saved Suppliers */}
        {savedSuppliers.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-medium text-foreground">Saved Suppliers</h2>
              </div>
              <Link to="/retailer/favorites" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {savedSuppliers.map((supplier) => (
                <Link
                  key={supplier.id}
                  to={`/retailer/supplier/${supplier.id}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                      <span className="text-sm font-medium text-accent-foreground">
                        {supplier.shopName.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground">{supplier.shopName}</span>
                        {supplier.isVerified && <VerifiedBadge size="sm" />}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {supplier.marketName}, {supplier.cityName}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
