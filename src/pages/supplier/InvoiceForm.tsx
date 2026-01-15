import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

import { invoices, CreateInvoiceData, UpdateInvoiceData, ManageLineItemsData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const invoiceSchema = z.object({
  retailer_name_snapshot: z.string().min(1, 'Retailer name is required'),
  retailer_phone_snapshot: z.string().optional(),
  retailer_address_snapshot: z.string().optional(),
  invoice_date: z.date(),
  due_date: z.date().optional(),
  notes: z.string().optional(),
  discount_total: z.number().min(0).default(0),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_total: number;
}

const InvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [deletedItemIds, setDeletedItemIds] = useState<string[]>([]);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const response = await invoices.get(id!);
      return response.data;
    },
    enabled: isEditMode,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      retailer_name_snapshot: '',
      retailer_phone_snapshot: '',
      retailer_address_snapshot: '',
      invoice_date: new Date(),
      discount_total: 0,
      notes: '',
    },
  });

  const invoiceDate = watch('invoice_date');
  const dueDate = watch('due_date');
  const discountTotal = watch('discount_total');

  useEffect(() => {
    if (invoice) {
      setValue('retailer_name_snapshot', invoice.retailer_name_snapshot);
      setValue('retailer_phone_snapshot', invoice.retailer_phone_snapshot || '');
      setValue('retailer_address_snapshot', invoice.retailer_address_snapshot || '');
      setValue('invoice_date', new Date(invoice.invoice_date));
      setValue('due_date', invoice.due_date ? new Date(invoice.due_date) : undefined);
      setValue('notes', invoice.notes || '');
      setValue('discount_total', invoice.discount_total);

      if (invoice.lineItems) {
        setLineItems(
          invoice.lineItems.map((item) => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            tax_rate: item.tax_rate || 0,
            line_total: item.line_total,
          }))
        );
      }
    }
  }, [invoice, setValue]);

  const createMutation = useMutation({
    mutationFn: async (data: CreateInvoiceData) => {
      const response = await invoices.create(data);
      return response.data;
    },
    onSuccess: (newInvoice) => {
      return newInvoice;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInvoiceData }) => {
      const response = await invoices.update(id, data);
      return response.data;
    },
  });

  const manageLineItemsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ManageLineItemsData }) => {
      const response = await invoices.manageLineItems(id, data);
      return response.data;
    },
  });

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      const invoiceData: CreateInvoiceData | UpdateInvoiceData = {
        retailer_name_snapshot: data.retailer_name_snapshot,
        retailer_phone_snapshot: data.retailer_phone_snapshot,
        retailer_address_snapshot: data.retailer_address_snapshot,
        invoice_date: data.invoice_date.toISOString(),
        due_date: data.due_date?.toISOString(),
        notes: data.notes,
      };

      let invoiceId = id;

      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: id!,
          data: { ...invoiceData, discount_total: data.discount_total },
        });
      } else {
        const newInvoice = await createMutation.mutateAsync(invoiceData as CreateInvoiceData);
        invoiceId = newInvoice.id;
      }

      if (lineItems.length > 0 || deletedItemIds.length > 0) {
        const lineItemsData: ManageLineItemsData = {
          items: lineItems.map((item) => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            tax_rate: item.tax_rate,
          })),
          itemsToDelete: deletedItemIds.length > 0 ? deletedItemIds : undefined,
        };

        await manageLineItemsMutation.mutateAsync({
          id: invoiceId!,
          data: lineItemsData,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', invoiceId] });
      
      toast.success(isEditMode ? 'Invoice updated successfully!' : 'Invoice created successfully!');
      navigate(`/supplier/invoices/${invoiceId}`);
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Failed to save invoice');
    }
  };

  const calculateLineTotal = (quantity: number, unitPrice: number, taxRate: number) => {
    return quantity * unitPrice * (1 + taxRate / 100);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        description: '',
        quantity: 1,
        unit_price: 0,
        tax_rate: 0,
        line_total: 0,
      },
    ]);
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };

    if (field === 'quantity' || field === 'unit_price' || field === 'tax_rate') {
      updated[index].line_total = calculateLineTotal(
        updated[index].quantity,
        updated[index].unit_price,
        updated[index].tax_rate
      );
    }

    setLineItems(updated);
  };

  const deleteLineItem = (index: number) => {
    const item = lineItems[index];
    if (item.id) {
      setDeletedItemIds([...deletedItemIds, item.id]);
    }
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  const taxTotal = lineItems.reduce(
    (sum, item) => sum + (item.quantity * item.unit_price * item.tax_rate) / 100,
    0
  );

  const grandTotal = subtotal + taxTotal - (discountTotal || 0);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading invoice...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Edit Invoice' : 'Create Invoice'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode ? 'Update invoice details' : 'Create a new invoice for your customer'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="retailer_name_snapshot">
                  Retailer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="retailer_name_snapshot"
                  {...register('retailer_name_snapshot')}
                  placeholder="Enter retailer name"
                />
                {errors.retailer_name_snapshot && (
                  <p className="text-sm text-red-500">{errors.retailer_name_snapshot.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="retailer_phone_snapshot">Phone Number</Label>
                <Input
                  id="retailer_phone_snapshot"
                  {...register('retailer_phone_snapshot')}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="retailer_address_snapshot">Address</Label>
                <Textarea
                  id="retailer_address_snapshot"
                  {...register('retailer_address_snapshot')}
                  placeholder="Enter retailer address"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Invoice Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !invoiceDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {invoiceDate ? format(invoiceDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={invoiceDate}
                      onSelect={(date) => setValue('invoice_date', date || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dueDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={(date) => setValue('due_date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Add any additional notes or terms"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Line Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent>
            {lineItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No line items added. Click "Add Item" to add products or services.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[35%]">Description</TableHead>
                      <TableHead className="w-[12%]">Quantity</TableHead>
                      <TableHead className="w-[15%]">Unit Price</TableHead>
                      <TableHead className="w-[12%]">Tax Rate (%)</TableHead>
                      <TableHead className="w-[18%] text-right">Line Total</TableHead>
                      <TableHead className="w-[8%]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) =>
                              updateLineItem(index, 'description', e.target.value)
                            }
                            placeholder="Item description"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unit_price}
                            onChange={(e) =>
                              updateLineItem(index, 'unit_price', parseFloat(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={item.tax_rate}
                            onChange={(e) =>
                              updateLineItem(index, 'tax_rate', parseFloat(e.target.value) || 0)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {item.line_total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteLineItem(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="mt-6 space-y-2 max-w-sm ml-auto">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax Total:</span>
                <span>{taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="discount_total">Discount Total:</Label>
                <Input
                  id="discount_total"
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-32 text-right"
                  {...register('discount_total', { valueAsNumber: true })}
                />
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Grand Total:</span>
                <span>{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/supplier/invoices')}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || manageLineItemsMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {isEditMode ? 'Update Invoice' : 'Save as Draft'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
