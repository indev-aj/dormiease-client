import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class MessagingController {
    // -------------------------------------------------------
    // Start or Get Existing Conversation (Admin ↔ User)
    // -------------------------------------------------------
    static async startConversation(req: Request, res: Response): Promise<any> {
        const { admin_id, user_id } = req.body;

        if (!admin_id || !user_id) {
            return res.status(400).json({ message: "admin_id and user_id are required" });
        }

        try {
            // Check if conversation already exists
            let conversation = await prisma.conversations.findFirst({
                where: { admin_id, user_id }
            });

            // If exists → return it
            if (conversation) return res.status(200).json(conversation);

            // Create new conversation
            conversation = await prisma.conversations.create({
                data: { admin_id, user_id }
            });

            return res.status(201).json(conversation);

        } catch (err) {
            console.error("startConversation error:", err);
            return res.status(500).json({ message: "Failed to start conversation" });
        }
    }

    // -------------------------------------------------------
    // Send Message (Either Admin or User)
    // -------------------------------------------------------
    static async sendMessage(req: Request, res: Response): Promise<any> {
        const {
            conversation_id,
            content,
            sender_admin_id,
            sender_user_id,
        } = req.body;

        if (!conversation_id) return res.status(400).send("conversation_id required");
        if (!content) return res.status(400).send("content required");

        if (!sender_admin_id && !sender_user_id) {
            return res.status(400).send("sender_admin_id or sender_user_id required");
        }

        try {
            const message = await prisma.messages.create({
                data: {
                    conversation_id,
                    content,
                    sender_admin_id: sender_admin_id || null,
                    sender_user_id: sender_user_id || null,
                }
            });

            return res.status(201).json(message);

        } catch (err) {
            console.error("sendMessage error:", err);
            return res.status(500).json({ message: "Failed to send message" });
        }
    }

    // -------------------------------------------------------
    // Get All Conversations for Admin
    // -------------------------------------------------------
    static async getAdminConversations(req: Request, res: Response): Promise<any> {
        const admin_id = Number(req.params.admin_id);
        if (!admin_id) return res.status(400).send("Invalid admin_id");

        try {
            const conversations = await prisma.conversations.findMany({
                where: { admin_id },
                include: {
                    user: true,
                    messages: {
                        orderBy: { created_at: "desc" },
                        take: 1, // latest message
                    }
                },
                orderBy: { created_at: "desc" }
            });

            return res.status(200).json(conversations);

        } catch (err) {
            console.error("getAdminConversations error:", err);
            return res.status(500).json({ message: "Failed to fetch conversations" });
        }
    }

    // -------------------------------------------------------
    // Get All Conversations for User
    // -------------------------------------------------------
    static async getUserConversations(req: Request, res: Response): Promise<any> {
        const user_id = Number(req.params.user_id);
        if (!user_id) return res.status(400).send("Invalid user_id");

        try {
            const conversations = await prisma.conversations.findMany({
                where: { user_id },
                include: {
                    admin: true,
                    messages: {
                        orderBy: { created_at: "desc" },
                        take: 1,
                    }
                },
                orderBy: { created_at: "desc" }
            });

            return res.status(200).json(conversations);

        } catch (err) {
            console.error("getUserConversations error:", err);
            return res.status(500).json({ message: "Failed to fetch conversations" });
        }
    }

    // -------------------------------------------------------
    // Get All Messages in a Conversation
    // -------------------------------------------------------
    static async getMessages(req: Request, res: Response): Promise<any> {
        const conversation_id = Number(req.params.conversation_id);
        if (!conversation_id) return res.status(400).send("Invalid conversation_id");

        try {
            const messages = await prisma.messages.findMany({
                where: { conversation_id },
                orderBy: { created_at: "asc" }
            });

            return res.status(200).json(messages);

        } catch (err) {
            console.error("getMessages error:", err);
            return res.status(500).json({ message: "Failed to fetch messages" });
        }
    }

    // -------------------------------------------------------
    // Mark Individual Message as Read
    // -------------------------------------------------------
    static async markAsRead(req: Request, res: Response): Promise<any> {
        const message_id = Number(req.params.message_id);
        if (!message_id) return res.status(400).send("Invalid message_id");

        try {
            const updated = await prisma.messages.update({
                where: { id: message_id },
                data: { is_read: true }
            });

            return res.status(200).json(updated);

        } catch (err) {
            console.error("markAsRead error:", err);
            return res.status(500).json({ message: "Failed to mark message as read" });
        }
    }
}

export default MessagingController;