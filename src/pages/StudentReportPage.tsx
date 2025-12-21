import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type ReportDetails = {
    applicationId: number;
    studentName: string;
    studentId: number;
    userId: number;
    roomName: string | null;
    roomPrice: number;
    feePaid: boolean;
    moveInDate?: string;
    moveOutDate?: string;
    status: string;
    roomId: number | null;
};

const FETCH_ALL_APPLICATIONS_API = `http://localhost:3000/api/hostels/all-applications`;
const FETCH_STUDENT_COMPLAINTS_API = `http://localhost:3000/api/complaint`;
const FETCH_STUDENT_MAINTENANCES_API = `http://localhost:3000/api/maintenance`;

type Ticket = {
    id: number;
    title: string;
    details: string;
    status: "open" | "resolved";
    createdAt?: string;
};

export default function StudentReportPage() {
    const { applicationId } = useParams();
    const [report, setReport] = useState<ReportDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [complaints, setComplaints] = useState<Ticket[]>([]);
    const [maintenances, setMaintenances] = useState<Ticket[]>([]);

    const parsedId = useMemo(() => Number(applicationId), [applicationId]);

    useEffect(() => {
        const fetchReport = async () => {
            if (!parsedId) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(FETCH_ALL_APPLICATIONS_API);
                const match = response.data.find(
                    (app: ReportDetails) => app.applicationId === parsedId
                );
                setReport(match || null);
            } catch (error) {
                console.error("Error fetching report:", error);
                setReport(null);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [parsedId]);

    useEffect(() => {
        const fetchTickets = async () => {
            if (!report?.userId) {
                setComplaints([]);
                setMaintenances([]);
                return;
            }

            try {
                const [complaintsRes, maintenancesRes] = await Promise.all([
                    axios.get(`${FETCH_STUDENT_COMPLAINTS_API}/${report.userId}`),
                    axios.get(`${FETCH_STUDENT_MAINTENANCES_API}/${report.userId}`),
                ]);

                setComplaints(complaintsRes.data || []);
                setMaintenances(maintenancesRes.data || []);
            } catch (error) {
                console.error("Error fetching student tickets:", error);
                setComplaints([]);
                setMaintenances([]);
            }
        };

        fetchTickets();
    }, [report?.userId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div className="page-shell page-enter">Loading report...</div>;
    }

    if (!report) {
        return (
            <div className="page-shell page-enter">
                <p className="mb-4">Report not found.</p>
                <Link to="/reports" className="text-blue-600 underline">Back to Reports</Link>
            </div>
        );
    }

    return (
        <div className="page-shell page-enter">
            <div className="page-header print:hidden">
                <div>
                    <h2 className="page-title">Student Statement</h2>
                    <p className="page-subtitle">Official record for hostel assignment and fee status.</p>
                </div>
                <Button
                    className="border-transparent text-white bg-[var(--accent)] hover:bg-[var(--accent-strong)] cursor-pointer"
                    onClick={handlePrint}
                >
                    Print / Save as PDF
                </Button>
            </div>

            <div className="print-statement max-w-3xl mx-auto panel p-6 print:shadow-none print:border-0">
                <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Official Student Statement</h1>
                        <p className="text-sm text-gray-500">Hostel Management System</p>
                    </div>
                    <div className="text-right text-xs text-gray-400">
                        <div>Document ID</div>
                        <div>HM-{report.applicationId}</div>
                    </div>
                </div>

                <div className="grid gap-4 text-gray-800">
                    <div className="flex justify-between border border-gray-100 rounded-xl px-4 py-3">
                        <span className="font-medium text-gray-600">Student Name</span>
                        <span>{report.studentName}</span>
                    </div>
                    <div className="flex justify-between border border-gray-100 rounded-xl px-4 py-3">
                        <span className="font-medium text-gray-600">Student ID</span>
                        <span>{report.studentId}</span>
                    </div>
                    <div className="flex justify-between border border-gray-100 rounded-xl px-4 py-3">
                        <span className="font-medium text-gray-600">Assigned Room</span>
                        <span>{report.roomName || "Not Assigned"}</span>
                    </div>
                    <div className="flex justify-between border border-gray-100 rounded-xl px-4 py-3">
                        <span className="font-medium text-gray-600">Room Fee</span>
                        <span>{report.roomPrice}</span>
                    </div>
                    <div className="flex justify-between border border-gray-100 rounded-xl px-4 py-3">
                        <span className="font-medium text-gray-600">Payment Status</span>
                        <span className={`pill ${report.feePaid ? "pill--paid" : "pill--unpaid"}`}>
                            {report.feePaid ? "Paid" : "Unpaid"}
                        </span>
                    </div>
                    <div className="flex justify-between border border-gray-100 rounded-xl px-4 py-3">
                        <span className="font-medium text-gray-600">Move In Date</span>
                        <span>{report.moveInDate ? report.moveInDate.toString().slice(0, 10) : "-"}</span>
                    </div>
                    <div className="flex justify-between border border-gray-100 rounded-xl px-4 py-3">
                        <span className="font-medium text-gray-600">Move Out Date</span>
                        <span>{report.moveOutDate ? report.moveOutDate.toString().slice(0, 10) : "-"}</span>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Student Submitted Tickets</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="text-sm font-medium text-gray-600 mb-2">Complaints</div>
                            {complaints.length === 0 ? (
                                <div className="text-sm text-gray-500">No complaints submitted.</div>
                            ) : (
                                <div className="space-y-2">
                                    {complaints.map((ticket) => (
                                        <div key={`complaint-${ticket.id}`} className="border border-gray-100 rounded-xl px-4 py-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-gray-800">{ticket.title}</span>
                                                <span className={`pill ${ticket.status === "resolved" ? "pill--resolved" : "pill--open"}`}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600">{ticket.details}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="text-sm font-medium text-gray-600 mb-2">Maintenance Requests</div>
                            {maintenances.length === 0 ? (
                                <div className="text-sm text-gray-500">No maintenance requests submitted.</div>
                            ) : (
                                <div className="space-y-2">
                                    {maintenances.map((ticket) => (
                                        <div key={`maintenance-${ticket.id}`} className="border border-gray-100 rounded-xl px-4 py-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-gray-800">{ticket.title}</span>
                                                <span className={`pill ${ticket.status === "resolved" ? "pill--resolved" : "pill--open"}`}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600">{ticket.details}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-sm text-gray-500">
                    This statement is generated by the hostel administration and reflects the latest recorded fee status.
                </div>
            </div>

            <div className="mt-6 text-center print:hidden">
                <Link to="/reports" className="text-blue-600 underline">Back to Reports</Link>
            </div>
        </div>
    );
}
