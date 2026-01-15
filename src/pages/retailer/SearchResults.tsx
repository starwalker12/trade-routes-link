import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, List, X, Phone, MessageCircle, FileText, Clock, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { categories, brands, cities } from '@/lib/mock-data';
import { search, type SearchResult } from '@/lib/api';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { NoSearchResults } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('verified');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const { selectedCity } = useApp();

  // Fetch search results from API
  const { data: searchResults = [], isLoading, error } = useQuery({
    queryKey: ['search', searchQuery, selectedCity?.id],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      try {
        const response = await search.products({
          query: searchQuery,
          cityId: selectedCity?.id,
        });
        return response.data;
      } catch (err) {
        console.error('Search error:', err);
        throw err;
      }
    },
    enabled: !!searchQuery.trim(),
  });

  // Sort results
  const sortedResults = [...searchResults].sort((a, b) => {
    if (sortBy === 'verified') {
      const aVerified = a.supplier.verifiedStatus === 'VERIFIED' ? 1 : 0;
      const bVerified = b.supplier.verifiedStatus === 'VERIFIED' ? 1 : 0;
      return bVerified - aVerified;
    }
    if (sortBy === 'stock') {
      const aStock = a.products.filter(p => p.inStock).length;
      const bStock = b.products.filter(p => p.inStock).length;
      return bStock - aStock;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Search Bar */}
      <div className="sticky top-14 z-40 bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
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
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* City Filter */}
                <div className="space-y-2">
                  <Label>City</Label>
                  <Select defaultValue={selectedCity?.id}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Market Filter */}
                <div className="space-y-2">
                  <Label>Market / Area</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Markets" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCity?.markets.map((market) => (
                        <SelectItem key={market.id} value={market.id}>
                          {market.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
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

                {/* Brand Filter */}
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Brands" />
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

                {/* In Stock Toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="in-stock">Show in stock only</Label>
                  <Switch
                    id="in-stock"
                    checked={showInStockOnly}
                    onCheckedChange={setShowInStockOnly}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setFiltersOpen(false)}>
                    Reset
                  </Button>
                  <Button className="flex-1" onClick={() => setFiltersOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* View Toggle & Sort */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 gap-1.5 px-2"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
              List
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 gap-1.5 px-2"
              onClick={() => setViewMode('map')}
            >
              <MapPin className="h-4 w-4" />
              Map
            </Button>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verified">Verified first</SelectItem>
              <SelectItem value="stock">Highest stock</SelectItem>
              <SelectItem value="recent">Recently updated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="border-b border-border bg-card px-4 py-2">
        <p className="text-sm text-muted-foreground">
          {isLoading ? (
            'Searching...'
          ) : error ? (
            'Error loading results'
          ) : (
            `${sortedResults.length} suppliers found in ${selectedCity?.name || 'all cities'}`
          )}
        </p>
      </div>

      {/* Results */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Failed to load search results. Please try again.
            </p>
          </div>
        ) : viewMode === 'list' ? (
          sortedResults.length > 0 ? (
            <div className="space-y-3">
              {sortedResults.map((result) => (
                <SupplierCard
                  key={result.supplier.id}
                  result={result}
                />
              ))}
            </div>
          ) : (
            <NoSearchResults />
          )
        ) : (
          <MapView results={sortedResults} />
        )}
      </div>
    </div>
  );
}

function SupplierCard({ result }: { result: SearchResult }) {
  const { supplier, products, matchCount } = result;
  const inStockCount = products.filter(p => p.inStock).length;
  const isVerified = supplier.verifiedStatus === 'VERIFIED';
  
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
            <span className="font-medium text-accent-foreground">
              {supplier.shopName.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Link 
                to={`/retailer/supplier/${supplier.id}`}
                className="font-medium text-foreground hover:underline"
              >
                {supplier.shopName}
              </Link>
              {isVerified && <VerifiedBadge size="sm" />}
            </div>
            <p className="text-sm text-muted-foreground">
              {supplier.marketArea?.name || 'Market Area'}, {supplier.city?.name || 'City'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Badge variant="secondary" className="font-normal">
            {inStockCount > 0 ? `${inStockCount} product${inStockCount !== 1 ? 's' : ''} in stock` : 'Check availability'}
          </Badge>
        </span>
        {matchCount > 0 && (
          <span className="text-xs">
            {matchCount} match{matchCount !== 1 ? 'es' : ''}
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="default" size="sm" className="flex-1 gap-1.5">
          <FileText className="h-4 w-4" />
          Request Quote
        </Button>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Phone className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function MapView({ results }: { results: SearchResult[] }) {
  const { selectedCity } = useApp();
  
  // Group by market for cluster view
  const marketClusters = selectedCity?.markets.map((market) => ({
    market,
    suppliers: results.filter((r) => r.supplier.marketAreaId === market.id),
  })) || [];

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted">
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted to-accent/20">
        <div className="absolute inset-0 opacity-30">
          {/* Grid pattern */}
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Market Clusters */}
      <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-8 p-8">
        {marketClusters.map(({ market, suppliers: marketSuppliers }) => (
          marketSuppliers.length > 0 && (
            <div
              key={market.id}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg">
                <span className="text-lg font-bold text-primary-foreground">
                  {marketSuppliers.length}
                </span>
              </div>
              <Badge variant="secondary" className="shadow-sm">
                {market.name}
              </Badge>
            </div>
          )
        ))}
      </div>

      {/* Map Controls Hint */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="rounded-lg bg-card/90 p-3 text-center text-sm text-muted-foreground backdrop-blur">
          <MapPin className="mr-1.5 inline-block h-4 w-4" />
          Tap a cluster to see suppliers • Pinch to zoom
        </div>
      </div>
    </div>
  );
}
