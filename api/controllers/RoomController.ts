import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class RoomController {
    /**
     * GET /api/rooms
     * Fetch all rooms with total current users (approved only)
     */
    static async fetchAll(req: Request, res: Response): Promise<any> {
        try {
            const rooms = await prisma.rooms.findMany({
                include: {
                    userRooms: true, // include all user-room relationships regardless of status
                    user_hostel_relation: true,
                },
            });

            const enriched = rooms.map((room) => ({
                id: room.id,
                name: room.name,
                maxSize: room.max_size,
                price: room.price,
                hostelId: room.hostel_id,
                currentUsers: room.user_hostel_relation.filter((ur) => ur.status === "approved")
                    .length,
                userIds: room.user_hostel_relation.map((ur) => ur.user_id),
                userStatuses: room.user_hostel_relation.map((ur) => ({
                    userId: ur.user_id,
                    status: ur.status,
                })),
            }));

            return res.status(200).json(enriched);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            return res.status(500).json({ message: "Failed to fetch rooms" });
        }
    }

    /**
     * POST /api/rooms
     * Create a new room with name and max_size
     */
    static async create(req: Request, res: Response): Promise<any> {
        const { name, maxSize, hostelId, price } = req.body;

        if (!name || !maxSize || !hostelId || price === undefined) {
            return res.status(400).json({ message: "Invalid room data" });
        }

        try {
            const room = await prisma.rooms.create({
                data: {
                    name,
                    max_size: Number(maxSize),
                    hostel_id: Number(hostelId),
                    price: Number(price)
                },
            });

            return res.status(201).json(room);
        } catch (error) {
            console.error("Error creating room:", error);
            return res.status(500).json({ message: "Failed to create room" });
        }
    }

    static async applyToRoom(req: Request, res: Response): Promise<any> {
        const { userId, roomId } = req.body;

        if (!userId || !roomId) {
            return res
                .status(400)
                .json({ message: "userId and roomId are required" });
        }

        const parsedUserId = Number(userId);
        const parsedRoomId = Number(roomId);

        try {
            // Check room exists
            const room = await prisma.rooms.findUnique({
                where: { id: parsedRoomId },
                include: {
                    userRooms: {
                        where: { status: "approved" },
                    },
                },
            });

            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }

            // Check if room is full
            const currentCount = room.userRooms.length;
            if (currentCount >= room.max_size) {
                return res.status(400).json({ message: "Room is already full" });
            }

            // Optional: prevent duplicate application
            const existing = await prisma.user_rooms.findFirst({
                where: {
                    userId: parsedUserId,
                    roomId: parsedRoomId,
                },
            });
            if (existing) {
                return res
                    .status(409)
                    .json({
                        message: "You have already applied or are assigned to this room",
                    });
            }

            // Create pending assignment
            const assignment = await prisma.user_rooms.create({
                data: {
                    userId: parsedUserId,
                    roomId: parsedRoomId,
                    status: "pending",
                },
            });

            return res
                .status(201)
                .json({ message: "Application submitted", assignment });
        } catch (error) {
            console.error("Error applying to room:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updateApplicationStatus(
        req: Request,
        res: Response
    ): Promise<any> {
        const { id } = req.params;
        const { action } = req.body; // 'approve' or 'reject'

        if (!["approve", "reject"].includes(action)) {
            return res.status(400).json({ message: "Invalid action" });
        }

        const actionResult = action == "approve" ? "approved" : "rejected";

        const application = await prisma.user_rooms.findUnique({
            where: { id: Number(id) },
            include: {
                room: {
                    include: {
                        userRooms: {
                            where: { status: "approved" },
                        },
                    },
                },
            },
        });

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (application.status !== "pending") {
            return res
                .status(400)
                .json({ message: "Only pending applications can be modified" });
        }

        if (action === "approve") {
            const approvedCount = application.room.userRooms.length;

            if (approvedCount >= application.room.max_size) {
                return res.status(400).json({ message: "Room is already full" });
            }
        }

        const updated = await prisma.user_rooms.update({
            where: { id: Number(id) },
            data: {
                status: actionResult,
            },
        });

        return res
            .status(200)
            .json({ message: `Application ${actionResult}`, application: updated });
    }

    static async getRoomApplications(req: Request, res: Response): Promise<any> {
        const applications = await prisma.user_rooms.findMany({
            where: {
                status: "pending",
            },
            include: {
                user: {
                    select: {
                        name: true,
                        student_id: true,
                    },
                },
                room: {
                    select: {
                        name: true,
                        max_size: true,
                        userRooms: {
                            select: {
                                status: true,
                            },
                        },
                    },
                },
            },
        });

        const result = applications.map((app) => ({
            id: app.id,
            user: {
                name: app.user.name,
                student_id: app.user.student_id,
            },
            room: {
                name: app.room.name,
                userRooms: app.room.userRooms,
                maxCount: app.room.max_size,
            },
        }));

        return res.status(200).json(result);
    }

    static async changeRoom(req: Request, res: Response): Promise<any> {
        const { applicationId, newRoomId } = req.body;

        try {
            const application = await prisma.user_hostel_relation.findFirst({
                where: {
                    id: Number(applicationId)
                }
            });

            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }

            const updated = await prisma.user_hostel_relation.update({
                where: {
                    id: Number(applicationId)
                },
                data: {
                    room_id: Number(newRoomId),
                    fee_paid: false,
                    fee_paid_at: null
                }
            });

            if (!updated) {
                return res.status(404).json({ message: "Changing room failed" });
            }

            return res.status(200).json(updated);
        } catch (error) {
            console.error("Error changing room:", error);
            return res.status(500).json({ message: "Failed to change room" });
        }
    }

    static async updateRoomPrice(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const { price } = req.body;

        if (price === undefined) {
            return res.status(400).json({ message: "price is required" });
        }

        try {
            const updated = await prisma.rooms.update({
                where: { id: Number(id) },
                data: { price: Number(price) }
            });

            return res.status(200).json(updated);
        } catch (error) {
            console.error("Error updating room price:", error);
            return res.status(500).json({ message: "Failed to update room price" });
        }
    }
}
