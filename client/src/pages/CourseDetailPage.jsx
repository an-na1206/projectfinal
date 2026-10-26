import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseService, enrollmentService } from '../services/api';
import { LoadingState, ErrorState } from '../components/StateViews';
import ProgressBar from '../components/ProgressBar';
import {
  Clock,
  BookOpen,
  Award,
  PlayCircle,
  CheckCircle,
  User,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);
  const [enrollMsg, setEnrollMsg] = useState('');

  const fetchCourseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.getById(id);
      setCourse(data.course);

      // Check enrollment status if logged in
      if (isAuthenticated) {
        const enrollData = await enrollmentService.checkStatus(id);
        if (enrollData.isEnrolled) {
          setEnrollment(enrollData.enrollment);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve course details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    setEnrolling(true);
    setEnrollMsg('');
    try {
      const data = await enrollmentService.enroll(id);
      setEnrollMsg('Successfully enrolled! Redirecting to classroom...');
      setTimeout(() => {
        navigate(`/learn/${id}`);
      }, 1000);
    } catch (err) {
      setEnrollMsg(err.message || 'Enrollment failed');
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0' }}>
        <LoadingState message="Loading syllabus and course overview..." />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container" style={{ padding: '5rem 0' }}>
        <ErrorState message={error || 'Course not found'} onRetry={fetchCourseData} />
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Course Detail Hero */}
      <section style={{ background: '#0f172a', color: 'white', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
                <span className="category-tag" style={{ position: 'static' }}>{course.category}</span>
                <span className={`course-level-badge level-${course.level || 'Beginner'}`}>
                  {course.level || 'Beginner'}
                </span>
              </div>

              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem' }}>
                {course.title}
              </h1>

              <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                {course.description}
              </p>

              {/* Course Meta Info */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={18} color="#818cf8" />
                  <span>Instructor: <strong>{course.instructorName || 'Anna Simon'}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} color="#818cf8" />
                  <span>Duration: <strong>{course.duration || '6 Weeks'}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={18} color="#818cf8" />
                  <span>Modules: <strong>{course.lessons ? course.lessons.length : 0} Lessons</strong></span>
                </div>
              </div>
            </div>

            {/* Course Action Box Card */}
            <div
              style={{
                background: 'white',
                color: 'var(--text-main)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border)'
              }}
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {course.price === 0 ? 'FREE' : `$${course.price}`}
                  </span>
                  {course.price > 0 && (
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ${(course.price * 1.5).toFixed(2)}
                    </span>
                  )}
                </div>

                {enrollment ? (
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success)' }}>
                        ✓ Already Enrolled
                      </span>
                      <ProgressBar progress={enrollment.progress} />
                    </div>
                    <Link to={`/learn/${course._id}`} className="btn btn-primary" style={{ width: '100%' }}>
                      Go to Classroom <ArrowRight size={16} />
                    </Link>
                  </div>
                ) : (
                  <div>
                    {enrollMsg && (
                      <div
                        style={{
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-md)',
                          marginBottom: '1rem',
                          background: enrollMsg.includes('Success') ? 'var(--success-light)' : 'var(--danger-light)',
                          color: enrollMsg.includes('Success') ? 'var(--success)' : 'var(--danger)',
                          fontSize: '0.85rem'
                        }}
                      >
                        {enrollMsg}
                      </div>
                    )}
                    <button
                      className="btn btn-primary"
                      onClick={handleEnroll}
                      disabled={enrolling}
                      style={{ width: '100%', padding: '0.85rem' }}
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll in This Course'}
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                      Instant access to all {course.lessons?.length || 0} lessons & study materials
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Syllabus Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Course Syllabus & Lectures
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              {course.lessons?.length || 0} comprehensive modules designed with practical walkthroughs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson, idx) => (
                  <div
                    key={lesson._id || idx}
                    style={{
                      background: 'white',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div
                        style={{
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                          {lesson.title}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {lesson.content ? lesson.content.substring(0, 100) + '...' : 'Lecture overview and exercises'}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <Clock size={15} />
                      <span>{lesson.duration || '15 mins'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No lessons uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetailPage;
