import express from 'express';
import { UserController } from '../controllers/UserController';
import { RoomController } from '../controllers/RoomController';
import { ComplaintController } from '../controllers/ComplaintController';
import { HostelController } from '../controllers/HostelController';
import { MaintenanceController } from '../controllers/MaintenanceController';
import NotificationController from '../controllers/NotificationController';

const router = express.Router();

router.post('/signin', UserController.signin);
router.post('/signup', UserController.signup);
router.post('/apply-room', RoomController.applyToRoom);
router.post('/apply-hostel', HostelController.applyHostel);
router.post('/submit-complaint', ComplaintController.submitComplaint);
router.post('/submit-maintenance', MaintenanceController.submitMaintenance);
router.get('/notifications/:userId', NotificationController.getForUser);
router.post('/update-notification/:userNotificationId', NotificationController.markAsRead)

export default router;
