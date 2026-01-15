import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { subscriptionPlans } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function SupplierSubscription() {
  const [isYearly, setIsYearly] = useState(false);
  const currentPlan = 'growth'; // Mock current plan

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-2xl font-bold text-foreground">Subscription</h1>
        <p className="mb-6 text-muted-foreground">Manage your subscription plan</p>

        {/* Current Plan */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">Growth Plan</p>
                <p className="text-muted-foreground">PKR 2,499/month • Renews on Apr 15, 2024</p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Billing Toggle */}
        <div className="mb-6 flex items-center justify-center gap-4">
          <span className={cn('text-sm', !isYearly && 'font-medium text-foreground')}>
            Monthly
          </span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={cn('text-sm', isYearly && 'font-medium text-foreground')}>
            Yearly
            <Badge variant="secondary" className="ml-1.5">Save 17%</Badge>
          </span>
        </div>

        {/* Plans */}
        <div className="grid gap-4 md:grid-cols-3">
          {subscriptionPlans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            
            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative',
                  isCurrent && 'border-primary'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-foreground">
                      {plan.currency}{' '}
                      {isYearly
                        ? Math.round(plan.price.yearly / 12).toLocaleString()
                        : plan.price.monthly.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="mt-6 w-full"
                    variant={isCurrent ? 'outline' : plan.popular ? 'default' : 'outline'}
                    disabled={isCurrent}
                  >
                    {isCurrent ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Cancel */}
        <div className="mt-8 text-center">
          <Button variant="ghost" className="text-muted-foreground hover:text-destructive">
            Cancel subscription
          </Button>
        </div>
      </div>
    </div>
  );
}
