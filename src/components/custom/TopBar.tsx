import { AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

type Props = {
    userName: string
}

export default function TopBar({ userName }: Props) {
    const navigate = useNavigate()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleRoomsMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleRoomsMouseLeave = () => {
        setTimeout(() => setAnchorEl(null), 200)
    }

    const handleLogout = () => {
        localStorage.removeItem("authToken")
        navigate("/login")
    }

    return (
        <AppBar position="sticky" color="default" elevation={1}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Left Navigation */}
                <Box sx={{ display: "flex", gap: 2 }} onMouseLeave={handleRoomsMouseLeave}>
                    <Button component={Link} to="/" color="inherit">Home</Button>

                    <Button
                        color="inherit"
                        onMouseEnter={handleRoomsMouseEnter}
                        onClick={handleRoomsMouseEnter}
                    >
                        Rooms
                    </Button>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => setAnchorEl(null)}
                        MenuListProps={{ onMouseEnter: () => { }, onMouseLeave: handleRoomsMouseLeave }}
                    >
                        <MenuItem component={Link} to="/rooms">List</MenuItem>
                        <MenuItem component={Link} to="/room-applications">Applications</MenuItem>
                    </Menu>

                    <Button component={Link} to="/complaints" color="inherit">Complaints</Button>
                </Box>

                {/* Right side */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Hello, <strong>{userName}</strong>
                    </Typography>
                    <Button variant="contained" size="small" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    )
}