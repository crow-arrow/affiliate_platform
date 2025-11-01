import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Удаляем в правильном порядке (сначала зависимости)
  await prisma.conversionEvent.deleteMany();
  await prisma.clicksData.deleteMany();
  await prisma.referralLink.deleteMany();
  await prisma.levelHistory.deleteMany();
  await prisma.partnerProfile.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.identity.deleteMany();
  await prisma.appSetting.deleteMany();
  await prisma.levelSetting.deleteMany();
  await prisma.tenant.deleteMany();

  // 1. Создаём Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "Jinn Travel",
      domain: "jinn-travel",
      branding: {
        logo: "https://jinn-travel.com/wp-content/uploads/2025/08/Jinn-royal.svg",
        primaryColor: "#CBAF87",
      },
    },
  });

  // 2. Создаём Identity с правильным хешем пароля
  // Пароль: "password123"
  const passwordHash = await bcrypt.hash("Lama457660712*", 10);

  const identity = await prisma.identity.create({
    data: {
      email: "amal@jinn-travel.com",
      firstName: "Amal",
      lastName: "ULD",
      passwordHash: passwordHash,
      emailVerified: true, // Для тестового пользователя email уже верифицирован
    },
  });

  // 3. Создаём Membership для Identity в Tenant
  const membership = await prisma.membership.create({
    data: {
      identityId: identity.id,
      tenantId: tenant.id,
      role: "ADMIN",
    },
  });

  // 4. Создаём PartnerProfile для Membership
  const partnerProfile = await prisma.partnerProfile.create({
    data: {
      membershipId: membership.id,
      affiliateId: "amal_666",
      level: "BRONZE",
    },
  });

  // 5. Создаём ReferralLink для PartnerProfile
  const referralLink = await prisma.referralLink.create({
    data: {
      slug: "amal_666",
      profileId: partnerProfile.id,
      destinationUrl: "https://jinn-travel.com/trips",
      utmSource: "telegram",
      utmCampaign: "autumn_launch",
      utmMedium: "social",
    },
  });

  // 6. Создаём LevelSettings для Tenant
  await prisma.levelSetting.createMany({
    data: [
      {
        tenantId: tenant.id,
        levelName: "BRONZE",
        levelOrder: 1,
        requiredAmount: 0,
        isActive: true,
      },
      {
        tenantId: tenant.id,
        levelName: "SILVER",
        levelOrder: 2,
        requiredAmount: 10,
        isActive: true,
      },
      {
        tenantId: tenant.id,
        levelName: "GOLD",
        levelOrder: 3,
        requiredAmount: 25,
        isActive: true,
      },
      {
        tenantId: tenant.id,
        levelName: "PLATINUM",
        levelOrder: 4,
        requiredAmount: 50,
        isActive: true,
      },
    ],
  });

  // 7. Создаём AppSettings для Tenant
  await prisma.appSetting.create({
    data: {
      tenantId: tenant.id,
      key: "levelAmountDescription",
      value: "Travellers This Year",
    },
  });

  console.log("✅ Seed complete!");
  console.log("\n📧 Данные для входа:");
  console.log("Email: amal@jinn-travel.com");
  console.log("Password: password123");
  console.log("\n🔗 Tenant: jinn-travel.com");
  console.log({
    tenant,
    identity,
    membership,
    partnerProfile,
    referralLink,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
