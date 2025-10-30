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
