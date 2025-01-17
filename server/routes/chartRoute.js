import express from 'express';

import { getChartData } from '../controllers/chartController.js';

const router = express.Router();

// Route to get chart data
router.get('/get-chart-data', getChartData);

export default router;
