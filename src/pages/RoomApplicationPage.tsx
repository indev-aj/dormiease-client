import { useEffect, useState } from "react"
import axios from 'axios';
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

const FETCH_ALL_APPLICATIONS_API = 'http://localhost:3000/api/room/all-applications';
const UPDATE_APPLICATIONS_API = 'http://localhost:3000/api/admin/update-application/';

export default function RoomApplicationPage() {
    const [applications, setApplications] = useState<Application[]>([])
    const [count, setCount] = useState(0);

    const fetchAllApplications = async() => {
        const applications = await axios.get(FETCH_ALL_APPLICATIONS_API);
        console.log(applications.data);

        setApplications(applications.data);
    };
    
    useEffect(() => {
        fetchAllApplications();
    }, [count]);

    const handleAction = async (id: number, action: "approve" | "reject") => {
        const url = UPDATE_APPLICATIONS_API + id;
        const update = await axios.put(url, { action: action});

        setCount((prev) => prev + 1);
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