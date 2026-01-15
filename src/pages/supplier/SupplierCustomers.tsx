import { useState } from 'react';
import { Search, Plus, User, ChevronRight, Phone, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { EmptyState } from '@/components/ui/empty-state';

// Mock customers
const customers = [
  { id: 'cust-1', name: 'Ali Mobile Shop', phone: '+92 321 1234567', balance: -5000, lastPurchase: '2 days ago' },
  { id: 'cust-2', name: 'Tech Corner', phone: '+92 333 9876543', balance: 0, lastPurchase: '1 week ago' },
  { id: 'cust-3', name: 'Phone Plaza', phone: '+92 300 5556667', balance: -12000, lastPurchase: 'Yesterday' },
  { id: 'cust-4', name: 'Mobile Express', phone: '+92 345 1112223', balance: -3500, lastPurchase: '5 days ago' },
];

export default function SupplierCustomers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const totalOutstanding = customers.reduce((sum, c) => sum + Math.abs(Math.min(0, c.balance)), 0);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">
            {customers.length} customers • PKR {totalOutstanding.toLocaleString()} outstanding
          </p>
        </div>
        <Dialog open={addCustomerOpen} onOpenChange={setAddCustomerOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <form className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Shop/Business Name</Label>
                <Input id="name" placeholder="Enter shop name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+92 3XX XXXXXXX" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setAddCustomerOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" className="flex-1" onClick={() => setAddCustomerOpen(false)}>
                  Add Customer
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customer List */}
      {filteredCustomers.length > 0 ? (
        <div className="space-y-3">
          {filteredCustomers.map((customer) => (
            <Dialog
              key={customer.id}
              open={selectedCustomer?.id === customer.id}
              onOpenChange={(open) => setSelectedCustomer(open ? customer : null)}
            >
              <DialogTrigger asChild>
                <button className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-accent">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                      <User className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {customer.balance < 0 && (
                      <Badge variant="destructive">
                        PKR {Math.abs(customer.balance).toLocaleString()} due
                      </Badge>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{customer.name}</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                  
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className={`text-2xl font-bold ${customer.balance < 0 ? 'text-destructive' : 'text-foreground'}`}>
                      PKR {customer.balance.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2">
                      <CreditCard className="h-4 w-4" />
                      Record Payment
                    </Button>
                    <Button className="flex-1 gap-2">
                      View Ledger
                    </Button>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground">
                      Last purchase: {customer.lastPurchase}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={User}
          title="No customers yet"
          description="Add your first customer to start tracking sales and credit."
          action={{
            label: 'Add Customer',
            onClick: () => setAddCustomerOpen(true),
          }}
        />
      )}
    </div>
  );
}
