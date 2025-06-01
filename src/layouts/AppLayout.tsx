import TopBar from "@/components/custom/TopBar"
import { Outlet } from "react-router-dom"

export default function AppLayout() {
    const userName = "Admin" // Replace with actual context or state later

    return (
        <div className="">
            <TopBar userName={userName} />
            <main className="p-6">
                <Outlet />
            </main>
        </div>
    )
}