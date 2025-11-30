-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "admin_id" INTEGER,
    "notification_id" INTEGER NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_notifications_user_id_idx" ON "user_notifications"("user_id");

-- CreateIndex
CREATE INDEX "user_notifications_admin_id_idx" ON "user_notifications"("admin_id");

-- CreateIndex
CREATE INDEX "user_notifications_notification_id_idx" ON "user_notifications"("notification_id");

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
