import { CheckCircle, XCircle, Clock, Eye, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { pendingVerifications } from '@/lib/mock-data';
import { useState } from 'react';

export default function AdminVerify() {
  const [verifications, setVerifications] = useState(pendingVerifications);

  const handleApprove = (id: string) => {
    setVerifications(verifications.filter((v) => v.id !== id));
  };

  const handleReject = (id: string) => {
    setVerifications(verifications.filter((v) => v.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Supplier Verifications</h1>
      <p className="mb-6 text-muted-foreground">{verifications.length} pending requests</p>

      {verifications.length > 0 ? (
        <div className="space-y-4">
          {verifications.map((verification) => (
            <Card key={verification.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{verification.shopName}</h3>
                    <p className="text-sm text-muted-foreground">{verification.supplierName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {verification.marketName}, {verification.cityName}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{verification.phone}</p>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    Pending
                  </Badge>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {verification.documents.map((doc) => (
                    <Badge key={doc} variant="outline">{doc}</Badge>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="gap-1.5" onClick={() => handleApprove(verification.id)}>
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5 text-destructive hover:bg-destructive/10" onClick={() => handleReject(verification.id)}>
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1.5">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <CheckCircle className="mb-4 h-12 w-12 text-primary" />
            <p className="font-medium text-foreground">All caught up!</p>
            <p className="text-sm text-muted-foreground">No pending verifications</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
