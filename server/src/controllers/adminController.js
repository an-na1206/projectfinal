import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get system-wide metrics and stats for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });

    // Aggregation: enrollments per course
    const enrollmentsByCourse = await Enrollment.aggregate([
      {
        $group: {
          _id: '$course',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'courseDetails'
        }
      },
      {
        $unwind: '$courseDetails'
      },
      {
        $project: {
          _id: 1,
          title: '$courseDetails.title',
          category: '$courseDetails.category',
          enrollmentsCount: '$count'
        }
      },
      {
        $sort: { enrollmentsCount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalAdmins,
        totalCourses,
        totalEnrollments,
        completedEnrollments
      },
      topCourses: enrollmentsByCourse,
      recentUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List all users (Admin view)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};
