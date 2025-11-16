-- DropForeignKey
ALTER TABLE "complaints" DROP CONSTRAINT "complaints_userId_fkey";

-- AlterTable
ALTER TABLE "complaints" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
