/*
  Warnings:

  - You are about to drop the column `sender_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `conversation_participants` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `admin_id` to the `conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `conversations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "conversation_participants" DROP CONSTRAINT "conversation_participants_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "conversation_participants" DROP CONSTRAINT "conversation_participants_user_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_sender_id_fkey";

-- DropIndex
DROP INDEX "messages_conversation_id_idx";

-- DropIndex
DROP INDEX "messages_sender_id_idx";

-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "admin_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "sender_id",
ADD COLUMN     "sender_admin_id" INTEGER,
ADD COLUMN     "sender_user_id" INTEGER;

-- DropTable
DROP TABLE "conversation_participants";

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
