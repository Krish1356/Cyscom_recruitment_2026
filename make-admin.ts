import { prisma } from './src/lib/prisma'

async function main() {
  const emails = ['shahvijval@gmail.com', 'aakansh15.gupta@gmail.com']
  
  for (const email of emails) {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        role: 'SUPER_ADMIN',
      },
      create: {
        email,
        name: email.split('@')[0],
        role: 'SUPER_ADMIN',
      },
    })

    // Ensure they have an admin profile
    await prisma.adminUser.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
      }
    })

    console.log(`Successfully configured ${email} as SUPER_ADMIN`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
