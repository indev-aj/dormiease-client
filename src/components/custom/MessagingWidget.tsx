import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function MessagingWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedConv, setSelectedConv] = useState<number | null>(null);
    const [messageText, setMessageText] = useState("");
    const [allUsers, setAllUsers] = useState<any[]>([]);

    const ADMIN_ID = 1; // TODO: Replace with actual logged-in admin

    // Fetch all users so admin can choose who to chat with
    const fetchAllUsers = async () => {
        const res = await axios.get("http://localhost:3000/api/admin/all-users");
        setAllUsers(res.data);
    };

    // Fetch messages for a conversation
    const fetchMessages = async (conversation_id: number) => {
        const res = await axios.get(
            `http://localhost:3000/api/messaging/messages/${conversation_id}`
        );
        setMessages(res.data);
    };

    // Send message (admin side)
    const sendMessage = async () => {
        if (!messageText || !selectedConv) return;

        await axios.post("http://localhost:3000/api/messaging/message/send", {
            conversation_id: selectedConv,
            content: messageText,
            sender_admin_id: ADMIN_ID
        });

        setMessageText("");
        fetchMessages(selectedConv);
    };

    useEffect(() => {
        if (open) {
            fetchAllUsers();
        }
    }, [open]);

    // Poll for new messages every 1 second
    useEffect(() => {
        if (!selectedConv) return; // Only poll when viewing a conversation

        const interval = setInterval(() => {
            fetchMessages(selectedConv);
        }, 1000);

        // Cleanup when conversation changes or widget closes
        return () => clearInterval(interval);
    }, [selectedConv, open]);

    return (
        <>
            {/* Floating Chat Button */}
            <div
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl cursor-pointer hover:bg-blue-700"
                onClick={() => setOpen(!open)}
            >
                💬
            </div>

            {/* Chat Window */}
            {open && (
                <Card className="fixed bottom-24 right-6 w-80 h-[120] bg-white shadow-xl border border-gray-300 flex flex-col">
                    {/* Header */}
                    <div className="p-3 border-b font-semibold flex justify-between items-center">
                        {selectedConv ? (
                            <>
                                <button
                                    onClick={() => {
                                        setSelectedConv(null);
                                        setMessages([]);
                                    }}
                                    className="text-blue-600 mr-2 font-bold"
                                >
                                    ←
                                </button>
                                <span>Chat</span>
                                <button onClick={() => setOpen(false)}>✖</button>
                            </>
                        ) : (
                            <>
                                <span>Messaging</span>
                                <button onClick={() => setOpen(false)}>✖</button>
                            </>
                        )}
                    </div>

                    {/* If no conversation selected → show user list */}
                    {!selectedConv ? (
                        <div className="flex-1 overflow-auto">
                            {allUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                                    onClick={async () => {
                                        // Start/retrieve conversation between ADMIN and USER
                                        const conv = await axios.post(
                                            "http://localhost:3000/api/messaging/conversation/start",
                                            { admin_id: ADMIN_ID, user_id: user.id }
                                        );

                                        setSelectedConv(conv.data.id);
                                        fetchMessages(conv.data.id);
                                    }}
                                >
                                    <div className="font-bold">{user.name}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Message list (chat window)
                        <div className="flex-1 overflow-auto p-3 space-y-2">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`p-2 rounded-lg max-w-[80%] ${msg.sender_admin_id === ADMIN_ID
                                        ? "bg-blue-100 ml-auto"
                                        : "bg-gray-200"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Message Input */}
                    {selectedConv && (
                        <div className="p-3 border-t flex gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                            />
                            <Button variant="contained" onClick={sendMessage}>
                                Send
                            </Button>
                        </div>
                    )}
                </Card>
            )}
        </>
    );
}