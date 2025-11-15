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
import type { Hostel, NewRoomState, Room } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FETCH_ALL_HOSTELS_API = 'http://localhost:3000/api/hostels/all';
const FETCH_ALL_ROOMS_API = 'http://localhost:3000/api/room/all';
const CREATE_ROOM_API = 'http://localhost:3000/api/room/create';

export default function RoomManagementPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [newRoom, setNewRoom] = useState<NewRoomState>({ name: "", maxSize: "", hostelId: null });
    const [hostels, setHostels] = useState<Hostel[]>([]);

    const handleAddRoom = async () => {
        if (!newRoom.name || !newRoom.maxSize) return

        const createRoom = await axios.post(CREATE_ROOM_API, { name: newRoom.name, maxSize: newRoom.maxSize, hostelId: newRoom.hostelId });

        const room: Room = {
            id: createRoom.data['id'],
            name: newRoom.name,
            maxSize: parseInt(newRoom.maxSize),
            currentUsers: 0,
            hostelId: newRoom.hostelId
        }

        setRooms([...rooms, room])
        setNewRoom({ name: "", maxSize: "", hostelId: null })
    }

    useEffect(() => {
        const fetchAllRooms = async () => {
            const rooms = await axios.get(FETCH_ALL_ROOMS_API);
            console.log(rooms.data);

            setRooms(rooms.data);
        };

        const fetchAllHostels = async () => {
            const hostels = await axios.get(FETCH_ALL_HOSTELS_API);
            setHostels(hostels.data);
        };

        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchAllRooms(),
                    fetchAllHostels()
                ])
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
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
                                    <TableHead>Hostel Name</TableHead>
                                    <TableHead>Current Users</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rooms.map((room) => (
                                    <TableRow key={room.id} className="text-left">
                                        <TableCell>{room.name}</TableCell>
                                        <TableCell>{room.maxSize}</TableCell>
                                        <TableCell>{hostels.find(h => h.id == room.hostelId)?.name || ''}</TableCell>
                                        <TableCell>{room.currentUsers}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Form Section */}
                <Card className="shadow-lg bg-white border-gray-400 relative h-fit">
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

                        <div className="space-y-2">
                            <Label htmlFor="hostel">Hostel</Label>
                            <Select
                                value={newRoom.hostelId?.toString()}
                                onValueChange={(value) =>
                                    setNewRoom({ ...newRoom, hostelId: Number(value) })
                                }
                            >
                                <SelectTrigger id="hostel" className="w-full">
                                    <SelectValue placeholder="Select a hostel" />
                                </SelectTrigger>

                                <SelectContent position="popper" sideOffset={5} className="z-[100]">
                                    {hostels.map((h) => (
                                        <SelectItem key={h.id} value={String(h.id)}>
                                            {h.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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