# TradeRoutes - B2B Mobile Accessories Marketplace

A full-stack B2B marketplace connecting retailers with mobile accessory suppliers across Pakistan.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, npm, Docker, Git

### Setup Steps

```bash
# 1. Clone and install dependencies
git clone https://github.com/starwalker12/trade-routes-link.git
cd trade-routes-link
npm install
cd server && npm install && cd ..

# 2. Copy environment files
cp .env.example .env
cp server/.env.example server/.env

# 3. Start PostgreSQL
docker compose up -d

# 4. Setup database
cd server
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
cd ..

# 5. Start backend (in one terminal)
cd server && npm run dev

# 6. Start frontend (in another terminal)
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:3001

## 🧪 Test Credentials

All passwords: `password123`

**Admin:** admin@test.com  
**Retailers:** retailer@test.com, retailer2@test.com  
**Suppliers:**
- supplier1@test.com (PRO, Verified)
- supplier2@test.com (PRO, Verified)
- supplier3@test.com (FREE, Unverified)
- supplier4@test.com (FREE, Verified)
- supplier5@test.com (PRO, Verified)

## ✅ Implemented Features

### Backend (Priority 1)
- ✅ PostgreSQL database with Prisma ORM
- ✅ JWT authentication with bcrypt
- ✅ Multi-city support (5 cities, 20+ markets)
- ✅ Intelligent search with synonym mapping
- ✅ Supplier profiles with geolocation
- ✅ Inventory management with subscription gating
- ✅ Role-based access control
- ✅ 2-tier subscription system (FREE/PRO)

### Frontend
- ✅ React + TypeScript + TanStack Query
- ✅ SearchResults page wired to real API
- ✅ AppContext fetching cities dynamically
- ✅ Axios client with auth interceptors

### Subscription Tiers

**FREE Tier (Default for new suppliers):**
- Inventory limit: **25 SKUs maximum**
- Quantity visibility: **IN_STOCK_ONLY** (retailers never see exact numbers)
- Verified badge: Not available
- Search ranking: Standard (appears below PRO suppliers)
- Backend enforces all restrictions

**PRO Tier:**
- Inventory limit: **UNLIMITED**
- Quantity visibility: **EXACT_QUANTITY allowed** (suppliers choose visibility mode)
- Verified badge: Eligible for verification
- Search ranking: **Boosted** (appears above FREE suppliers)
- All premium features enabled

### Critical Business Rules
- ✅ NO PRICES shown to retailers (backend enforces)
- ✅ Subscription gating (FREE: 25 items, PRO: unlimited)
- ✅ Search ranking: PRO > verified > matchCount > updatedAt
- ✅ FREE suppliers forced to IN_STOCK_ONLY visibility
- ✅ Multi-city support (no hardcoding)
- ✅ Public search (no auth required)

## 📡 Key API Endpoints

```bash
# Search (Public)
POST /api/search
{
  "query": "samsung case",
  "cityId": "optional-uuid"
}

# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Get Cities (Public)
GET /api/cities

# Add Inventory (Supplier only)
POST /api/inventory
Authorization: Bearer <token>
{
  "newProduct": {
    "title": "Product Name",
    "category": "Cases",
    "brand": "Samsung"
  },
  "quantity": 100
}
```

## 🔍 Search Features

**Synonym Mapping:**  
case ↔ cover | glass ↔ protector | charger ↔ adaptor | cable ↔ wire

**Ranking:**  
1. **PRO suppliers first**
2. Verified suppliers next
3. Higher match count
4. Recently updated

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Vite, TanStack Query, shadcn/ui, Tailwind  
**Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, bcrypt, Zod

## 📋 Roadmap

**Completed:** Backend foundation, auth, search, inventory, 2-tier subscriptions, frontend integration  
**Next:** Map clustering, authentication UI, supplier dashboard wiring, upgrade CTAs  
**Planned:** Quotes, chat, admin panel, analytics, sales, receipt import

## 🆘 Support

Check README for detailed setup instructions and API documentation.

Full documentation at: [README.md]
