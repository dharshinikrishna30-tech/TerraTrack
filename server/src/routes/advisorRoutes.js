import express from 'express';
import { getRecommendations } from '../controllers/advisorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/recommendations', getRecommendations);

export default router;
