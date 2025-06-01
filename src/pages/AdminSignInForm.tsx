import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function AdminSignInForm() {
    const [formData, setFormData] = useState({
        staffId: "",
        password: "",
    })

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: call signup API
        console.log("Admin Signup Data:", formData)
        navigate('/rooms');
    }

    return (
        <div className="w-2xl flex items-center justify-center px-4">
            <Card className="w-full max-w-lg shadow-xl border border-gray-200 rounded-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-semibold">Admin Sign In</CardTitle>
                </CardHeader>
                <CardContent>
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

                        <Button type="submit" className="w-full text-white text-md py-2">
                            Sign In
                        </Button>

                        <div className="text-center text-sm text-gray-600 mt-4">
                            Already have an account?{" "}
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
    )
}