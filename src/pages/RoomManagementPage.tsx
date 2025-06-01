import { useEffect, useState } from "react"
import axios from 'axios';
import Button from '@mui/material/Button';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
    currentUsers: number
}

const FETCH_ALL_ROOMS_API = 'http://localhost:3000/api/room/all';
const CREATE_ROOM_API = 'http://localhost:3000/api/room/create';

export default function RoomManagementPage() {
    const [rooms, setRooms] = useState<Room[]>([
        { id: 1, name: "Room A", maxSize: 4, currentUsers: 2 },
        { id: 2, name: "Room B", maxSize: 3, currentUsers: 1 },
    ])

    const [newRoom, setNewRoom] = useState({ name: "", maxSize: "" })

    const handleAddRoom = async () => {
        if (!newRoom.name || !newRoom.maxSize) return

        const createRoom = await axios.post(CREATE_ROOM_API, { name: newRoom.name, maxSize: newRoom.maxSize });

        const room: Room = {
            id: createRoom.data['id'],
            name: newRoom.name,
            maxSize: parseInt(newRoom.maxSize),
            currentUsers: 0,
        }

        setRooms([...rooms, room])
        setNewRoom({ name: "", maxSize: "" })
    }

    useEffect(() => {
        const fetchAllRooms = async() => {
            const rooms = await axios.get(FETCH_ALL_ROOMS_API);
            console.log(rooms.data);

            setRooms(rooms.data);
        };

        fetchAllRooms();
    }, []);

    return (
        <div className="py-10 px-4">
            <div className="w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Table Section */}
                <Card className="md:col-span-2 shadow-lg bg-white border-gray-400">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Room List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Max Size</TableHead>
                                    <TableHead>Current Users</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rooms.map((room) => (
                                    <TableRow key={room.id} className="text-left">
                                        <TableCell>{room.name}</TableCell>
                                        <TableCell>{room.maxSize}</TableCell>
                                        <TableCell>{room.currentUsers}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Form Section */}
                <Card className="shadow-lg h-fit bg-white border-gray-400">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Add New Room</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="roomName">Room Name</Label>
                            <Input
                                id="roomName"
                                placeholder="e.g. Room C"
                                value={newRoom.name}
                                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxSize">Max Size</Label>
                            <Input
                                id="maxSize"
                                type="number"
                                placeholder="e.g. 4"
                                value={newRoom.maxSize}
                                onChange={(e) => setNewRoom({ ...newRoom, maxSize: e.target.value })}
                            />
                        </div>

                        <Button variant="contained" onClick={handleAddRoom} className="w-full">
                            Add Room
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}