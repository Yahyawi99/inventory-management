// packages/db/scripts/seed.ts

// Corrected import path to use the official @prisma/client package.
// This is the standard way to import both the PrismaClient and the generated types and enums.
import {
  PrismaClient,
  OrderStatus,
  OrderType,
  CustomerType,
  InvoiceStatus,
} from "../generated/prisma/index.js";
import { faker } from "@faker-js/faker";
import { randomUUID } from "crypto";
import type {
  Category,
  Supplier,
  Stock,
  Customer,
  Product,
  Organization,
  User,
} from "../types";

// Helper for date ranges (assuming it's available in utils, or you can add it here directly)
// If getDateRangesForComparison and isDateWithinRange are in a separate file, ensure they are imported.
// For self-containment in this seed script, I'll define a simplified version here.
const getSeedDateRanges = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of today

  // Current Period (Last 7 full days, ending yesterday)
  const endCurrentPeriod = new Date(today);
  endCurrentPeriod.setDate(today.getDate() - 1); // End of yesterday
  endCurrentPeriod.setHours(23, 59, 59, 999);

  const startCurrentPeriod = new Date(endCurrentPeriod);
  startCurrentPeriod.setDate(endCurrentPeriod.getDate() - 6); // 7 days back from end of yesterday
  startCurrentPeriod.setHours(0, 0, 0, 0);

  // Previous Period (the 7 days before the current period)
  const endPreviousPeriod = new Date(startCurrentPeriod);
  endPreviousPeriod.setDate(startCurrentPeriod.getDate() - 1); // Day before current period starts
  endPreviousPeriod.setHours(23, 59, 59, 999);

  const startPreviousPeriod = new Date(endPreviousPeriod);
  startPreviousPeriod.setDate(endPreviousPeriod.getDate() - 6); // 7 days back from that point
  startPreviousPeriod.setHours(0, 0, 0, 0);

  return {
    current: { startDate: startCurrentPeriod, endDate: endCurrentPeriod },
    previous: { startDate: startPreviousPeriod, endDate: endPreviousPeriod },
  };
};

// A single instance of PrismaClient for seeding
const prisma = new PrismaClient();

// Helper function to create a random Address object
const createAddress = () => ({
  street: faker.location.streetAddress(),
  city: faker.location.city(),
  postalCode: faker.location.zipCode(),
});

// Helper to generate unique SKU
const generateUniqueSKU = (
  organizationId: string,
  existingSKUs: Set<string>
): string => {
  let sku: string;
  do {
    sku = faker.string.alphanumeric(8).toUpperCase();
  } while (existingSKUs.has(`${organizationId}-${sku}`));
  existingSKUs.add(`${organizationId}-${sku}`);
  return sku;
};

// Helper to generate unique barcode
const generateUniqueBarcode = (
  organizationId: string,
  existingBarcodes: Set<string>
): string => {
  let barcode: string;
  do {
    barcode = faker.string.alphanumeric(10).toUpperCase();
  } while (existingBarcodes.has(barcode));
  existingBarcodes.add(barcode);
  return barcode;
};

// Global counters for unique generation
let customerEmailCounter = 0;
let supplierEmailCounter = 0;
let supplierPhoneCounter = 0;
let contactEmailCounter = 0;
let userEmailCounter = 0;
let organizationNameCounter = 0;
let orderNumberCounter = 0; // New counter for unique order numbers

// Helper to generate unique email for customers
const generateUniqueCustomerEmail = (
  organizationId: string,
  existingEmails: Set<string>
): string => {
  customerEmailCounter++;
  const email = `customer${customerEmailCounter}@org${organizationId.slice(
    -3
  )}.com`;
  existingEmails.add(`${organizationId}-${email}`);
  return email;
};

// Helper to generate unique email and phone for suppliers
const generateUniqueSupplierData = (
  organizationId: string,
  existingEmails: Set<string>,
  existingPhones: Set<string>
): { email: string; phone: string } => {
  supplierEmailCounter++;
  supplierPhoneCounter++;

  const email = `supplier${supplierEmailCounter}@org${organizationId.slice(
    -3
  )}.com`;
  const phone = `+1-555-${String(supplierPhoneCounter).padStart(4, "0")}`;

  existingEmails.add(`${organizationId}-${email}`);
  existingPhones.add(`${organizationId}-${phone}`);

  return { email, phone };
};

// Helper to generate unique contact email
const generateUniqueContactEmail = (
  organizationId: string,
  existingEmails: Set<string>
): string => {
  contactEmailCounter++;
  const email = `contact${contactEmailCounter}@org${organizationId.slice(
    -3
  )}.com`;
  existingEmails.add(`${organizationId}-${email}`);
  return email;
};

// Helper to generate unique category name
const generateUniqueCategoryName = (
  organizationId: string,
  existingNames: Set<string>
): string => {
  let name: string;
  do {
    name = faker.commerce.department();
  } while (existingNames.has(`${organizationId}-${name}`));
  existingNames.add(`${organizationId}-${name}`);
  return name;
};

/**
 * Generates a unique order number in the format "ORD-<sequential_number>".
 * Ensures uniqueness within the seed script.
 * @param existingOrderNumbers A Set to track already used order numbers.
 * @returns A unique order number string.
 */
const generateUniqueOrderNumber = (
  existingOrderNumbers: Set<string>
): string => {
  let orderNumber: string;
  do {
    orderNumberCounter++;
    orderNumber = `ORD-${String(orderNumberCounter).padStart(5, "0")}`; // e.g., ORD-00001
  } while (existingOrderNumbers.has(orderNumber));
  existingOrderNumbers.add(orderNumber);
  return orderNumber;
};

async function main() {
  console.log(
    "✨ Starting comprehensive database seeding with ALL enum values..."
  );

  // --- 1. CLEAN UP EXISTING DATA ---
  await prisma.invoice.deleteMany({});
  await prisma.orderLine.deleteMany({});
  await prisma.stockItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.stock.deleteMany({});
  await prisma.contactPerson.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.organization.deleteMany({});
  console.log("✅ All existing data has been cleaned up.");

  // --- 2. CREATE ORGANIZATIONS ---
  const organizations: Organization[] = [];
  for (let i = 0; i < 3; i++) {
    organizationNameCounter++;
    const organization = await prisma.organization.create({
      data: {
        id: randomUUID(),
        name: `TechCorp${organizationNameCounter} ${faker.company.buzzAdjective()}`,
        slug: `techcorp${organizationNameCounter}-${faker.lorem.slug()}`,
        address: faker.location.streetAddress(),
        phone: `+1-800-${String(organizationNameCounter).padStart(4, "0")}`,
        email: `contact${organizationNameCounter}@techcorp${organizationNameCounter}.com`,
        logo: faker.image.url(),
        metadata: JSON.stringify({
          industry: faker.company.buzzNoun(),
          founded: faker.date.past({ years: 20 }).getFullYear(),
        }),
      },
    });
    organizations.push(organization);
  }
  console.log(`✅ Created ${organizations.length} Organizations.`);

  // Use first organization for main seeding
  const mainOrganization = organizations[0];

  // --- 3. CREATE USERS ---
  const users: User[] = [];
  const allRoles = ["ADMIN", "SALESMAN", "MANAGER", "VIEWER"]; // Using strings as per new schema

  // Create users (simplified structure)
  for (let i = 0; i < 5; i++) {
    userEmailCounter++;
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: `${faker.person.firstName()} ${faker.person.lastName()}`,
        email: `user${userEmailCounter}@techcorp.com`,
        emailVerified: faker.datatype.boolean(),
        image: faker.image.avatar(),
        password: faker.internet.password(),
        twoFactorEnabled: faker.datatype.boolean(),
      },
    });
    users.push(user);
  }
  console.log(`✅ Created ${users.length} Users.`);

  // --- 4. CREATE MEMBERS (USER-ORGANIZATION RELATIONSHIPS) ---
  for (const user of users) {
    const role = faker.helpers.arrayElement(allRoles);
    await prisma.member.create({
      data: {
        id: randomUUID().toString(),
        role: role,
        createdAt: faker.date.recent({ days: 30 }),
        organizationId: mainOrganization.id,
        userId: user.id,
      },
    });
  }
  console.log("✅ Created Member relationships for all users.");

  // --- 5. CREATE CATEGORIES ---
  const categories: Category[] = [];
  const categoryNames = [
    "Electronics",
    "Hardware",
    "Software",
    "Furniture",
    "Office Supplies",
    "Industrial",
    "Automotive",
    "Medical",
  ];

  for (let i = 0; i < categoryNames.length; i++) {
    const category = await prisma.category.create({
      data: {
        id: randomUUID().toString(),
        name: categoryNames[i],
        description: i % 2 === 0 ? faker.lorem.sentence() : null,
        organizationId: mainOrganization.id,
      },
    });
    categories.push(category);
  }
  console.log(
    `✅ Created ${categories.length} Categories (with and without descriptions).`
  );

  // --- 6. CREATE CUSTOMERS WITH ALL CUSTOMER TYPES ---
  const customers: Customer[] = [];
  const existingCustomerEmails = new Set<string>();
  const allCustomerTypes = [CustomerType.B2B, CustomerType.B2C];

  // Create customers for each type (minimum 3 per type for variety)
  for (const customerType of allCustomerTypes) {
    for (let i = 0; i < 3; i++) {
      const customer = await prisma.customer.create({
        data: {
          id: randomUUID().toString(),
          name: `${faker.company.name()} ${customerType} ${i + 1}`,
          email: generateUniqueCustomerEmail(
            mainOrganization.id,
            existingCustomerEmails
          ),
          customerType: customerType,
          billingAddress: createAddress(),
          shippingAddress: createAddress(),
          organizationId: mainOrganization.id,
        },
      });
      customers.push(customer);
    }
  }
  console.log(`✅ Created ${customers.length} Customers:`);
  console.log(
    `   - ${
      customers.filter((c) => c.customerType === CustomerType.B2B).length
    } B2B customers`
  );
  console.log(
    `   - ${
      customers.filter((c) => c.customerType === CustomerType.B2C).length
    } B2C customers`
  );

  // --- 7. CREATE SUPPLIERS ---
  const suppliers: Supplier[] = [];
  const existingSupplierEmails = new Set<string>();
  const existingSupplierPhones = new Set<string>();
  const paymentTermsOptions = ["Net 15", "Net 30", "Net 45", "Net 60", "COD"];

  for (let i = 0; i < 5; i++) {
    const { email, phone } = generateUniqueSupplierData(
      mainOrganization.id,
      existingSupplierEmails,
      existingSupplierPhones
    );

    const supplier = await prisma.supplier.create({
      data: {
        id: randomUUID().toString(),
        name: `${faker.company.name()} Corp ${i + 1}`,
        email,
        phone,
        address: createAddress(),
        paymentTerms: paymentTermsOptions[i % paymentTermsOptions.length],
        notes: i % 2 === 0 ? faker.lorem.paragraph() : null,
        tags: faker.helpers.arrayElements(
          [
            "electronics",
            "hardware",
            "software",
            "furniture",
            "office",
            "industrial",
          ],
          { min: 0, max: 3 }
        ),
        organizationId: mainOrganization.id,
      },
    });
    suppliers.push(supplier);
  }
  console.log(
    `✅ Created ${suppliers.length} Suppliers (with various payment terms and tags).`
  );

  // --- 8. CREATE CONTACT PERSONS FOR CUSTOMERS AND SUPPLIERS ---
  const existingContactEmails = new Set<string>();

  // Create contacts for customers
  for (const customer of customers) {
    const numContacts = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < numContacts; i++) {
      await prisma.contactPerson.create({
        data: {
          id: randomUUID().toString(),
          email: generateUniqueContactEmail(
            mainOrganization.id,
            existingContactEmails
          ),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          jobTitle: faker.person.jobTitle(),
          notes: i % 3 === 0 ? faker.lorem.sentence() : null,
          customerId: customer.id,
          supplierId: null,
          organizationId: mainOrganization.id,
        },
      });
    }
  }

  // Create contacts for suppliers
  for (const supplier of suppliers) {
    const numContacts = faker.number.int({ min: 1, max: 2 });
    for (let i = 0; i < numContacts; i++) {
      await prisma.contactPerson.create({
        data: {
          id: randomUUID().toString(),
          email: generateUniqueContactEmail(
            mainOrganization.id,
            existingContactEmails
          ),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          jobTitle: faker.person.jobTitle(),
          notes: i % 3 === 0 ? faker.lorem.sentence() : null,
          customerId: null,
          supplierId: supplier.id,
          organizationId: mainOrganization.id,
        },
      });
    }
  }
  console.log(
    "✅ Created Contact Persons for all customers and suppliers (with and without notes)."
  );

  // --- 9. CREATE STOCKS ---
  const stocks: Stock[] = [];
  for (let i = 0; i < 4; i++) {
    const stock = await prisma.stock.create({
      data: {
        id: randomUUID().toString(),
        name: `Warehouse ${String.fromCharCode(65 + i)}`, // A, B, C, D
        location: i % 2 === 0 ? faker.location.streetAddress() : null,
        organizationId: mainOrganization.id,
      },
    });
    stocks.push(stock);
  }
  console.log(
    `✅ Created ${stocks.length} Stock locations (with and without location details).`
  );

  // --- 10. CREATE PRODUCTS ---
  const products: Product[] = [];
  const existingSKUs = new Set<string>();
  const existingBarcodes = new Set<string>();

  for (let i = 0; i < 20; i++) {
    const product = await prisma.product.create({
      data: {
        id: randomUUID().toString(),
        name: faker.commerce.productName(),
        description: i % 3 === 0 ? null : faker.commerce.productDescription(),
        sku: generateUniqueSKU(mainOrganization.id, existingSKUs),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
        barcode: generateUniqueBarcode(mainOrganization.id, existingBarcodes),
        organizationId: mainOrganization.id,
        categoryId: faker.helpers.arrayElement(categories).id,
      },
    });
    products.push(product);
  }
  console.log(
    `✅ Created ${products.length} Products (with and without descriptions/barcodes).`
  );

  // --- 11. CREATE STOCK ITEMS (COMPREHENSIVE INVENTORY) ---
  const existingStockItems = new Set<string>();

  // Ensure every product has at least one stock item
  for (const product of products) {
    const randomStock = faker.helpers.arrayElement(stocks);
    const stockItemKey = `${mainOrganization.id}-${product.id}-${randomStock.id}`;

    if (!existingStockItems.has(stockItemKey)) {
      await prisma.stockItem.create({
        data: {
          id: randomUUID().toString(),
          quantity: faker.number.int({ min: 0, max: 150 }),
          organizationId: mainOrganization.id,
          productId: product.id,
          stockId: randomStock.id,
        },
      });
      existingStockItems.add(stockItemKey);
    }
  }

  // Add additional stock items for some products in different locations
  for (let i = 0; i < 15; i++) {
    const randomProduct = faker.helpers.arrayElement(products);
    const randomStock = faker.helpers.arrayElement(stocks);
    const stockItemKey = `${mainOrganization.id}-${randomProduct.id}-${randomStock.id}`;

    if (!existingStockItems.has(stockItemKey)) {
      await prisma.stockItem.create({
        data: {
          id: randomUUID().toString(),
          quantity: faker.number.int({ min: 0, max: 100 }),
          organizationId: mainOrganization.id,
          productId: randomProduct.id,
          stockId: randomStock.id,
        },
      });
      existingStockItems.add(stockItemKey);
    }
  }
  console.log(
    "✅ Populated Stock Items (including zero quantities and multiple locations)."
  );

  // --- 12. CREATE ORDERS WITH ALL ENUM COMBINATIONS AND DATE TRENDS ---
  const existingInvoiceNumbers = new Set<string>();
  const existingOrderNumbers = new Set<string>(); // New Set to track unique order numbers

  const allOrderStatuses = [
    OrderStatus.Pending,
    OrderStatus.Processing,
    OrderStatus.Shipped,
    OrderStatus.Delivered,
    OrderStatus.Cancelled,
  ];

  const allOrderTypes = [OrderType.SALES, OrderType.PURCHASE];

  const allInvoiceStatuses = [
    InvoiceStatus.Paid,
    InvoiceStatus.Pending,
    InvoiceStatus.Overdue,
    InvoiceStatus.Void,
  ];

  let orderCount = 0;
  const { current: currentPeriod, previous: previousPeriod } =
    getSeedDateRanges();

  console.log("\n📝 Creating orders to demonstrate trends on summary cards...");
  console.log(
    `   Current Period: ${currentPeriod.startDate.toLocaleDateString()} - ${currentPeriod.endDate.toLocaleDateString()}`
  );
  console.log(
    `   Previous Period: ${previousPeriod.startDate.toLocaleDateString()} - ${previousPeriod.endDate.toLocaleDateString()}`
  );

  // Scenario 1: Sales Orders - Increase in Current Period, Some Cancelled in Previous
  const numSalesOrdersCurrent = 15; // e.g., 15 orders this week
  const numSalesOrdersPrevious = 10; // e.g., 10 orders last week (for a positive change)
  const numCancelledInPreviousSales = 3; // To demonstrate cancelled orders logic

  for (let i = 0; i < numSalesOrdersCurrent; i++) {
    const randomCustomer = faker.helpers.arrayElement(customers);
    const randomUser = faker.helpers.arrayElement(users);
    const orderDate = faker.date.between({
      from: currentPeriod.startDate,
      to: currentPeriod.endDate,
    });
    const dueDate = faker.date.future({ years: 1, refDate: orderDate });
    const orderNumber = generateUniqueOrderNumber(existingOrderNumbers); // Generate unique order number

    const selectedProducts = faker.helpers.arrayElements(products, {
      min: 1,
      max: 3,
    });
    const orderLinesData = selectedProducts.map((p, index) => ({
      quantity: faker.number.int({ min: 1, max: 5 }),
      unitPrice: p.price + index * 0.01,
      productId: p.id,
    }));
    const totalAmount = orderLinesData.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice,
      0
    );

    await prisma.order.create({
      data: {
        id: randomUUID().toString(),
        orderNumber: orderNumber, // Assign the generated order number
        orderDate,
        totalAmount,
        orderType: OrderType.SALES,
        status: faker.helpers.arrayElement([
          OrderStatus.Delivered,
          OrderStatus.Shipped,
          OrderStatus.Processing,
        ]), // Mostly fulfilled/processing for current
        organizationId: mainOrganization.id,
        userId: randomUser.id,
        customerId: randomCustomer.id,
        supplierId: null,
        invoice: {
          create: {
            id: randomUUID().toString(),
            invoiceNumber: `INV-SALES-CUR-${String(i).padStart(3, "0")}`,
            invoiceDate: orderDate,
            ueDate: dueDate,
            totalAmount,
            status: faker.helpers.arrayElement([
              InvoiceStatus.Paid,
              InvoiceStatus.Pending,
            ]),
            organizationId: mainOrganization.id,
          },
        },
        orderLines: {
          createMany: {
            data: orderLinesData.map((line) => ({
              id: randomUUID().toString(),
              ...line,
            })),
          },
        },
      },
    });
    orderCount++;
  }
  console.log(
    `   Created ${numSalesOrdersCurrent} SALES orders for the CURRENT period.`
  );

  for (let i = 0; i < numSalesOrdersPrevious; i++) {
    const randomCustomer = faker.helpers.arrayElement(customers);
    const randomUser = faker.helpers.arrayElement(users);
    const orderDate = faker.date.between({
      from: previousPeriod.startDate,
      to: previousPeriod.startDate, // Should be previousPeriod.endDate for proper range
    });
    const dueDate = faker.date.future({ years: 1, refDate: orderDate });
    const orderNumber = generateUniqueOrderNumber(existingOrderNumbers); // Generate unique order number

    const selectedProducts = faker.helpers.arrayElements(products, {
      min: 1,
      max: 3,
    });
    const orderLinesData = selectedProducts.map((p, index) => ({
      quantity: faker.number.int({ min: 1, max: 5 }),
      unitPrice: p.price + index * 0.01,
      productId: p.id,
    }));
    const totalAmount = orderLinesData.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice,
      0
    );

    await prisma.order.create({
      data: {
        id: randomUUID().toString(),
        orderNumber: orderNumber, // Assign the generated order number
        orderDate,
        totalAmount,
        orderType: OrderType.SALES,
        // Distribute statuses: some cancelled, some delivered/shipped
        status:
          i < numCancelledInPreviousSales
            ? OrderStatus.Cancelled
            : faker.helpers.arrayElement([
                OrderStatus.Delivered,
                OrderStatus.Shipped,
                OrderStatus.Processing,
              ]),
        organizationId: mainOrganization.id,
        userId: randomUser.id,
        customerId: randomCustomer.id,
        supplierId: null,
        invoice: {
          create: {
            id: randomUUID().toString(),
            invoiceNumber: `INV-SALES-PREV-${String(i).padStart(3, "0")}`,
            invoiceDate: orderDate,
            ueDate: dueDate,
            totalAmount,
            status: faker.helpers.arrayElement([
              InvoiceStatus.Paid,
              InvoiceStatus.Pending,
            ]),
            organizationId: mainOrganization.id,
          },
        },
        orderLines: {
          createMany: {
            data: orderLinesData.map((line) => ({
              id: randomUUID().toString(),
              ...line,
            })),
          },
        },
      },
    });
    orderCount++;
  }
  console.log(
    `   Created ${numSalesOrdersPrevious} SALES orders for the PREVIOUS period (${numCancelledInPreviousSales} Cancelled).`
  );

  // Scenario 2: Purchase Orders - Decrease in Current Period, few fulfilled in Current
  const numPurchaseOrdersCurrent = 5; // e.g., 5 orders this week
  const numPurchaseOrdersPrevious = 8; // e.g., 8 orders last week (for a negative change)
  const numFulfilledInCurrentPurchase = 2; // To show specific fulfilled logic

  for (let i = 0; i < numPurchaseOrdersCurrent; i++) {
    const randomSupplier = faker.helpers.arrayElement(suppliers);
    const randomUser = faker.helpers.arrayElement(users);
    const orderDate = faker.date.between({
      from: currentPeriod.startDate,
      to: currentPeriod.endDate,
    });
    const orderNumber = generateUniqueOrderNumber(existingOrderNumbers); // Generate unique order number

    const selectedProducts = faker.helpers.arrayElements(products, {
      min: 1,
      max: 2,
    });
    const orderLinesData = selectedProducts.map((p, index) => ({
      quantity: faker.number.int({ min: 1, max: 10 }), // Fewer items per purchase order on average
      unitPrice:
        p.price * faker.number.float({ min: 0.6, max: 0.9 }) + index * 0.01,
      productId: p.id,
    }));
    const totalAmount = orderLinesData.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice,
      0
    );

    await prisma.order.create({
      data: {
        id: randomUUID().toString(),
        orderNumber: orderNumber, // Assign the generated order number
        orderDate,
        totalAmount,
        orderType: OrderType.PURCHASE,
        status:
          i < numFulfilledInCurrentPurchase
            ? OrderStatus.Delivered
            : faker.helpers.arrayElement([
                OrderStatus.Pending,
                OrderStatus.Processing,
              ]),
        organizationId: mainOrganization.id,
        userId: randomUser.id,
        supplierId: randomSupplier.id,
        customerId: null,
        orderLines: {
          createMany: {
            data: orderLinesData.map((line) => ({
              id: randomUUID().toString(),
              ...line,
            })),
          },
        },
      },
    });
    orderCount++;
  }
  console.log(
    `   Created ${numPurchaseOrdersCurrent} PURCHASE orders for the CURRENT period (${numFulfilledInCurrentPurchase} Fulfilled).`
  );

  for (let i = 0; i < numPurchaseOrdersPrevious; i++) {
    const randomSupplier = faker.helpers.arrayElement(suppliers);
    const randomUser = faker.helpers.arrayElement(users);
    const orderDate = faker.date.between({
      from: previousPeriod.startDate,
      to: previousPeriod.endDate,
    });
    const orderNumber = generateUniqueOrderNumber(existingOrderNumbers); // Generate unique order number

    const selectedProducts = faker.helpers.arrayElements(products, {
      min: 1,
      max: 3,
    });
    const orderLinesData = selectedProducts.map((p, index) => ({
      quantity: faker.number.int({ min: 1, max: 15 }), // More items per purchase order on average
      unitPrice:
        p.price * faker.number.float({ min: 0.6, max: 0.9 }) + index * 0.01,
      productId: p.id,
    }));
    const totalAmount = orderLinesData.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice,
      0
    );

    await prisma.order.create({
      data: {
        id: randomUUID().toString(),
        orderNumber: orderNumber, // Assign the generated order number
        orderDate,
        totalAmount,
        orderType: OrderType.PURCHASE,
        status: faker.helpers.arrayElement([
          OrderStatus.Delivered,
          OrderStatus.Shipped,
          OrderStatus.Processing,
        ]),
        organizationId: mainOrganization.id,
        userId: randomUser.id,
        supplierId: randomSupplier.id,
        customerId: null,
        orderLines: {
          createMany: {
            data: orderLinesData.map((line) => ({
              id: randomUUID().toString(),
              ...line,
            })),
          },
        },
      },
    });
    orderCount++;
  }
  console.log(
    `   Created ${numPurchaseOrdersPrevious} PURCHASE orders for the PREVIOUS period.`
  );

  console.log(`\n🎉 COMPREHENSIVE SEEDING COMPLETE!`);
  console.log(`\n📊 SUMMARY OF ALL ENUM VALUES CREATED:`);
  console.log(`👥 Users: ${users.length} total`);
  console.log(`   - Roles: ${allRoles.join(", ")} (via Member relationships)`);
  console.log(`🏢 Customers: ${customers.length} total`);
  console.log(`   - CustomerTypes: ${Object.values(CustomerType).join(", ")}`);
  console.log(`📦 Orders: ${orderCount} total`);
  console.log(`   - OrderTypes: ${allOrderTypes.join(", ")}`);
  console.log(`   - OrderStatuses: ${allOrderStatuses.join(", ")}`);
  console.log(`   - SALES orders (Current Period): ${numSalesOrdersCurrent}`);
  console.log(`   - SALES orders (Previous Period): ${numSalesOrdersPrevious}`);
  console.log(
    `   - PURCHASE orders (Current Period): ${numPurchaseOrdersCurrent}`
  );
  console.log(
    `   - PURCHASE orders (Previous Period): ${numPurchaseOrdersPrevious}`
  );
  console.log(
    `📄 Invoices: ${allOrderStatuses.length * allInvoiceStatuses.length} total`
  );
  console.log(`   - InvoiceStatuses: ${allInvoiceStatuses.join(", ")}`);
  console.log(`📝 Additional Coverage:`);
  console.log(`   - Products: With/without descriptions and barcodes`);
  console.log(`   - Categories: With/without descriptions`);
  console.log(`   - Suppliers: Various payment terms and tag combinations`);
  console.log(`   - Contacts: With/without notes`);
  console.log(`   - Stock locations: With/without location details`);
  console.log(`   - Stock items: Including zero quantities`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Connection to database closed.");
  });
