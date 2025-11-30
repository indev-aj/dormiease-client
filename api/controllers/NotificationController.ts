import { Request, Response } from "express"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class NotificationController {
    static async create(req: Request, res: Response): Promise<any> {
        const { title, message } = req.body;

        if (!title) return res.status(400).send('title is required');
        if (!message) return res.status(400).send('message is required');

        try {
            const notification = await prisma.notifications.create({
                data: {
                    title: title,
                    message: message
                }
            });

            if (!notification) return res.status(500).send('notification not created');

            const users = await prisma.users.findMany({
                select: { id: true }
            });

            // Create a notification entry for each user
            const data = users.map(user => ({
                user_id: user.id,
                notification_id: notification.id
            }));

            await prisma.user_notifications.createMany({
                data,
            });

            return res.status(200).send(notification);
        } catch (error: any) {
            console.error("Error creating notification:", error);
            return res.status(500).json({ message: "Failed to create notification" });
        }
    }

    static async delete(req: Request, res: Response): Promise<any> {
        const { id } = req.params;

        try {
            const notifId = Number(id);
            if (isNaN(notifId)) return res.status(400).send("Invalid notification id");

            // Delete assigned user notifications first
            await prisma.user_notifications.deleteMany({
                where: { notification_id: notifId }
            });

            // Then delete the notification
            const deleted = await prisma.notifications.delete({
                where: { id: notifId }
            });

            return res.status(200).send(deleted);
        } catch (error) {
            console.error("Error deleting notification:", error);
            return res.status(500).json({ message: "Failed to delete notification" });
        }
    }

    // -------------------------------------------------------
    // FETCH ALL NOTIFICATIONS (Admin)
    // Returns all notifications + count of assigned users
    // -------------------------------------------------------
    static async adminGetAll(req: Request, res: Response): Promise<any> {
        try {
            const notifications = await prisma.notifications.findMany({
                orderBy: { created_at: "desc" },
                include: {
                    userNotifications: true
                }
            });

            return res.status(200).json(notifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return res.status(500).json({ message: "Failed to fetch notifications" });
        }
    }

    // -------------------------------------------------------
    // FETCH NOTIFICATIONS FOR USER
    // -------------------------------------------------------
    static async getForUser(req: Request, res: Response): Promise<any> {
        const { userId } = req.params;
        const parsedUserId = Number(userId);
        if (isNaN(parsedUserId)) return res.status(400).send("Invalid user id");

        try {
            const notifications = await prisma.user_notifications.findMany({
                where: { user_id: parsedUserId },
                orderBy: { id: "desc" },
                include: {
                    notification: true
                }
            });

            return res.status(200).json(notifications);
        } catch (error) {
            console.error("Error fetching user notifications:", error);
            return res.status(500).json({ message: "Failed to fetch user notifications" });
        }
    }

    // -------------------------------------------------------
    // MARK NOTIFICATION AS READ (User)
    // -------------------------------------------------------
    static async markAsRead(req: Request, res: Response): Promise<any> {
        const { userNotificationId } = req.params;

        try {
            const id = Number(userNotificationId);
            if (isNaN(id)) return res.status(400).send("Invalid notification id");

            const notification = await prisma.user_notifications.update({
                where: { id },
                data: {
                    is_read: true,
                    read_at: new Date()
                }
            });

            return res.status(200).send(notification);
        } catch (error) {
            console.error("Error updating read status:", error);
            return res.status(500).json({ message: "Failed to update read status" });
        }
    }
}

export default NotificationController;