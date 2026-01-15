import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { invoices, Invoice } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Download, Eye, Edit } from 'lucide-react';
import { toast } from 'sonner';

const InvoicesList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED' | 'ALL'>('ALL');
  const limit = 20;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['invoices', page, status],
    queryFn: async () => {
      const params: any = { page, limit };
      if (status !== 'ALL') {
        params.status = status;
      }
      params.sort = 'invoice_date:desc';
      const response = await invoices.list(params);
      return response.data;
    },
  });

  const handleGeneratePDF = async (invoiceId: string) => {
    try {
      const response = await invoices.generatePDF(invoiceId);
      toast.success('PDF generated successfully!');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate PDF');
    }
  };

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
    return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">Error loading invoices</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage your customer invoices</p>
        </div>
        <Button onClick={() => navigate('/supplier/invoices/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Invoices</CardTitle>
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading invoices...</div>
          ) : data?.invoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No invoices found. Create your first invoice to get started.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Retailer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.invoices.map((invoice: Invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoice_number}
                      </TableCell>
                      <TableCell>{invoice.retailer_name_snapshot}</TableCell>
                      <TableCell>
                        {new Date(invoice.invoice_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {invoice.due_date
                          ? new Date(invoice.due_date).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/supplier/invoices/${invoice.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {invoice.status === 'DRAFT' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/supplier/invoices/${invoice.id}/edit`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                          {!invoice.pdf_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGeneratePDF(invoice.id)}
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          )}
                          {invoice.pdf_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`http://localhost:3001${invoice.pdf_url}`, '_blank')}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data && data.pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4">
                    Page {page} of {data.pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === data.pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesList;
