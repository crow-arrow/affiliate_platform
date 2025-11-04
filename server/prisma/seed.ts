import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Удаляем в правильном порядке (сначала зависимости)
  await prisma.conversionEvent.deleteMany();
  await prisma.clicksData.deleteMany();
  await prisma.referralLink.deleteMany();
  await prisma.levelHistory.deleteMany();
  await prisma.trips.deleteMany();
  await prisma.tenantFieldMapping.deleteMany();
  await prisma.tenantApiKey.deleteMany();
  await prisma.partnerProfile.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.identity.deleteMany();
  await prisma.appSetting.deleteMany();
  await prisma.levelSetting.deleteMany();
  await prisma.tenant.deleteMany();

  const passwordHash = await bcrypt.hash("Lama457660712*", 10);

  // 1. Создаём первого пользователя (amal@jinn-travel.com)
  const identity1 = await prisma.identity.create({
    data: {
      email: "amal@jinn-travel.com",
      firstName: "Amal",
      lastName: "ULD",
      passwordHash: passwordHash,
      emailVerified: true,
    },
  });

  // 2. Создаём второго пользователя
  const identity2 = await prisma.identity.create({
    data: {
      email: "user2@example.com",
      firstName: "User",
      lastName: "Two",
      passwordHash: passwordHash,
      emailVerified: true,
    },
  });

  // 3. Создаём первый Tenant (Jinn Travel)
  const tenant1 = await prisma.tenant.create({
    data: {
      name: "Jinn Travel",
      domain: "jinn-travel",
      branding: {
        logo: "https://jinn-travel.com/wp-content/uploads/2025/08/Jinn-royal.svg",
        primaryColor: "#CBAF87",
      },
    },
  });

  // 4. Создаём второй Tenant (Dream Travel)
  const tenant2 = await prisma.tenant.create({
    data: {
      name: "Dream Travel",
      domain: "dream-travel",
      branding: {
        logo: "",
        primaryColor: "#4A90E2",
      },
    },
  });

  // 5. Создаём Membership для первого пользователя в обоих тенантах
  const membership1_tenant1 = await prisma.membership.create({
    data: {
      identityId: identity1.id,
      tenantId: tenant1.id,
      role: "ADMIN",
    },
  });

  const membership1_tenant2 = await prisma.membership.create({
    data: {
      identityId: identity1.id,
      tenantId: tenant2.id,
      role: "ADMIN",
    },
  });

  // 6. Создаём PartnerProfile для первого пользователя в обоих тенантах
  const partnerProfile1_tenant1 = await prisma.partnerProfile.create({
    data: {
      membershipId: membership1_tenant1.id,
      affiliateId: "amal_666",
      level: "BRONZE",
    },
  });

  const partnerProfile1_tenant2 = await prisma.partnerProfile.create({
    data: {
      membershipId: membership1_tenant2.id,
      affiliateId: "amal_43897",
      level: "BRONZE",
    },
  });

  // 7. Создаём LevelSettings для обоих тенантов
  const levelSettings = [
    { levelName: "BRONZE", levelOrder: 1, requiredAmount: 0 },
    { levelName: "SILVER", levelOrder: 2, requiredAmount: 10 },
    { levelName: "GOLD", levelOrder: 3, requiredAmount: 25 },
    { levelName: "PLATINUM", levelOrder: 4, requiredAmount: 50 },
  ];

  await prisma.levelSetting.createMany({
    data: [
      ...levelSettings.map((s) => ({ ...s, tenantId: tenant1.id, isActive: true })),
      ...levelSettings.map((s) => ({ ...s, tenantId: tenant2.id, isActive: true })),
    ],
  });

  // 8. Создаём AppSettings для обоих тенантов
  await prisma.appSetting.createMany({
    data: [
      {
        tenantId: tenant1.id,
        key: "levelAmountDescription",
        value: "Travellers This Year",
      },
      {
        tenantId: tenant2.id,
        key: "levelAmountDescription",
        value: "Travellers This Year",
      },
    ],
  });

  // 9. Создаём 10 туров для первого тенанта (Jinn Travel)
  const trips1 = [];
  const baseDate1 = new Date("2025-11-01");
  const statuses = ["COMPLETED", "CONFIRMED", "PENDING", "WAIT_FOR_APPROVAL", "CANCEL", "DEPOSIT_PAID", "APPROVED", "REJECTED"];

  for (let i = 0; i < 10; i++) {
    const travelDate = new Date(baseDate1);
    travelDate.setDate(baseDate1.getDate() + i * 3);
    const bookingDate = new Date(travelDate);
    bookingDate.setDate(travelDate.getDate() - 15);

    trips1.push({
      travellerAmount: Math.floor(Math.random() * 5) + 1,
      travelDate,
      bookingDate,
      orderStatus: statuses[i % statuses.length],
      totalPrice: (Math.random() * 5000 + 1000).toFixed(2),
      currency: "EUR",
      affiliateId: "amal_666",
      tenantId: tenant1.id,
      customerFirstName: `John${i}`,
      customerLastName: `Doe${i}`,
      customerEmail: `john${i}@example.com`,
    });
  }

  await prisma.trips.createMany({
    data: trips1,
  });

  // 10. Создаём 10 туров для второго тенанта (Dream Travel)
  const trips2 = [];
  const baseDate2 = new Date("2025-11-01");

  for (let i = 0; i < 10; i++) {
    const travelDate = new Date(baseDate2);
    travelDate.setDate(baseDate2.getDate() + i * 3);
    const bookingDate = new Date(travelDate);
    bookingDate.setDate(travelDate.getDate() - 15);

    trips2.push({
      travellerAmount: Math.floor(Math.random() * 5) + 1,
      travelDate,
      bookingDate,
      orderStatus: statuses[i % statuses.length],
      totalPrice: (Math.random() * 5000 + 1000).toFixed(2),
      currency: "EUR",
      affiliateId: "amal_43897",
      tenantId: tenant2.id,
      customerFirstName: `Jane${i}`,
      customerLastName: `Smith${i}`,
      customerEmail: `jane${i}@example.com`,
    });
  }

  await prisma.trips.createMany({
    data: trips2,
  });

  console.log("✅ Seed complete!");
  console.log("\n📧 Данные для входа:");
  console.log("Email 1: amal@jinn-travel.com");
  console.log("Email 2: user2@example.com");
  console.log("Password: Lama457660712*");
  console.log("\n🔗 Tenants:");
  console.log("- Jinn Travel (jinn-travel)");
  console.log("- Dream Travel (dream-travel)");
  console.log("\n📊 Создано:");
  console.log(`- 2 пользователя`);
  console.log(`- 2 тенанта`);
  console.log(`- 20 туров (по 10 на каждый тенант)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
