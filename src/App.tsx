import { Route, Routes } from 'react-router-dom'
import './App.css'

import AdminSignInForm from './pages/AdminSignInForm'
import AdminSignUpForm from './pages/AdminSignUpForm'
import RoomManagementPage from './pages/RoomManagementPage'
import ComplaintManagementPage from './pages/ComplaintManagementPage'
import AppLayout from './layouts/AppLayout'

function App() {
    return (
        <Routes>
            <Route path="/signup" element={<AdminSignUpForm />} />
            <Route path="/login" element={<AdminSignInForm />} />

            <Route path="/" element={<AppLayout />}>
                <Route path="rooms" element={<RoomManagementPage />} />
                <Route path="complaints" element={<ComplaintManagementPage />} />
                <Route index element={<div>Welcome Dashboard</div>} />
            </Route>
        </Routes>
    )
}

export default App
