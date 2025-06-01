import { useState } from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table"

type Room = {
    id: number
    name: string
    maxSize: number
}

export default function ComplaintManagementPage() {
    const [rooms, _] = useState<Room[]>([
        { id: 1, name: "Room A", maxSize: 4},
        { id: 2, name: "Room B", maxSize: 3 },
    ])

    return (
        <div className="py-10 px-4">
            <div className="w-3xl mx-auto gap-6">
                {/* Table Section */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Complaint List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Title</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rooms.map((room) => (
                                    <TableRow key={room.id} className="text-left">
                                        <TableCell>{room.name}</TableCell>
                                        <TableCell>{room.maxSize}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}