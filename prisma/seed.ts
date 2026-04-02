import { PrismaClient, Role, AccountStatus, ClinicianRole, Specialization } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('test1234', 12);

  // 1. Create Default Institution
  const institution = await prisma.institution.upsert({
    where: { slug: 'oncobuddy-india' },
    update: {},
    create: {
      institutionName: 'OncoBuddy Clinical Research Center',
      slug: 'oncobuddy-india',
      emergencyPhoneNumber: '102',
    },
  });

  // 2. Create Default Oncologist
  const oncologistUser = await prisma.user.upsert({
    where: { email: 'oncologist@oncobuddy.com' },
    update: {},
    create: {
      email: 'oncologist@oncobuddy.com',
      firstName: 'Albus',
      lastName: 'Smith',
      passwordHash,
      role: Role.ONCOLOGIST,
      accountStatus: AccountStatus.ACTIVE,
      institutionId: institution.id,
    },
  });

  const oncologist = await prisma.clinician.upsert({
    where: { userId: oncologistUser.id },
    update: {},
    create: {
      userId: oncologistUser.id,
      licenseNumber: 'DOC-999-IND',
      specialization: Specialization.MEDICAL_ONCOLOGIST,
      institutionId: institution.id,
    },
  });

  console.log('✅ Clinician Seeded:', oncologistUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
