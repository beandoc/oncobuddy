import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function check() {
  const email = "oncologist@oncobuddy.com";
  const user = await prisma.user.findUnique({
    where: { email },
    include: { clinician: true }
  });

  if (!user) {
    console.log("❌ User NOT found in database.");
  } else {
    console.log("✅ User found:", user.email);
    console.log("✅ Role:", user.role);
    console.log("✅ Status:", user.accountStatus);
    
    // Check password
    const test1234 = "test1234";
    const match = await bcrypt.compare(test1234, user.passwordHash || "");
    console.log("🔑 Password 'test1234' matches:", match);
  }
}

check().then(() => process.exit(0));
