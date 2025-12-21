import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type FeeStatusRow = {
    applicationId: number;
    studentName: string;
    roomPrice: number;
    feePaid: boolean;
    status: string;
    roomId: number | null;
};

const FETCH_ALL_APPLICATIONS_API = `http://localhost:3000/api/hostels/all-applications`;
const FETCH_ALL_ROOMS_API = `http://localhost:3000/api/room/all`;

export default function HomePage() {
    const [rows, setRows] = useState<FeeStatusRow[]>([]);
    const [summary, setSummary] = useState({
        totalRooms: 0,
        totalCapacity: 0,
        occupied: 0,
        available: 0,
        occupancyRate: 0,
    });
    const [chartColors, setChartColors] = useState({
        accent: "#f5a623",
        ink: "#1c1f4a",
        muted: "#d8def2",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [applicationsRes, roomsRes] = await Promise.all([
                    axios.get(FETCH_ALL_APPLICATIONS_API),
                    axios.get(FETCH_ALL_ROOMS_API),
                ]);

                const approvedRows = applicationsRes.data.filter((app: FeeStatusRow) => (
                    app.status === "approved" && app.roomId
                ));
                setRows(approvedRows);

                const rooms = roomsRes.data;
                const totalRooms = rooms.length;
                const totalCapacity = rooms.reduce(
                    (sum: number, room: any) => sum + Number(room.maxSize || 0),
                    0
                );
                const occupied = rooms.reduce(
                    (sum: number, room: any) => sum + Number(room.currentUsers || 0),
                    0
                );
                const available = Math.max(totalCapacity - occupied, 0);
                const occupancyRate = totalCapacity > 0
                    ? Math.round((occupied / totalCapacity) * 100)
                    : 0;

                setSummary({
                    totalRooms,
                    totalCapacity,
                    occupied,
                    available,
                    occupancyRate,
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const styles = getComputedStyle(document.documentElement);
        setChartColors({
            accent: styles.getPropertyValue("--accent").trim() || "#f5a623",
            ink: styles.getPropertyValue("--ink").trim() || "#1c1f4a",
            muted: styles.getPropertyValue("--stroke").trim() || "#d8def2",
        });
    }, []);

    const chartData = useMemo(() => ({
        labels: ["Occupied", "Available"],
        datasets: [
            {
                data: [summary.occupied, summary.available],
                backgroundColor: [chartColors.accent, chartColors.muted],
                borderWidth: 0,
                hoverOffset: 6,
            },
        ],
    }), [summary.occupied, summary.available, chartColors]);

    const chartOptions = useMemo(() => ({
        cutout: "68%",
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    boxWidth: 12,
                    color: chartColors.ink,
                },
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.label}: ${context.raw}`,
                },
            },
        },
    }), [chartColors.ink]);

    return (
        <div className="page-shell page-enter">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Dashboard Overview</h2>
                    <p className="page-subtitle">Room capacity and fee status at a glance.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="panel lg:col-span-2">
                    <div className="panel-header">
                        <span className="panel-title">Room Status Summary</span>
                    </div>
                    <div className="panel-body">
                        <div className="stat-grid">
                            <div className="stat-card">
                                <span className="stat-label">Total Rooms</span>
                                <span className="stat-value">{summary.totalRooms}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Total Capacity</span>
                                <span className="stat-value">{summary.totalCapacity}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Occupied</span>
                                <span className="stat-value">{summary.occupied}</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Available</span>
                                <span className="stat-value">{summary.available}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="panel">
                    <div className="panel-header">
                        <span className="panel-title">Occupancy Rate</span>
                    </div>
                    <div className="panel-body">
                        <div className="chart-wrap">
                            <Doughnut data={chartData} options={chartOptions} />
                            <div className="chart-center">
                                <span className="chart-value">{summary.occupancyRate}%</span>
                                <span className="chart-label">Occupied</span>
                            </div>
                        </div>
                    </div>
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
