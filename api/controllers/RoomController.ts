import { Request, Response } from "express"
import { PrismaClient } from '@prisma/client';

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
                    userRooms: {
                        where: { status: "approved" },
                    },
                },
            });

            const enriched = rooms.map(room => ({
                id: room.id,
                name: room.name,
                max_size: room.max_size,
                current_users: room.userRooms.length,
            }))

            return res.status(200).json(enriched)
        } catch (error) {
            console.error("Error fetching rooms:", error)
            return res.status(500).json({ message: "Failed to fetch rooms" })
        }
    }

    /**
     * POST /api/rooms
     * Create a new room with name and max_size
     */
    static async create(req: Request, res: Response): Promise<any> {
        const { name, maxSize } = req.body

        if (!name || !maxSize) {
            return res.status(400).json({ message: "Invalid room data" })
        }

        try {
            const room = await prisma.rooms.create({
                data: {
                    name,
                    max_size: Number(maxSize),
                },
            })

            return res.status(201).json(room)
        } catch (error) {
            console.error("Error creating room:", error)
            return res.status(500).json({ message: "Failed to create room" })
        }
    }

    static async applyToRoom(req: Request, res: Response): Promise<any> {
        const { userId, roomId } = req.body

        if (!userId || !roomId) {
            return res.status(400).json({ message: "userId and roomId are required" })
        }

        try {
            // Check room exists
            const room = await prisma.rooms.findUnique({
                where: { id: roomId },
                include: {
                    userRooms: {
                        where: { status: "approved" },
                    },
                },
            })

            if (!room) {
                return res.status(404).json({ message: "Room not found" })
            }

            // Check if room is full
            const currentCount = room.userRooms.length
            if (currentCount >= room.max_size) {
                return res.status(400).json({ message: "Room is already full" })
            }

            // Optional: prevent duplicate application
            const existing = await prisma.user_rooms.findFirst({
                where: {
                    userId,
                    roomId,
                },
            })
            if (existing) {
                return res.status(409).json({ message: "You have already applied or are assigned to this room" })
            }

            // Create pending assignment
            const assignment = await prisma.user_rooms.create({
                data: {
                    userId,
                    roomId,
                    status: "pending",
                },
            })

            return res.status(201).json({ message: "Application submitted", assignment })
        } catch (error) {
            console.error("Error applying to room:", error)
            return res.status(500).json({ message: "Internal server error" })
        }
    }
}