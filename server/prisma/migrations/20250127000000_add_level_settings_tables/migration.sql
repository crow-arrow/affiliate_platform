-- Migration: Add Level Settings Tables
-- Description: Add tables for managing user level settings and app configuration

-- Create LevelSetting table
CREATE TABLE IF NOT EXISTS "LevelSetting" (
    "id" SERIAL PRIMARY KEY,
    "levelName" VARCHAR(50) NOT NULL UNIQUE,
    "levelOrder" INTEGER NOT NULL UNIQUE,
    "requiredAmount" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create AppSetting table
CREATE TABLE IF NOT EXISTS "AppSetting" (
    "id" SERIAL PRIMARY KEY,
    "key" VARCHAR(100) NOT NULL UNIQUE,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert default level settings
INSERT INTO "LevelSetting" ("levelName", "levelOrder", "requiredAmount", "isActive") VALUES
('BRONZE', 1, 0, true),
('SILVER', 2, 10, true),
('GOLD', 3, 25, true),
('PLATINUM', 4, 50, true)
ON CONFLICT ("levelName") DO NOTHING;

-- Insert default app settings
INSERT INTO "AppSetting" ("key", "value") VALUES
('levelAmountDescription', 'Travellers This Year')
ON CONFLICT ("key") DO NOTHING;
