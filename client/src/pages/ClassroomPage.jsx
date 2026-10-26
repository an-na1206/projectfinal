import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseService, enrollmentService } from '../services/api';
import { LoadingState, ErrorState } from '../components/StateViews';
import ProgressBar from '../components/ProgressBar';
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  Clock,
  ArrowLeft,
  Award,
  ChevronRight,
  BookOpen
} from 'lucide-react';

const ClassroomPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchClassroomData = async () => {
    setLoading(true);
    setError(null);
    try {
      const courseData = await courseService.getById(courseId);
      setCourse(courseData.course);

      const statusData = await enrollmentService.checkStatus(courseId);
      if (statusData.isEnrolled) {
        setEnrollment(statusData.enrollment);
      } else {
        // Automatically auto-enroll if student is opening classroom
        const newEnroll = await enrollmentService.enroll(courseId);
        setEnrollment(newEnroll.enrollment);
      }
    } catch (err) {
      setError(err.message || 'Failed to load classroom session');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassroomData();
  }, [courseId]);

  const activeLesson = course?.lessons?.[activeLessonIndex];

  const isLessonCompleted = (lessonId) => {
    if (!enrollment?.completedLessons) return false;
    return enrollment.completedLessons.some(
      (id) => (id._id || id).toString() === lessonId?.toString()
    );
  };

  const handleMarkComplete = async () => {
    if (!activeLesson || !activeLesson._id) return;
    setUpdating(true);
    try {
      const res = await enrollmentService.updateProgress(courseId, activeLesson._id);
      if (res.success) {
        setEnrollment((prev) => ({
          ...prev,
          progress: res.progress,
          status: res.status,
          completedLessons: res.completedLessons
        }));

        // Advance to next lesson if available
        if (activeLessonIndex < (course.lessons.length - 1)) {
          setActiveLessonIndex(activeLessonIndex + 1);
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to update lesson progress');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0' }}>
        <LoadingState message="Loading interactive classroom..." />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container" style={{ padding: '5rem 0' }}>
        <ErrorState message={error || 'Course not available'} onRetry={fetchClassroomData} />
      </div>
    );
  }

  const currentLessonCompleted = activeLesson ? isLessonCompleted(activeLesson._id) : false;

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 4.5rem)', padding: '1.5rem 0 4rem 0' }}>
      <div className="container">
        {/* Top Back Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Link
            to="/my-learning"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}
          >
            <ArrowLeft size={16} /> Back to My Learning
          </Link>

          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Course: <strong>{course.title}</strong>
          </span>
        </div>

        {/* Course Completion Banner */}
        {enrollment?.progress === 100 && (
          <div
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '1.25rem 1.75rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <Award size={36} color="#ffffff" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Congratulations! Course Completed!</h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                You have finished all {course.lessons?.length || 0} modules in this curriculum with 100% progress.
              </p>
            </div>
          </div>
        )}

        {/* Classroom Grid */}
        <div className="classroom-layout">
          {/* Main Video & Content Column */}
          <div>
            <div className="video-frame-wrapper" style={{ boxShadow: 'var(--shadow-lg)' }}>
              <iframe
                src={activeLesson?.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                title={activeLesson?.title || 'Lecture Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Lesson Details Box */}
            <div
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                marginTop: '1.5rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    Lesson {activeLessonIndex + 1} of {course.lessons?.length || 1}
                  </span>
                  <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.2rem' }}>
                    {activeLesson?.title}
                  </h2>
                </div>

                <button
                  onClick={handleMarkComplete}
                  disabled={updating}
                  className={`btn ${currentLessonCompleted ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ padding: '0.65rem 1.25rem' }}
                >
                  {currentLessonCompleted ? (
                    <>
                      <CheckCircle2 size={18} color="var(--success)" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle size={18} />
                      <span>{updating ? 'Saving...' : 'Mark as Completed'}</span>
                    </>
                  )}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={15} /> Duration: {activeLesson?.duration || '15 mins'}
                </span>
                <span>•</span>
                <span>Instructor: {course.instructorName || 'Anna Simon'}</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Lesson Study Notes & Objectives
              </h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {activeLesson?.content ||
                  'Review this lecture thoroughly. Complete the exercises described and mark the lesson complete to progress through your curriculum.'}
              </p>
            </div>
          </div>

          {/* Right Sidebar: Syllabus & Progress */}
          <div>
            <div className="lesson-list-card" style={{ boxShadow: 'var(--shadow-md)' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: '#f8fafc' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                  Curriculum Progress
                </h3>
                <ProgressBar progress={enrollment?.progress || 0} />
              </div>

              <div style={{ overflowY: 'auto', flex: 1 }}>
                {course.lessons?.map((lesson, idx) => {
                  const completed = isLessonCompleted(lesson._id);
                  const isActive = idx === activeLessonIndex;

                  return (
                    <div
                      key={lesson._id || idx}
                      onClick={() => setActiveLessonIndex(idx)}
                      className={`lesson-item ${isActive ? 'active' : ''}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {completed ? (
                          <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0 }} />
                        ) : (
                          <PlayCircle size={18} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                        )}
                        <div>
                          <p
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: isActive ? 700 : 500,
                              color: isActive ? 'var(--primary)' : 'var(--text-main)',
                              lineHeight: 1.3
                            }}
                          >
                            {idx + 1}. {lesson.title}
                          </p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {lesson.duration || '15 mins'}
                          </span>
                        </div>
                      </div>

                      {isActive && <ChevronRight size={16} color="var(--primary)" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomPage;
