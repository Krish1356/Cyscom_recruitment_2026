import { prisma } from './src/lib/prisma';
async function main() {
  const count = await prisma.applicantProfile.count();
  console.log("Current Registrations:", count);
}
main().catch(console.error);
