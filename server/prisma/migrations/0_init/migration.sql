-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PARTNER', 'MANAGER');

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

-- CreateEnum
CREATE TYPE "TripField" AS ENUM ('travelDate', 'bookingDate', 'customerFirstName', 'customerLastName', 'customerEmail', 'affiliateId', 'couponCode', 'travellerAmount', 'totalPrice', 'orderStatus', 'currency');

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "branding" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identities" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "clerk_id" TEXT,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "avatar_url" TEXT,
    "password_hash" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_codes" (
    "id" TEXT NOT NULL,
    "identity_id" TEXT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "type" VARCHAR(50) NOT NULL DEFAULT 'EMAIL_VERIFICATION',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "identity_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'PARTNER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_profiles" (
    "id" TEXT NOT NULL,
    "membership_id" TEXT NOT NULL,
    "phone" VARCHAR(20),
    "affiliate_id" VARCHAR(50),
    "coupon_code" VARCHAR(50),
    "level" "Level" NOT NULL DEFAULT 'BRONZE',
    "level_changed_at" TIMESTAMP(3),
    "booked_trips_count" INTEGER NOT NULL DEFAULT 0,
    "current_year_travellers" INTEGER DEFAULT 0,
    "number_of_travellers" INTEGER DEFAULT 0,
    "earnings" DECIMAL(19,2) NOT NULL DEFAULT 0,
    "canceled_earnings" DECIMAL(19,2) NOT NULL DEFAULT 0,
    "total_commission" DECIMAL(19,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" BIGSERIAL NOT NULL,
    "traveller_amount" INTEGER NOT NULL,
    "booking_date" TIMESTAMP(3) NOT NULL,
    "travel_date" TIMESTAMP(3) NOT NULL,
    "order_status" "OrderStatus" DEFAULT 'PENDING',
    "total_price" DECIMAL(19,2) NOT NULL,
    "currency" VARCHAR(10),
    "coupon_code" VARCHAR(50),
    "affiliate_id" VARCHAR(50),
    "customer_first_name" VARCHAR(100),
    "customer_last_name" VARCHAR(100),
    "customer_email" VARCHAR(255),
    "tenant_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clicks_data" (
    "id" BIGSERIAL NOT NULL,
    "affiliate_id" VARCHAR(50) NOT NULL,
    "referer" TEXT,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referral_profile_id" TEXT,
    "type" "ClickType" DEFAULT 'CLICK',
    "device_type" "DeviceType",

    CONSTRAINT "clicks_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level_history" (
    "id" SERIAL NOT NULL,
    "profile_id" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "level_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversion_events" (
    "id" SERIAL NOT NULL,
    "referralId" VARCHAR(255) NOT NULL,
    "event" VARCHAR(50) NOT NULL,
    "amount" DECIMAL(19,2),
    "currency" VARCHAR(10),
    "order_id" VARCHAR(100),
    "email" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversion_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral_links" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ConversionStatus" NOT NULL DEFAULT 'PENDING',
    "destination_url" TEXT,
    "utm_source" VARCHAR(50),
    "utm_campaign" VARCHAR(100),
    "utm_medium" VARCHAR(50),
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "referral_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level_settings" (
    "id" SERIAL NOT NULL,
    "tenant_id" TEXT,
    "level_name" VARCHAR(50) NOT NULL,
    "level_order" INTEGER NOT NULL,
    "required_amount" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "level_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_settings" (
    "id" SERIAL NOT NULL,
    "tenant_id" TEXT,
    "key" VARCHAR(100) NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_api_keys" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "api_key" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_field_mappings" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "incoming_field" VARCHAR(100) NOT NULL,
    "target_field" "TripField" NOT NULL,
    "description" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_field_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_domain_key" ON "tenants"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "identities_email_key" ON "identities"("email");

-- CreateIndex
CREATE UNIQUE INDEX "identities_clerk_id_key" ON "identities"("clerk_id");

-- CreateIndex
CREATE INDEX "verification_codes_identity_id_type_used_idx" ON "verification_codes"("identity_id", "type", "used");

-- CreateIndex
CREATE INDEX "verification_codes_code_identity_id_idx" ON "verification_codes"("code", "identity_id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_identity_id_tenant_id_key" ON "memberships"("identity_id", "tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "partner_profiles_membership_id_key" ON "partner_profiles"("membership_id");

-- CreateIndex
CREATE UNIQUE INDEX "partner_profiles_affiliate_id_key" ON "partner_profiles"("affiliate_id");

-- CreateIndex
CREATE INDEX "trips_travel_date_idx" ON "trips"("travel_date");

-- CreateIndex
CREATE INDEX "trips_booking_date_idx" ON "trips"("booking_date");

-- CreateIndex
CREATE INDEX "trips_order_status_idx" ON "trips"("order_status");

-- CreateIndex
CREATE INDEX "trips_affiliate_id_idx" ON "trips"("affiliate_id");

-- CreateIndex
CREATE INDEX "trips_tenant_id_idx" ON "trips"("tenant_id");

-- CreateIndex
CREATE INDEX "trips_customer_email_booking_date_idx" ON "trips"("customer_email", "booking_date");

-- CreateIndex
CREATE INDEX "clicks_data_affiliate_id_idx" ON "clicks_data"("affiliate_id");

-- CreateIndex
CREATE INDEX "clicks_data_ip_address_idx" ON "clicks_data"("ip_address");

-- CreateIndex
CREATE INDEX "clicks_data_timestamp_idx" ON "clicks_data"("timestamp");

-- CreateIndex
CREATE INDEX "clicks_data_referral_profile_id_idx" ON "clicks_data"("referral_profile_id");

-- CreateIndex
CREATE INDEX "level_history_profile_id_idx" ON "level_history"("profile_id");

-- CreateIndex
CREATE INDEX "level_history_changed_at_idx" ON "level_history"("changed_at");

-- CreateIndex
CREATE INDEX "conversion_events_referralId_idx" ON "conversion_events"("referralId");

-- CreateIndex
CREATE INDEX "conversion_events_created_at_idx" ON "conversion_events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "referral_links_slug_key" ON "referral_links"("slug");

-- CreateIndex
CREATE INDEX "referral_links_profile_id_idx" ON "referral_links"("profile_id");

-- CreateIndex
CREATE INDEX "referral_links_slug_idx" ON "referral_links"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "level_settings_tenant_id_level_order_key" ON "level_settings"("tenant_id", "level_order");

-- CreateIndex
CREATE UNIQUE INDEX "level_settings_tenant_id_level_name_key" ON "level_settings"("tenant_id", "level_name");

-- CreateIndex
CREATE UNIQUE INDEX "app_settings_tenant_id_key_key" ON "app_settings"("tenant_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_api_keys_api_key_key" ON "tenant_api_keys"("api_key");

-- CreateIndex
CREATE INDEX "tenant_api_keys_tenant_id_idx" ON "tenant_api_keys"("tenant_id");

-- CreateIndex
CREATE INDEX "tenant_api_keys_api_key_idx" ON "tenant_api_keys"("api_key");

-- CreateIndex
CREATE INDEX "tenant_field_mappings_tenant_id_idx" ON "tenant_field_mappings"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_field_mappings_tenant_id_incoming_field_key" ON "tenant_field_mappings"("tenant_id", "incoming_field");

-- AddForeignKey
ALTER TABLE "verification_codes" ADD CONSTRAINT "verification_codes_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_profiles" ADD CONSTRAINT "partner_profiles_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "partner_profiles"("affiliate_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clicks_data" ADD CONSTRAINT "clicks_data_referral_profile_id_fkey" FOREIGN KEY ("referral_profile_id") REFERENCES "partner_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "level_history" ADD CONSTRAINT "level_history_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "partner_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversion_events" ADD CONSTRAINT "conversion_events_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "referral_links"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_links" ADD CONSTRAINT "referral_links_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "partner_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "level_settings" ADD CONSTRAINT "level_settings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_settings" ADD CONSTRAINT "app_settings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_api_keys" ADD CONSTRAINT "tenant_api_keys_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_field_mappings" ADD CONSTRAINT "tenant_field_mappings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

