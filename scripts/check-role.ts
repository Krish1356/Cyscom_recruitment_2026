import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function check() {
  const user = await prisma.user.findFirst();
  if (user) {
    console.log("User email:", user.email);
    console.log("User role:", user.role);
    
    // Force upgrade to SUPER_ADMIN if they aren't already
    if (user.role !== "SUPER_ADMIN") {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "SUPER_ADMIN" }
      });
      await prisma.adminUser.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id }
      });
      console.log("Upgraded to SUPER_ADMIN!");
    }
  } else {
    console.log("No user found");
  }
}

check().finally(() => prisma.$disconnect());
