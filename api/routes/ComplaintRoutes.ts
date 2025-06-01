import express from 'express';
import { ComplaintController } from '../controllers/ComplaintController';

const router = express.Router();

router.get('/all', ComplaintController.fetchAll);

export default router;
