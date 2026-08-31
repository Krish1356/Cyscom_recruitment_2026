import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('secret') !== 'cyscom123!@#') return NextResponse.json({ error: 'unauthorized' });

  const emails = [
    'shubhkothari1307@gmail.com',
    'joeliyncalista26@gmail.com',
    'navyakarthi0713@gmail.com',
    'pc.guhan@gmail.com',
    'sakshamkaushish27@gmail.com',
    'yuvashreenandakumar6@gmail.com',
    'surajkumarps27@gmail.com',
    'yggamer111@gmail.com',
    'deepakshimathur2712@gmail.com',
    'gargimohajangm@gmail.com',
    'education.anayy@gmail.com',
    'sugeeth2007@gmail.com'
  ];

  const results = [];
  for (const email of emails) {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, role: 'ADMIN' }
      });
      results.push(`Created user ${email}`);
    } else {
      user = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
      });
      results.push(`Updated user ${email}`);
    }
    
    const adminProfile = await prisma.adminUser.findUnique({ where: { userId: user.id } });
    if (!adminProfile) {
      await prisma.adminUser.create({
        data: { userId: user.id, designation: 'Admin' }
      });
    }
  }

  return NextResponse.json({ success: true, results });
}
