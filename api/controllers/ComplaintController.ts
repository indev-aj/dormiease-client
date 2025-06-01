import { Request, Response } from "express"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ComplaintController {
    static async submitComplaint(req: Request, res: Response): Promise<any> {
        const { userId, title, details } = req.body

        if (!userId || !title || !details) {
            return res.status(400).json({ message: "User ID, title and details are required" })
        }

        try {
            const complaint = await prisma.complaints.create({
                data: {
                    userId: Number(userId),
                    adminId: 1, // TEMP: Placeholder, until assigned later
                    status: "open",
                    title,
                    details,
                    reply: "",
                },
            })

            return res.status(201).json({ message: "Complaint submitted", complaint })
        } catch (error) {
            console.error("Error submitting complaint:", error)
            return res.status(500).json({ message: "Failed to submit complaint" })
        }
    }

    static async updateComplaint(req: Request, res: Response): Promise<any> {
        const { id } = req.params
        const { adminId, reply } = req.body

        if (!adminId || !reply) {
            return res.status(400).json({ message: "Admin ID and reply are required" })
        }

        try {
            const complaint = await prisma.complaints.update({
                where: { id: Number(id) },
                data: {
                    reply,
                    adminId: Number(adminId),
                    status: "resolved",
                },
            })

            return res.status(200).json({ message: "Complaint updated", complaint })
        } catch (error) {
            console.error("Error updating complaint:", error)
            return res.status(500).json({ message: "Failed to update complaint" })
        }
    }

    static async fetchAll(req: Request, res: Response): Promise<any> {
        try {
            const complaints = await prisma.complaints.findMany();

            // const enriched = rooms.map(room => ({
            //     id: room.id,
            //     name: room.name,
            //     max_size: room.max_size,
            //     current_users: room.userRooms.length,
            // }))

            return res.status(200).json(complaints)
        } catch (error) {
            console.error("Error fetching complaints:", error)
            return res.status(500).json({ message: "Failed to fetch rooms" })
        }
    }
}