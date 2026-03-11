-- Migration: CANCEL -> CANCELLED
-- Database was migrated with CANCEL; schema expects CANCELLED.
-- Create new enum (with CANCELLED, without CANCEL) and migrate in one step.
-- Avoids "new enum values must be committed" error by not using ADD VALUE.

-- Step 1: Create new enum
CREATE TYPE "OrderStatus_new" AS ENUM (
  'PENDING',
  'APPROVED',
  'CONFIRMED',
  'COMPLETED',
  'ONLINE_PAID',
  'DEPOSIT_PAID',
  'DEPARTED',
  'REJECTED',
  'CANCELLED',
  'WAIT_FOR_APPROVAL',
  'RECEIPT_SUBMITTED'
);

-- Step 2: Drop default (cannot cast old enum default to new type)
ALTER TABLE "trips" ALTER COLUMN "order_status" DROP DEFAULT;

-- Step 3: Migrate column (CANCEL -> CANCELLED via USING)
ALTER TABLE "trips"
  ALTER COLUMN "order_status" TYPE "OrderStatus_new"
  USING (
    CASE "order_status"::text
      WHEN 'CANCEL' THEN 'CANCELLED'::"OrderStatus_new"
      ELSE "order_status"::text::"OrderStatus_new"
    END
  );

-- Step 4: Drop old enum and rename new one
DROP TYPE "OrderStatus";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";

-- Step 5: Restore default
ALTER TABLE "trips" ALTER COLUMN "order_status" SET DEFAULT 'PENDING'::"OrderStatus";
