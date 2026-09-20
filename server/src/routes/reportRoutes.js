import express from 'express';
import { getReportSummary, exportCSV } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getReportSummary);
router.get('/export-csv', exportCSV);

export default router;
