import { PrismaClient, Role, VerifiedStatus, Plan, SubscriptionStatus, VisibilityMode } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatThread.deleteMany();
  await prisma.invoiceLineItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.retailerCustomer.deleteMany();
  await prisma.quoteRequest.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.product.deleteMany();
  await prisma.phoneModel.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.supplierProfile.deleteMany();
  await prisma.retailerProfile.deleteMany();
  await prisma.marketArea.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  // Hash password for test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // ============================================
  // CITIES & MARKETS
  // ============================================
  console.log('Creating cities and markets...');

  const lahore = await prisma.city.create({
    data: {
      name: 'Lahore',
      markets: {
        create: [
          { name: 'Hall Road' },
          { name: 'Hafeez Center' },
          { name: 'Liberty Market' },
          { name: 'Anarkali' },
          { name: 'Landa Bazaar' },
        ],
      },
    },
    include: { markets: true },
  });

  const karachi = await prisma.city.create({
    data: {
      name: 'Karachi',
      markets: {
        create: [
          { name: 'Saddar' },
          { name: 'Tariq Road' },
          { name: 'Hyderi' },
          { name: 'Bohri Bazaar' },
          { name: 'Regal Chowk' },
        ],
      },
    },
    include: { markets: true },
  });

  const islamabad = await prisma.city.create({
    data: {
      name: 'Islamabad',
      markets: {
        create: [
          { name: 'Jinnah Super' },
          { name: 'F-10 Markaz' },
          { name: 'Blue Area' },
          { name: 'Centaurus Mall' },
        ],
      },
    },
    include: { markets: true },
  });

  const faisalabad = await prisma.city.create({
    data: {
      name: 'Faisalabad',
      markets: {
        create: [
          { name: 'D Ground' },
          { name: 'Rail Bazaar' },
          { name: 'Clock Tower' },
        ],
      },
    },
    include: { markets: true },
  });

  const rawalpindi = await prisma.city.create({
    data: {
      name: 'Rawalpindi',
      markets: {
        create: [
          { name: 'Saddar Bazaar' },
          { name: 'Raja Bazaar' },
          { name: 'Commercial Market' },
        ],
      },
    },
    include: { markets: true },
  });

  // ============================================
  // CATEGORIES & BRANDS
  // ============================================
  console.log('Creating categories and brands...');

  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Cases' } }),
    prisma.category.create({ data: { name: 'Screen Protectors' } }),
    prisma.category.create({ data: { name: 'Chargers' } }),
    prisma.category.create({ data: { name: 'Cables' } }),
    prisma.category.create({ data: { name: 'Power Banks' } }),
    prisma.category.create({ data: { name: 'Audio' } }),
    prisma.category.create({ data: { name: 'Accessories' } }),
  ]);

  const samsung = await prisma.brand.create({
    data: {
      name: 'Samsung',
      phoneModels: {
        create: [
          { name: 'A32' },
          { name: 'A52' },
          { name: 'A73' },
          { name: 'S23' },
          { name: 'S24' },
          { name: 'S24 Ultra' },
        ],
      },
    },
  });

  const apple = await prisma.brand.create({
    data: {
      name: 'Apple',
      phoneModels: {
        create: [
          { name: 'iPhone 13' },
          { name: 'iPhone 14' },
          { name: 'iPhone 14 Pro' },
          { name: 'iPhone 15' },
          { name: 'iPhone 15 Pro' },
        ],
      },
    },
  });

  const xiaomi = await prisma.brand.create({
    data: {
      name: 'Xiaomi',
      phoneModels: {
        create: [
          { name: 'Redmi Note 12' },
          { name: 'Poco X5' },
          { name: 'Poco F5' },
        ],
      },
    },
  });

  await prisma.brand.createMany({
    data: [
      { name: 'Oppo' },
      { name: 'Vivo' },
      { name: 'Realme' },
      { name: 'OnePlus' },
      { name: 'Huawei' },
      { name: 'Anker' },
      { name: 'Generic' },
    ],
  });

  // ============================================
  // USERS
  // ============================================
  console.log('Creating users...');

  // Admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      phone: '+923001111111',
      passwordHash: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // Retailer users
  const retailer1 = await prisma.user.create({
    data: {
      email: 'retailer@test.com',
      phone: '+923001234567',
      passwordHash: hashedPassword,
      role: Role.RETAILER,
      retailerProfile: {
        create: {
          shopName: 'Mobile Plaza',
          cityId: lahore.id,
          areaText: 'Johar Town',
          phoneNumber: '+923001234567',
        },
      },
    },
  });

  const retailer2 = await prisma.user.create({
    data: {
      email: 'retailer2@test.com',
      phone: '+923009876543',
      passwordHash: hashedPassword,
      role: Role.RETAILER,
      retailerProfile: {
        create: {
          shopName: 'Tech Shop',
          cityId: karachi.id,
          areaText: 'Clifton',
          phoneNumber: '+923009876543',
        },
      },
    },
  });

  // Supplier users (verified and unverified)
  const supplier1 = await prisma.user.create({
    data: {
      email: 'supplier1@test.com',
      phone: '+923002222222',
      passwordHash: hashedPassword,
      role: Role.SUPPLIER,
      supplierProfile: {
        create: {
          shopName: 'Ahmed Mobile Accessories',
          cityId: lahore.id,
          marketAreaId: lahore.markets[0].id, // Hall Road
          address: 'Shop 45, Hall Road, Lahore',
          lat: 31.5548,
          lng: 74.3435,
          phoneNumber: '+923002222222',
          whatsappNumber: '+923002222222',
          verifiedStatus: VerifiedStatus.VERIFIED,
          subscription: {
            create: {
              plan: Plan.PRO,
              status: SubscriptionStatus.ACTIVE,
            },
          },
        },
      },
    },
  });

  const supplier2 = await prisma.user.create({
    data: {
      email: 'supplier2@test.com',
      phone: '+923003333333',
      passwordHash: hashedPassword,
      role: Role.SUPPLIER,
      supplierProfile: {
        create: {
          shopName: 'Mobile Hub Trading',
          cityId: lahore.id,
          marketAreaId: lahore.markets[0].id, // Hall Road
          address: 'Shop 78, Hall Road, Lahore',
          lat: 31.5544,
          lng: 74.3430,
          phoneNumber: '+923003333333',
          whatsappNumber: '+923003333333',
          verifiedStatus: VerifiedStatus.VERIFIED,
          subscription: {
            create: {
              plan: Plan.PRO,
              status: SubscriptionStatus.ACTIVE,
            },
          },
        },
      },
    },
  });

  const supplier3 = await prisma.user.create({
    data: {
      email: 'supplier3@test.com',
      phone: '+923004444444',
      passwordHash: hashedPassword,
      role: Role.SUPPLIER,
      supplierProfile: {
        create: {
          shopName: 'TechZone Electronics',
          cityId: lahore.id,
          marketAreaId: lahore.markets[2].id, // Liberty Market
          address: 'Shop 12, Liberty Market, Lahore',
          lat: 31.5115,
          lng: 74.3450,
          phoneNumber: '+923004444444',
          whatsappNumber: '+923004444444',
          verifiedStatus: VerifiedStatus.PENDING,
          subscription: {
            create: {
              plan: Plan.FREE,
              status: SubscriptionStatus.ACTIVE,
            },
          },
        },
      },
    },
  });

  const supplier4 = await prisma.user.create({
    data: {
      email: 'supplier4@test.com',
      phone: '+923005555555',
      passwordHash: hashedPassword,
      role: Role.SUPPLIER,
      supplierProfile: {
        create: {
          shopName: 'Mobile World',
          cityId: karachi.id,
          marketAreaId: karachi.markets[0].id, // Saddar
          address: 'Shop 23, Saddar, Karachi',
          lat: 24.8565,
          lng: 67.0180,
          phoneNumber: '+923005555555',
          whatsappNumber: '+923005555555',
          verifiedStatus: VerifiedStatus.VERIFIED,
          subscription: {
            create: {
              plan: Plan.FREE,
              status: SubscriptionStatus.ACTIVE,
            },
          },
        },
      },
    },
  });

  const supplier5 = await prisma.user.create({
    data: {
      email: 'supplier5@test.com',
      phone: '+923006666666',
      passwordHash: hashedPassword,
      role: Role.SUPPLIER,
      supplierProfile: {
        create: {
          shopName: 'Accessory King',
          cityId: karachi.id,
          marketAreaId: karachi.markets[1].id, // Tariq Road
          address: 'Shop 56, Tariq Road, Karachi',
          lat: 24.8748,
          lng: 67.0615,
          phoneNumber: '+923006666666',
          whatsappNumber: '+923006666666',
          verifiedStatus: VerifiedStatus.VERIFIED,
          subscription: {
            create: {
              plan: Plan.PRO,
              status: SubscriptionStatus.ACTIVE,
            },
          },
        },
      },
    },
  });

  // ============================================
  // PRODUCTS
  // ============================================
  console.log('Creating products...');

  const products = await Promise.all([
    // Samsung A32 products
    prisma.product.create({
      data: {
        title: 'Samsung A32 Silicone Case',
        category: 'Cases',
        brand: 'Samsung',
        phoneModel: 'A32',
        variant: 'Silicone',
        searchText: 'samsung a32 silicone case cover soft',
      },
    }),
    prisma.product.create({
      data: {
        title: 'Samsung A32 Glass Protector',
        category: 'Screen Protectors',
        brand: 'Samsung',
        phoneModel: 'A32',
        variant: 'Tempered Glass',
        searchText: 'samsung a32 glass protector screen tempered',
      },
    }),
    // iPhone 14 Pro products
    prisma.product.create({
      data: {
        title: 'iPhone 14 Pro Case Premium',
        category: 'Cases',
        brand: 'Apple',
        phoneModel: 'iPhone 14 Pro',
        variant: 'Premium',
        searchText: 'iphone 14 pro case cover premium',
      },
    }),
    prisma.product.create({
      data: {
        title: 'iPhone 14 Pro Screen Protector',
        category: 'Screen Protectors',
        brand: 'Apple',
        phoneModel: 'iPhone 14 Pro',
        variant: 'Tempered Glass',
        searchText: 'iphone 14 pro screen protector glass',
      },
    }),
    // Chargers
    prisma.product.create({
      data: {
        title: 'USB-C Fast Charger 65W',
        category: 'Chargers',
        brand: 'Generic',
        phoneModel: 'Universal',
        variant: '65W',
        searchText: 'usb-c fast charger 65w adaptor',
      },
    }),
    prisma.product.create({
      data: {
        title: 'iPhone 15 MagSafe Charger',
        category: 'Chargers',
        brand: 'Apple',
        phoneModel: 'iPhone 15',
        variant: 'MagSafe',
        searchText: 'iphone 15 magsafe charger wireless',
      },
    }),
    // Samsung S24 Ultra
    prisma.product.create({
      data: {
        title: 'Samsung S24 Ultra Hard Case',
        category: 'Cases',
        brand: 'Samsung',
        phoneModel: 'S24 Ultra',
        variant: 'Hard',
        searchText: 'samsung s24 ultra hard case cover',
      },
    }),
    // Audio
    prisma.product.create({
      data: {
        title: 'Wireless Earbuds Pro',
        category: 'Audio',
        brand: 'Generic',
        phoneModel: 'Universal',
        variant: 'TWS',
        searchText: 'wireless earbuds pro handsfree earphones',
      },
    }),
    // Power Bank
    prisma.product.create({
      data: {
        title: 'Anker PowerCore 20000mAh',
        category: 'Power Banks',
        brand: 'Anker',
        phoneModel: 'Universal',
        variant: '20000mAh',
        searchText: 'anker powercore 20000mah power bank battery',
      },
    }),
    // Cable
    prisma.product.create({
      data: {
        title: 'Lightning Cable 2m',
        category: 'Cables',
        brand: 'Apple',
        phoneModel: 'Universal',
        variant: '2m',
        searchText: 'lightning cable 2m wire apple',
      },
    }),
  ]);

  // ============================================
  // INVENTORY
  // ============================================
  console.log('Creating inventory items...');

  const supplier1Profile = await prisma.supplierProfile.findUnique({
    where: { userId: supplier1.id },
  });
  const supplier2Profile = await prisma.supplierProfile.findUnique({
    where: { userId: supplier2.id },
  });
  const supplier3Profile = await prisma.supplierProfile.findUnique({
    where: { userId: supplier3.id },
  });
  const supplier4Profile = await prisma.supplierProfile.findUnique({
    where: { userId: supplier4.id },
  });
  const supplier5Profile = await prisma.supplierProfile.findUnique({
    where: { userId: supplier5.id },
  });

  if (supplier1Profile && supplier2Profile && supplier3Profile && supplier4Profile && supplier5Profile) {
    await prisma.inventoryItem.createMany({
      data: [
        // Supplier 1 (verified, pro)
        { supplierId: supplier1Profile.id, productId: products[0].id, quantity: 150, visibilityMode: VisibilityMode.EXACT_QUANTITY },
        { supplierId: supplier1Profile.id, productId: products[1].id, quantity: 200, visibilityMode: VisibilityMode.EXACT_QUANTITY },
        { supplierId: supplier1Profile.id, productId: products[2].id, quantity: 75, visibilityMode: VisibilityMode.EXACT_QUANTITY },
        // Supplier 2 (verified, growth)
        { supplierId: supplier2Profile.id, productId: products[4].id, quantity: 50, visibilityMode: VisibilityMode.EXACT_QUANTITY },
        { supplierId: supplier2Profile.id, productId: products[5].id, quantity: 25, visibilityMode: VisibilityMode.IN_STOCK_ONLY },
        // Supplier 3 (unverified, starter)
        { supplierId: supplier3Profile.id, productId: products[9].id, quantity: 500, visibilityMode: VisibilityMode.EXACT_QUANTITY },
        // Supplier 4 (verified, pro)
        { supplierId: supplier4Profile.id, productId: products[6].id, quantity: 300, visibilityMode: VisibilityMode.EXACT_QUANTITY },
        { supplierId: supplier4Profile.id, productId: products[8].id, quantity: 45, visibilityMode: VisibilityMode.EXACT_QUANTITY },
        // Supplier 5 (verified, pro)
        { supplierId: supplier5Profile.id, productId: products[7].id, quantity: 120, visibilityMode: VisibilityMode.IN_STOCK_ONLY },
      ],
    });
  }

  // ============================================
  // QUOTE REQUESTS
  // ============================================
  console.log('Creating sample quote requests...');

  const retailer1Profile = await prisma.retailerProfile.findUnique({
    where: { userId: retailer1.id },
  });

  if (retailer1Profile && supplier1Profile) {
    await prisma.quoteRequest.create({
      data: {
        retailerId: retailer1Profile.id,
        supplierId: supplier1Profile.id,
        productId: products[0].id,
        quantity: 50,
        note: 'Need bulk pricing for Samsung A32 cases',
        status: 'PENDING',
      },
    });
  }

  // ============================================
  // SAMPLE INVOICES
  // ============================================
  console.log('Creating sample invoices...');

  if (supplier1Profile && retailer1Profile) {
    // Invoice 1: DRAFT invoice for PRO supplier
    const invoice1 = await prisma.invoice.create({
      data: {
        supplierId: supplier1Profile.id,
        retailerUserId: retailer1.id,
        retailer_name_snapshot: 'Mobile Hub Lahore',
        retailer_phone_snapshot: '+92-300-1234567',
        retailer_address_snapshot: 'Shop 45, Hall Road, Lahore',
        invoice_number: 'INV-2026-0001',
        invoice_date: new Date('2026-01-10'),
        due_date: new Date('2026-01-25'),
        currency: 'PKR',
        subtotal: 45000,
        tax_total: 7200,
        discount_total: 2000,
        total: 50200,
        status: 'DRAFT',
        notes: 'Bulk order discount applied',
      },
    });

    await prisma.invoiceLineItem.createMany({
      data: [
        {
          invoiceId: invoice1.id,
          description: 'Samsung A32 Premium Cases (Pack of 50)',
          quantity: 50,
          unit_price: 800,
          tax_rate: 18,
          line_total: 47200,
        },
        {
          invoiceId: invoice1.id,
          description: 'Tempered Glass Protectors (Pack of 20)',
          quantity: 20,
          unit_price: 250,
          tax_rate: 0,
          line_total: 5000,
        },
      ],
    });

    // Invoice 2: SENT invoice for PRO supplier
    const invoice2 = await prisma.invoice.create({
      data: {
        supplierId: supplier1Profile.id,
        retailer_name_snapshot: 'Tech Store Karachi',
        retailer_phone_snapshot: '+92-321-9876543',
        retailer_address_snapshot: 'Shop 12, Saddar, Karachi',
        invoice_number: 'INV-2026-0002',
        invoice_date: new Date('2026-01-12'),
        due_date: new Date('2026-01-27'),
        currency: 'PKR',
        subtotal: 28000,
        tax_total: 5040,
        discount_total: 0,
        total: 33040,
        status: 'SENT',
        notes: 'Payment terms: 15 days',
      },
    });

    await prisma.invoiceLineItem.createMany({
      data: [
        {
          invoiceId: invoice2.id,
          description: 'iPhone 13 Cases Mixed Colors (Pack of 30)',
          quantity: 30,
          unit_price: 700,
          tax_rate: 18,
          line_total: 24780,
        },
        {
          invoiceId: invoice2.id,
          description: 'USB-C Charging Cables (Pack of 40)',
          quantity: 40,
          unit_price: 200,
          tax_rate: 18,
          line_total: 9440,
        },
      ],
    });
  }

  if (supplier4Profile) {
    // Invoice 3: DRAFT invoice for FREE supplier
    const invoice3 = await prisma.invoice.create({
      data: {
        supplierId: supplier4Profile.id,
        retailer_name_snapshot: 'Mobile Shop ISB',
        retailer_phone_snapshot: '+92-333-5551234',
        retailer_address_snapshot: 'F-10 Markaz, Islamabad',
        invoice_number: 'INV-2026-0001',
        invoice_date: new Date('2026-01-14'),
        due_date: new Date('2026-01-29'),
        currency: 'PKR',
        subtotal: 12000,
        tax_total: 2160,
        discount_total: 500,
        total: 13660,
        status: 'DRAFT',
        notes: 'First time customer discount',
      },
    });

    await prisma.invoiceLineItem.createMany({
      data: [
        {
          invoiceId: invoice3.id,
          description: 'Xiaomi Redmi Cases (Pack of 20)',
          quantity: 20,
          unit_price: 600,
          tax_rate: 18,
          line_total: 14160,
        },
      ],
    });
  }

  console.log('Seed completed successfully!');
  console.log('\n=== TEST USER CREDENTIALS ===');
  console.log('Admin: admin@test.com / password123');
  console.log('Retailer: retailer@test.com / password123');
  console.log('Verified Supplier (PRO): supplier1@test.com / password123');
  console.log('Verified Supplier (PRO): supplier2@test.com / password123');
  console.log('Unverified Supplier (FREE): supplier3@test.com / password123');
  console.log('Verified Supplier (FREE): supplier4@test.com / password123');
  console.log('Verified Supplier (PRO): supplier5@test.com / password123');
  console.log('============================\n');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
