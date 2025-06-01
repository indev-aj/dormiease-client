import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

type Application = {
    id: number
    user: {
        name: string
        student_id: string
    }
    room: {
        name: string
        userRooms: { status: string }[]
        maxCount: number
    }
}

export default function RoomApplicationPage() {
    const [applications, setApplications] = useState<Application[]>([])

    useEffect(() => {
        // Mocked applications data
        const mockData: Application[] = [
            {
                id: 1,
                user: { name: "Aisyah Zainal", student_id: "S001" },
                room: {
                    name: "Room Alpha",
                    userRooms: [
                        { status: "approved" },
                        { status: "approved" },
                        { status: "pending" },
                    ],
                    maxCount: 4,
                },
            },
            {
                id: 2,
                user: { name: "Daniel Tan", student_id: "S002" },
                room: {
                    name: "Room Beta",
                    userRooms: [{ status: "approved" }],
                    maxCount: 4,
                },
            },
            {
                id: 3,
                user: { name: "Nurul Hafiza", student_id: "S003" },
                room: {
                    name: "Room Gamma",
                    userRooms: [
                        { status: "approved" },
                        { status: "approved" },
                        { status: "approved" },
                    ],
                    maxCount: 4,
                },
            },
        ]

        setApplications(mockData)
    }, [])

    const handleAction = (id: number, action: "approve" | "reject") => {
        alert(`Application ${id} ${action}d.`)
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Room Applications</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Approved Count</TableHead>
                        <TableHead>Max Count</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.map((app) => (
                        <TableRow key={app.id}>
                            <TableCell>{app.user.name}</TableCell>
                            <TableCell>{app.user.student_id}</TableCell>
                            <TableCell>{app.room.name}</TableCell>
                            <TableCell>
                                {
                                    app.room.userRooms.filter((r) => r.status === "approved")
                                        .length
                                }
                            </TableCell>
                            <TableCell>{ app.room.maxCount }</TableCell>
                            <TableCell className="flex gap-2 justify-center">
                                <Button
                                    className="border-green-600 text-white bg-green-600 hover:bg-green-700 cursor-pointer"
                                    onClick={() => handleAction(app.id, "approve")}
                                >
                                    Approve
                                </Button>
                                <Button
                                    className="border-red-600 text-white bg-red-500 hover:bg-red-700 cursor-pointer"
                                    onClick={() => handleAction(app.id, "reject")}
                                >
                                    Reject
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}