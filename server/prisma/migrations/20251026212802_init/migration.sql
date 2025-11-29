-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PARTNER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('APPROVED', 'PENDING', 'CONFIRMED', 'CANCEL', 'COMPLETED', 'WAIT_FOR_APPROVAL', 'REJECTED', 'DEPOSIT_PAID');

-- CreateEnum
CREATE TYPE "ClickType" AS ENUM ('CLICK', 'BOOKING', 'BOUNCE');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('MOBILE', 'DESKTOP', 'TABLET', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM');

-- CreateEnum
CREATE TYPE "ConversionStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "branding" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral_users" (
    "id" SERIAL NOT NULL,
    "clerkId" TEXT,
    "email" TEXT NOT NULL,
    "phone" VARCHAR(20),
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "coupon_code" VARCHAR(50),
    "affiliate_id" VARCHAR(50),
    "role" "UserRole" NOT NULL DEFAULT 'PARTNER',
    "level" "Level" NOT NULL DEFAULT 'BRONZE',
    "levelChangedAt" TIMESTAMP(3),
    "booked_trips_count" INTEGER NOT NULL DEFAULT 0,
    "current_year_travellers" INTEGER DEFAULT 0,
    "number_of_travellers" INTEGER DEFAULT 0,
    "earnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "canceled_earnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avatarUrl" TEXT,
    "tenantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referral_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wp_tourmaster_order" (
    "id" BIGSERIAL NOT NULL,
    "traveller_amount" INTEGER NOT NULL,
    "booking_date" TIMESTAMP(3) NOT NULL,
    "travel_date" TIMESTAMP(3) NOT NULL,
    "order_status" "OrderStatus" DEFAULT 'PENDING',
    "total_price" DECIMAL(19,2) NOT NULL,
    "currency" VARCHAR(10),
    "coupon_code" VARCHAR(50),
    "affiliate_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wp_tourmaster_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wp_affiliate_analytics" (
    "id" BIGSERIAL NOT NULL,
    "affiliate_id" VARCHAR(50) NOT NULL,
    "referer" TEXT,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referral_user_id" INTEGER NOT NULL,
    "type" "ClickType" DEFAULT 'CLICK',
    "device_type" "DeviceType",

    CONSTRAINT "wp_affiliate_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level_history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "level" "Level" NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "level_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversionEvent" (
    "id" SERIAL NOT NULL,
    "referralId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "currency" TEXT,
    "orderId" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralLink" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ConversionStatus" NOT NULL DEFAULT 'PENDING',
    "destinationUrl" TEXT,
    "utmSource" TEXT,
    "utmCampaign" TEXT,
    "utmMedium" TEXT,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ReferralLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "referral_users_clerkId_key" ON "referral_users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "referral_users_email_key" ON "referral_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "referral_users_affiliate_id_key" ON "referral_users"("affiliate_id");

-- CreateIndex
CREATE INDEX "wp_affiliate_analytics_affiliate_id_idx" ON "wp_affiliate_analytics"("affiliate_id");

-- CreateIndex
CREATE INDEX "wp_affiliate_analytics_ip_address_idx" ON "wp_affiliate_analytics"("ip_address");

-- CreateIndex
CREATE INDEX "fk_referral_user_id" ON "wp_affiliate_analytics"("referral_user_id");

-- CreateIndex
CREATE INDEX "ConversionEvent_referralId_idx" ON "ConversionEvent"("referralId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralLink_slug_key" ON "ReferralLink"("slug");

-- CreateIndex
CREATE INDEX "ReferralLink_userId_idx" ON "ReferralLink"("userId");

-- AddForeignKey
ALTER TABLE "referral_users" ADD CONSTRAINT "referral_users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wp_tourmaster_order" ADD CONSTRAINT "wp_tourmaster_order_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "referral_users"("affiliate_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wp_affiliate_analytics" ADD CONSTRAINT "wp_affiliate_analytics_referral_user_id_fkey" FOREIGN KEY ("referral_user_id") REFERENCES "referral_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "level_history" ADD CONSTRAINT "level_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "referral_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversionEvent" ADD CONSTRAINT "ConversionEvent_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "ReferralLink"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralLink" ADD CONSTRAINT "ReferralLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "referral_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
