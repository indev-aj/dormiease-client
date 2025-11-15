import express from 'express';
import { AdminController } from '../controllers/AdminController';
import { RoomController } from '../controllers/RoomController';
import { ComplaintController } from '../controllers/ComplaintController';
import { HostelController } from '../controllers/HostelController';

const router = express.Router();

router.post('/signin', AdminController.signin);
router.post('/signup', AdminController.signup);
router.post('/update-hostel-application', HostelController.updateApplicationStatus);
router.put('/update-application/:id', RoomController.updateApplicationStatus);
router.put('/update-complaint/:id', ComplaintController.updateComplaint);

export default router;
