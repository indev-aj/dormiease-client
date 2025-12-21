import { Route, Routes } from 'react-router-dom'
import './App.css'

import AdminSignInForm from './pages/AdminSignInForm'
import AdminSignUpForm from './pages/AdminSignUpForm'
import RoomManagementPage from './pages/RoomManagementPage'
import ComplaintManagementPage from './pages/ComplaintManagementPage'
import AppLayout from './layouts/AppLayout'
import RoomApplicationPage from './pages/RoomApplicationPage'
import HostelManagementPage from './pages/HostelManagementPage'
import HostelApplicationPage from './pages/HostelApplicationPage'
import MaintenanceManagementPage from './pages/MaintenanceManagementPage'
import NotificationManagementPage from './pages/NotificationPage'
import HomePage from './pages/HomePage'
import ReportsPage from './pages/ReportsPage'
import StudentReportPage from './pages/StudentReportPage'

function App() {
    return (
        <Routes>
            <Route path="/signup" element={<AdminSignUpForm />} />
            <Route path="/login" element={<AdminSignInForm />} />

            <Route path="/" element={<AppLayout />}>
                <Route path="hostels" element={<HostelManagementPage />} />
                <Route path="rooms" element={<RoomManagementPage />} />
                <Route path="room-applications" element={<RoomApplicationPage />} />
                <Route path="hostel-applications" element={<HostelApplicationPage />} />
                <Route path="complaints" element={<ComplaintManagementPage />} />
                <Route path="maintenances" element={<MaintenanceManagementPage />} />
                <Route path="notifications" element={<NotificationManagementPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="reports/:applicationId" element={<StudentReportPage />} />
                <Route index element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
            </Route>
        </Routes>
    )
}

export default App
