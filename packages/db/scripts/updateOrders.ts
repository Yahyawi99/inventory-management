import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "🚀 Starting script to update all Order user and organization IDs..."
  );

  // Define the new IDs you want to set
  const newUserId = "FvJj314y4Gzxb8DOwvd4X65h4Sbkz6Hb";
  const newOrganizationId = "cexNHYarYdbPro4etPFXdGlvKzz9CaLs";

  try {
    // 1. Fetch all existing orders
    const allOrders = await prisma.order.findMany();

    if (allOrders.length === 0) {
      console.log("No orders found in the database to update.");
      return;
    }

    console.log(
      `Found ${allOrders.length} orders to update. Initiating batch update...`
    );

    // 2. Loop through each order and update its IDs
    const updatePromises = allOrders.map((order) =>
      prisma.order.update({
        where: { id: order.id },
        data: {
          userId: newUserId,
          organizationId: newOrganizationId,
        },
      })
    );

    // 3. Execute all update promises concurrently
    const updatedOrders = await Promise.all(updatePromises);

    console.log(`✅ Successfully updated ${updatedOrders.length} orders.`);
    console.log(
      `All orders now have userId: ${newUserId} and organizationId: ${newOrganizationId}`
    );
  } catch (error) {
    console.error("❌ Error updating orders:", error);
    // You might want to log more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    process.exit(1); // Exit with an error code
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from database.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
