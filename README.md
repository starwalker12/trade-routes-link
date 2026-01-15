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
**Suppliers:** supplier1@test.com through supplier5@test.com

## ✅ Implemented Features

### Backend (Priority 1)
- ✅ PostgreSQL database with Prisma ORM
- ✅ JWT authentication with bcrypt
- ✅ Multi-city support (5 cities, 20+ markets)
- ✅ Intelligent search with synonym mapping
- ✅ Supplier profiles with geolocation
- ✅ Inventory management with subscription gating
- ✅ Role-based access control

### Frontend
- ✅ React + TypeScript + TanStack Query
- ✅ SearchResults page wired to real API
- ✅ AppContext fetching cities dynamically
- ✅ Axios client with auth interceptors

### Critical Business Rules
- ✅ NO PRICES shown to retailers (backend enforces)
- ✅ Subscription gating (50/500/unlimited items)
- ✅ Search ranking: verified > matchCount > updatedAt
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
1. Verified suppliers first
2. Higher match count
3. Recently updated

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Vite, TanStack Query, shadcn/ui, Tailwind  
**Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, bcrypt, Zod

## 📋 Roadmap

**Completed:** Backend foundation, auth, search, inventory, frontend integration  
**Next:** Map clustering, authentication UI, supplier dashboard wiring  
**Planned:** Quotes, chat, admin panel, subscriptions, analytics, sales

## 🆘 Support

Check README for detailed setup instructions and API documentation.

Full documentation at: [README.md]
