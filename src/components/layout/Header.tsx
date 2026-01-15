import { MapPin, ChevronDown, Moon, Sun, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/AppContext';

export function Header() {
  const { selectedCity, setSelectedCity, cities, isDarkMode, toggleDarkMode, user } = useApp();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">SC</span>
          </div>
          <span className="hidden font-semibold text-foreground sm:inline-block">
            SupplyConnect
          </span>
        </div>

        {/* City Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">{selectedCity?.name || 'Select City'}</span>
              <span className="sm:hidden">{selectedCity?.name?.slice(0, 3) || 'City'}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            {cities.map((city) => (
              <DropdownMenuItem
                key={city.id}
                onClick={() => setSelectedCity(city)}
                className={selectedCity?.id === city.id ? 'bg-accent' : ''}
              >
                <MapPin className="mr-2 h-4 w-4" />
                {city.name}
                <span className="ml-auto text-xs text-muted-foreground">
                  {city.markets.reduce((acc, m) => acc + m.supplierCount, 0)} suppliers
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          {user && (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                  3
                </span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <span className="font-medium">{user.name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
