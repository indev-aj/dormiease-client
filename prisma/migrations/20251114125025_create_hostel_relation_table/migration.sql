-- CreateTable
CREATE TABLE "hostels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "hostels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_hostel_relation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "hostelId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "status" "room_status" NOT NULL DEFAULT 'pending',

    CONSTRAINT "user_hostel_relation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_hostel_relation_userId_idx" ON "user_hostel_relation"("userId");

-- CreateIndex
CREATE INDEX "user_hostel_relation_hostelId_idx" ON "user_hostel_relation"("hostelId");

-- CreateIndex
CREATE INDEX "user_hostel_relation_roomId_idx" ON "user_hostel_relation"("roomId");

-- AddForeignKey
ALTER TABLE "user_hostel_relation" ADD CONSTRAINT "user_hostel_relation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hostel_relation" ADD CONSTRAINT "user_hostel_relation_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "hostels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hostel_relation" ADD CONSTRAINT "user_hostel_relation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
