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
import type { Hostel } from "@/lib/types";

const FETCH_ALL_HOSTELS_API = 'http://localhost:3000/api/hostels/all';
const CREATE_HOSTEL_API = 'http://localhost:3000/api/hostels/create';
const UPDATE_HOSTEL_DATES_API = 'http://localhost:3000/api/admin/update-hostel-dates';

export default function HostelManagementPage() {
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [newHostel, setNewHostel] = useState({ name: "", maxSize: "", moveInDate: "", moveOutDate: "" });
    const [dateEdits, setDateEdits] = useState<Record<number, { moveInDate: string; moveOutDate: string }>>({});

    const getDefaultMoveDates = () => {
        const year = new Date().getFullYear();
        const moveIn = `${year}-01-01`;
        const moveOut = `${year}-12-31`;
        return { moveIn, moveOut };
    };

    const handleAddHostel = async () => {
        if (!newHostel.name) return

        const defaults = getDefaultMoveDates();
        const createHostel = await axios.post(CREATE_HOSTEL_API, {
            name: newHostel.name,
            maxSize: newHostel.maxSize,
            moveInDate: newHostel.moveInDate || defaults.moveIn,
            moveOutDate: newHostel.moveOutDate || defaults.moveOut
        });

        const hostel: Hostel = {
            id: createHostel.data['id'],
            name: newHostel.name,
            moveInDate: createHostel.data['move_in_date'] || createHostel.data['moveInDate'] || defaults.moveIn,
            moveOutDate: createHostel.data['move_out_date'] || createHostel.data['moveOutDate'] || defaults.moveOut
        }

        setHostels([...hostels, hostel])
        setNewHostel({ name: "", maxSize: "", moveInDate: "", moveOutDate: "" })
    }

    const handleDateEdit = (hostelId: number, field: "moveInDate" | "moveOutDate", value: string) => {
        setDateEdits((prev) => ({
            ...prev,
            [hostelId]: {
                moveInDate: prev[hostelId]?.moveInDate || "",
                moveOutDate: prev[hostelId]?.moveOutDate || "",
                [field]: value
            }
        }));
    };

    const handleUpdateDates = async (hostelId: number) => {
        const defaults = getDefaultMoveDates();
        const edits = dateEdits[hostelId];
        const moveInDate = edits?.moveInDate || hostels.find(h => h.id === hostelId)?.moveInDate || defaults.moveIn;
        const moveOutDate = edits?.moveOutDate || hostels.find(h => h.id === hostelId)?.moveOutDate || defaults.moveOut;

        await axios.put(`${UPDATE_HOSTEL_DATES_API}/${hostelId}`, { moveInDate, moveOutDate });
        setHostels((prev) =>
            prev.map((h) =>
                h.id === hostelId ? { ...h, moveInDate, moveOutDate } : h
            )
        );
        setDateEdits((prev) => {
            const next = { ...prev };
            delete next[hostelId];
            return next;
        });
    };

    useEffect(() => {
        const fetchAllHostels = async() => {
            const hostels = await axios.get(FETCH_ALL_HOSTELS_API);
            setHostels(hostels.data);
        };

        fetchAllHostels();
    }, []);

    return (
        <div className="page-shell page-enter">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Hostel Management</h2>
                    <p className="page-subtitle">Create and manage hostel entries.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="panel lg:col-span-2">
                    <CardHeader className="panel-header">
                        <CardTitle className="panel-title">Hostel List</CardTitle>
                    </CardHeader>
                    <CardContent className="panel-body data-table">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Move In</TableHead>
                                    <TableHead>Move Out</TableHead>
                                    <TableHead className="text-center">Update Dates</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hostels.map((hostel) => (
                                    <TableRow key={hostel.id} className="text-left">
                                        <TableCell>{hostel.name}</TableCell>
                                        <TableCell>{hostel.moveInDate ? hostel.moveInDate.toString().slice(0, 10) : "-"}</TableCell>
                                        <TableCell>{hostel.moveOutDate ? hostel.moveOutDate.toString().slice(0, 10) : "-"}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-2">
                                                <Input
                                                    type="date"
                                                    value={dateEdits[hostel.id]?.moveInDate || (hostel.moveInDate ? hostel.moveInDate.toString().slice(0, 10) : "")}
                                                    onChange={(e) => handleDateEdit(hostel.id, "moveInDate", e.target.value)}
                                                />
                                                <Input
                                                    type="date"
                                                    value={dateEdits[hostel.id]?.moveOutDate || (hostel.moveOutDate ? hostel.moveOutDate.toString().slice(0, 10) : "")}
                                                    onChange={(e) => handleDateEdit(hostel.id, "moveOutDate", e.target.value)}
                                                />
                                                <Button className="bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]" onClick={() => handleUpdateDates(hostel.id)}>
                                                    Save
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="panel h-fit">
                    <CardHeader className="panel-header">
                        <CardTitle className="panel-title">Add New Hostel</CardTitle>
                    </CardHeader>
                    <CardContent className="panel-body space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="hostelName">Hostel Name</Label>
                            <Input
                                id="hostelName"
                                placeholder="e.g. Hostel C"
                                value={newHostel.name}
                                onChange={(e) => setNewHostel({ ...newHostel, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="moveInDate">Move In Date</Label>
                            <Input
                                id="moveInDate"
                                type="date"
                                value={newHostel.moveInDate}
                                onChange={(e) => setNewHostel({ ...newHostel, moveInDate: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="moveOutDate">Move Out Date</Label>
                            <Input
                                id="moveOutDate"
                                type="date"
                                value={newHostel.moveOutDate}
                                onChange={(e) => setNewHostel({ ...newHostel, moveOutDate: e.target.value })}
                            />
                        </div>

                        <Button className="w-full bg-slate-900 text-white hover:bg-slate-800" onClick={handleAddHostel}>
                            Add Hostel
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
