import { Request, Response } from "express"
import { PrismaClient } from '@prisma/client';
import { compare, hash } from "bcrypt-ts";

const prisma = new PrismaClient();

export class UserController {
    // User Signup
    static async signup(req: Request, res: Response): Promise<any> {
        const { name, studentId, email, password } = req.body

        if (!name || !studentId || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await prisma.users.findUnique({
            where: { email },
        })

        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" })
        }

        const hashedPassword = await hash(password, 10)

        const user = await prisma.users.create({
            data: {
                name,
                student_id: studentId,
                email,
                password: hashedPassword,
            },
        })

        return res
            .status(201)
            .json({ message: "User created", user: { id: user.id, name: user.name } })
    }

    // User Signin
    static async signin(req: Request, res: Response): Promise<any> {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await prisma.users.findUnique({
            where: { email },
        })

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        return res
            .status(200)
            .json({ user: { id: user.id, name: user.name, email: user.email, studentId: user.student_id } })
    }
}