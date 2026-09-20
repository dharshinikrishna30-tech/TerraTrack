import express from 'express';
import { triggerSeed } from '../controllers/seedController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/demo', triggerSeed);

export default router;
