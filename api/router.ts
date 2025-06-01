import express from 'express';
import AdminRoutes from './routes/AdminRoutes.js';

const router = express.Router();

router.use('/admin', AdminRoutes);

export default router;