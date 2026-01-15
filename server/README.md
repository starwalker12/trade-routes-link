# TradeRoutes B2B Marketplace Backend

Node.js + Express + TypeScript backend server for the TradeRoutes B2B marketplace application.

## Tech Stack

- **Node.js** + **Express** - Server framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database management
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Zod** - Input validation

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Seed data
├── src/
│   ├── middleware/       # Auth, error handling, role validation
│   ├── routes/          # API endpoints
│   ├── utils/           # JWT, search, synonyms
│   ├── app.ts          # Express app configuration
│   └── server.ts       # Server startup
└── package.json
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Start PostgreSQL (via Docker Compose):**
   ```bash
   docker-compose up -d
   ```

4. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

5. **Run migrations:**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed database:**
   ```bash
   npm run prisma:seed
   ```

## Development

Start the development server:
```bash
npm run dev
```

Server will run on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register/retailer` - Register retailer
- `POST /api/auth/register/supplier` - Register supplier
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Cities
- `GET /api/cities` - List all cities
- `GET /api/cities/:cityId/markets` - List markets in a city

### Search
- `GET /api/search?query=:query&cityId=:cityId&limit=:limit` - Search products (protected)
  - Supports synonym mapping (case/cover, charger/adaptor, etc.)
  - Ranking: verified > stock > updatedAt
  - Retailers don't see quantity/prices

### Suppliers
- `GET /api/suppliers/:supplierId` - Get supplier profile (public)
- `PUT /api/suppliers/profile` - Update own profile (supplier only)
- `GET /api/suppliers/:supplierId/inventory` - Get supplier inventory (public)

### Inventory
- `GET /api/inventory` - Get own inventory (supplier only)
- `POST /api/inventory` - Create inventory item (supplier only)
- `PUT /api/inventory/:itemId` - Update inventory item (supplier only)
- `DELETE /api/inventory/:itemId` - Delete inventory item (supplier only)

### Invoices (Supplier Only)
- `GET /api/supplier/invoices` - List invoices (with pagination)
- `POST /api/supplier/invoices` - Create new invoice
- `GET /api/supplier/invoices/:id` - Get invoice details
- `PATCH /api/supplier/invoices/:id` - Update invoice
- `POST /api/supplier/invoices/:id/items` - Manage invoice line items
- `POST /api/supplier/invoices/:id/generate-pdf` - Generate PDF

### Supplier Logo
- `POST /api/supplier/logo` - Upload company logo (supplier only)
  - Accepts: PNG, JPEG, WebP
  - Max size: 2MB
  - Requires authentication (JWT, supplier role)
  - Returns: `{ success: boolean, logoUrl: string }`
  - Uploaded to: `/server/uploads/logos/`
  - Updates: SupplierProfile.logoUrl

## Features

### Supplier Logo Upload
Suppliers can upload a company logo that appears on generated invoice PDFs:
- **Upload**: Through Supplier Settings page
- **Storage**: `/server/uploads/logos/<supplierId>-<timestamp>.<ext>`
- **Formats**: PNG, JPEG, WebP
- **Max Size**: 2MB
- **PDF Rendering**: Logo appears at top-left of invoice PDFs (60px height, aspect ratio maintained)
- **Fallback**: If no logo or file missing, displays company name as text with larger font
- **Watermark**: FREE plan invoices still show watermark, PRO plan doesn't (existing behavior preserved)

### Synonym Mapping
Search supports intelligent synonym matching:
- case ↔ cover
- glass ↔ protector ↔ screen
- handsfree ↔ earphones ↔ earbuds
- charger ↔ adaptor ↔ adapter
- cable ↔ wire
- silicone ↔ soft

### Subscription Gating
Inventory limits based on subscription plan:
- **STARTER**: 50 items
- **GROWTH**: 500 items
- **PRO**: Unlimited

### Role-Based Access Control
- **RETAILER**: Can search, view profiles, request quotes
- **SUPPLIER**: Can manage inventory, update profile
- **ADMIN**: (Future) Full access

## Test Users

Created by seed script:

**Admin:**
- Email: `admin@test.com`
- Password: `password123`

**Retailer:**
- Email: `retailer@test.com`
- Password: `password123`

**Suppliers:**
- Email: `supplier1@test.com` (Pro Plan, Verified)
- Email: `supplier2@test.com` (Growth Plan, Verified)
- Email: `supplier3@test.com` (Starter Plan, Unverified)
- Password: `password123` (all)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:seed` - Seed database
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:reset` - Reset database

## Testing

Run the test script:
```bash
./test-api.sh
```

Or test manually:
```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "retailer@test.com", "password": "password123"}'

# Search
curl "http://localhost:3001/api/search?query=samsung+case" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Schema

Key entities:
- **User** - Authentication and roles
- **RetailerProfile** - Retailer information
- **SupplierProfile** - Supplier shop details
- **Product** - Product catalog
- **InventoryItem** - Supplier stock
- **City** / **MarketArea** - Location data
- **Subscription** - Plan management
- **QuoteRequest** - RFQ system (future)
- **ChatThread** / **ChatMessage** - Chat system (future)

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 7-day expiry
- Role-based middleware protection
- Input validation with Zod
- Environment variables for secrets

## Future Routes (Not Yet Implemented)

- Quote management
- Chat system
- Admin panel
- Sales/POS
- Analytics

## License

Private - TradeRoutes
