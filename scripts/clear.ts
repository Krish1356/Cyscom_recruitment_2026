import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function clear() {
  await prisma.assessment.deleteMany();
  await prisma.assessmentSession.deleteMany();
  console.log("Cleared old assessments");
}

clear().finally(() => prisma.$disconnect());
