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
  console.log("Adding Profile Links question for Web Dev and Technical...");
  
  await prisma.questionBank.create({
    data: {
      department: "WEB_DEVELOPMENT",
      type: "GENERAL",
      title: "Profile Links",
      content: "Please provide the links to your GitHub and LinkedIn profiles."
    }
  });

  await prisma.questionBank.create({
    data: {
      department: "TECHNICAL",
      type: "GENERAL",
      title: "Profile Links",
      content: "Please provide the links to your GitHub and LinkedIn profiles."
    }
  });

  console.log("Success!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
