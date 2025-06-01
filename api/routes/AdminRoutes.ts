import express from 'express';
import { AdminController } from '../controllers/AdminController';
import { RoomController } from '../controllers/RoomController';
import { ComplaintController } from '../controllers/ComplaintController';

const router = express.Router();

router.post('/signin', AdminController.signin);
router.post('/signup', AdminController.signup);
router.put('/update-application/:id', RoomController.updateApplicationStatus);
router.put('/update-complaint/:id', ComplaintController.updateComplaint);

export default router;
