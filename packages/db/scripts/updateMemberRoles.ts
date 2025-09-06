import { randomUUID } from "crypto";
import { PrismaClient, Role } from "../generated/prisma/index.js";

// This script will delete all existing member records and then
// create a new member for each user in the provided array.
const prisma = new PrismaClient();

// The specific organization ID to associate with all new members.
const newOrganizationId = "ol9ZZzrMNEmShc3qhRcJ0V9g5UjsPMwF";

// Array of all available roles to be assigned randomly.
const roles: Role[] = [
  "Super_Admin",
  "Admin",
  "Manager",
  "Analyst",
  "Contributor",
  "Employee",
  "Intern",
];

// The users to create member records for.
const users = [
  {
    id: "800e8793-28ca-4252-b85b-7ea95128175c",
  },
  {
    id: "b6a83701-1abf-4099-ae7b-f0673a781d70",
  },
  {
    id: "d4c5fe6c-3f60-4cb2-a511-2bdf52c068a4",
  },
  {
    id: "e97c576c-76bc-44bd-b0b1-552f68adf0ec",
  },
  {
    id: "6b30ec33-2248-4f4a-b717-e26fb546a932",
  },
  {
    id: "dMiV48OSBQYVbdK1Va9EWHCPGLon5WI7",
  },
];

// Helper function to get a random role from the roles array.
function getRandomRole(): Role {
  const randomIndex = Math.floor(Math.random() * roles.length);
  return roles[randomIndex];
}

async function main() {
  console.log(
    "🚀 Starting script to delete all members and create new ones..."
  );

  try {
    // 1. Delete all existing member records
    console.log("🗑️ Deleting all existing members...");
    const deleteResult = await prisma.member.deleteMany();
    console.log(`✅ Successfully deleted ${deleteResult.count} members.`);

    // 2. Create a new member for each user with the specified organization ID and a random role
    console.log(`✨ Creating ${users.length} new member records...`);
    const createPromises = users.map((user) =>
      prisma.member.create({
        data: {
          id: randomUUID(),
          userId: user.id,
          organizationId: newOrganizationId,
          role: getRandomRole(),
        },
      })
    );

    const newMembers = await Promise.all(createPromises);

    console.log("✅ New members created successfully!");
    console.log("New Members Details:");
    newMembers.forEach((member) => {
      console.log(
        `- Member ID: ${member.id}, User ID: ${member.userId}, Role: ${member.role}`
      );
    });
  } catch (error) {
    console.error("❌ Error during script execution:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    process.exit(1); // Exit with an error code
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from the database.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
