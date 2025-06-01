import express from 'express';
import { AdminController } from '../controllers/AdminController';

const router = express.Router();

router.post('/signin', AdminController.signin);
router.post('/signup', AdminController.signup);

export default router;
