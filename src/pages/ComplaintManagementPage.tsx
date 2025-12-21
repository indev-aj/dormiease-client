import { useEffect, useState } from "react"
import axios from 'axios';
import { Button } from "@/components/ui/button";


type Complaint = {
    id: number
    studentName: string
    studentId: string
    title: string
    details: string
    reply: string
    status: "open" | "resolved"
}

const FETCH_ALL_COMPLAINTS_API = 'http://localhost:3000/api/complaint/all';
const UPDATE_COMPLAINTS_API = 'http://localhost:3000/api/admin/update-complaint/';
const SUBMIT_COMPLAINT_API = 'http://localhost:3000/api/admin/submit-complaint';

export default function ComplaintManagementPage() {
    const [complaints, setComplaints] = useState<Complaint[]>([
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

    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
    const [replyText, setReplyText] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [openCreateComplaintModal, setOpenCreateComplaintModal] = useState(false);
    const [complaintTitle, setComplaintTitle] = useState("");
    const [complaintDetails, setComplaintDetails] = useState("");
    const [studentId, setStudentId] = useState("");

    const handleResolve = async () => {
        if (!selectedComplaint) return;

        const admin = JSON.parse(localStorage.getItem("admin") || "{}");
        const adminId = admin.id;
        const url = UPDATE_COMPLAINTS_API + selectedComplaint.id;

        const resolve = await axios.put(url, { adminId: adminId, reply: replyText });

        if (resolve.status == 200) {
            setComplaints(prev =>
                prev.map(c =>
                    c.id === selectedComplaint.id
                        ? { ...c, reply: replyText, status: "resolved" }
                        : c
                )
            )
            setSelectedComplaint(null)
            setReplyText("")
            setIsDialogOpen(false)
        } else {
            alert('Something went wrong');
        }

    }

    const createComplaint = async () => {
        try {
            const payload = {
                title: complaintTitle,
                details: complaintDetails,
                userId: studentId
            }

            await axios.post(SUBMIT_COMPLAINT_API, payload);
            await handleFetchComplaints();
            handleCancelCreateComplaint();
        } catch (error) {
            console.error(error);
        }
    }

    const openDialog = (complaint: Complaint) => {
        setSelectedComplaint(complaint)
        setReplyText(complaint.reply)
        setIsDialogOpen(true)
    }

    const closeDialog = () => {
        setSelectedComplaint(null)
        setReplyText("")
        setIsDialogOpen(false)
    }

    const handleFetchComplaints = async () => {
        const complaints = await axios.get(FETCH_ALL_COMPLAINTS_API);
        setComplaints(complaints.data);
    }

    const handleClickCreateComplaint = () => {
        setOpenCreateComplaintModal(true);
    }

    const handleCancelCreateComplaint = () => {
        setComplaintTitle("");
        setComplaintDetails("");
        setOpenCreateComplaintModal(false);
    }

    useEffect(() => {
        handleFetchComplaints();
    }, []);

    return (
        <div className="page-shell page-enter">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Complaints</h2>
                    <p className="page-subtitle">Track student complaints and respond with resolutions.</p>
                </div>
                <Button className="bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]" onClick={handleClickCreateComplaint}>
                    Submit New Complaint
                </Button>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <span className="panel-title">Complaint List</span>
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
                                {complaints.map((complaint) => (
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
                                <h3 className="text-lg font-semibold text-gray-900">Reply to Complaint</h3>
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
                                        value={selectedComplaint?.title || ""}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                                    <textarea
                                        value={selectedComplaint?.details || ""}
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

            {openCreateComplaintModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={handleCancelCreateComplaint}
                    ></div>

                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto border border-gray-200">
                        <div className="px-6 pt-6 pb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Complaint</h3>
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
                                        value={complaintTitle}
                                        onChange={(e) => setComplaintTitle(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                                    <textarea
                                        value={complaintDetails}
                                        onChange={(e) => setComplaintDetails(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                            <Button
                                onClick={() => createComplaint()}
                                disabled={!complaintTitle.trim() || !complaintDetails.trim()}
                                className="bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] disabled:bg-gray-300"
                            >
                                Submit
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleCancelCreateComplaint}
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
