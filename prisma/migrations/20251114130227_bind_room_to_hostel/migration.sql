/*
  Warnings:

  - Added the required column `hostelId` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_hostel_relation" DROP CONSTRAINT "user_hostel_relation_roomId_fkey";

-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "hostelId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user_hostel_relation" ALTER COLUMN "roomId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "hostels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hostel_relation" ADD CONSTRAINT "user_hostel_relation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
