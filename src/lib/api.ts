import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;

// Base URL for non-API resources (like PDFs)
export const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface City {
  id: string;
  name: string;
}

export interface MarketArea {
  id: string;
  cityId: string;
  name: string;
}

export interface User {
  id: string;
  role: 'RETAILER' | 'SUPPLIER' | 'ADMIN';
  email?: string;
  phone?: string;
}

export interface SupplierProfile {
  id: string;
  userId: string;
  shopName: string;
  cityId: string;
  marketAreaId: string;
  address: string;
  lat: number;
  lng: number;
  whatsappNumber?: string;
  phoneNumber: string;
  verifiedStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  city?: City;
  marketArea?: MarketArea;
}

export interface RetailerProfile {
  id: string;
  userId: string;
  shopName?: string;
  cityId: string;
  areaText?: string;
  phoneNumber?: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  brand?: string;
  phoneModel?: string;
  variant?: string;
}

export interface InventoryItem {
  id: string;
  supplierId: string;
  productId: string;
  quantity: number;
  visibilityMode: 'EXACT_QUANTITY' | 'IN_STOCK_ONLY';
  updatedAt: string;
  product?: Product;
}

export interface SearchResult {
  supplier: SupplierProfile;
  products: Array<{
    product: Product;
    quantity?: number; // Only for suppliers viewing their own inventory
    visibilityMode: 'EXACT_QUANTITY' | 'IN_STOCK_ONLY';
    inStock: boolean;
    lastUpdated: string;
  }>;
  matchCount: number;
}

export interface Invoice {
  id: string;
  supplierId: string;
  retailerUserId?: string;
  retailer_name_snapshot: string;
  retailer_phone_snapshot?: string;
  retailer_address_snapshot?: string;
  invoice_number: string;
  invoice_date: string;
  due_date?: string;
  currency: string;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  total: number;
  pdf_url?: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lineItems?: InvoiceLineItem[];
  _count?: {
    lineItems: number;
  };
}

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate?: number;
  line_total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceData {
  retailerUserId?: string;
  retailer_name_snapshot: string;
  retailer_phone_snapshot?: string;
  retailer_address_snapshot?: string;
  invoice_date: string;
  due_date?: string;
  notes?: string;
}

export interface UpdateInvoiceData {
  retailerUserId?: string;
  retailer_name_snapshot?: string;
  retailer_phone_snapshot?: string;
  retailer_address_snapshot?: string;
  invoice_date?: string;
  due_date?: string;
  notes?: string;
  discount_total?: number;
  status?: 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED';
}

export interface ManageLineItemsData {
  items: Array<{
    id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate?: number;
  }>;
  itemsToDelete?: string[];
}

// ============================================
// API FUNCTIONS
// ============================================

// Auth
export const auth = {
  register: (data: {
    email?: string;
    phone?: string;
    password: string;
    role: 'RETAILER' | 'SUPPLIER';
    profile: any;
  }) => api.post('/auth/register', data),

  login: (data: { email?: string; phone?: string; password: string }) =>
    api.post('/auth/login', data),

  me: () => api.get('/auth/me'),
};

// Cities
export const cities = {
  list: () => api.get<City[]>('/cities'),
  getMarkets: (cityId: string) => api.get<MarketArea[]>(`/cities/${cityId}/markets`),
};

// Search
export const search = {
  products: (params: {
    query: string;
    cityId?: string;
    categoryFilter?: string;
    brandFilter?: string;
    verifiedOnly?: boolean;
  }) => api.post<SearchResult[]>('/search', params),
};

// Suppliers
export const suppliers = {
  getProfile: (id: string) => api.get<SupplierProfile>(`/suppliers/${id}`),
  updateProfile: (data: Partial<SupplierProfile>) => api.put('/suppliers/profile', data),
  getInventory: (id: string) => api.get<InventoryItem[]>(`/suppliers/${id}/inventory`),
};

// Inventory (supplier only)
export const inventory = {
  list: () => api.get<InventoryItem[]>('/inventory'),
  create: (data: {
    productId?: string;
    newProduct?: {
      title: string;
      category: string;
      brand?: string;
      phoneModel?: string;
      variant?: string;
    };
    quantity: number;
    visibilityMode?: 'EXACT_QUANTITY' | 'IN_STOCK_ONLY';
  }) => api.post('/inventory', data),
  update: (id: string, data: { quantity: number; visibilityMode?: 'EXACT_QUANTITY' | 'IN_STOCK_ONLY' }) =>
    api.put(`/inventory/${id}`, data),
  delete: (id: string) => api.delete(`/inventory/${id}`),
};

// Invoices (supplier only)
export const invoices = {
  list: (params?: {
    page?: number;
    limit?: number;
    status?: 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED';
    sort?: string;
  }) => api.get<{
    invoices: Invoice[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>('/supplier/invoices', { params }),
  
  get: (id: string) => api.get<Invoice>(`/supplier/invoices/${id}`),
  
  create: (data: CreateInvoiceData) => api.post<Invoice>('/supplier/invoices', data),
  
  update: (id: string, data: UpdateInvoiceData) => 
    api.patch<Invoice>(`/supplier/invoices/${id}`, data),
  
  manageLineItems: (id: string, data: ManageLineItemsData) => 
    api.post<Invoice>(`/supplier/invoices/${id}/items`, data),
  
  generatePDF: (id: string) => 
    api.post<{ success: boolean; pdf_url: string }>(`/supplier/invoices/${id}/generate-pdf`),
};
