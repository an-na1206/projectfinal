import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  duration: {
    type: String,
    default: '15 mins'
  },
  content: {
    type: String,
    default: 'Welcome to this lesson. Review the video lecture and complete the study materials.'
  },
  videoUrl: {
    type: String,
    default: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Web Development', 'Full Stack MERN', 'Data Science', 'Mobile Development', 'UI/UX Design', 'Cloud & DevOps'],
      default: 'Full Stack MERN'
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative']
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    instructorName: {
      type: String,
      default: 'Prof. Simon'
    },
    duration: {
      type: String,
      default: '6 Weeks'
    },
    lessons: [lessonSchema],
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for searching and filtering
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ category: 1, level: 1 });

const Course = mongoose.model('Course', courseSchema);
export default Course;
