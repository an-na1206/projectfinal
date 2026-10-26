import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

// @desc    Enroll authenticated student in a course
// @route   POST /api/enrollments/:courseId
// @access  Private/Student
export const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
        enrollment: existing
      });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      completedLessons: [],
      progress: 0,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: `Enrolled successfully in "${course.title}"`,
      enrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enrollments for current logged-in user
// @route   GET /api/enrollments/my
// @access  Private
export const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        select: 'title description thumbnail category level duration lessons instructorName'
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course enrollment status & progress for logged in user
// @route   GET /api/enrollments/check/:courseId
// @access  Private
export const getEnrollmentStatus = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId
    }).populate('course');

    if (!enrollment) {
      return res.status(200).json({
        success: true,
        isEnrolled: false,
        enrollment: null
      });
    }

    res.status(200).json({
      success: true,
      isEnrolled: true,
      enrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a lesson as completed & update progress percentage
// @route   PUT /api/enrollments/:courseId/progress
// @access  Private
export const updateLessonProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { lessonId } = req.body;

    if (!lessonId) {
      return res.status(400).json({
        success: false,
        message: 'lessonId is required'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    let enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment record not found. Please enroll first.'
      });
    }

    // Add lessonId if not already marked completed
    const lessonExists = enrollment.completedLessons.some(
      (id) => id.toString() === lessonId.toString()
    );

    if (!lessonExists) {
      enrollment.completedLessons.push(lessonId);
    }

    // Recalculate progress percentage
    const totalLessons = course.lessons.length || 1;
    const completedCount = enrollment.completedLessons.length;
    enrollment.progress = Math.min(100, Math.round((completedCount / totalLessons) * 100));

    if (enrollment.progress === 100) {
      enrollment.status = 'completed';
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Lesson progress updated successfully',
      progress: enrollment.progress,
      status: enrollment.status,
      completedLessons: enrollment.completedLessons
    });
  } catch (error) {
    next(error);
  }
};
