import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

type TopBarProps = {
    userName: string
}

export default function TopBar({ userName }: TopBarProps) {
    const navigate = useNavigate()

    const handleLogout = () => {
        // Clear token, user data, etc.
        localStorage.removeItem("authToken")
        navigate("/login")
    }

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center">
            {/* Left: Navigation */}
            <nav className="flex gap-6 text-sm font-medium">
                <Link to="/" className="hover:text-primary">Home</Link>
                <Link to="/rooms" className="hover:text-primary">Rooms</Link>
                <Link to="/complaints" className="hover:text-primary">Complaints</Link>
            </nav>

            {/* Right: User Info + Logout */}
            <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Hello, <span className="font-semibold">{userName}</span></span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </header>
    )
}