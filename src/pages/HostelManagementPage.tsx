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

export default function HostelManagementPage() {
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [newHostel, setNewHostel] = useState({ name: "", maxSize: "" });

    const handleAddHostel = async () => {
        if (!newHostel.name) return

        const createHostel = await axios.post(CREATE_HOSTEL_API, { name: newHostel.name, maxSize: newHostel.maxSize });

        const hostel: Hostel = {
            id: createHostel.data['id'],
            name: newHostel.name
        }

        setHostels([...hostels, hostel])
        setNewHostel({ name: "", maxSize: "" })
    }

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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hostels.map((hostel) => (
                                    <TableRow key={hostel.id} className="text-left">
                                        <TableCell>{hostel.name}</TableCell>
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

                        <Button className="w-full bg-slate-900 text-white hover:bg-slate-800" onClick={handleAddHostel}>
                            Add Hostel
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
