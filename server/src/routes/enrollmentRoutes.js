import express from 'express';
import {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentStatus,
  updateLessonProgress
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', protect, getMyEnrollments);
router.get('/check/:courseId', protect, getEnrollmentStatus);
router.post('/:courseId', protect, enrollInCourse);
router.put('/:courseId/progress', protect, updateLessonProgress);

export default router;
