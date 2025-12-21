import { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type FeeStatusRow = {
    applicationId: number;
    studentName: string;
    roomPrice: number;
    feePaid: boolean;
    status: string;
    roomId: number | null;
};

const FETCH_ALL_APPLICATIONS_API = `http://localhost:3000/api/hostels/all-applications`;

export default function HomePage() {
    const [rows, setRows] = useState<FeeStatusRow[]>([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(FETCH_ALL_APPLICATIONS_API);
                const approvedRows = response.data.filter((app: FeeStatusRow) => (
                    app.status === "approved" && app.roomId
                ));
                setRows(approvedRows);
            } catch (error) {
                console.error("Error fetching fee status rows:", error);
            }
        };

        fetchApplications();
    }, []);

    return (
        <div className="page-shell page-enter">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Fee Status Overview</h2>
                    <p className="page-subtitle">Approved students with assigned rooms and fee status.</p>
                </div>
            </div>
            <div className="panel">
                <div className="panel-header">
                    <span className="panel-title">Student Fee Ledger</span>
                </div>
                <div className="panel-body data-table">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Room Fee</TableHead>
                                <TableHead>Payment Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.applicationId}>
                                    <TableCell>{row.studentName}</TableCell>
                                    <TableCell>{row.roomPrice}</TableCell>
                                    <TableCell>
                                        <span className={`pill ${row.feePaid ? "pill--paid" : "pill--unpaid"}`}>
                                            {row.feePaid ? "Paid" : "Unpaid"}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {rows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3}>No approved students yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
