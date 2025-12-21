import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';

const SIGN_IN_API = 'http://localhost:3000/api/admin/signin';

export default function AdminSignInForm() {
    const [formData, setFormData] = useState({
        staffId: "",
        password: "",
    })

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: call signup API
        console.log("Admin Signup Data:", formData)

        const signin = await axios.post(SIGN_IN_API, { staff_id: formData.staffId, password: formData.password });

        if (signin.status == 200) {
            localStorage.setItem('admin', JSON.stringify(signin.data.admin))
            navigate('/rooms');
        }
    }

    return (
        <div className="auth-shell">
            <div className="auth-card page-enter">
                <div className="auth-hero">
                    <div>
                        <h1>Hostel Admin Portal</h1>
                        <p>Secure access for lecturers and administrators managing hostels, rooms, and student services.</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em]">University Operations</p>
                    </div>
                </div>

                <Card className="auth-form">
                    <CardHeader className="text-left p-0 mb-6">
                        <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
                        <p className="page-subtitle">Use your staff credentials to continue.</p>
                    </CardHeader>
                    <CardContent className="p-0">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <Label htmlFor="staffId">Staff ID</Label>
                                <Input
                                    id="staffId"
                                    name="staffId"
                                    placeholder="e.g. ADM001"
                                    value={formData.staffId}
                                    onChange={handleChange}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]"
                            >
                                Sign In
                            </Button>

                            <div className="text-center text-sm text-gray-600 mt-4">
                                Need an account?{" "}
                                <Link
                                    to="/signup"
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    Sign up here
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
