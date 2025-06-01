import express from 'express';
import AdminRoutes from './routes/AdminRoutes.js';
import RoomRoutes from './routes/RoomRoutes.js';

const router = express.Router();

router.use('/admin', AdminRoutes);
router.use('/room', RoomRoutes);

export default router;