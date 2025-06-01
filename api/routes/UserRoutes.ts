import express from 'express';
import { UserController } from '../controllers/UserController';
import { RoomController } from '../controllers/RoomController';

const router = express.Router();

router.post('/signin', UserController.signin);
router.post('/signup', UserController.signup);
router.post('/apply-room', RoomController.applyToRoom)

export default router;
