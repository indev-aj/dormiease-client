import { AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem } from "@mui/material"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

type Props = {
    userName: string
}

export default function TopBar({ userName }: Props) {
    const navigate = useNavigate();
    const location = useLocation()

    const isActive = (path: string) => location.pathname.startsWith(path)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleRoomsMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleRoomsMouseLeave = () => {
        setTimeout(() => setAnchorEl(null), 100)
    }

    const handleLogout = () => {
        localStorage.removeItem("admin")
        navigate("/login")
    }

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex space-x-8">
                        <a
                            href="/home"
                            className={`px-3 py-2 text-sm font-medium ${isActive("/home")
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-900 hover:text-gray-700"
                                }`}
                        >
                            HOME
                        </a>
                        <a
                            href="/hostels"
                            className={`px-3 py-2 text-sm font-medium ${isActive("/hostels")
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-900 hover:text-gray-700"
                                }`}
                        >
                            HOSTELS
                        </a>
                        <a
                            href="/hostel-applications"
                            className={`px-3 py-2 text-sm font-medium ${isActive("/hostel-applications")
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-900 hover:text-gray-700"
                                }`}
                        >
                            HOSTEL APPLICATION
                        </a>
                        <a
                            href="/rooms"
                            className={`px-3 py-2 text-sm font-medium ${isActive("/rooms")
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-900 hover:text-gray-700"
                                }`}
                        >
                            ROOMS
                        </a>
                        <a
                            href="/complaints"
                            className={`px-3 py-2 text-sm font-medium ${isActive("/complaints")
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-900 hover:text-gray-700"
                                }`}
                        >
                            COMPLAINTS
                        </a>
                        <a
                            href="/maintenances"
                            className={`px-3 py-2 text-sm font-medium ${isActive("/maintenances")
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-900 hover:text-gray-700"
                                }`}
                        >
                            MAINTENANCE
                        </a>
                        <a
                            href="/notifications"
                            className={`px-3 py-2 text-sm font-medium ${isActive("/notifications")
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-900 hover:text-gray-700"
                                }`}
                        >
                            NOTIFICATIONS
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600 text-sm">Hello, <span className="font-medium">Admin</span></span>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium" onClick={handleLogout}>LOGOUT</button>
                    </div>
                </div>
            </div>
        </nav>
    )

    return (
        <AppBar position="sticky" color="default" elevation={1}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Left Navigation */}
                <Box sx={{ display: "flex", gap: 2 }} onMouseLeave={handleRoomsMouseLeave}>
                    <Button component={Link} to="/" color="inherit" className="cursor-pointer">Home</Button>

                    <Button
                        color="inherit"
                        onMouseEnter={handleRoomsMouseEnter}
                        onClick={handleRoomsMouseEnter}
                        className="cursor-pointer"
                    >
                        Rooms
                    </Button>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => setAnchorEl(null)}

                        MenuListProps={{ onMouseEnter: () => { }, onMouseLeave: handleRoomsMouseLeave }}
                    >
                        <MenuItem component={Link} to="/rooms" className="cursor-pointer">List</MenuItem>
                        <MenuItem component={Link} to="/room-applications" className="cursor-pointer">Applications</MenuItem>
                    </Menu>

                    <Button component={Link} to="/complaints" color="inherit">Complaints</Button>
                </Box>

                {/* Right side */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Hello, <strong>{userName}</strong>
                    </Typography>
                    <Button variant="contained" size="small" onClick={handleLogout} className="cursor-pointer">
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    )
}