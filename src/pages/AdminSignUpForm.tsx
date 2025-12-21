import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';

const SIGN_UP_API = 'http://localhost:3000/api/admin/signup';

export default function AdminSignUpForm() {
    const [formData, setFormData] = useState({
        name: "",
        staffId: "",
        password: "",
        rePassword: ""
    });

    const navigate = useNavigate();

    const validatePasswordMatch = (password: string, rePassword: string): boolean => {
        return password === rePassword
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: call signup API
        console.log("Admin Signup Data:", formData)

        if (!validatePasswordMatch(formData.password, formData.rePassword)) {
            alert('Password do not match!');
        }

        const signup = await axios.post(SIGN_UP_API, { name: formData.name, staff_id: formData.staffId, password: formData.password });
        if (signup.status == 200 || signup.status == 201) {
            navigate('/login');
        }
    }

    return (
        <div className="auth-shell">
            <div className="auth-card page-enter">
                <div className="auth-hero">
                    <div>
                        <h1>Hostel Admin Portal</h1>
                        <p>Provision staff access for hostel operations, fee tracking, and student support.</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em]">University Operations</p>
                    </div>
                </div>

                <Card className="auth-form">
                    <CardHeader className="text-left p-0 mb-6">
                        <CardTitle className="text-2xl font-semibold">Create Account</CardTitle>
                        <p className="page-subtitle">Register a new admin profile.</p>
                    </CardHeader>
                    <CardContent className="p-0">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="staffId">Staff ID</Label>
                                <Input
                                    id="staffId"
                                    name="staffId"
                                    placeholder="e.g. ADM001"
                                    value={formData.staffId}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 "
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

                            <div>
                                <Label htmlFor="rePassword">Repeat Password</Label>
                                <Input
                                    id="rePassword"
                                    name="rePassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.rePassword}
                                    onChange={handleChange}
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]"
                            >
                                Sign Up
                            </Button>

                            <div className="text-center text-sm text-gray-600 mt-4">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    Sign in here
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
