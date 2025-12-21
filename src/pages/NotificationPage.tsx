import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

const FETCH_ALL_NOTIFICATIONS_API = "http://localhost:3000/api/admin/notifications";
const CREATE_NOTIFICATION_API = "http://localhost:3000/api/admin/create-notification";

interface Notification {
    id: number;
    title: string;
    message: string;
    created_at: string;
}

export default function NotificationManagementPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [newNotif, setNewNotif] = useState({ title: "", message: "" });

    // Fetch notifications
    const fetchNotifications = async () => {
        const res = await axios.get(FETCH_ALL_NOTIFICATIONS_API);
        setNotifications(res.data);
    };

    // Add notification
    const handleAddNotification = async () => {
        if (!newNotif.title || !newNotif.message) return;

        await axios.post(CREATE_NOTIFICATION_API, {
            title: newNotif.title,
            message: newNotif.message,
        });

        setNewNotif({ title: "", message: "" });
        fetchNotifications(); // refresh
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="page-shell page-enter">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Notifications</h2>
                    <p className="page-subtitle">Publish announcements to students and staff.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="panel lg:col-span-2">
                    <CardHeader className="panel-header">
                        <CardTitle className="panel-title">
                            Notification List
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="panel-body data-table">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {notifications.map((notif) => (
                                    <TableRow key={notif.id} className="text-left">
                                        <TableCell>{notif.title}</TableCell>
                                        <TableCell className="max-w-[300px] truncate">
                                            {notif.message}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(notif.created_at).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="panel h-fit">
                    <CardHeader className="panel-header">
                        <CardTitle className="panel-title">
                            Create Notification
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="panel-body space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="notifTitle">Title</Label>
                            <Input
                                id="notifTitle"
                                placeholder="Enter title"
                                value={newNotif.title}
                                onChange={(e) =>
                                    setNewNotif({ ...newNotif, title: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notifMessage">Message</Label>
                            <Input
                                id="notifMessage"
                                placeholder="Enter message"
                                value={newNotif.message}
                                onChange={(e) =>
                                    setNewNotif({ ...newNotif, message: e.target.value })
                                }
                            />
                        </div>

                        <Button
                            onClick={handleAddNotification}
                            className="w-full bg-slate-900 text-white hover:bg-slate-800"
                        >
                            Create Notification
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
