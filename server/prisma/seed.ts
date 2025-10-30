import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Создаём Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "Jinn Travel",
      domain: "jinn-travel.com",
      branding: {
        logo: "https://jinn-travel.com/wp-content/uploads/2025/08/Jinn-royal.svg",
        primaryColor: "#CBAF87",
      },
    },
  });

  // 2. Создаём User, связанного с Tenant
  const user = await prisma.user.create({
    data: {
      email: "amal@jinn-travel.com",
      first_name: "Amal",
      last_name: "ULD",
      password: "hashedpassword123",
      affiliate_id: "amal_666",
      role: "PARTNER",
      level: "BRONZE",
      tenantId: tenant.id,
    },
  });

  // 3. Создаём ReferralLink для User
  const referralLink = await prisma.referralLink.create({
    data: {
      slug: "amal_666",
      userId: user.id,
      destinationUrl: "https://jinn-travel.com/trips",
      utmSource: "telegram",
      utmCampaign: "autumn_launch",
      utmMedium: "social",
    },
  });

  console.log("✅ Seed complete!");
  console.log({ tenant, user, referralLink });
}

await prisma.conversionEvent.deleteMany();
await prisma.clicksData.deleteMany(); // ⬅️ сначала удалим связи
await prisma.referralLink.deleteMany();
await prisma.levelHistory.deleteMany(); // если есть
await prisma.user.deleteMany(); // ⬅️ теперь можно удалить
await prisma.tenant.deleteMany();

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
