/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,key]` on the table `AppSetting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,levelOrder]` on the table `LevelSetting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,levelName]` on the table `LevelSetting` will be added. If there are existing duplicate values, this will fail.

*/
-- Drop unique constraint (was created as a constraint, not a plain index)
ALTER TABLE "AppSetting" DROP CONSTRAINT IF EXISTS "AppSetting_key_key";

-- Drop unique constraint (was created as a constraint, not a plain index)
ALTER TABLE "LevelSetting" DROP CONSTRAINT IF EXISTS "LevelSetting_levelName_key";

-- Drop unique constraint (was created as a constraint, not a plain index)
ALTER TABLE "LevelSetting" DROP CONSTRAINT IF EXISTS "LevelSetting_levelOrder_key";

-- AlterTable
ALTER TABLE "AppSetting" ADD COLUMN     "tenantId" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "LevelSetting" ADD COLUMN     "tenantId" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "AppSetting_tenantId_key_key" ON "AppSetting"("tenantId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "LevelSetting_tenantId_levelOrder_key" ON "LevelSetting"("tenantId", "levelOrder");

-- CreateIndex
CREATE UNIQUE INDEX "LevelSetting_tenantId_levelName_key" ON "LevelSetting"("tenantId", "levelName");

-- AddForeignKey
ALTER TABLE "LevelSetting" ADD CONSTRAINT "LevelSetting_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppSetting" ADD CONSTRAINT "AppSetting_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Update existing enum values for role if needed
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
    CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PARTNER');
  END IF;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Ensure enum has PARTNER
DO $$ BEGIN
  ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'PARTNER';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Migrate existing rows from GENIE to PARTNER (if GENIE existed previously)
DO $$ BEGIN
  UPDATE "referral_users" SET "role"='PARTNER' WHERE "role"::text='GENIE';
EXCEPTION WHEN undefined_column THEN NULL; END $$;

-- Set default to PARTNER
ALTER TABLE "referral_users" ALTER COLUMN "role" SET DEFAULT 'PARTNER';
