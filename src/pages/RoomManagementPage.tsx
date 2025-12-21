import { useEffect, useState } from "react"
import axios from 'axios';
import { Button } from "@/components/ui/button";
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
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const FETCH_ALL_HOSTELS_API = 'http://localhost:3000/api/hostels/all';
const FETCH_ALL_ROOMS_API = 'http://localhost:3000/api/room/all';
const CREATE_ROOM_API = 'http://localhost:3000/api/room/create';
const UPDATE_ROOM_PRICE_API = 'http://localhost:3000/api/admin/update-room-price';

export default function RoomManagementPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [newRoom, setNewRoom] = useState<NewRoomState>({ name: "", maxSize: "", price: "", hostelId: null });
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [priceEdits, setPriceEdits] = useState<Record<number, string>>({});

    const handleAddRoom = async () => {
        if (!newRoom.name || !newRoom.maxSize || !newRoom.price) return

        const createRoom = await axios.post(CREATE_ROOM_API, {
            name: newRoom.name,
            maxSize: newRoom.maxSize,
            price: newRoom.price,
            hostelId: newRoom.hostelId
        });

        const room: Room = {
            id: createRoom.data['id'],
            name: newRoom.name,
            maxSize: parseInt(newRoom.maxSize),
            price: parseInt(newRoom.price),
            currentUsers: 0,
            hostelId: newRoom.hostelId
        }

        setRooms([...rooms, room])
        setNewRoom({ name: "", maxSize: "", price: "", hostelId: null })
    }

    const handlePriceEdit = (roomId: number, value: string) => {
        setPriceEdits((prev) => ({ ...prev, [roomId]: value }));
    };

    const handleUpdateRoomPrice = async (roomId: number) => {
        const value = priceEdits[roomId];
        if (!value) return;

        await axios.put(`${UPDATE_ROOM_PRICE_API}/${roomId}`, { price: value });
        setRooms((prev) =>
            prev.map((room) =>
                room.id === roomId ? { ...room, price: parseInt(value) } : room
            )
        );
        setPriceEdits((prev) => {
            const next = { ...prev };
            delete next[roomId];
            return next;
        });
    };

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
        <div className="page-shell page-enter">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Room Management</h2>
                    <p className="page-subtitle">Set pricing, capacity, and availability per room.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="panel lg:col-span-2">
                    <CardHeader className="panel-header">
                        <CardTitle className="panel-title">Room List</CardTitle>
                    </CardHeader>
                    <CardContent className="panel-body data-table">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Max Size</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-center">Update Price</TableHead>
                                    <TableHead>Hostel Name</TableHead>
                                    <TableHead>Current Users</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rooms.map((room) => (
                                    <TableRow key={room.id} className="text-left">
                                        <TableCell>{room.name}</TableCell>
                                        <TableCell>{room.maxSize}</TableCell>
                                        <TableCell>{room.price}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    value={priceEdits[room.id] ?? room.price.toString()}
                                                    onChange={(e) => handlePriceEdit(room.id, e.target.value)}
                                                />
                                                <Button
                                                    className="bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]"
                                                    onClick={() => handleUpdateRoomPrice(room.id)}
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>{hostels.find(h => h.id == room.hostelId)?.name || ''}</TableCell>
                                        <TableCell>{room.currentUsers}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="panel h-fit">
                    <CardHeader className="panel-header">
                        <CardTitle className="panel-title">Add New Room</CardTitle>
                    </CardHeader>
                    <CardContent className="panel-body space-y-4">
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
                            <Label htmlFor="roomPrice">Room Price</Label>
                            <Input
                                id="roomPrice"
                                type="number"
                                placeholder="e.g. 500"
                                value={newRoom.price}
                                onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Select Hostel</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={newRoom.hostelId?.toString()}
                                    label="Select Hostel"
                                    onChange={(value) =>
                                        setNewRoom({ ...newRoom, hostelId: Number(value) })
                                    }
                                >
                                    {hostels.map((h) => (
                                        <MenuItem key={h.id} value={String(h.id)}>
                                            {h.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <Button className="w-full bg-slate-900 text-white hover:bg-slate-800" onClick={handleAddRoom}>
                            Add Room
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
