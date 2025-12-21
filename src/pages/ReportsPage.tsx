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
import { Button } from "@/components/ui/button";

type ReportRow = {
    applicationId: number;
    studentName: string;
    status: string;
    roomId: number | null;
};

const FETCH_ALL_APPLICATIONS_API = `http://localhost:3000/api/hostels/all-applications`;

export default function ReportsPage() {
    const [rows, setRows] = useState<ReportRow[]>([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(FETCH_ALL_APPLICATIONS_API);
                const approvedRows = response.data.filter((app: ReportRow) => (
                    app.status === "approved" && app.roomId
                ));
                setRows(approvedRows);
            } catch (error) {
                console.error("Error fetching report rows:", error);
            }
        };

        fetchApplications();
    }, []);

    const handleOpenReport = (applicationId: number) => {
        window.open(`/reports/${applicationId}`, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="page-shell page-enter">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Student Reports</h2>
                    <p className="page-subtitle">Generate official fee statements per student.</p>
                </div>
            </div>
            <div className="panel">
                <div className="panel-header">
                    <span className="panel-title">Approved Students</span>
                </div>
                <div className="panel-body data-table">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead className="text-center">Report</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.applicationId}>
                                    <TableCell>{row.studentName}</TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            className="border-transparent text-white bg-[var(--accent)] hover:bg-[var(--accent-strong)] cursor-pointer"
                                            onClick={() => handleOpenReport(row.applicationId)}
                                        >
                                            Show Report
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {rows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2}>No approved students yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
