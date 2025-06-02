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
            const complaints = await prisma.complaints.findMany({
                include: {
                    user: {
                        select: {
                            name: true,
                            student_id: true,
                        },
                    },
                },
                orderBy: {
                    created_at: "desc",
                },
            })

            const formatted = complaints.map((c) => ({
                id: c.id,
                studentName: c.user.name,
                studentId: c.user.student_id,
                title: c.title ?? "", // use `c.title` if available in your schema
                details: c.details,
                reply: c.reply,
                status: c.status,
            }))

            return res.status(200).json(formatted)
        } catch (error) {
            console.error("Error fetching complaints:", error)
            return res.status(500).json({ message: "Failed to fetch complaints" })
        }
    }

    static async fetchByStudent(req: Request, res: Response): Promise<any> {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ message: "userId is required" });
            }

            const complaints = await prisma.complaints.findMany({
                where: {
                    userId: parseInt(userId),
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            student_id: true,
                        },
                    },
                },
                orderBy: {
                    created_at: 'desc',
                },
            });

            const formatted = complaints.map(c => ({
                id: c.id,
                studentName: c.user.name,
                studentId: c.user.student_id,
                title: c.title,
                details: c.details,
                reply: c.reply,
                status: c.status,
                createdAt: c.created_at,
            }));

            return res.status(200).json(formatted);
        } catch (error) {
            console.error("Error fetching complaints by student:", error);
            return res.status(500).json({ message: "Failed to fetch complaints" });
        }
    }
}