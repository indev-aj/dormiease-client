import { Request, Response } from "express"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MaintenanceController {
    static async submitMaintenance(req: Request, res: Response): Promise<any> {
        const { userId, title, details } = req.body

        if (!userId || !title || !details) {
            return res.status(400).json({ message: "User ID, title and details are required" })
        }

        try {
            let parsedUserId;
            if (isNaN(userId)) {
                parsedUserId = await prisma.users.findFirst({ where: { student_id: userId }});
            }

            const maintenance = await prisma.maintenances.create({
                data: {
                    userId: Number(userId) || Number(parsedUserId?.id),
                    adminId: 1, // TEMP: Placeholder, until assigned later
                    status: "open",
                    title,
                    details,
                    reply: "",
                },
            })

            return res.status(201).json({ message: "Maintenance submitted", maintenance })
        } catch (error) {
            console.error("Error submitting Maintenance:", error)
            return res.status(500).json({ message: "Failed to submit Maintenance" })
        }
    }

    static async updateMaintenance(req: Request, res: Response): Promise<any> {
        const { id } = req.params
        const { adminId, reply } = req.body

        if (!adminId || !reply) {
            return res.status(400).json({ message: "Admin ID and reply are required" })
        }

        try {
            const Maintenance = await prisma.maintenances.update({
                where: { id: Number(id) },
                data: {
                    reply,
                    adminId: Number(adminId),
                    status: "resolved",
                },
            })

            return res.status(200).json({ message: "Maintenance updated", Maintenance })
        } catch (error) {
            console.error("Error updating Maintenance:", error)
            return res.status(500).json({ message: "Failed to update Maintenance" })
        }
    }

    static async fetchAll(req: Request, res: Response): Promise<any> {
        try {
            const maintenances = await prisma.maintenances.findMany({
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

            const formatted = maintenances.map((c) => ({
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
            console.error("Error fetching Maintenances:", error)
            return res.status(500).json({ message: "Failed to fetch Maintenances" })
        }
    }

    static async fetchByStudent(req: Request, res: Response): Promise<any> {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({ message: "userId is required" });
            }

            const Maintenances = await prisma.maintenances.findMany({
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

            const formatted = Maintenances.map(c => ({
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
            console.error("Error fetching Maintenances by student:", error);
            return res.status(500).json({ message: "Failed to fetch Maintenances" });
        }
    }
}