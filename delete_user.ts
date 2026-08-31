import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "vijvalmargesh.shah2023@vitstudent.ac.in";
  console.log(`Looking for user with email: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.log("User not found in the database. They might already be deleted or haven't signed in yet.");
    return;
  }

  console.log(`Found user: ${user.id}. Deleting...`);
  
  // Thanks to onDelete: Cascade in schema.prisma, 
  // deleting the user deletes their ApplicantProfile, DepartmentSelections, Assessments, etc.
  await prisma.user.delete({
    where: { id: user.id }
  });

  console.log("Successfully deleted user and all associated data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
