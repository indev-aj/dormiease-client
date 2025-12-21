import { useEffect, useState } from "react"
import axios from 'axios';
import { Button } from "@/components/ui/button";


type Maintenance = {
    id: number
    studentName: string
    studentId: string
    title: string
    details: string
    reply: string
    status: "open" | "resolved"
}

const FETCH_ALL_MAINTENANCES_API = 'http://localhost:3000/api/maintenance/all';
const UPDATE_MAINTENANCES_API = 'http://localhost:3000/api/admin/update-maintenance/';
const SUBMIT_MAINTENANCE_API = 'http://localhost:3000/api/admin/submit-maintenance';

export default function MaintenanceManagementPage() {
    const [Maintenances, setMaintenances] = useState<Maintenance[]>([
        // {
        //     id: 1,
        //     studentName: "Ali Karim",
        //     studentId: "S001",
        //     title: "Fan not working",
        //     details: "The ceiling fan in Room 12 is not functioning.",
        //     reply: "",
        //     status: "open"
        // },
        // {
        //     id: 2,
        //     studentName: "Nora Lee",
        //     studentId: "S002",
        //     title: "Water leakage",
        //     details: "There is a leaking pipe in the shared bathroom.",
        //     reply: "",
        //     status: "resolved"
        // }
    ])

    const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null)
    const [replyText, setReplyText] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [openCreateMaintenanceModal, setOpenCreateMaintenanceModal] = useState(false);
    const [maintenanceTitle, setMaintenanceTitle] = useState("");
    const [maintenanceDetails, setMaintenanceDetails] = useState("");
    const [studentId, setStudentId] = useState("");

    const handleResolve = async () => {
        if (!selectedMaintenance) return;

        const admin = JSON.parse(localStorage.getItem("admin") || "{}");
        const adminId = admin.id;
        const url = UPDATE_MAINTENANCES_API + selectedMaintenance.id;

        const resolve = await axios.put(url, { adminId: adminId, reply: replyText });

        if (resolve.status == 200) {
            setMaintenances(prev =>
                prev.map(c =>
                    c.id === selectedMaintenance.id
                        ? { ...c, reply: replyText, status: "resolved" }
                        : c
                )
            )
            setSelectedMaintenance(null)
            setReplyText("")
            setIsDialogOpen(false)
        } else {
            alert('Something went wrong');
        }

    }

    const createMaintenance = async () => {
        try {
            const payload = {
                title: maintenanceTitle,
                details: maintenanceDetails,
                userId: studentId
            }

            await axios.post(SUBMIT_MAINTENANCE_API, payload);
            await handleFetchMaintenances();
            handleCancelCreateMaintenance();
        } catch (error) {
            console.error(error);
        }
    }

    const openDialog = (complaint: Maintenance) => {
        setSelectedMaintenance(complaint)
        setReplyText(complaint.reply)
        setIsDialogOpen(true)
    }

    const closeDialog = () => {
        setSelectedMaintenance(null)
        setReplyText("")
        setIsDialogOpen(false)
    }

    const handleFetchMaintenances = async () => {
        const maintenances = await axios.get(FETCH_ALL_MAINTENANCES_API);
        setMaintenances(maintenances.data);
    }

    const handleClickCreateMaintenance = () => {
        setOpenCreateMaintenanceModal(true);
    }

    const handleCancelCreateMaintenance = () => {
        setMaintenanceTitle("");
        setMaintenanceDetails("");
        setOpenCreateMaintenanceModal(false);
    }

    useEffect(() => {
        handleFetchMaintenances();
    }, []);

    return (
        <div className="page-shell page-enter">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Maintenance</h2>
                    <p className="page-subtitle">Log and resolve maintenance requests.</p>
                </div>
                <Button className="bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]" onClick={handleClickCreateMaintenance}>
                    Submit New Maintenance
                </Button>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <span className="panel-title">Maintenance List</span>
                </div>
                <div className="panel-body data-table">
                    <div className="overflow-x-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Student ID</th>
                                    <th>Title</th>
                                    <th>Details</th>
                                    <th className="text-center">Action</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Maintenances.map((complaint) => (
                                    <tr key={complaint.id}>
                                        <td>{complaint.studentName || "-"}</td>
                                        <td>{complaint.studentId || "-"}</td>
                                        <td>{complaint.title}</td>
                                        <td>{complaint.details}</td>
                                        <td className="text-center">
                                            {complaint.status === "open" ? (
                                                <Button
                                                    className="bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]"
                                                    onClick={() => openDialog(complaint)}
                                                >
                                                    Reply
                                                </Button>
                                            ) : (
                                                <span className="text-gray-400 italic text-sm">Resolved</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`pill ${complaint.status === "open" ? "pill--open" : "pill--resolved"}`}>
                                                {complaint.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Dialog/Modal */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={closeDialog}
                    ></div>

                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto border border-gray-200">
                        <div className="px-6 pt-6 pb-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Reply to Maintenance</h3>
                                <button
                                    onClick={closeDialog}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={selectedMaintenance?.title || ""}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                                    <textarea
                                        value={selectedMaintenance?.details || ""}
                                        readOnly
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Reply</label>
                                    <textarea
                                        placeholder="Type your reply here..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-slate-300 focus:border-slate-400 resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                            <Button
                                onClick={handleResolve}
                                disabled={!replyText.trim()}
                                className="bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] disabled:bg-gray-300"
                            >
                                Resolve
                            </Button>
                            <Button
                                variant="outline"
                                onClick={closeDialog}
                                className="border-gray-200"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {openCreateMaintenanceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={handleCancelCreateMaintenance}
                    ></div>

                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto border border-gray-200">
                        <div className="px-6 pt-6 pb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Maintenance</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                                    <input
                                        type="text"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={maintenanceTitle}
                                        onChange={(e) => setMaintenanceTitle(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                                    <textarea
                                        value={maintenanceDetails}
                                        onChange={(e) => setMaintenanceDetails(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                            <Button
                                onClick={() => createMaintenance()}
                                disabled={!maintenanceTitle.trim() || !maintenanceDetails.trim()}
                                className="bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] disabled:bg-gray-300"
                            >
                                Submit
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleCancelCreateMaintenance}
                                className="border-gray-200"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
