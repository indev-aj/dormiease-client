import express from 'express';
import { HostelController } from '../controllers/HostelController';

const router = express.Router();

router.post('/create', HostelController.create);
router.get('/all', HostelController.fetchAll);
router.get('/all-applications', HostelController.fetchApplications);

export default router;
