import express from 'express';
import AdminRoutes from './routes/AdminRoutes.js';
import UserRoutes from './routes/UserRoutes.js';
import RoomRoutes from './routes/RoomRoutes.js';

const router = express.Router();

router.use('/admin', AdminRoutes);
router.use('/room', RoomRoutes);
router.use('/user', UserRoutes);

export default router;