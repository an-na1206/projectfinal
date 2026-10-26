import express from 'express';
import { getAdminStats, getAllUsers } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);

export default router;
