import express from 'express';
import {
  createLog,
  getLogs,
  getLogById,
  updateLog,
  deleteLog,
  getEmissionSummary,
} from '../controllers/resourceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Require authentication for all resource routes

router.route('/')
  .post(createLog)
  .get(getLogs);

router.get('/summary', getEmissionSummary);

router.route('/:id')
  .get(getLogById)
  .put(updateLog)
  .delete(deleteLog);

export default router;
