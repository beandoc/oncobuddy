import { PrismaClient, DayCareShift, DayCareStatus, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Day Care Sessions...');

  const clinician = await prisma.clinician.findFirst({
    where: { user: { role: Role.ONCOLOGIST } }
  });

  if (!clinician) {
    console.error('No clinician found for seeding DCU.');
    return;
  }

  const patients = await prisma.patient.findMany({ 
    take: 8,
    where: { institutionId: clinician.institutionId }
  });

  if (patients.length === 0) {
    console.error('No patients found for seeding DCU.');
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1);

  const days = [today, tomorrow];

  for (const date of days) {
    for (let i = 0; i < patients.length; i++) {
        const shift = i < 4 ? DayCareShift.MORNING : DayCareShift.AFTERNOON;
        
        await prisma.dayCareSession.upsert({
            where: {
                patientId_date_shift: {
                    patientId: patients[i].id,
                    date: date,
                    shift: shift
                }
            },
            update: {},
            create: {
                patientId: patients[i].id,
                clinicianId: clinician.id,
                date: date,
                shift: shift,
                status: DayCareStatus.SCHEDULED,
                notes: `Standard Cycle 4 (Day ${i+1})`
            }
        });
    }
  }

  console.log('Day Care Sessions seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
