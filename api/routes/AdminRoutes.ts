import express from 'express';
import { AdminController } from '../controllers/AdminController';
import { RoomController } from '../controllers/RoomController';
import { ComplaintController } from '../controllers/ComplaintController';
import { HostelController } from '../controllers/HostelController';
import { MaintenanceController } from '../controllers/MaintenanceController';
import NotificationController from '../controllers/NotificationController';
import { UserController } from '../controllers/UserController';

const router = express.Router();

router.post('/signin', AdminController.signin);
router.post('/signup', AdminController.signup);
router.get('/all-users', UserController.getAllUsers);
router.post('/submit-complaint', ComplaintController.submitComplaint);
router.post('/submit-maintenance', MaintenanceController.submitMaintenance);
router.put('/update-hostel-application', HostelController.updateApplicationStatus);
router.put('/change-room', RoomController.changeRoom);
router.put('/update-application/:id', RoomController.updateApplicationStatus);
router.put('/update-complaint/:id', ComplaintController.updateComplaint);
router.put('/update-maintenance/:id', MaintenanceController.updateMaintenance);
router.post('/create-notification', NotificationController.create);
router.get('/notifications', NotificationController.adminGetAll);
router.delete('/delete-notification/:id', NotificationController.delete);

export default router;
