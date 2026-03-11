import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Загружаем переменные окружения
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const { Pool } = pg;

// Создаем connection pool для PostgreSQL
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString });

// Создаем adapter для Prisma 7.0
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const OrderStatus = {
  APPROVED: "APPROVED",
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
  WAIT_FOR_APPROVAL: "WAIT_FOR_APPROVAL",
  REJECTED: "REJECTED",
  DEPOSIT_PAID: "DEPOSIT_PAID",
};

async function seedTrips() {
  try {
    console.log("🌱 Starting trips seeding...");

    // Получаем первый PartnerProfile с affiliateId
    const profile = await prisma.partnerProfile.findFirst({
      where: {
        affiliateId: "amal_666",
      },
      select: {
        affiliateId: true,
        couponCode: true,
      },
    });

    if (!profile || !profile.affiliateId) {
      console.log(
        "❌ No PartnerProfile with affiliateId found. Please create a user first.",
      );
      return;
    }

    console.log(`✅ Found profile with affiliateId: ${profile.affiliateId}`);

    // Получаем текущую дату для генерации дат
    const now = new Date();

    // Генерируем тестовые trips
    const testTrips = [
      {
        orderId: "159",
        travellerAmount: 2,
        bookingDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 дней назад
        travelDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // через 15 дней
        orderStatus: OrderStatus.COMPLETED,
        totalPrice: 2500.0,
        currency: "EUR",
        couponCode: profile.couponCode,
        affiliateId: profile.affiliateId,
      },
      {
        orderId: "160",
        travellerAmount: 1,
        bookingDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 дней назад
        travelDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // через 10 дней
        orderStatus: OrderStatus.CONFIRMED,
        totalPrice: 1200.5,
        currency: "EUR",
        couponCode: profile.couponCode,
        affiliateId: profile.affiliateId,
      },
      {
        orderId: "161",
        travellerAmount: 4,
        bookingDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 дней назад
        travelDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000), // через 25 дней
        orderStatus: OrderStatus.PENDING,
        totalPrice: 4800.75,
        currency: "EUR",
        couponCode: profile.couponCode,
        affiliateId: profile.affiliateId,
      },
      {
        orderId: "162",
        travellerAmount: 2,
        bookingDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000), // 45 дней назад
        travelDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 дней назад (прошедшая)
        orderStatus: OrderStatus.COMPLETED,
        totalPrice: 3200.0,
        currency: "EUR",
        couponCode: profile.couponCode,
        affiliateId: profile.affiliateId,
      },
      {
        orderId: "163",
        travellerAmount: 3,
        bookingDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 дней назад
        travelDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // через 30 дней
        orderStatus: OrderStatus.WAIT_FOR_APPROVAL,
        totalPrice: 3750.25,
        currency: "EUR",
        affiliateId: profile.affiliateId,
      },
      {
        orderId: "164",
        travellerAmount: 1,
        bookingDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000), // 60 дней назад
        travelDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 дней назад
        orderStatus: OrderStatus.CANCELLED,
        totalPrice: 1500.0,
        currency: "EUR",
        couponCode: profile.couponCode,
        affiliateId: profile.affiliateId,
      },
      {
        orderId: "165",
        travellerAmount: 5,
        bookingDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 дня назад
        travelDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000), // через 45 дней
        orderStatus: OrderStatus.DEPOSIT_PAID,
        totalPrice: 6250.5,
        currency: "EUR",
        affiliateId: profile.affiliateId,
      },
      {
        orderId: "166",
        travellerAmount: 2,
        bookingDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 дней назад
        travelDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // через 20 дней
        orderStatus: OrderStatus.APPROVED,
        totalPrice: 2800.0,
        currency: "EUR",
        couponCode: profile.couponCode,
        affiliateId: profile.affiliateId,
      },
      {
        orderId: "167",
        travellerAmount: 1,
        bookingDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), // 90 дней назад
        travelDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000), // 60 дней назад
        orderStatus: OrderStatus.REJECTED,
        totalPrice: 1100.0,
        currency: "EUR",
        affiliateId: profile.affiliateId,
      },
      {
        orderId: "168",
        travellerAmount: 3,
        bookingDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // вчера
        travelDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000), // через 60 дней
        orderStatus: OrderStatus.PENDING,
        totalPrice: 4200.0,
        currency: "EUR",
        couponCode: profile.couponCode,
        affiliateId: profile.affiliateId,
      },
    ];

    // Создаем trips
    console.log(`📝 Creating ${testTrips.length} test trips...`);

    const createdTrips = await prisma.trips.createMany({
      data: testTrips,
      skipDuplicates: true,
    });

    console.log(`✅ Successfully created ${createdTrips.count} trips!`);
    console.log(`📊 Trips created for affiliateId: ${profile.affiliateId}`);

    // Показываем статистику по статусам
    const statusCounts = {};
    testTrips.forEach((trip) => {
      statusCounts[trip.orderStatus] =
        (statusCounts[trip.orderStatus] || 0) + 1;
    });

    console.log("\n📈 Status breakdown:");
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });
  } catch (error) {
    console.error("❌ Error seeding trips:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем скрипт
seedTrips()
  .then(() => {
    console.log("\n✨ Seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seeding failed:", error);
    process.exit(1);
  });
