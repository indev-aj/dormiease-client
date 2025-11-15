/*
  Warnings:

  - You are about to drop the column `hostelId` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `hostelId` on the `user_hostel_relation` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `user_hostel_relation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_hostel_relation` table. All the data in the column will be lost.
  - Added the required column `hostel_id` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostel_id` to the `user_hostel_relation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_hostel_relation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_hostelId_fkey";

-- DropForeignKey
ALTER TABLE "user_hostel_relation" DROP CONSTRAINT "user_hostel_relation_hostelId_fkey";

-- DropForeignKey
ALTER TABLE "user_hostel_relation" DROP CONSTRAINT "user_hostel_relation_roomId_fkey";

-- DropForeignKey
ALTER TABLE "user_hostel_relation" DROP CONSTRAINT "user_hostel_relation_userId_fkey";

-- DropIndex
DROP INDEX "user_hostel_relation_hostelId_idx";

-- DropIndex
DROP INDEX "user_hostel_relation_roomId_idx";

-- DropIndex
DROP INDEX "user_hostel_relation_userId_idx";

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "hostelId",
ADD COLUMN     "hostel_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user_hostel_relation" DROP COLUMN "hostelId",
DROP COLUMN "roomId",
DROP COLUMN "userId",
ADD COLUMN     "hostel_id" INTEGER NOT NULL,
ADD COLUMN     "room_id" INTEGER,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "user_hostel_relation_user_id_idx" ON "user_hostel_relation"("user_id");

-- CreateIndex
CREATE INDEX "user_hostel_relation_hostel_id_idx" ON "user_hostel_relation"("hostel_id");

-- CreateIndex
CREATE INDEX "user_hostel_relation_room_id_idx" ON "user_hostel_relation"("room_id");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hostel_id_fkey" FOREIGN KEY ("hostel_id") REFERENCES "hostels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hostel_relation" ADD CONSTRAINT "user_hostel_relation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hostel_relation" ADD CONSTRAINT "user_hostel_relation_hostel_id_fkey" FOREIGN KEY ("hostel_id") REFERENCES "hostels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hostel_relation" ADD CONSTRAINT "user_hostel_relation_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
