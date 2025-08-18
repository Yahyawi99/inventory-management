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
        description: i % 3 === 0 ? null : faker.commerce.productDescription(), // Note: 'escription' not 'description'
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

  // --- 12. CREATE ORDERS WITH ALL ENUM COMBINATIONS ---
  const existingInvoiceNumbers = new Set<string>();

  // All possible enum values
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

  // Loop through all order types
  for (const orderType of allOrderTypes) {
    console.log(`\n📝 Creating ${orderType} orders...`);

    if (orderType === OrderType.SALES) {
      // Create SALES orders with all status combinations
      for (const orderStatus of allOrderStatuses) {
        for (const invoiceStatus of allInvoiceStatuses) {
          const randomCustomer = faker.helpers.arrayElement(customers);
          const randomUser = faker.helpers.arrayElement(users);
          const orderDate = faker.date.recent({ days: 60 });
          const ueDate = faker.date.future({ years: 1, refDate: orderDate }); // Note: 'ueDate' not 'dueDate'

          // Generate unique invoice number with better format
          let invoiceNumber: string;
          let attempts = 0;
          do {
            attempts++;
            invoiceNumber = `INV-${orderStatus
              .substring(0, 3)
              .toUpperCase()}-${invoiceStatus
              .substring(0, 3)
              .toUpperCase()}-${String(attempts).padStart(3, "0")}`;
          } while (
            existingInvoiceNumbers.has(
              `${mainOrganization.id}-${invoiceNumber}`
            )
          );
          existingInvoiceNumbers.add(`${mainOrganization.id}-${invoiceNumber}`);

          // Create order lines data with unique products per order
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

          const salesOrder = await prisma.order.create({
            data: {
              id: randomUUID().toString(),
              orderDate,
              totalAmount,
              orderType: OrderType.SALES,
              status: orderStatus,
              organizationId: mainOrganization.id,
              userId: randomUser.id,
              customerId: randomCustomer.id,
              supplierId: null,
              invoice: {
                create: {
                  id: randomUUID().toString(),
                  invoiceNumber,
                  invoiceDate: orderDate,
                  ueDate, // Note: 'ueDate' not 'dueDate'
                  totalAmount,
                  status: invoiceStatus,
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
          console.log(
            `   ✅ SALES order ${salesOrder.id} - Status: ${orderStatus}, Invoice: ${invoiceStatus}`
          );
          orderCount++;
        }
      }
    } else if (orderType === OrderType.PURCHASE) {
      // Create PURCHASE orders with all statuses
      for (const orderStatus of allOrderStatuses) {
        const randomSupplier = faker.helpers.arrayElement(suppliers);
        const randomUser = faker.helpers.arrayElement(users);
        const orderDate = faker.date.recent({ days: 60 });

        // Create order lines data with unique products per order
        const selectedProducts = faker.helpers.arrayElements(products, {
          min: 1,
          max: 3,
        });
        const orderLinesData = selectedProducts.map((p, index) => ({
          quantity: faker.number.int({ min: 1, max: 15 }),
          unitPrice:
            p.price * faker.number.float({ min: 0.6, max: 0.9 }) + index * 0.01,
          productId: p.id,
        }));

        const totalAmount = orderLinesData.reduce(
          (sum, line) => sum + line.quantity * line.unitPrice,
          0
        );

        const purchaseOrder = await prisma.order.create({
          data: {
            id: randomUUID().toString(),
            orderDate,
            totalAmount,
            orderType: OrderType.PURCHASE,
            status: orderStatus,
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
        console.log(
          `   ✅ PURCHASE order ${purchaseOrder.id} - Status: ${orderStatus}, Supplier: ${randomSupplier.name}`
        );
        orderCount++;
      }
    }
  }

  console.log(`\n🎉 COMPREHENSIVE SEEDING COMPLETE!`);
  console.log(`\n📊 SUMMARY OF ALL ENUM VALUES CREATED:`);
  console.log(`👥 Users: ${users.length} total`);
  console.log(`   - Roles: ${allRoles.join(", ")} (via Member relationships)`);
  console.log(`🏢 Customers: ${customers.length} total`);
  console.log(`   - CustomerTypes: ${Object.values(CustomerType).join(", ")}`);
  console.log(`📦 Orders: ${orderCount} total`);
  console.log(`   - OrderTypes: ${allOrderTypes.join(", ")}`);
  console.log(`   - OrderStatuses: ${allOrderStatuses.join(", ")}`);
  console.log(
    `   - SALES orders: ${
      allOrderStatuses.length * allInvoiceStatuses.length
    } (with all invoice combinations)`
  );
  console.log(
    `   - PURCHASE orders: ${allOrderStatuses.length} (all statuses)`
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
