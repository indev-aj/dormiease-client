import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class HostelController {
    /**
     * GET /api/hostels
     * Fetch all rooms with total current users (approved only)
     */
    static async fetchAll(req: Request, res: Response): Promise<any> {
        try {
            const hostels = await prisma.hostels.findMany({
                include: {
                    rooms: {
                        include: {
                            user_hostel_relation: true,
                        },
                    },
                    user_hostel_relation: true
                },
                orderBy: {
                    id: 'desc'
                }
            });

            const enriched = hostels.map((hostel) => {
                // Collect room-level details
                const rooms = hostel.rooms.map((room) => {
                    const approvedUsers = room.user_hostel_relation
                        .filter((ur) => ur.status === "approved")
                        .map((u) => u.user_id);

                    return {
                        id: room.id,
                        name: room.name,
                        maxSize: room.max_size,
                        currentUsers: approvedUsers.length,
                        userStatuses: room.user_hostel_relation.map((ur) => ({
                            userId: ur.user_id,
                            status: ur.status,
                        })),
                    };
                });

                // Aggregate hostel capacity
                const totalCapacity = hostel.rooms.reduce(
                    (sum, r) => sum + r.max_size,
                    0
                );

                const totalApprovedUsers = hostel.rooms.reduce(
                    (sum, r) =>
                        sum +
                        r.user_hostel_relation.filter(
                            (ur) => ur.status === "approved"
                        ).length,
                    0
                );

                // 🔥 Aggregate user statuses across ALL rooms inside this hostel
                const approvedUsers: number[] = [];
                const pendingUsers: number[] = [];
                const rejectedUsers: number[] = [];

                hostel.user_hostel_relation.forEach((ur) => {
                    if (ur.status === "approved") approvedUsers.push(ur.user_id);
                    if (ur.status === "pending") pendingUsers.push(ur.user_id);
                    if (ur.status === "rejected") rejectedUsers.push(ur.user_id);
                });

                return {
                    id: hostel.id,
                    name: hostel.name,
                    totalRooms: hostel.rooms.length,
                    totalCapacity,
                    totalApprovedUsers,
                    isFull: totalApprovedUsers >= totalCapacity,

                    // 🔥 NEW aggregated lists
                    approvedUsers,
                    pendingUsers,
                    rejectedUsers,

                    rooms,
                };
            });

            return res.status(200).json(enriched);
        } catch (error) {
            console.error("Error fetching hostels:", error);
            return res.status(500).json({ message: "Failed to fetch hostels" });
        }
    }

    /**
     * POST /api/hostels
     * Create a new room with name and max_size
     */
    static async create(req: Request, res: Response): Promise<any> {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "name is required" });
        }

        try {
            const hostel = await prisma.hostels.create({
                data: {
                    name
                },
            });

            return res.status(201).json(hostel);
        } catch (error) {
            console.error("Error creating hostel:", error);
            return res.status(500).json({ message: "Failed to create hostel" });
        }
    }

    static async applyHostel(req: Request, res: Response): Promise<any> {
        const { userId, hostelId } = req.body;

        if (!userId || !hostelId) {
            return res
                .status(400)
                .json({ message: "userId and hostelId are required" });
        }

        try {
            const result = await prisma.$transaction(async (tx) => {
                // 1️⃣ Create hostel application (pending)
                const application = await tx.user_hostel_relation.create({
                    data: {
                        user_id: Number(userId),
                        hostel_id: Number(hostelId),
                        status: "pending",
                        room_id: null
                    }
                });

                // 2️⃣ Fetch all rooms for that hostel
                // const rooms = await tx.rooms.findMany({
                //     where: { hostel_id: hostelId },
                //     include: {
                //         user_hostel_relation: true
                //     }
                // });

                // if (rooms.length === 0) {
                //     throw new Error("NO_ROOMS");
                // }

                // // 3️⃣ Filter rooms that are not full
                // const availableRooms = rooms.filter((room) => {
                //     const currentOccupancy = room.user_hostel_relation.length;
                //     return currentOccupancy < room.max_size;
                // });

                // if (availableRooms.length === 0) {
                //     throw new Error("HOSTEL_FULL");
                // }

                // // 4️⃣ Pick a random room
                // const randomRoom =
                //     availableRooms[Math.floor(Math.random() * availableRooms.length)];

                // // 5️⃣ Assign room to application (approve)
                // const updatedApplication = await tx.user_hostel_relation.update({
                //     where: { id: application.id },
                //     data: {
                //         room_id: randomRoom.id,
                //         status: "approved"
                //     },
                //     include: { room: true }
                // });

                return application;
            });

            // SUCCESS
            return res.status(200).json({
                message: "Hostel applied successfully",
                application: result,
            });
        } catch (error: any) {
            console.error("Error applying hostel:", error);

            // Handle specific transaction errors
            if (error.message === "NO_ROOMS") {
                return res.status(400).json({ message: "No rooms available in this hostel" });
            }

            if (error.message === "HOSTEL_FULL") {
                return res.status(400).json({ message: "Hostel is full — no available rooms" });
            }

            return res.status(500).json({ message: "Failed to apply hostel" });
        }
    }

    static async updateApplicationStatus(req: Request, res: Response): Promise<any> {
        const { applicationId, status } = req.body;

        if (!applicationId || !["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "applicationId and valid status ('approved' or 'rejected') are required",
            });
        }

        try {
            const result = await prisma.$transaction(async (tx) => {
                // 1️⃣ Get application with hostel info
                const application = await tx.user_hostel_relation.findUnique({
                    where: { id: Number(applicationId) },
                    include: { hostel: true, room: true }
                });

                if (!application) {
                    throw new Error("NOT_FOUND");
                }

                if (application.status !== "pending") {
                    throw new Error("ALREADY_DECIDED");
                }

                // 2️⃣ If admin rejects → simple update
                if (status === "rejected") {
                    return await tx.user_hostel_relation.update({
                        where: { id: Number(applicationId) },
                        data: { status: "rejected", room_id: null }
                    });
                }

                // 3️⃣ Admin approves → must assign room

                // Fetch rooms in this hostel
                const rooms = await tx.rooms.findMany({
                    where: { hostel_id: application.hostel_id },
                    include: {
                        user_hostel_relation: true
                    }
                });

                if (rooms.length === 0) {
                    throw new Error("NO_ROOMS");
                }

                // Find rooms with available slots
                const availableRooms = rooms.filter(room => {
                    const occupied = room.user_hostel_relation.length;
                    return occupied < room.max_size;
                });

                if (availableRooms.length === 0) {
                    throw new Error("HOSTEL_FULL");
                }

                // Pick random available room
                const randomRoom =
                    availableRooms[Math.floor(Math.random() * availableRooms.length)];

                // Update application
                return await tx.user_hostel_relation.update({
                    where: { id: Number(applicationId) },
                    data: {
                        status: "approved",
                        room_id: randomRoom.id
                    },
                    include: { room: true, hostel: true }
                });
            });

            return res.status(200).json({
                message: `Application ${result.status} successfully`,
                application: result
            });
        } catch (error: any) {
            console.error("Error updating application:", error);

            if (error.message === "NOT_FOUND") {
                return res.status(404).json({ message: "Application not found" });
            }

            if (error.message === "ALREADY_DECIDED") {
                return res.status(400).json({
                    message: "Application was already approved/rejected"
                });
            }

            if (error.message === "NO_ROOMS") {
                return res.status(400).json({ message: "No rooms available in this hostel" });
            }

            if (error.message === "HOSTEL_FULL") {
                return res.status(400).json({
                    message: "Hostel is full — cannot approve application"
                });
            }

            return res.status(500).json({ message: "Failed to update application" });
        }
    }

    static async fetchApplications(req: Request, res: Response): Promise<any> {
        try {
            const applications = await prisma.user_hostel_relation.findMany({
                include: {
                    user: true,
                    hostel: true,
                    room: {
                        include: {
                            user_hostel_relation: true
                        }
                    },
                },
                orderBy: {
                    id: 'desc'
                }
            });

            const formatted = applications.map(a => ({
                applicationId: a.id,
                userId: a.user_id,
                studentName: a.user.name,
                studentId: a.user.student_id,
                hostelId: a.hostel_id,
                hostelName: a.hostel.name,
                roomId: a.room_id,
                roomName: a.room?.name || null,
                status: a.status,
                approvedCount: a.room?.user_hostel_relation.filter(r => r.status === "approved").length || 0,
                maxCount: a.room?.max_size || 0
            }));

            return res.status(200).json(formatted);
        } catch (error) {
            console.error("Error fetching hostel applications:", error);
            return res.status(500).json({ message: "Failed to fetch hostel applications" });
        }
    }
}