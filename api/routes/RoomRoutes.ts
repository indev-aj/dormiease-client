import express from 'express';
import { RoomController } from '../controllers/RoomController';

const router = express.Router();

router.post('/create', RoomController.create);
router.get('/all', RoomController.fetchAll);

export default router;
