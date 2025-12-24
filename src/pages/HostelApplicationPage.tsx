import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, MenuItem, FormControl } from '@mui/material';
import axios from "axios";
import { useEffect, useState } from "react";
import type { Hostel } from "@/lib/types";
import { QRCodeCanvas } from "qrcode.react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type Application = {
    applicationId: number;
    userId: number;
    studentName: string;
    studentId: number;
    hostelId: number;
    hostelName: string;
    roomId: number | null;
    roomName: string | null;
    roomPrice: number;
    status: string;
    feePaid: boolean;
    feePaidAt: string | null;
    approvedCount: number;
    maxCount: number;
}

const FETCH_ALL_APPLICATIONS_API = `http://localhost:3000/api/hostels/all-applications`;
const FETCH_ALL_HOSTELS_API = `http://localhost:3000/api/hostels/all`;
const UPDATE_APPLICATION_API = `http://localhost:3000/api/admin/update-hostel-application`;
const CHANGE_ROOM_API = `http://localhost:3000/api/admin/change-room`;
const UPDATE_FEE_STATUS_API = `http://localhost:3000/api/admin/update-fee-status`;

export default function HostelApplicationPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [qrOpen, setQrOpen] = useState(false);
    const [qrValue, setQrValue] = useState("");
    const [qrLabel, setQrLabel] = useState("");

    const fetchApplications = async () => {
        const applications = await axios.get(FETCH_ALL_APPLICATIONS_API);
        setApplications(applications.data);
    }

    const fetchHostels = async () => {
        const hostels = await axios.get(FETCH_ALL_HOSTELS_API);
        setHostels(hostels.data);
    }

    const getAvailableRooms = (hostelId: number) => {
        const hostel = hostels.find(h => h.id === hostelId);
        return hostel?.rooms.filter(room => room.currentUsers <= room.maxSize) || [];
    }

    const handleRoomChange = async (applicationId: number, newRoomId: number) => {
        try {
            const payload = {
                applicationId,
                newRoomId
            };

            await axios.put(CHANGE_ROOM_API, payload);
            await fetchApplications();
            await fetchHostels();
        } catch (error) {
            console.error("Error changing room:", error);
        }
    }

    const handleUpdateApplication = async (applicationId: number, status: string) => {
        try {
            const payload = {
                applicationId,
                status
            };

            await axios.put(UPDATE_APPLICATION_API, payload);
            await fetchApplications();
            await fetchHostels();
        } catch (error) {
            console.error(error);
        }
    }

    const handleUpdateFeeStatus = async (applicationId: number, feePaid: boolean) => {
        try {
            const payload = {
                applicationId,
                feePaid
            };

            await axios.put(UPDATE_FEE_STATUS_API, payload);
            await fetchApplications();
        } catch (error) {
            console.error("Error updating fee status:", error);
        }
    }

    const openPaymentQr = (applicationId: number, studentName: string) => {
        const value = `http://localhost:3000/api/admin/update-fee-status?applicationId=${applicationId}&feePaid=true`;
        setQrValue(value);
        setQrLabel(studentName);
        setQrOpen(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchApplications(),
                    fetchHostels()
                ]);
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
                    <h2 className="page-title">Hostel Applications</h2>
                    <p className="page-subtitle">Approve assignments, manage rooms, and track fees.</p>
                </div>
            </div>
            <div className="panel">
                <div className="panel-header">
                    <span className="panel-title">Applications</span>
                </div>
                <div className="panel-body data-table">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Hostel</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Room Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Fee Status</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                                <TableHead className="text-center">Change Room</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.map((app) => (
                                <TableRow key={app.applicationId}>
                                    <TableCell>{app.studentName}</TableCell>
                                    <TableCell>{app.studentId}</TableCell>
                                    <TableCell>{app.hostelName}</TableCell>
                                    <TableCell>{app.roomName}</TableCell>
                                    <TableCell>{app.roomPrice}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`pill ${app.status === "approved"
                                                ? "pill--approved"
                                                : app.status === "rejected"
                                                    ? "pill--rejected"
                                                    : "pill--pending"
                                                }`}
                                        >
                                            {app.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={`pill ${app.feePaid ? "pill--paid" : "pill--unpaid"}`}>
                                                {app.feePaid ? "Paid" : "Unpaid"}
                                            </span>
                                            {app.status === "approved" && app.roomId && (
                                                <>
                                                    <Button
                                                        className="border-transparent text-white bg-[var(--accent)] hover:bg-[var(--accent-strong)] cursor-pointer"
                                                        onClick={() => handleUpdateFeeStatus(app.applicationId, !app.feePaid)}
                                                    >
                                                        {app.feePaid ? "Mark Unpaid" : "Mark Paid"}
                                                    </Button>
                                                    {!app.feePaid && (
                                                        <Button
                                                            className="border-transparent text-white bg-slate-900 hover:bg-slate-800 cursor-pointer"
                                                            onClick={() => openPaymentQr(app.applicationId, app.studentName)}
                                                        >
                                                            Show QR
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="flex gap-2 justify-center">
                                        <Button
                                            className="border-transparent text-white bg-[var(--accent)] hover:bg-[var(--accent-strong)] cursor-pointer"
                                            disabled={app.status == "approved" || app.status == "rejected"}
                                            onClick={() => handleUpdateApplication(app.applicationId, "approved")}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            className="border-transparent text-white bg-slate-900 hover:bg-slate-800 cursor-pointer"
                                            disabled={app.status == "approved" || app.status == "rejected"}
                                            onClick={() => handleUpdateApplication(app.applicationId, "rejected")}
                                        >
                                            Reject
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        {app.status === "approved" && (
                                            <FormControl size="small" fullWidth>
                                                <Select
                                                    value={app.roomId || ""}
                                                    onChange={(e) => handleRoomChange(app.applicationId, e.target.value as number)}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="" disabled>
                                                        Select Room
                                                    </MenuItem>
                                                    {getAvailableRooms(app.hostelId).map((room) => (
                                                        <MenuItem key={room.id} value={room.id}>
                                                            {room.name} ({room.currentUsers}/{room.maxSize})
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Payment QR</DialogTitle>
                        <DialogDescription>
                            Scan to mark fee as paid{qrLabel ? ` for ${qrLabel}` : ""}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-4">
                        <QRCodeCanvas value={qrValue} size={220} />
                        <div className="text-xs text-muted-foreground break-all text-center">
                            {qrValue}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
