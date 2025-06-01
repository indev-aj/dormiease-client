import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Button from '@mui/material/Button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function AdminSignUpForm() {
    const [formData, setFormData] = useState({
        name: "",
        staffId: "",
        password: "",
        rePassword: ""
    })

    const validatePasswordMatch = (password: string, rePassword: string): boolean => {
        return password === rePassword
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: call signup API
        console.log("Admin Signup Data:", formData)

        if (!validatePasswordMatch(formData.password, formData.rePassword)) {
            alert('Password do not match!');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <Card className="w-full max-w-lg shadow-xl border border-gray-200 rounded-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-semibold">Admin Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
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
                            variant="contained"
                            type="submit"
                            className="w-full text-white text-md py-2"
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
    )
}