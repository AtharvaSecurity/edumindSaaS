import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'demo-school' },
    update: {},
    create: {
      name: 'Demo Public School',
      subdomain: 'demo-school',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      phone: '+919999999999',
      email: 'admin@demoschool.edu.in',
      subscriptionPlan: 'BASIC',
      subscriptionStatus: 'TRIAL',
      settings: { timezone: 'Asia/Kolkata', currency: 'INR', dateFormat: 'DD/MM/YYYY' },
    },
  });

  console.log(`✅ Created tenant: ${tenant.name}`);

  const hashedPassword = await bcrypt.hash('Admin@123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demoschool.edu.in' },
    update: {},
    create: {
      email: 'admin@demoschool.edu.in',
      passwordHash: hashedPassword,
      role: 'SCHOOL_ADMIN',
      isActive: true,
      tenantId: tenant.id,
    },
  });

  await prisma.admin.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      tenantId: tenant.id,
      fullName: 'Rajesh Kumar',
      employeeCode: 'ADM001',
      phone: '+919999999999',
    },
  });

  const currentYear = new Date().getFullYear();
  await prisma.academicYear.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: `${currentYear}-${currentYear + 1}` } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: `${currentYear}-${currentYear + 1}`,
      startDate: new Date(`${currentYear}-04-01`),
      endDate: new Date(`${currentYear + 1}-03-31`),
      isActive: true,
    },
  });

  console.log('✅ Seed completed!');
  console.log('');
  console.log('📧 Demo Login Credentials:');
  console.log('   Email:     admin@demoschool.edu.in');
  console.log('   Password:  Admin@123');
  console.log('   Subdomain: demo-school');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
