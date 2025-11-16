import express from 'express';
import { MaintenanceController } from '../controllers/MaintenanceController';

const router = express.Router();

router.get('/all', MaintenanceController.fetchAll);
router.get('/:userId', MaintenanceController.fetchByStudent);

export default router;
