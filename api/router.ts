import express from 'express';
import AdminRoutes from './routes/AdminRoutes.js';
import UserRoutes from './routes/UserRoutes.js';
import RoomRoutes from './routes/RoomRoutes.js';
import ComplaintRoutes from './routes/ComplaintRoutes.js';
import MaintenanceRoutes from './routes/MaintenanceRoutes.js';
import HostelRoutes from './routes/HostelRoutes.js';

const router = express.Router();

router.use('/admin', AdminRoutes);
router.use('/room', RoomRoutes);
router.use('/user', UserRoutes);
router.use('/maintenance', MaintenanceRoutes);
router.use('/complaint', ComplaintRoutes);
router.use('/hostels', HostelRoutes);

export default router;