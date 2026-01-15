// Mock data for SupplyConnect - B2B Marketplace

export interface City {
  id: string;
  name: string;
  markets: Market[];
}

export interface Market {
  id: string;
  name: string;
  cityId: string;
  supplierCount: number;
  lat: number;
  lng: number;
}

export interface Supplier {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  whatsapp: string;
  cityId: string;
  marketId: string;
  marketName: string;
  cityName: string;
  address: string;
  isVerified: boolean;
  verifiedAt?: string;
  rating: number;
  totalProducts: number;
  lastActive: string;
  lat: number;
  lng: number;
  subscriptionTier: 'starter' | 'growth' | 'pro';
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  variant?: string;
  supplierId: string;
  quantity: number;
  inStock: boolean;
  lastUpdated: string;
}

export interface QuoteRequest {
  id: string;
  retailerId: string;
  supplierId: string;
  productId: string;
  quantity: number;
  note?: string;
  status: 'pending' | 'responded' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Retailer {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  cityId: string;
  createdAt: string;
}

// Cities with markets
export const cities: City[] = [
  {
    id: 'city-1',
    name: 'Lahore',
    markets: [
      { id: 'market-1', name: 'Hall Road', cityId: 'city-1', supplierCount: 45, lat: 31.5546, lng: 74.3432 },
      { id: 'market-2', name: 'Liberty Market', cityId: 'city-1', supplierCount: 28, lat: 31.5112, lng: 74.3447 },
      { id: 'market-3', name: 'Anarkali', cityId: 'city-1', supplierCount: 32, lat: 31.5653, lng: 74.3117 },
    ],
  },
  {
    id: 'city-2',
    name: 'Karachi',
    markets: [
      { id: 'market-4', name: 'Saddar', cityId: 'city-2', supplierCount: 67, lat: 24.8562, lng: 67.0176 },
      { id: 'market-5', name: 'Tariq Road', cityId: 'city-2', supplierCount: 41, lat: 24.8745, lng: 67.0612 },
      { id: 'market-6', name: 'Hyderi', cityId: 'city-2', supplierCount: 23, lat: 24.9402, lng: 67.0597 },
    ],
  },
  {
    id: 'city-3',
    name: 'Islamabad',
    markets: [
      { id: 'market-7', name: 'Jinnah Super', cityId: 'city-3', supplierCount: 19, lat: 33.7104, lng: 73.0800 },
      { id: 'market-8', name: 'F-10 Markaz', cityId: 'city-3', supplierCount: 15, lat: 33.6938, lng: 73.0169 },
    ],
  },
  {
    id: 'city-4',
    name: 'Faisalabad',
    markets: [
      { id: 'market-9', name: 'D Ground', cityId: 'city-4', supplierCount: 34, lat: 31.4187, lng: 73.0791 },
      { id: 'market-10', name: 'Rail Bazaar', cityId: 'city-4', supplierCount: 29, lat: 31.4181, lng: 73.0849 },
    ],
  },
];

// Suppliers
export const suppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Ahmed Electronics',
    shopName: 'Ahmed Mobile Accessories',
    phone: '+92 300 1234567',
    whatsapp: '+92 300 1234567',
    cityId: 'city-1',
    marketId: 'market-1',
    marketName: 'Hall Road',
    cityName: 'Lahore',
    address: 'Shop 45, Hall Road, Lahore',
    isVerified: true,
    verifiedAt: '2024-01-15',
    rating: 4.8,
    totalProducts: 156,
    lastActive: '2 hours ago',
    lat: 31.5548,
    lng: 74.3435,
    subscriptionTier: 'pro',
  },
  {
    id: 'sup-2',
    name: 'Mobile Hub',
    shopName: 'Mobile Hub Trading',
    phone: '+92 321 9876543',
    whatsapp: '+92 321 9876543',
    cityId: 'city-1',
    marketId: 'market-1',
    marketName: 'Hall Road',
    cityName: 'Lahore',
    address: 'Shop 78, Hall Road, Lahore',
    isVerified: true,
    verifiedAt: '2024-02-20',
    rating: 4.5,
    totalProducts: 89,
    lastActive: '30 min ago',
    lat: 31.5544,
    lng: 74.3430,
    subscriptionTier: 'growth',
  },
  {
    id: 'sup-3',
    name: 'TechZone',
    shopName: 'TechZone Electronics',
    phone: '+92 333 4567890',
    whatsapp: '+92 333 4567890',
    cityId: 'city-1',
    marketId: 'market-2',
    marketName: 'Liberty Market',
    cityName: 'Lahore',
    address: 'Shop 12, Liberty Market, Lahore',
    isVerified: false,
    rating: 4.2,
    totalProducts: 45,
    lastActive: '1 day ago',
    lat: 31.5115,
    lng: 74.3450,
    subscriptionTier: 'starter',
  },
  {
    id: 'sup-4',
    name: 'Karachi Mobile World',
    shopName: 'Mobile World',
    phone: '+92 311 2223334',
    whatsapp: '+92 311 2223334',
    cityId: 'city-2',
    marketId: 'market-4',
    marketName: 'Saddar',
    cityName: 'Karachi',
    address: 'Shop 23, Saddar, Karachi',
    isVerified: true,
    verifiedAt: '2024-03-10',
    rating: 4.7,
    totalProducts: 234,
    lastActive: '15 min ago',
    lat: 24.8565,
    lng: 67.0180,
    subscriptionTier: 'pro',
  },
  {
    id: 'sup-5',
    name: 'Accessory King',
    shopName: 'Accessory King',
    phone: '+92 345 6789012',
    whatsapp: '+92 345 6789012',
    cityId: 'city-2',
    marketId: 'market-5',
    marketName: 'Tariq Road',
    cityName: 'Karachi',
    address: 'Shop 56, Tariq Road, Karachi',
    isVerified: true,
    verifiedAt: '2024-01-05',
    rating: 4.9,
    totalProducts: 178,
    lastActive: '5 min ago',
    lat: 24.8748,
    lng: 67.0615,
    subscriptionTier: 'pro',
  },
];

// Products
export const products: Product[] = [
  { id: 'prod-1', name: 'Samsung A32 Silicone Case', brand: 'Samsung', model: 'A32', category: 'Cases', variant: 'Silicone', supplierId: 'sup-1', quantity: 150, inStock: true, lastUpdated: '2 hours ago' },
  { id: 'prod-2', name: 'Samsung A32 Glass Protector', brand: 'Samsung', model: 'A32', category: 'Screen Protectors', supplierId: 'sup-1', quantity: 200, inStock: true, lastUpdated: '1 hour ago' },
  { id: 'prod-3', name: 'iPhone 14 Pro Case Premium', brand: 'Apple', model: 'iPhone 14 Pro', category: 'Cases', variant: 'Premium', supplierId: 'sup-1', quantity: 75, inStock: true, lastUpdated: '3 hours ago' },
  { id: 'prod-4', name: 'USB-C Fast Charger 65W', brand: 'Generic', model: 'Universal', category: 'Chargers', variant: '65W', supplierId: 'sup-2', quantity: 50, inStock: true, lastUpdated: '30 min ago' },
  { id: 'prod-5', name: 'iPhone 15 MagSafe Charger', brand: 'Apple', model: 'iPhone 15', category: 'Chargers', variant: 'MagSafe', supplierId: 'sup-2', quantity: 25, inStock: true, lastUpdated: '1 day ago' },
  { id: 'prod-6', name: 'Samsung S24 Ultra Case', brand: 'Samsung', model: 'S24 Ultra', category: 'Cases', variant: 'Hard', supplierId: 'sup-4', quantity: 300, inStock: true, lastUpdated: '10 min ago' },
  { id: 'prod-7', name: 'Wireless Earbuds Pro', brand: 'Generic', model: 'Universal', category: 'Audio', supplierId: 'sup-5', quantity: 0, inStock: false, lastUpdated: '2 days ago' },
  { id: 'prod-8', name: 'Power Bank 20000mAh', brand: 'Anker', model: 'PowerCore', category: 'Power Banks', supplierId: 'sup-4', quantity: 45, inStock: true, lastUpdated: '5 hours ago' },
  { id: 'prod-9', name: 'Lightning Cable 2m', brand: 'Apple', model: 'Universal', category: 'Cables', supplierId: 'sup-3', quantity: 500, inStock: true, lastUpdated: '12 hours ago' },
  { id: 'prod-10', name: 'Phone Stand Adjustable', brand: 'Generic', model: 'Universal', category: 'Accessories', supplierId: 'sup-5', quantity: 120, inStock: true, lastUpdated: '1 hour ago' },
];

// Categories for filtering
export const categories = [
  'Cases',
  'Screen Protectors',
  'Chargers',
  'Cables',
  'Power Banks',
  'Audio',
  'Accessories',
];

// Brands for filtering
export const brands = [
  'Samsung',
  'Apple',
  'Xiaomi',
  'Oppo',
  'Vivo',
  'Realme',
  'OnePlus',
  'Huawei',
  'Generic',
  'Anker',
];

// Popular models
export const popularModels = [
  { brand: 'Samsung', models: ['A32', 'A52', 'A73', 'S23', 'S24 Ultra'] },
  { brand: 'Apple', models: ['iPhone 13', 'iPhone 14', 'iPhone 14 Pro', 'iPhone 15', 'iPhone 15 Pro'] },
  { brand: 'Xiaomi', models: ['Redmi Note 12', 'Poco X5', 'Poco F5'] },
];

// Recent searches (for demo)
export const recentSearches = [
  'Samsung A32 case',
  'iPhone 14 charger',
  'USB-C cable',
  'Screen protector',
];

// Subscription plans
export const subscriptionPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 999, yearly: 9990 },
    currency: 'PKR',
    features: [
      'List up to 50 products',
      'Basic analytics',
      'Quote requests',
      'WhatsApp integration',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: { monthly: 2499, yearly: 24990 },
    currency: 'PKR',
    features: [
      'List up to 200 products',
      'Advanced analytics',
      'Priority support',
      'Verified badge',
      'POS system',
      'Customer ledger',
    ],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 4999, yearly: 49990 },
    currency: 'PKR',
    features: [
      'Unlimited products',
      'Full analytics suite',
      '24/7 priority support',
      'Verified badge',
      'POS system',
      'Customer ledger',
      'AI receipt import',
      'Multi-branch support',
    ],
  },
];

// Dashboard stats for supplier
export const supplierDashboardStats = {
  todaySales: 45000,
  monthSales: 1250000,
  lowStockItems: 8,
  pendingQuotes: 12,
  topProducts: [
    { name: 'Samsung A32 Case', sales: 45 },
    { name: 'iPhone 14 Charger', sales: 38 },
    { name: 'USB-C Cable', sales: 32 },
  ],
  outstandingCredit: 125000,
};

// Pending verifications for admin
export const pendingVerifications = [
  {
    id: 'ver-1',
    supplierId: 'sup-3',
    supplierName: 'TechZone Electronics',
    shopName: 'TechZone',
    cityName: 'Lahore',
    marketName: 'Liberty Market',
    phone: '+92 333 4567890',
    submittedAt: '2024-03-15',
    documents: ['CNIC', 'Shop Registration'],
  },
  {
    id: 'ver-2',
    supplierId: 'sup-new-1',
    supplierName: 'New Mobile Shop',
    shopName: 'Mobile Express',
    cityName: 'Karachi',
    marketName: 'Saddar',
    phone: '+92 312 5556667',
    submittedAt: '2024-03-16',
    documents: ['CNIC', 'Shop Registration', 'NTN'],
  },
];
