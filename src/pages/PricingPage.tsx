import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { subscriptionPlans } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">SC</span>
            </div>
            <span className="text-lg font-semibold text-foreground">SupplyConnect</span>
          </Link>
          <Link to="/auth/supplier/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Simple, transparent pricing
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Choose the plan that fits your business. Start free, upgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="mb-12 flex items-center justify-center gap-4">
            <span className={cn('text-sm', !isYearly && 'font-medium text-foreground')}>
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={cn('text-sm', isYearly && 'font-medium text-foreground')}>
              Yearly
              <span className="ml-1.5 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                Save 17%
              </span>
            </span>
          </div>

          {/* Plans */}
          <div className="grid gap-6 md:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-xl border bg-card p-6 text-left',
                  plan.popular
                    ? 'border-primary shadow-lg'
                    : 'border-border'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="mb-2 text-xl font-semibold text-foreground">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">
                    {plan.currency}{' '}
                    {isYearly
                      ? Math.round(plan.price.yearly / 12).toLocaleString()
                      : plan.price.monthly.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                {isYearly && (
                  <p className="mb-4 text-sm text-muted-foreground">
                    Billed yearly ({plan.currency} {plan.price.yearly.toLocaleString()})
                  </p>
                )}
                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/auth/supplier/signup">
                  <Button
                    className="w-full gap-2"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="border-t border-border bg-card py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Questions? We're here to help
          </h2>
          <p className="text-muted-foreground">
            Contact us at{' '}
            <a href="mailto:hello@supplyconnect.pk" className="text-primary hover:underline">
              hello@supplyconnect.pk
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
