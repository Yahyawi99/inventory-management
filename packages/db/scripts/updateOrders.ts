import { PrismaClient, OrderType } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

/**
 * Generates a random Date object that falls within the last specified number of days.
 * @param days The number of days back to start the date range from.
 * @returns A Date object within the specified historical range.
 */
const getRandomDateInLastDays = (days: number): Date => {
  const today = new Date();
  const daysAgo = new Date();

  // Set the start of the range (30 days ago at midnight)
  daysAgo.setDate(today.getDate() - days);
  daysAgo.setHours(0, 0, 0, 0);

  // Calculate the total time range in milliseconds
  const timeRange = today.getTime() - daysAgo.getTime();

  // Get a random offset within that 30-day range
  const randomOffset = Math.floor(Math.random() * timeRange);

  // Create the final random date by adding the offset to the start date
  return new Date(daysAgo.getTime() + randomOffset);
};

async function main() {
  console.log(
    "🚀 Starting script to update all Order IDs and assign dates within the last 30 days..."
  );

  // Define the common IDs you want to set
  const newUserId = "dMiV48OSBQYVbdK1Va9EWHCPGLon5WI7";
  const newOrganizationId = "ol9ZZzrMNEmShc3qhRcJ0V9g5UjsPMwF";
  const daysToSeed = 30; // *** Only seed data for the last 30 days ***

  try {
    // 1. Fetch all existing orders
    const allOrders = await prisma.order.findMany({
      select: { id: true },
    });

    if (allOrders.length === 0) {
      console.log("No orders found in the database to update.");
      return;
    }

    console.log(
      `Found ${allOrders.length} orders. Assigning random dates within the last ${daysToSeed} days...`
    );

    // 2. Loop through each order and update its IDs, date, and type
    const updatePromises = allOrders.map((order) => {
      const randomDate = getRandomDateInLastDays(daysToSeed);

      return prisma.order.update({
        where: { id: order.id },
        data: {
          userId: newUserId,
          organizationId: newOrganizationId,
          orderDate: randomDate,
          orderType: OrderType.SALES, // Ensure it's marked as a SALES order
        },
      });
    });

    // 3. Execute all update promises concurrently
    const updatedOrders = await Promise.all(updatePromises);

    console.log(`✅ Successfully updated ${updatedOrders.length} orders.`);
    console.log(
      `All orders now support charting by falling within the last 30 days.`
    );
  } catch (error) {
    console.error("❌ Error updating orders:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
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
