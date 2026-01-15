import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Check, Store, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cities } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';

export default function SupplierOnboarding() {
  const [step, setStep] = useState(1);
  const [shopName, setShopName] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const navigate = useNavigate();

  const city = cities.find((c) => c.id === selectedCity);

  const handleComplete = () => {
    navigate('/supplier');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Progress Header */}
      <div className="border-b border-border bg-card px-4 py-4">
        <div className="mx-auto max-w-md">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Step {step} of 2</span>
            <span className="font-medium text-primary">Go live in 10 minutes</span>
          </div>
          <Progress value={step * 50} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                  <Store className="h-8 w-8 text-accent-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Set up your shop</h1>
                <p className="mt-2 text-muted-foreground">
                  Tell us about your business so retailers can find you.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shop-name">Shop Name</Label>
                  <Input
                    id="shop-name"
                    placeholder="e.g., Ahmed Mobile Accessories"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Select value={selectedCity} onValueChange={(v) => { setSelectedCity(v); setSelectedMarket(''); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your city" />
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

                <div className="space-y-2">
                  <Label>Market / Area</Label>
                  <Select value={selectedMarket} onValueChange={setSelectedMarket} disabled={!selectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedCity ? 'Select market' : 'Select city first'} />
                    </SelectTrigger>
                    <SelectContent>
                      {city?.markets.map((market) => (
                        <SelectItem key={market.id} value={market.id}>
                          {market.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Shop Location (Optional)</Label>
                  <Button variant="outline" className="w-full gap-2">
                    <MapPin className="h-4 w-4" />
                    Pin on map
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Help retailers navigate to your shop
                  </p>
                </div>
              </div>

              <Button
                className="w-full gap-2"
                size="lg"
                onClick={() => setStep(2)}
                disabled={!shopName || !selectedCity || !selectedMarket}
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                  <Package className="h-8 w-8 text-accent-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Add your products</h1>
                <p className="mt-2 text-muted-foreground">
                  You can add products now or do it later from the inventory section.
                </p>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="h-auto w-full flex-col gap-2 p-6" onClick={() => navigate('/supplier/inventory')}>
                  <Package className="h-8 w-8 text-primary" />
                  <span className="font-medium">Add products manually</span>
                  <span className="text-sm text-muted-foreground">Add items one by one</span>
                </Button>

                <Button variant="outline" className="h-auto w-full flex-col gap-2 p-6" onClick={() => navigate('/supplier/import')}>
                  <Package className="h-8 w-8 text-primary" />
                  <span className="font-medium">Import from receipt</span>
                  <span className="text-sm text-muted-foreground">Use AI to scan your purchase receipts</span>
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleComplete}
              >
                <Check className="h-4 w-4" />
                Skip for now & go to dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
