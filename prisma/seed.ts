import { PrismaClient, Role, AccountStatus, Gender, SexAtBirth, MaritalStatus, BloodGroup, AlertType, AlertSeverity, AlertStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Clinical Seeding...');

  // 1. Create Default Institution (Section 12)
  const institution = await prisma.institution.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      institutionName: "OncoBuddy Clinical Network",
      slug: "default",
      emergencyPhoneNumber: "911",
    }
  });

  // 2. Create Lead Oncologist (Role: ONCOLOGIST) (Section 1)
  const oncologistPassword = await bcrypt.hash('test1234', 12);
  const oncologistUser = await prisma.user.upsert({
    where: { email: 'oncologist@oncobuddy.com' },
    update: { 
      passwordHash: oncologistPassword,
      firstName: 'Dr. Anvesh',
      lastName: 'Rathod',
    },
    create: {
      email: 'oncologist@oncobuddy.com',
      passwordHash: oncologistPassword,
      firstName: 'Dr. Anvesh',
      lastName: 'Rathod',
      role: Role.ONCOLOGIST,
      accountStatus: AccountStatus.ACTIVE,
      institutionId: institution.id,
    }
  });

  const oncologist = await prisma.clinician.upsert({
    where: { userId: oncologistUser.id },
    update: {},
    create: {
      userId: oncologistUser.id,
      institutionId: institution.id,
      specialization: 'MEDICAL_ONCOLOGIST',
      licenseNumber: 'REG-1044-INDIA',
    }
  });

  // 2b. Create Onco-Nurse (Role: NURSE) (Section 12)
  const nursePassword = await bcrypt.hash('test1234', 12);
  const nurseUser = await prisma.user.upsert({
    where: { email: 'nurse@oncobuddy.com' },
    update: { passwordHash: nursePassword },
    create: {
      email: 'nurse@oncobuddy.com',
      passwordHash: nursePassword,
      firstName: 'Nurse Ananya',
      lastName: 'Iyer',
      role: Role.NURSE,
      accountStatus: AccountStatus.ACTIVE,
      institutionId: institution.id,
    }
  });

  await prisma.clinician.upsert({
    where: { userId: nurseUser.id },
    update: {},
    create: {
      userId: nurseUser.id,
      institutionId: institution.id,
      specialization: 'NURSE_NAVIGATOR',
      licenseNumber: 'NURSE-990-INDIA',
    }
  });

  // 3. Indian Patient Data - 5 High-Fidelity Test Cases (Section 4)
  const patientsData = [
    { firstName: 'Arjun', lastName: 'Sharma', mrn: 'MRN-1001', diagnosis: 'Ductal Carcinoma (Breast)', site: 'Breast (C50)', severity: AlertSeverity.URGENT },
    { firstName: 'Priya', lastName: 'Iyer', mrn: 'MRN-1002', diagnosis: 'Adenocarcinoma (Lung)', site: 'Lung (C34)', severity: AlertSeverity.EMERGENCY },
    { firstName: 'Rohan', lastName: 'Verma', mrn: 'MRN-1003', diagnosis: 'Squamous Cell Carcinoma (Skin)', site: 'Skin (C44)', severity: AlertSeverity.MODERATE },
    { firstName: 'Sunita', lastName: 'Reddy', mrn: 'MRN-1004', diagnosis: 'Pancreatic Adenocarcinoma', site: 'Pancreas (C25)', severity: AlertSeverity.INFORMATIONAL },
    { firstName: 'Amit', lastName: 'Das', mrn: 'MRN-1005', diagnosis: 'Glioblastoma Multiforme', site: 'Brain (C71)', severity: AlertSeverity.EMERGENCY },
  ];

  for (const p of patientsData) {
    const userPassword = await bcrypt.hash('test1234', 12);
    const user = await prisma.user.upsert({
      where: { email: `${p.firstName.toLowerCase()}@example.com` },
      update: { passwordHash: userPassword },
      create: {
        email: `${p.firstName.toLowerCase()}@example.com`,
        passwordHash: userPassword,
        firstName: p.firstName,
        lastName: p.lastName,
        role: Role.PATIENT,
        accountStatus: AccountStatus.ACTIVE,
        institutionId: institution.id,
      }
    });

    const patient = await prisma.patient.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        institutionId: institution.id,
        mrn: p.mrn,
        preferredName: p.firstName,
        dateOfBirth: new Date('1985-05-15'),
        gender: Gender.PREFER_NOT_TO_SAY,
        sexAtBirth: SexAtBirth.MALE,
        maritalStatus: MaritalStatus.MARRIED,
        bloodGroup: BloodGroup.A_POS,
        primaryPhone: '9876543210',
        phoneVerified: true,
      }
    });

    // Link to Oncologist Panel (Section 4)
    await prisma.patientClinicalTeam.create({
      data: {
        patientId: patient.id,
        clinicianId: oncologist.id,
        clinicianRole: 'ONCOLOGIST',
      }
    });

    // Create Initial Diagnosis (Section 4)
    const diagnosis = await prisma.diagnosis.create({
      data: {
        patientId: patient.id,
        icd10Code: 'C50.9',
        icd10Description: p.diagnosis,
        primarySiteCode: 'C50',
        primarySiteDescription: p.site,
        morphologyCode: '8500/3',
        morphologyDescription: 'Infiltrating duct carcinoma',
        diagnosisDate: new Date(),
      }
    });

    // Create Symptom Log with Alert if severity is high (Section 15)
    const log = await prisma.symptomLog.create({
      data: {
        patientId: patient.id,
        diagnosisId: diagnosis.id,
        submittedBy: user.id,
        submittedByType: 'PATIENT',
        wellbeingScore: 7,
        logDate: new Date(),
      }
    });

    // Create High-Precision Alert (Section 4)
    if (p.severity !== AlertSeverity.INFORMATIONAL) {
      await prisma.alert.create({
        data: {
          patientId: patient.id,
          triggeredByLogId: log.id,
          alertType: AlertType.THRESHOLD_BREACH,
          alertSeverity: p.severity,
          alertStatus: AlertStatus.PENDING,
        }
      });
    }
  }

  // 4. Create Family Caregiver (Role: CAREGIVER) for Arjun Sharma (Section 4)
  const arjun = await prisma.patient.findFirst({
    where: { preferredName: 'Arjun' }
  });

  if (arjun) {
    const caregiverPassword = await bcrypt.hash('test1234', 12);
    const caregiverUser = await prisma.user.upsert({
      where: { email: 'caregiver@example.com' },
      update: { passwordHash: caregiverPassword },
      create: {
        email: 'caregiver@example.com',
        passwordHash: caregiverPassword,
        firstName: 'Rajesh',
        lastName: 'Sharma',
        role: Role.CAREGIVER,
        accountStatus: AccountStatus.ACTIVE,
        institutionId: institution.id,
      }
    });

    const caregiver = await prisma.caregiver.upsert({
      where: { userId: caregiverUser.id },
      update: {},
      create: {
        userId: caregiverUser.id,
      }
    });

    await prisma.patientCaregiverAccess.upsert({
      where: { 
        patientId_caregiverId_isActive: {
          patientId: arjun.id,
          caregiverId: caregiver.id,
          isActive: true
        }
      },
      update: {},
      create: {
        patientId: arjun.id,
        caregiverId: caregiver.id,
        accessLevel: 'VIEW_AND_LOG',
        consentGrantedBy: arjun.userId,
        isActive: true,
      }
    });
  }

  console.log('✅ Clinical Seeding Completed Successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
