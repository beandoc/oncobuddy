import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const patients = await prisma.patient.findMany({
    include: {
      user: true,
    }
  });

  console.log(JSON.stringify(patients.map(p => ({
    firstName: p.user.firstName,
    lastName: p.user.lastName,
    publicId: p.publicId,
    id: p.id
  })), null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
