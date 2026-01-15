import { Router, Response } from 'express';
import { PrismaClient, InvoiceStatus, Plan, Prisma, Role } from '@prisma/client';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { requireRole } from '../middleware/validateRole.js';
import { AppError } from '../middleware/error.js';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const router = Router();
const prisma = new PrismaClient();

// Zod Schemas
const createInvoiceSchema = z.object({
  retailerUserId: z.string().optional(),
  retailer_name_snapshot: z.string().min(1),
  retailer_phone_snapshot: z.string().optional(),
  retailer_address_snapshot: z.string().optional(),
  invoice_date: z.string().datetime(),
  due_date: z.string().datetime().optional(),
  notes: z.string().optional(),
});

const updateInvoiceSchema = z.object({
  retailerUserId: z.string().optional().nullable(),
  retailer_name_snapshot: z.string().min(1).optional(),
  retailer_phone_snapshot: z.string().optional().nullable(),
  retailer_address_snapshot: z.string().optional().nullable(),
  invoice_date: z.string().datetime().optional(),
  due_date: z.string().datetime().optional().nullable(),
  notes: z.string().optional().nullable(),
  discount_total: z.number().min(0).optional(),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'CANCELLED']).optional(),
});

const lineItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1),
  quantity: z.number().positive(),
  unit_price: z.number().min(0),
  tax_rate: z.number().min(0).max(100).optional(),
});

const manageLineItemsSchema = z.object({
  items: z.array(lineItemSchema),
  itemsToDelete: z.array(z.string()).optional(),
});

// Helper function to generate invoice number
async function generateInvoiceNumber(supplierId: string): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  
  // Get the last invoice for this supplier in this year
  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      supplierId,
      invoice_number: {
        startsWith: prefix,
      },
    },
    orderBy: {
      invoice_number: 'desc',
    },
  });

  let sequence = 1;
  if (lastInvoice) {
    const parts = lastInvoice.invoice_number.split('-');
    if (parts.length >= 3) {
      const lastSequence = parseInt(parts[2], 10);
      if (!isNaN(lastSequence)) {
        sequence = lastSequence + 1;
      }
    }
  }

  return `${prefix}${sequence.toString().padStart(4, '0')}`;
}

// Helper function to calculate line total
function calculateLineTotal(
  quantity: number,
  unit_price: number,
  tax_rate?: number
): number {
  const base = quantity * unit_price;
  const tax = tax_rate ? base * (tax_rate / 100) : 0;
  return base + tax;
}

// Helper function to recalculate invoice totals
async function recalculateInvoiceTotals(invoiceId: string): Promise<void> {
  const lineItems = await prisma.invoiceLineItem.findMany({
    where: { invoiceId },
  });

  let subtotal = new Prisma.Decimal(0);
  let tax_total = new Prisma.Decimal(0);

  for (const item of lineItems) {
    const baseAmount = item.quantity.mul(item.unit_price);
    subtotal = subtotal.add(baseAmount);
    
    if (item.tax_rate) {
      const taxAmount = baseAmount.mul(item.tax_rate).div(100);
      tax_total = tax_total.add(taxAmount);
    }
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice) return;

  const total = subtotal.add(tax_total).sub(invoice.discount_total);

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      subtotal,
      tax_total,
      total,
    },
  });
}

// POST /api/supplier/invoices - Create invoice
router.post(
  '/',
  authenticate,
  requireRole(Role.SUPPLIER),
  async (req: AuthRequest, res: Response, next) => {
    try {
      const data = createInvoiceSchema.parse(req.body);
      
      const supplier = await prisma.supplierProfile.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!supplier) {
        throw new AppError(404, 'Supplier profile not found');
      }

      const invoice_number = await generateInvoiceNumber(supplier.id);

      const invoice = await prisma.invoice.create({
        data: {
          supplierId: supplier.id,
          retailerUserId: data.retailerUserId,
          retailer_name_snapshot: data.retailer_name_snapshot,
          retailer_phone_snapshot: data.retailer_phone_snapshot,
          retailer_address_snapshot: data.retailer_address_snapshot,
          invoice_number,
          invoice_date: new Date(data.invoice_date),
          due_date: data.due_date ? new Date(data.due_date) : null,
          notes: data.notes,
          subtotal: new Prisma.Decimal(0),
          tax_total: new Prisma.Decimal(0),
          discount_total: new Prisma.Decimal(0),
          total: new Prisma.Decimal(0),
          status: InvoiceStatus.DRAFT,
        },
        include: {
          lineItems: true,
        },
      });

      res.status(201).json(invoice);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/supplier/invoices - List invoices
router.get(
  '/',
  authenticate,
  requireRole(Role.SUPPLIER),
  async (req: AuthRequest, res: Response, next) => {
    try {
      const supplier = await prisma.supplierProfile.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!supplier) {
        throw new AppError(404, 'Supplier profile not found');
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as InvoiceStatus | undefined;
      const sortField = (req.query.sort as string)?.split(':')[0] || 'invoice_date';
      const sortOrder = (req.query.sort as string)?.split(':')[1] || 'desc';

      interface WhereClause {
        supplierId: string;
        status?: InvoiceStatus;
      }

      const where: WhereClause = { supplierId: supplier.id };
      if (status) {
        where.status = status;
      }

      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where,
          include: {
            lineItems: true,
            _count: {
              select: { lineItems: true },
            },
          },
          orderBy: {
            [sortField]: sortOrder,
          },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.invoice.count({ where }),
      ]);

      res.json({
        invoices,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/supplier/invoices/:id - Get single invoice
router.get(
  '/:id',
  authenticate,
  requireRole(Role.SUPPLIER),
  async (req: AuthRequest, res: Response, next) => {
    try {
      const supplier = await prisma.supplierProfile.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!supplier) {
        throw new AppError(404, 'Supplier profile not found');
      }

      const invoice = await prisma.invoice.findFirst({
        where: {
          id: req.params.id as string,
          supplierId: supplier.id,
        },
        include: {
          lineItems: true,
        },
      });

      if (!invoice) {
        throw new AppError(404, 'Invoice not found');
      }

      res.json(invoice);
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/supplier/invoices/:id - Update invoice
router.patch(
  '/:id',
  authenticate,
  requireRole(Role.SUPPLIER),
  async (req: AuthRequest, res: Response, next) => {
    try {
      const data = updateInvoiceSchema.parse(req.body);
      
      const supplier = await prisma.supplierProfile.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!supplier) {
        throw new AppError(404, 'Supplier profile not found');
      }

      const invoice = await prisma.invoice.findFirst({
        where: {
          id: req.params.id as string,
          supplierId: supplier.id,
        },
      });

      if (!invoice) {
        throw new AppError(404, 'Invoice not found');
      }

      // Allow status changes on any invoice, but other fields only on DRAFT
      const isStatusOnlyUpdate = data.status && Object.keys(data).length === 1;
      
      if (invoice.status !== InvoiceStatus.DRAFT && !isStatusOnlyUpdate) {
        throw new AppError(400, 'Can only update draft invoices (except for status changes)');
      }

      interface UpdateData {
        retailerUserId?: string | null;
        retailer_name_snapshot?: string;
        retailer_phone_snapshot?: string | null;
        retailer_address_snapshot?: string | null;
        invoice_date?: Date;
        due_date?: Date | null;
        notes?: string | null;
        status?: InvoiceStatus;
        discount_total?: Prisma.Decimal;
      }

      const updateData: UpdateData = {};
      
      if (data.retailerUserId !== undefined) updateData.retailerUserId = data.retailerUserId;
      if (data.retailer_name_snapshot) updateData.retailer_name_snapshot = data.retailer_name_snapshot;
      if (data.retailer_phone_snapshot !== undefined) updateData.retailer_phone_snapshot = data.retailer_phone_snapshot;
      if (data.retailer_address_snapshot !== undefined) updateData.retailer_address_snapshot = data.retailer_address_snapshot;
      if (data.invoice_date) updateData.invoice_date = new Date(data.invoice_date);
      if (data.due_date !== undefined) updateData.due_date = data.due_date ? new Date(data.due_date) : null;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.status) updateData.status = data.status;
      
      if (data.discount_total !== undefined) {
        updateData.discount_total = new Prisma.Decimal(data.discount_total);
      }

      await prisma.invoice.update({
        where: { id: req.params.id as string },
        data: updateData,
        include: {
          lineItems: true,
        },
      });

      // Recalculate totals if discount changed
      if (data.discount_total !== undefined) {
        await recalculateInvoiceTotals(req.params.id as string);
      }

      const finalInvoice = await prisma.invoice.findUnique({
        where: { id: req.params.id as string },
        include: { lineItems: true },
      });

      res.json(finalInvoice);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/supplier/invoices/:id/items - Manage line items
router.post(
  '/:id/items',
  authenticate,
  requireRole(Role.SUPPLIER),
  async (req: AuthRequest, res: Response, next) => {
    try {
      const data = manageLineItemsSchema.parse(req.body);
      
      const supplier = await prisma.supplierProfile.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!supplier) {
        throw new AppError(404, 'Supplier profile not found');
      }

      const invoice = await prisma.invoice.findFirst({
        where: {
          id: req.params.id as string,
          supplierId: supplier.id,
        },
      });

      if (!invoice) {
        throw new AppError(404, 'Invoice not found');
      }

      if (invoice.status !== InvoiceStatus.DRAFT) {
        throw new AppError(400, 'Can only modify line items on draft invoices');
      }

      // Delete items
      if (data.itemsToDelete && data.itemsToDelete.length > 0) {
        await prisma.invoiceLineItem.deleteMany({
          where: {
            id: { in: data.itemsToDelete },
            invoiceId: req.params.id as string,
          },
        });
      }

      // Add or update items
      for (const item of data.items) {
        const line_total = new Prisma.Decimal(
          calculateLineTotal(item.quantity, item.unit_price, item.tax_rate)
        );

        if (item.id) {
          // Update existing item
          await prisma.invoiceLineItem.update({
            where: { id: item.id },
            data: {
              description: item.description,
              quantity: new Prisma.Decimal(item.quantity),
              unit_price: new Prisma.Decimal(item.unit_price),
              tax_rate: item.tax_rate ? new Prisma.Decimal(item.tax_rate) : null,
              line_total,
            },
          });
        } else {
          // Create new item
          await prisma.invoiceLineItem.create({
            data: {
              invoiceId: req.params.id as string,
              description: item.description,
              quantity: new Prisma.Decimal(item.quantity),
              unit_price: new Prisma.Decimal(item.unit_price),
              tax_rate: item.tax_rate ? new Prisma.Decimal(item.tax_rate) : null,
              line_total,
            },
          });
        }
      }

      // Recalculate invoice totals
      await recalculateInvoiceTotals(req.params.id as string);

      const updatedInvoice = await prisma.invoice.findUnique({
        where: { id: req.params.id as string },
        include: { lineItems: true },
      });

      res.json(updatedInvoice);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/supplier/invoices/:id/generate-pdf - Generate PDF
router.post(
  '/:id/generate-pdf',
  authenticate,
  requireRole(Role.SUPPLIER),
  async (req: AuthRequest, res: Response, next) => {
    try {
      const supplier = await prisma.supplierProfile.findUnique({
        where: { userId: req.user!.userId },
        include: { subscription: true },
      });

      if (!supplier) {
        throw new AppError(404, 'Supplier profile not found');
      }

      const invoice = await prisma.invoice.findFirst({
        where: {
          id: req.params.id as string,
          supplierId: supplier.id,
        },
        include: {
          lineItems: true,
        },
      });

      if (!invoice) {
        throw new AppError(404, 'Invoice not found');
      }

      // Create directory if it doesn't exist
      const uploadDir = path.join(
        process.cwd(),
        'uploads',
        'invoices',
        supplier.id
      );
      
      try {
        await fs.promises.access(uploadDir);
      } catch {
        await fs.promises.mkdir(uploadDir, { recursive: true });
      }

      // Sanitize filename to prevent file system issues
      const safeFilename = invoice.invoice_number
        .replace(/[/\\:*?"<>|]/g, '-')
        .substring(0, 255); // Limit filename length
      const filename = `${safeFilename}.pdf`;
      const filepath = path.join(uploadDir, filename);

      // Generate PDF
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Determine if watermark needed
      const needsWatermark = supplier.subscription?.plan === Plan.FREE;

      // Helper to add watermark
      const addWatermark = () => {
        if (needsWatermark) {
          doc.save();
          doc.opacity(0.15);
          doc.fontSize(60);
          doc.rotate(-45, { origin: [300, 400] });
          doc.text('Generated with Free Plan', 50, 400, {
            width: 600,
            align: 'center',
          });
          doc.restore();
        }
      };

      // Add watermark to first page
      addWatermark();

      // Header
      doc.fontSize(20).text(supplier.shopName, { align: 'left' });
      doc.fontSize(10).text(supplier.address);
      doc.text(`Phone: ${supplier.phoneNumber}`);
      if (supplier.whatsappNumber) {
        doc.text(`WhatsApp: ${supplier.whatsappNumber}`);
      }
      doc.moveDown();

      // Invoice Info
      doc.fontSize(16).text('INVOICE', { align: 'center' });
      doc.fontSize(10);
      doc.text(`Invoice #: ${invoice.invoice_number}`, { align: 'right' });
      doc.text(
        `Date: ${invoice.invoice_date.toLocaleDateString()}`,
        { align: 'right' }
      );
      if (invoice.due_date) {
        doc.text(
          `Due Date: ${invoice.due_date.toLocaleDateString()}`,
          { align: 'right' }
        );
      }
      doc.moveDown();

      // Billed To
      doc.fontSize(12).text('Billed To:', { underline: true });
      doc.fontSize(10).text(invoice.retailer_name_snapshot);
      if (invoice.retailer_phone_snapshot) {
        doc.text(`Phone: ${invoice.retailer_phone_snapshot}`);
      }
      if (invoice.retailer_address_snapshot) {
        doc.text(invoice.retailer_address_snapshot);
      }
      doc.moveDown(2);

      // Items Table Header
      const tableTop = doc.y;
      const descWidth = 200;
      const qtyWidth = 60;
      const priceWidth = 80;
      const taxWidth = 60;
      const totalWidth = 80;
      
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Description', 50, tableTop, { width: descWidth });
      doc.text('Qty', 260, tableTop, { width: qtyWidth });
      doc.text('Unit Price', 330, tableTop, { width: priceWidth });
      doc.text('Tax %', 420, tableTop, { width: taxWidth });
      doc.text('Total', 490, tableTop, { width: totalWidth, align: 'right' });
      
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // Items
      doc.font('Helvetica');
      let currentY = tableTop + 25;

      for (const item of invoice.lineItems) {
        // Check if we need a new page
        if (currentY > 700) {
          doc.addPage();
          addWatermark();
          currentY = 50;
        }

        doc.fontSize(9);
        doc.text(item.description, 50, currentY, { width: descWidth });
        doc.text(item.quantity.toString(), 260, currentY, { width: qtyWidth });
        doc.text(
          `${invoice.currency} ${parseFloat(item.unit_price.toString()).toFixed(2)}`,
          330,
          currentY,
          { width: priceWidth }
        );
        doc.text(
          item.tax_rate ? `${item.tax_rate.toString()}%` : '-',
          420,
          currentY,
          { width: taxWidth }
        );
        doc.text(
          `${invoice.currency} ${parseFloat(item.line_total.toString()).toFixed(2)}`,
          490,
          currentY,
          { width: totalWidth, align: 'right' }
        );
        
        currentY += 25;
      }

      // Totals Section
      doc.moveDown(2);
      currentY = doc.y + 20;
      
      doc.fontSize(10);
      const totalsX = 400;
      
      doc.text('Subtotal:', totalsX, currentY);
      doc.text(
        `${invoice.currency} ${parseFloat(invoice.subtotal.toString()).toFixed(2)}`,
        490,
        currentY,
        { align: 'right' }
      );
      currentY += 20;

      doc.text('Tax Total:', totalsX, currentY);
      doc.text(
        `${invoice.currency} ${parseFloat(invoice.tax_total.toString()).toFixed(2)}`,
        490,
        currentY,
        { align: 'right' }
      );
      currentY += 20;

      doc.text('Discount:', totalsX, currentY);
      doc.text(
        `${invoice.currency} ${parseFloat(invoice.discount_total.toString()).toFixed(2)}`,
        490,
        currentY,
        { align: 'right' }
      );
      currentY += 20;

      doc.fontSize(12).font('Helvetica-Bold');
      doc.text('GRAND TOTAL:', totalsX, currentY);
      doc.text(
        `${invoice.currency} ${parseFloat(invoice.total.toString()).toFixed(2)}`,
        490,
        currentY,
        { align: 'right' }
      );

      // Notes
      if (invoice.notes) {
        doc.moveDown(3);
        doc.fontSize(10).font('Helvetica-Bold').text('Notes:');
        doc.font('Helvetica').fontSize(9).text(invoice.notes);
      }

      doc.end();

      // Wait for PDF to finish writing
      await new Promise<void>((resolve, reject) => {
        stream.on('finish', () => resolve());
        stream.on('error', reject);
      });

      // Update invoice with PDF URL
      const pdfUrl = `/uploads/invoices/${supplier.id}/${filename}`;
      await prisma.invoice.update({
        where: { id: req.params.id as string },
        data: { pdf_url: pdfUrl },
      });

      res.json({
        success: true,
        pdf_url: pdfUrl,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
