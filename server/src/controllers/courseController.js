import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get all published courses with pagination and filters
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 9, 50); // Sensible max page size
    const skip = (page - 1) * limit;

    const { search, category, level } = req.query;
    let query = { isPublished: true };

    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (level && level !== 'All') {
      query.level = level;
    }

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email avatar bio');
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, level, price, thumbnail, duration, lessons } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course title, description, and category'
      });
    }

    const newCourse = await Course.create({
      title,
      description,
      category,
      level: level || 'Beginner',
      price: price !== undefined ? Number(price) : 0,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      instructor: req.user._id,
      instructorName: req.user.name,
      duration: duration || '4 Weeks',
      lessons: lessons && lessons.length > 0 ? lessons : [
        {
          title: 'Introduction & Course Overview',
          duration: '10 mins',
          content: 'Welcome to the course! In this lesson we will cover the roadmap and setup requirements.',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: newCourse
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Cascade delete enrollments associated with this course
    await Enrollment.deleteMany({ course: req.params.id });
    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course and related student enrollments removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
