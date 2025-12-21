-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "user_hostel_relation" ADD COLUMN     "fee_paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fee_paid_at" TIMESTAMP(3);
