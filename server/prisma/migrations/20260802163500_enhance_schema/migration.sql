-- Add name to User with a temp default so existing rows don't fail, then drop the default
ALTER TABLE "User" ADD COLUMN "name" TEXT NOT NULL DEFAULT 'Unknown';
ALTER TABLE "User" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ALTER COLUMN "name" DROP DEFAULT;

-- Add new enum values
ALTER TYPE "PolicyStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';
ALTER TYPE "ClaimStatus"  ADD VALUE IF NOT EXISTS 'UNDER_REVIEW';
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';

-- Create new enums
DO $$ BEGIN
  CREATE TYPE "PolicyType" AS ENUM ('LIFE', 'HEALTH', 'AUTO', 'HOME', 'TRAVEL', 'BUSINESS');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "DocumentType" AS ENUM ('ID_PROOF', 'ADDRESS_PROOF', 'POLICY_DOCUMENT', 'CLAIM_DOCUMENT', 'OTHER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Update Policy table
ALTER TABLE "Policy" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Policy" ADD COLUMN IF NOT EXISTS "coverageAmount" DECIMAL(65,30) NOT NULL DEFAULT 0;
ALTER TABLE "Policy" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "Policy" ALTER COLUMN "policyType" TYPE TEXT;
-- Now we need to handle policyType conversion carefully - keep as TEXT for now since existing data may not match enum
-- We'll migrate the data and change the type in a separate step

-- Update Customer table
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "city"      TEXT;
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "state"     TEXT;
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "zipCode"   TEXT;
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

-- Add unique constraint on Customer.phone if not exists
DO $$ BEGIN
  ALTER TABLE "Customer" ADD CONSTRAINT "Customer_phone_key" UNIQUE ("phone");
EXCEPTION WHEN duplicate_table THEN null; END $$;

-- Update Claim table
ALTER TABLE "Claim" ADD COLUMN IF NOT EXISTS "claimNumber"  TEXT;
ALTER TABLE "Claim" ADD COLUMN IF NOT EXISTS "description"  TEXT;
ALTER TABLE "Claim" ADD COLUMN IF NOT EXISTS "resolvedDate" TIMESTAMP(3);
ALTER TABLE "Claim" ADD COLUMN IF NOT EXISTS "reviewerNote" TEXT;

-- Populate claimNumber for existing rows
UPDATE "Claim" SET "claimNumber" = gen_random_uuid()::TEXT WHERE "claimNumber" IS NULL;
ALTER TABLE "Claim" ALTER COLUMN "claimNumber" SET NOT NULL;

DO $$ BEGIN
  ALTER TABLE "Claim" ADD CONSTRAINT "Claim_claimNumber_key" UNIQUE ("claimNumber");
EXCEPTION WHEN duplicate_table THEN null; END $$;

-- Update PremiumPayment table
ALTER TABLE "PremiumPayment" ADD COLUMN IF NOT EXISTS "dueDate"       TIMESTAMP(3);
ALTER TABLE "PremiumPayment" ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT;
ALTER TABLE "PremiumPayment" ADD COLUMN IF NOT EXISTS "transactionId" TEXT;

DO $$ BEGIN
  ALTER TABLE "PremiumPayment" ADD CONSTRAINT "PremiumPayment_transactionId_key" UNIQUE ("transactionId");
EXCEPTION WHEN duplicate_table THEN null; END $$;

-- Update Document table
ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "originalName" TEXT;
ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "mimeType"     TEXT;
ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "fileSize"     INTEGER;
ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "policyId"     TEXT;
ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "claimId"      TEXT;

-- Populate required fields for existing document rows
UPDATE "Document" SET "originalName" = "fileName" WHERE "originalName" IS NULL;
UPDATE "Document" SET "mimeType"     = 'application/octet-stream' WHERE "mimeType" IS NULL;
UPDATE "Document" SET "fileSize"     = 0 WHERE "fileSize" IS NULL;

ALTER TABLE "Document" ALTER COLUMN "originalName" SET NOT NULL;
ALTER TABLE "Document" ALTER COLUMN "mimeType"     SET NOT NULL;
ALTER TABLE "Document" ALTER COLUMN "fileSize"     SET NOT NULL;
ALTER TABLE "Document" ALTER COLUMN "customerId"   DROP NOT NULL;

-- Add fileType column as TEXT (will cast to enum)
ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "fileType" TEXT NOT NULL DEFAULT 'OTHER';

-- Add foreign key constraints for new Document relations
ALTER TABLE "Document" ADD CONSTRAINT "Document_policyId_fkey"
  FOREIGN KEY ("policyId") REFERENCES "Policy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Document" ADD CONSTRAINT "Document_claimId_fkey"
  FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS "User_email_idx"               ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_role_idx"                ON "User"("role");
CREATE INDEX IF NOT EXISTS "Customer_fullName_idx"        ON "Customer"("fullName");
CREATE INDEX IF NOT EXISTS "Customer_phone_idx"           ON "Customer"("phone");
CREATE INDEX IF NOT EXISTS "Customer_userId_idx"          ON "Customer"("userId");
CREATE INDEX IF NOT EXISTS "Policy_customerId_idx"        ON "Policy"("customerId");
CREATE INDEX IF NOT EXISTS "Policy_status_idx"            ON "Policy"("status");
CREATE INDEX IF NOT EXISTS "Policy_policyType_idx"        ON "Policy"("policyType");
CREATE INDEX IF NOT EXISTS "Policy_policyNumber_idx"      ON "Policy"("policyNumber");
CREATE INDEX IF NOT EXISTS "Claim_policyId_idx"           ON "Claim"("policyId");
CREATE INDEX IF NOT EXISTS "Claim_status_idx"             ON "Claim"("status");
CREATE INDEX IF NOT EXISTS "Claim_submissionDate_idx"     ON "Claim"("submissionDate");
CREATE INDEX IF NOT EXISTS "PremiumPayment_policyId_idx"  ON "PremiumPayment"("policyId");
CREATE INDEX IF NOT EXISTS "PremiumPayment_status_idx"    ON "PremiumPayment"("paymentStatus");
CREATE INDEX IF NOT EXISTS "PremiumPayment_dueDate_idx"   ON "PremiumPayment"("dueDate");
CREATE INDEX IF NOT EXISTS "Document_customerId_idx"      ON "Document"("customerId");
CREATE INDEX IF NOT EXISTS "Document_policyId_idx"        ON "Document"("policyId");
CREATE INDEX IF NOT EXISTS "Document_claimId_idx"         ON "Document"("claimId");
