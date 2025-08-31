import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

// ====================================================================
// Helper Functions
// ====================================================================

/**
 * Defines the date ranges for comparison (current and previous periods).
 * This function mirrors the logic in your application's `dateUtils`.
 * @returns An object containing the current and previous date ranges.
 */
const getDateRangesForComparison = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endCurrentPeriod = new Date(today);
  endCurrentPeriod.setDate(today.getDate() - 1);
  endCurrentPeriod.setHours(23, 59, 59, 999);

  const startCurrentPeriod = new Date(endCurrentPeriod);
  startCurrentPeriod.setDate(endCurrentPeriod.getDate() - 6);
  startCurrentPeriod.setHours(0, 0, 0, 0);

  // -----
  const endPreviousPeriod = new Date(startCurrentPeriod);
  endPreviousPeriod.setDate(startCurrentPeriod.getDate() - 1);
  endPreviousPeriod.setHours(23, 59, 59, 999);

  const startPreviousPeriod = new Date(endPreviousPeriod);
  startPreviousPeriod.setDate(endPreviousPeriod.getDate() - 6);
  startPreviousPeriod.setHours(0, 0, 0, 0);

  return {
    current: { startDate: startCurrentPeriod, endDate: endCurrentPeriod },
    previous: { startDate: startPreviousPeriod, endDate: endPreviousPeriod },
  };
};

/**
 * Generates a random date between a start and end date.
 * @param startDate The start of the date range.
 * @param endDate The end of the date range.
 * @returns A new Date object within the specified range.
 */
const getRandomDateInRange = (startDate: Date, endDate: Date): Date => {
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();
  const randomTimestamp =
    startTimestamp + Math.random() * (endTimestamp - startTimestamp);
  return new Date(randomTimestamp);
};

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * @param array The array to shuffle.
 * @returns The shuffled array.
 */
const shuffleArray = (array: any[]): any[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ====================================================================
// Main Update Script
// ====================================================================

/**
 * Updates timestamps for all models, ensuring related data has consistent dates
 * and is distributed across both current and previous periods.
 */
async function updateMockData() {
  try {
    console.log("--- Starting Database Timestamp Update Script ---");

    const { current, previous } = getDateRangesForComparison();
    console.log(
      `Current period: ${current.startDate.toISOString()} to ${current.endDate.toISOString()}`
    );
    console.log(
      `Previous period: ${previous.startDate.toISOString()} to ${previous.endDate.toISOString()}`
    );

    // =================================================================
    // Step 1: Update independent models first
    // =================================================================
    const independentModels = [
      { name: "organization", model: prisma.organization },
      { name: "user", model: prisma.user },
      { name: "category", model: prisma.category },
      { name: "customer", model: prisma.customer },
      { name: "supplier", model: prisma.supplier },
      { name: "contactPerson", model: prisma.contactPerson },
    ];

    for (const { name, model } of independentModels) {
      await updateModelWithDistribution(name, model, current, previous);
    }

    // =================================================================
    // Step 2: Update products and ensure they have proper distribution
    // =================================================================
    console.log(`\n=== Updating Products ===`);
    const products = await prisma.product.findMany();

    if (products.length > 0) {
      const shuffledProducts = shuffleArray(products);
      const currentCount = Math.ceil(shuffledProducts.length * 0.6);
      const currentProducts = shuffledProducts.slice(0, currentCount);
      const previousProducts = shuffledProducts.slice(currentCount);

      // Update current period products
      const currentUpdates = currentProducts.map((product) => {
        const newDate = getRandomDateInRange(
          current.startDate,
          current.endDate
        );
        return prisma.product.update({
          where: { id: product.id },
          data: {
            createdAt: newDate,
            updatedAt: newDate,
          },
        });
      });

      // Update previous period products
      const previousUpdates = previousProducts.map((product) => {
        const newDate = getRandomDateInRange(
          previous.startDate,
          previous.endDate
        );
        return prisma.product.update({
          where: { id: product.id },
          data: {
            createdAt: newDate,
            updatedAt: newDate,
          },
        });
      });

      // Execute updates in batches
      await Promise.all([...currentUpdates, ...previousUpdates]);

      console.log(
        `Products: ${currentProducts.length} current, ${previousProducts.length} previous`
      );
    }

    // =================================================================
    // Step 3: Update stock and stockItems to match product timeline
    // =================================================================
    console.log(`\n=== Updating Stock & Stock Items ===`);

    // Update Stock locations
    await updateModelWithDistribution("stock", prisma.stock, current, previous);

    // Update StockItems to be created after their related products
    const stockItems = await prisma.stockItem.findMany({
      include: { product: true, stock: true },
    });

    const stockItemUpdates = stockItems.map((stockItem) => {
      const productDate = stockItem.product.createdAt;
      const stockDate = stockItem.stock.createdAt;

      // StockItem should be created after both product and stock
      const baseDate = productDate > stockDate ? productDate : stockDate;
      const stockItemDate = new Date(
        baseDate.getTime() + Math.random() * 24 * 60 * 60 * 1000
      );

      return prisma.stockItem.update({
        where: { id: stockItem.id },
        data: {
          createdAt: stockItemDate,
          updatedAt: stockItemDate,
        },
      });
    });

    if (stockItemUpdates.length > 0) {
      await Promise.all(stockItemUpdates);
      console.log(`Updated ${stockItemUpdates.length} stock items`);
    }

    // =================================================================
    // Step 4: Update orders and ensure distribution
    // =================================================================
    console.log(`\n=== Updating Orders ===`);
    const orders = await prisma.order.findMany();

    if (orders.length > 0) {
      const shuffledOrders = shuffleArray(orders);
      const currentOrderCount = Math.ceil(shuffledOrders.length * 0.6);
      const currentOrders = shuffledOrders.slice(0, currentOrderCount);
      const previousOrders = shuffledOrders.slice(currentOrderCount);

      // Update current period orders
      const currentOrderUpdates = currentOrders.map((order) => {
        const newDate = getRandomDateInRange(
          current.startDate,
          current.endDate
        );
        return prisma.order.update({
          where: { id: order.id },
          data: {
            createdAt: newDate,
            updatedAt: newDate,
            orderDate: newDate,
          },
        });
      });

      // Update previous period orders
      const previousOrderUpdates = previousOrders.map((order) => {
        const newDate = getRandomDateInRange(
          previous.startDate,
          previous.endDate
        );
        return prisma.order.update({
          where: { id: order.id },
          data: {
            createdAt: newDate,
            updatedAt: newDate,
            orderDate: newDate,
          },
        });
      });

      // Execute all order updates
      await Promise.all([...currentOrderUpdates, ...previousOrderUpdates]);

      console.log(
        `Orders: ${currentOrders.length} current, ${previousOrders.length} previous`
      );
    }

    // =================================================================
    // Step 5: Update orderLines to match their parent order dates
    // =================================================================
    console.log(`\n=== Updating Order Lines ===`);
    const orderLines = await prisma.orderLine.findMany({
      include: { order: true },
    });

    const orderLineUpdates = orderLines.map((orderLine) => {
      const orderDate = orderLine.order.createdAt;
      // OrderLine should be created at same time or shortly after order (within 2 hours)
      const orderLineDate = new Date(
        orderDate.getTime() + Math.random() * 2 * 60 * 60 * 1000
      );

      return prisma.orderLine.update({
        where: { id: orderLine.id },
        data: {
          createdAt: orderLineDate,
          updatedAt: orderLineDate,
        },
      });
    });

    if (orderLineUpdates.length > 0) {
      await Promise.all(orderLineUpdates);
      console.log(`Updated ${orderLineUpdates.length} order lines`);
    }

    // =================================================================
    // Step 6: Update invoices to match order dates
    // =================================================================
    console.log(`\n=== Updating Invoices ===`);
    const invoices = await prisma.invoice.findMany({
      include: { order: true },
    });

    const invoiceUpdates = invoices.map((invoice) => {
      const orderDate = invoice.order.createdAt;
      // Invoice should be created after order (within 1-7 days)
      const daysAfter = 1 + Math.random() * 6; // 1 to 7 days
      const invoiceDate = new Date(
        orderDate.getTime() + daysAfter * 24 * 60 * 60 * 1000
      );

      return prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          createdAt: invoiceDate,
          updatedAt: invoiceDate,
        },
      });
    });

    if (invoiceUpdates.length > 0) {
      await Promise.all(invoiceUpdates);
      console.log(`Updated ${invoiceUpdates.length} invoices`);
    }

    console.log("\n--- Database Update Complete ---");
    console.log(
      "Your summary cards should now show meaningful data with comparisons!"
    );

    // =================================================================
    // Verification: Check the distribution
    // =================================================================
    console.log("\n=== Verification ===");

    const currentProductCount = await prisma.product.count({
      where: {
        createdAt: {
          gte: current.startDate,
          lte: current.endDate,
        },
      },
    });

    const previousProductCount = await prisma.product.count({
      where: {
        createdAt: {
          gte: previous.startDate,
          lte: previous.endDate,
        },
      },
    });

    const currentOrderCount = await prisma.order.count({
      where: {
        createdAt: {
          gte: current.startDate,
          lte: current.endDate,
        },
      },
    });

    const previousOrderCount = await prisma.order.count({
      where: {
        createdAt: {
          gte: previous.startDate,
          lte: previous.endDate,
        },
      },
    });

    const currentOrderLineCount = await prisma.orderLine.count({
      where: {
        createdAt: {
          gte: current.startDate,
          lte: current.endDate,
        },
      },
    });

    const previousOrderLineCount = await prisma.orderLine.count({
      where: {
        createdAt: {
          gte: previous.startDate,
          lte: previous.endDate,
        },
      },
    });

    console.log(
      `Products: ${currentProductCount} current, ${previousProductCount} previous`
    );
    console.log(
      `Orders: ${currentOrderCount} current, ${previousOrderCount} previous`
    );
    console.log(
      `Order Lines: ${currentOrderLineCount} current, ${previousOrderLineCount} previous`
    );
  } catch (error) {
    console.error("Error updating mock data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Helper function to update a model with distribution across periods
 */
async function updateModelWithDistribution(
  modelName: string,
  model: any,
  current: any,
  previous: any
) {
  console.log(`\n=== Updating ${modelName} ===`);
  const records = await model.findMany();

  if (records.length === 0) {
    console.log(`No records found in ${modelName}. Skipping.`);
    return;
  }

  const shuffledRecords = shuffleArray(records);
  const currentCount = Math.ceil(shuffledRecords.length * 0.6);
  const currentRecords = shuffledRecords.slice(0, currentCount);
  const previousRecords = shuffledRecords.slice(currentCount);

  // Create update promises
  const currentUpdates = currentRecords.map((record) => {
    const newDate = getRandomDateInRange(current.startDate, current.endDate);
    return model.update({
      where: { id: record.id },
      data: {
        createdAt: newDate,
        updatedAt: newDate,
      },
    });
  });

  const previousUpdates = previousRecords.map((record) => {
    const newDate = getRandomDateInRange(previous.startDate, previous.endDate);
    return model.update({
      where: { id: record.id },
      data: {
        createdAt: newDate,
        updatedAt: newDate,
      },
    });
  });

  // Execute all updates
  await Promise.all([...currentUpdates, ...previousUpdates]);

  console.log(
    `${modelName}: ${currentRecords.length} current, ${previousRecords.length} previous`
  );
}

updateMockData();
