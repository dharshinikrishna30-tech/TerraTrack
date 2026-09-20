import express from 'express';
import {
  getAlerts,
  markAlertRead,
  resolveAlert,
  deleteAlert,
  clearAllAlerts,
} from '../controllers/alertController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAlerts);
router.delete('/clear-all', clearAllAlerts);
router.put('/:id/read', markAlertRead);
router.put('/:id/resolve', resolveAlert);
router.delete('/:id', deleteAlert);

export default router;
