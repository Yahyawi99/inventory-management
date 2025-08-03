import {
  PrismaClient,
  Role,
  OrderStatus,
  OrderType,
  CustomerType,
  InvoiceStatus,
} from "../generated/prisma/index.js";
import { faker } from "@faker-js/faker";
import type { Category, Supplier, Stock, Customer, Product } from "../types";

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
  companyId: string,
  existingSKUs: Set<string>
): string => {
  let sku: string;
  do {
    sku = faker.string.alphanumeric(8).toUpperCase();
  } while (existingSKUs.has(`${companyId}-${sku}`));
  existingSKUs.add(`${companyId}-${sku}`);
  return sku;
};

// Helper to generate unique barcode
const generateUniqueBarcode = (
  companyId: string,
  existingBarcodes: Set<string>
): string => {
  let barcode: string;
  do {
    barcode = faker.string.alphanumeric(10).toUpperCase();
  } while (existingBarcodes.has(`${companyId}-${barcode}`));
  existingBarcodes.add(`${companyId}-${barcode}`);
  return barcode;
};

// Helper to generate unique email for customers
const generateUniqueCustomerEmail = (
  companyId: string,
  existingEmails: Set<string>
): string => {
  let email: string;
  do {
    email = faker.internet.email();
  } while (existingEmails.has(`${companyId}-${email}`));
  existingEmails.add(`${companyId}-${email}`);
  return email;
};

// Helper to generate unique email and phone for suppliers
const generateUniqueSupplierData = (
  companyId: string,
  existingEmails: Set<string>,
  existingPhones: Set<string>
): { email: string; phone: string } => {
  let email: string;
  let phone: string;

  do {
    email = faker.internet.email();
  } while (existingEmails.has(`${companyId}-${email}`));
  existingEmails.add(`${companyId}-${email}`);

  do {
    phone = faker.phone.number();
  } while (existingPhones.has(`${companyId}-${phone}`));
  existingPhones.add(`${companyId}-${phone}`);

  return { email, phone };
};

// Helper to generate unique contact email
const generateUniqueContactEmail = (
  companyId: string,
  existingEmails: Set<string>
): string => {
  let email: string;
  do {
    email = faker.internet.email();
  } while (existingEmails.has(`${companyId}-${email}`));
  existingEmails.add(`${companyId}-${email}`);
  return email;
};

// Helper to generate unique category name
const generateUniqueCategoryName = (
  companyId: string,
  existingNames: Set<string>
): string => {
  let name: string;
  do {
    name = faker.commerce.department();
  } while (existingNames.has(`${companyId}-${name}`));
  existingNames.add(`${companyId}-${name}`);
  return name;
};

async function main() {
  console.log("✨ Starting database seeding...");

  // --- 1. CLEAN UP EXISTING DATA ---
  // A clean slate is important for consistent seeding.
  // Note: Order matters due to foreign key constraints.
  await prisma.invoice.deleteMany({});
  await prisma.orderLine.deleteMany({});
  await prisma.stockItem.deleteMany({}); // Must be deleted before Product, Stock, Company
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({}); // New model
  await prisma.stock.deleteMany({}); // New model
  await prisma.userCompany.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.contactPerson.deleteMany({}); // New model
  await prisma.supplier.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.company.deleteMany({});
  console.log("✅ All existing data has been cleaned up.");

  // --- 2. CREATE A COMPANY ---
  const company = await prisma.company.create({
    data: {
      name: `Acme Corp - ${faker.string.alphanumeric(6)}`, // Make company name unique
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      email: "contact@acmecorp.com",
    },
  });
  console.log(`✅ Created Company: ${company.name}`);

  // --- 3. CREATE A USER AND LINK THEM AS AN ADMIN ---
  const user = await prisma.user.create({
    data: {
      email: `admin-${faker.string.alphanumeric(6)}@acmecorp.com`, // Make email unique
      username: `admin-${faker.string.alphanumeric(6)}`, // Make username unique
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      passwordHash: faker.internet.password(),
      userCompanies: {
        create: {
          companyId: company.id,
          role: Role.ADMIN,
        },
      },
    },
  });
  console.log(`✅ Created Admin User: ${user.email} and linked to company.`);

  // --- 4. CREATE CATEGORIES, CUSTOMERS, AND SUPPLIERS ---
  const categories: Category[] = [];
  const existingCategoryNames = new Set<string>();

  for (let i = 0; i < 5; i++) {
    const category = await prisma.category.create({
      data: {
        name: generateUniqueCategoryName(company.id, existingCategoryNames),
        description: faker.lorem.sentence(),
        companyId: company.id,
      },
    });
    categories.push(category);
  }
  console.log(`✅ Created ${categories.length} Categories.`);

  const customers: Customer[] = [];
  const existingCustomerEmails = new Set<string>();

  for (let i = 0; i < 5; i++) {
    const customer = await prisma.customer.create({
      data: {
        name: faker.company.name(),
        email: generateUniqueCustomerEmail(company.id, existingCustomerEmails),
        customerType: faker.helpers.arrayElement([
          CustomerType.B2B,
          CustomerType.B2C,
        ]),
        billingAddress: createAddress(),
        shippingAddress: createAddress(),
        companyId: company.id,
      },
    });
    customers.push(customer);
  }
  console.log(`✅ Created ${customers.length} Customers.`);

  const suppliers: Supplier[] = [];
  const existingSupplierEmails = new Set<string>();
  const existingSupplierPhones = new Set<string>();

  for (let i = 0; i < 3; i++) {
    const { email, phone } = generateUniqueSupplierData(
      company.id,
      existingSupplierEmails,
      existingSupplierPhones
    );

    const supplier = await prisma.supplier.create({
      data: {
        name: faker.company.name(),
        email,
        phone,
        address: createAddress(),
        paymentTerms: faker.helpers.arrayElement(["Net 30", "Net 60"]),
        tags: faker.helpers.arrayElements(
          ["electronics", "hardware", "software"],
          { min: 1, max: 2 }
        ),
        companyId: company.id,
      },
    });
    suppliers.push(supplier);
  }
  console.log(`✅ Created ${suppliers.length} Suppliers.`);

  // --- 5. CREATE CONTACTS FOR CUSTOMERS AND SUPPLIERS ---
  const existingContactEmails = new Set<string>();

  for (let i = 0; i < 3; i++) {
    const randomCustomer = faker.helpers.arrayElement(customers);
    await prisma.contactPerson.create({
      data: {
        email: generateUniqueContactEmail(company.id, existingContactEmails),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        jobTitle: faker.person.jobTitle(),
        customerId: randomCustomer.id,
        companyId: company.id,
      },
    });
  }

  for (let i = 0; i < 2; i++) {
    const randomSupplier = faker.helpers.arrayElement(suppliers);
    await prisma.contactPerson.create({
      data: {
        email: generateUniqueContactEmail(company.id, existingContactEmails),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        jobTitle: faker.person.jobTitle(),
        supplierId: randomSupplier.id,
        companyId: company.id,
      },
    });
  }
  console.log("✅ Created Contact Persons for customers and suppliers.");

  // --- 6. CREATE STOCKS ---
  const stocks: Stock[] = [];
  for (let i = 0; i < 2; i++) {
    const stock = await prisma.stock.create({
      data: {
        name: `Stock Location ${i + 1}`,
        location: faker.location.streetAddress(),
        companyId: company.id,
      },
    });
    stocks.push(stock);
  }
  console.log(`✅ Created ${stocks.length} Stock locations.`);

  // --- 7. CREATE PRODUCTS ---
  const products: Product[] = [];
  const existingSKUs = new Set<string>();
  const existingBarcodes = new Set<string>();

  for (let i = 0; i < 10; i++) {
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        sku: generateUniqueSKU(company.id, existingSKUs),
        price: parseFloat(faker.commerce.price()),
        barcode: generateUniqueBarcode(company.id, existingBarcodes),
        companyId: company.id,
        categoryId: faker.helpers.arrayElement(categories).id,
      },
    });
    products.push(product);
  }
  console.log(`✅ Created ${products.length} Products.`);

  // --- 8. CREATE STOCK ITEMS (INVENTORY) ---
  const existingStockItems = new Set<string>();

  for (const product of products) {
    const randomStock = faker.helpers.arrayElement(stocks);
    const stockItemKey = `${company.id}-${product.id}-${randomStock.id}`;

    // Avoid duplicate stock items (same company, product, stock combination)
    if (!existingStockItems.has(stockItemKey)) {
      await prisma.stockItem.create({
        data: {
          quantity: faker.number.int({ min: 10, max: 100 }),
          companyId: company.id,
          productId: product.id,
          stockId: randomStock.id,
        },
      });
      existingStockItems.add(stockItemKey);
    }
  }
  console.log("✅ Populated Stock Items (Inventory).");

  // --- 9. CREATE ORDERS AND ORDER LINES ---
  const existingInvoiceNumbers = new Set<string>();

  for (let i = 0; i < 8; i++) {
    const randomCustomer = faker.helpers.arrayElement(customers);
    const orderDate = faker.date.recent({ days: 30 });
    const dueDate = faker.date.future({ years: 1, refDate: orderDate });

    // Fixed: Use the correct enum values from your schema
    const orderStatus = faker.helpers.arrayElement([
      OrderStatus.Pending,
      OrderStatus.Processing,
      OrderStatus.Shipped,
      OrderStatus.Delivered,
      OrderStatus.Cancelled,
    ]);
    const invoiceStatus = faker.helpers.arrayElement([
      InvoiceStatus.Paid,
      InvoiceStatus.Pending,
      InvoiceStatus.Overdue,
      InvoiceStatus.Void,
    ]);

    // Generate unique invoice number
    let invoiceNumber: string;
    do {
      invoiceNumber = faker.string.alphanumeric(8).toUpperCase();
    } while (existingInvoiceNumbers.has(`${company.id}-${invoiceNumber}`));
    existingInvoiceNumbers.add(`${company.id}-${invoiceNumber}`);

    // Create order lines data first to calculate the total
    const selectedProducts = faker.helpers.arrayElements(products, {
      min: 1,
      max: 5,
    });
    const orderLinesData = selectedProducts.map((p) => ({
      quantity: faker.number.int({ min: 1, max: 10 }),
      unitPrice: p.price,
      productId: p.id,
    }));

    const totalAmount = orderLinesData.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice,
      0
    );

    const order = await prisma.order.create({
      data: {
        orderDate,
        totalAmount,
        orderType: OrderType.SALES,
        status: orderStatus,
        companyId: company.id,
        userId: user.id,
        customerId: randomCustomer.id,
        // Using nested create to create an invoice and order lines with the order
        invoice: {
          create: {
            invoiceNumber,
            invoiceDate: orderDate,
            dueDate,
            totalAmount,
            status: invoiceStatus,
            companyId: company.id,
          },
        },
        orderLines: {
          createMany: {
            data: orderLinesData,
          },
        },
      },
    });
  }
  console.log("✅ Created 8 Orders with Invoices and Order Lines.");

  console.log("🎉 Seeding complete.");
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
