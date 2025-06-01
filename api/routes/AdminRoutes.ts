import express from 'express';
import { AdminController } from '../controllers/AdminController';
import { RoomController } from '../controllers/RoomController';

const router = express.Router();

router.post('/signin', AdminController.signin);
router.post('/signup', AdminController.signup);
router.put('/update-application/:id', RoomController.updateApplicationStatus);

export default router;
