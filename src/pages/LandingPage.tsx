import { Link } from 'react-router-dom';
import { Store, ShoppingBag, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">SC</span>
            </div>
            <span className="text-lg font-semibold text-foreground">SupplyConnect</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/auth/retailer/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth/supplier/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm text-accent-foreground">
            <CheckCircle className="h-4 w-4" />
            Trusted by 500+ suppliers across Pakistan
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Connect with verified{' '}
            <span className="text-primary">suppliers</span>{' '}
            instantly
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            The fastest way to find mobile accessories, request quotes, and build trusted business relationships.
            No middlemen, no hassle.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/auth/retailer/signup">
              <Button size="lg" className="w-full gap-2 sm:w-auto">
                I'm a Retailer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth/supplier/signup">
              <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                I'm a Supplier
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-2xl font-bold text-foreground md:text-3xl">
            Built for the way you work
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Retailer Feature */}
            <div className="rounded-xl border border-border bg-background p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <ShoppingBag className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">For Retailers</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Find products across multiple markets, request quotes, and connect with verified suppliers—all from your phone.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Search by brand, model, or category
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Compare suppliers on a map
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  WhatsApp & Call directly
                </li>
              </ul>
            </div>

            {/* Supplier Feature */}
            <div className="rounded-xl border border-border bg-background p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <Store className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">For Suppliers</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Get discovered by retailers, manage inventory easily, and grow your business with our simple tools.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Go live in 10 minutes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Simple inventory management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Built-in POS & analytics
                </li>
              </ul>
            </div>

            {/* Trust Feature */}
            <div className="rounded-xl border border-border bg-background p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <Shield className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Verified & Trusted</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Every supplier goes through verification. Look for the verified badge for peace of mind.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Identity verification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Shop documentation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Real-time stock updates
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-primary p-8 text-center md:p-12">
          <h2 className="mb-4 text-2xl font-bold text-primary-foreground md:text-3xl">
            Ready to grow your business?
          </h2>
          <p className="mb-6 text-primary-foreground/80">
            Join hundreds of suppliers and retailers already using SupplyConnect.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/auth/supplier/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start as Supplier
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="w-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 SupplyConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
