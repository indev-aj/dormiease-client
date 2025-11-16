-- CreateTable
CREATE TABLE "maintenances" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "complaint_status" NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "reply" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "maintenances_adminId_idx" ON "maintenances"("adminId");

-- CreateIndex
CREATE INDEX "maintenances_userId_idx" ON "maintenances"("userId");

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
