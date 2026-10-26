import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, User } from 'lucide-react';
import ProgressBar from './ProgressBar';

const CourseCard = ({ course, enrollment, actionButton }) => {
  return (
    <div className="course-card">
      <div className="course-thumbnail-wrapper">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
          alt={course.title}
          className="course-thumbnail"
          loading="lazy"
        />
        <span className="category-tag">{course.category}</span>
      </div>

      <div className="course-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={`course-level-badge level-${course.level || 'Beginner'}`}>
            {course.level || 'Beginner'}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
            {course.price === 0 ? 'FREE' : `$${course.price}`}
          </span>
        </div>

        <h3 className="course-title">{course.title}</h3>
        <p className="course-desc">{course.description}</p>

        {/* If enrolled, show progress */}
        {enrollment && (
          <div style={{ marginBottom: '1rem' }}>
            <ProgressBar progress={enrollment.progress} />
          </div>
        )}

        <div className="course-meta">
          <div className="meta-instructor">
            <User size={15} />
            <span>{course.instructorName || 'Lead Instructor'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={14} />
              {course.duration || '6 Weeks'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <BookOpen size={14} />
              {course.lessons ? course.lessons.length : 0} lessons
            </span>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem' }}>
          {actionButton ? (
            actionButton
          ) : enrollment ? (
            <Link
              to={`/learn/${course._id}`}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Resume Course
            </Link>
          ) : (
            <Link
              to={`/courses/${course._id}`}
              className="btn btn-outline"
              style={{ width: '100%' }}
            >
              View Syllabus
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
