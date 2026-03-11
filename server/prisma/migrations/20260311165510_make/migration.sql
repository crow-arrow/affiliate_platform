/*
  Warnings:

  - A unique constraint covering the columns `[tenant_id,order_id]` on the table `trips` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "TripField" ADD VALUE 'orderId';

-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "order_id" VARCHAR(100),
ALTER COLUMN "booking_date" DROP NOT NULL,
ALTER COLUMN "travel_date" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "trips_order_id_idx" ON "trips"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "trips_tenant_id_order_id_key" ON "trips"("tenant_id", "order_id");
