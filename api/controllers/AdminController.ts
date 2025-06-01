import { Request, Response } from "express"
import { PrismaClient } from '@prisma/client';
import { compare, hash } from "bcrypt-ts";

const prisma = new PrismaClient();

export class AdminController {
    // Admin Signup
    static async signup(req: Request, res: Response): Promise<any> {        
        const { name, staff_id, password } = req.body

        if (!name || !staff_id || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingAdmin = await prisma.admins.findUnique({
            where: { staff_id },
        })

        if (existingAdmin) {
            return res.status(409).json({ message: "Staff ID already exists" })
        }

        const hashedPassword = await hash(password, 10)

        const admin = await prisma.admins.create({
            data: {
                name,
                staff_id,
                password: hashedPassword,
            },
        });

        return res.status(201).json({ message: "Admin created", admin: { id: admin.id, name: admin.name } })
    }

    // Admin Signin
    static async signin(req: Request, res: Response): Promise<any> {
        const { staff_id, password } = req.body

        if (!staff_id || !password) {
            return res.status(400).json({ message: "Staff ID and password are required" })
        }

        const admin = await prisma.admins.findUnique({
            where: { staff_id },
        })

        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const passwordMatch = await compare(password, admin.password)

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        // const token = jwt.sign(
        //     { id: admin.id, staff_id: admin.staff_id, role: "admin" },
        //     JWT_SECRET,
        //     { expiresIn: "7d" }
        // )

        return res.status(200).json({ admin: { id: admin.id, name: admin.name } })
    }
}