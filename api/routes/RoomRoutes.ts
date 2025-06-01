import express from 'express';
import { RoomController } from '../controllers/RoomController';

const router = express.Router();

router.post('/create', RoomController.create);
router.get('/all', RoomController.fetchAll);
router.get('/all-applications', RoomController.getRoomApplications);

export default router;
