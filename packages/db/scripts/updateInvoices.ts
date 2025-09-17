import { PrismaClient } from "../generated/prisma/index.js";
import { randomUUID as uuidv4 } from "crypto";

const prisma = new PrismaClient();

// Configuration constants
const INVOICES_TO_SEED = 50;
const INVOICE_STATUSES = ["Paid", "Pending", "Overdue", "Void"];
const newUserId = "dMiV48OSBQYVbdK1Va9EWHCPGLon5WI7";
const newOrganizationId = "ol9ZZzrMNEmShc3qhRcJ0V9g5UjsPMwF";

/**
 * Generates a random date within the previous week (7 days ago to now).
 * @returns {Date} A new Date object.
 */
function getPreviousWeekDate() {
  const now = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  const start = oneWeekAgo.getTime();
  const end = now.getTime();
  const randomTime = start + Math.random() * (end - start);

  return new Date(randomTime);
}

/**
 * Generates a random date within the week before the previous week (14 to 7 days ago).
 * @returns {Date} A new Date object.
 */
function getTwoWeeksAgoDate() {
  const now = new Date();
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(now.getDate() - 14);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  const start = twoWeeksAgo.getTime();
  const end = oneWeekAgo.getTime();
  const randomTime = start + Math.random() * (end - start);

  return new Date(randomTime);
}

/**
 * Picks a random element from an array.
 * @param {Array} arr The array to pick from.
 * @returns {*} A random element from the array.
 */
function getRandomElement(arr: any) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("🚀 Starting script to delete and re-seed invoices...");

  try {
    // 1. Delete all existing invoices
    console.log("Deleting all existing invoices...");
    const { count } = await prisma.invoice.deleteMany({});
    console.log(`✅ Successfully deleted ${count} invoices.`);

    // 2. Fetch the required number of orders to link to the new invoices
    console.log(
      `Fetching ${INVOICES_TO_SEED} orders to link with new invoices...`
    );
    const orders = await prisma.order.findMany({ take: INVOICES_TO_SEED });

    if (orders.length === 0) {
      console.log("No orders found. Cannot seed invoices without orders.");
      return;
    }
    console.log(`Found ${orders.length} orders. Proceeding with seeding.`);

    // 3. Prepare the data for the new invoices
    const invoiceData = orders.map((order, index) => {
      // Split invoices evenly between the last week and the week before
      let invoiceDate;
      if (index < INVOICES_TO_SEED / 2) {
        invoiceDate = getPreviousWeekDate();
      } else {
        invoiceDate = getTwoWeeksAgoDate();
      }

      const dueDate = new Date(invoiceDate);
      dueDate.setDate(dueDate.getDate() + 30); // Due date 30 days later

      return {
        id: uuidv4(),
        invoiceNumber: `INV-${String(index + 1).padStart(4, "0")}`,
        invoiceDate: invoiceDate,
        dueDate: dueDate,
        totalAmount: parseFloat((Math.random() * 5000 + 50).toFixed(2)),
        status: getRandomElement(INVOICE_STATUSES),
        orderId: order.id,
        userId: newUserId,
        organizationId: newOrganizationId,
      };
    });

    // 4. Seed the new invoices
    console.log(`Creating ${invoiceData.length} new invoices...`);
    await prisma.invoice.createMany({
      data: invoiceData,
    });

    console.log(
      "✅ Seeding complete. The database now contains a fresh set of invoices."
    );
  } catch (error) {
    console.error("❌ Error during seeding process:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from database.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
