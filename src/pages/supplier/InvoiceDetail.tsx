import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Edit, FileText, Download, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { invoices, openPdfUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: invoice, isLoading, error } = useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const response = await invoices.get(id!);
      return response.data;
    },
    enabled: !!id,
  });

  const generatePDFMutation = useMutation({
    mutationFn: async () => {
      const response = await invoices.generatePDF(id!);
      return response.data;
    },
    onSuccess: () => {
      toast.success('PDF generated successfully!');
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
    },
    onError: (error) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to generate PDF');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED') => {
      const response = await invoices.update(id!, { status });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Invoice status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error) => {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to update status');
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-500';
      case 'SENT':
        return 'bg-blue-500';
      case 'PAID':
        return 'bg-green-500';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'PKR') => {
    return `${currency} ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Loading invoice...</div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="p-6">
        <div className="text-center py-8 text-red-500">
          Error loading invoice. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/supplier/invoices')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoices
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Invoice {invoice.invoice_number}</h1>
          <p className="text-muted-foreground">
            Created on {format(new Date(invoice.createdAt), 'PPP')}
          </p>
        </div>
        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
      </div>

      {!invoice.pdf_url && (
        <Alert>
          <AlertDescription>
            PDFs generated on Free Plan include a watermark. Upgrade to PRO to remove it.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Retailer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <p className="font-medium">{invoice.retailer_name_snapshot}</p>
            </div>
            {invoice.retailer_phone_snapshot && (
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="font-medium">{invoice.retailer_phone_snapshot}</p>
              </div>
            )}
            {invoice.retailer_address_snapshot && (
              <div>
                <Label className="text-muted-foreground">Address</Label>
                <p className="font-medium">{invoice.retailer_address_snapshot}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label className="text-muted-foreground">Invoice Date</Label>
              <p className="font-medium">
                {format(new Date(invoice.invoice_date), 'PPP')}
              </p>
            </div>
            {invoice.due_date && (
              <div>
                <Label className="text-muted-foreground">Due Date</Label>
                <p className="font-medium">
                  {format(new Date(invoice.due_date), 'PPP')}
                </p>
              </div>
            )}
            <div>
              <Label className="text-muted-foreground">Currency</Label>
              <p className="font-medium">{invoice.currency}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {invoice.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{invoice.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          {!invoice.lineItems || invoice.lineItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No line items added to this invoice.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Tax Rate</TableHead>
                      <TableHead className="text-right">Line Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unit_price, invoice.currency)}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.tax_rate ? `${item.tax_rate}%` : '0%'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.line_total, invoice.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 space-y-2 max-w-sm ml-auto">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax Total:</span>
                  <span>{formatCurrency(invoice.tax_total, invoice.currency)}</span>
                </div>
                {invoice.discount_total > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Discount:</span>
                    <span>-{formatCurrency(invoice.discount_total, invoice.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(invoice.total, invoice.currency)}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {invoice.status === 'DRAFT' && (
              <Button
                variant="outline"
                onClick={() => navigate(`/supplier/invoices/${id}/edit`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Invoice
              </Button>
            )}

            {!invoice.pdf_url && (
              <Button
                variant="outline"
                onClick={() => generatePDFMutation.mutate()}
                disabled={generatePDFMutation.isPending}
              >
                <FileText className="w-4 h-4 mr-2" />
                {generatePDFMutation.isPending ? 'Generating...' : 'Generate PDF'}
              </Button>
            )}

            {invoice.pdf_url && (
              <Button
                variant="outline"
                onClick={() => openPdfUrl(invoice.pdf_url!)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label>Update Status</Label>
            <Select
              value={invoice.status}
              onValueChange={(value) => updateStatusMutation.mutate(value as 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED')}
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger className="w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDetail;
