import express from 'express';
import { getEmissionFactors, updateEmissionFactors } from '../controllers/settingsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/factors', getEmissionFactors);
router.put('/factors', updateEmissionFactors);

export default router;
