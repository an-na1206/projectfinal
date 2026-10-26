import React, { useState, useEffect } from 'react';
import { adminService, courseService } from '../services/api';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  PlusCircle,
  Trash2,
  Edit,
  ShieldCheck,
  CheckCircle2,
  X,
  AlertTriangle
} from 'lucide-react';

const CATEGORIES = [
  'Full Stack MERN',
  'Web Development',
  'Data Science',
  'UI/UX Design',
  'Cloud & DevOps'
];

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'Full Stack MERN',
    level: 'Beginner',
    price: 0,
    duration: '6 Weeks',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    lessonTitle: 'Introduction to the Course'
  });

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, coursesRes] = await Promise.all([
        adminService.getStats(),
        courseService.getAll({ limit: 50 })
      ]);

      setStats(statsRes.stats);
      setTopCourses(statsRes.topCourses || []);
      setRecentUsers(statsRes.recentUsers || []);
      setCourses(coursesRes.courses || []);
    } catch (err) {
      setError(err.message || 'Failed to load administrator metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.title.trim() || !courseForm.description.trim()) {
      setFormError('Please fill out course title and description');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      await courseService.create({
        title: courseForm.title,
        description: courseForm.description,
        category: courseForm.category,
        level: courseForm.level,
        price: Number(courseForm.price),
        duration: courseForm.duration,
        thumbnail: courseForm.thumbnail,
        lessons: [
          {
            title: courseForm.lessonTitle,
            duration: '15 mins',
            content: 'Welcome to this comprehensive course! Review syllabus materials.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          }
        ]
      });

      setShowModal(false);
      setCourseForm({
        title: '',
        description: '',
        category: 'Full Stack MERN',
        level: 'Beginner',
        price: 0,
        duration: '6 Weeks',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        lessonTitle: 'Introduction to the Course'
      });
      fetchAdminData();
    } catch (err) {
      setFormError(err.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete course "${title}"? This will also remove any student enrollments.`)) {
      try {
        await courseService.delete(id);
        fetchAdminData();
      } catch (err) {
        alert(err.message || 'Failed to delete course');
      }
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0' }}>
        <LoadingState message="Loading administrator dashboard & platform telemetry..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '5rem 0' }}>
        <ErrorState message={error} onRetry={fetchAdminData} />
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <ShieldCheck size={22} color="var(--primary)" />
              <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                Administrator Portal
              </span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Platform Management & Analytics</h1>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
            style={{ padding: '0.75rem 1.4rem' }}
          >
            <PlusCircle size={18} /> Add New Course
          </button>
        </div>

        {/* Analytics Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3rem'
          }}
        >
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Users</span>
              <Users size={18} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>{stats?.totalUsers || 0}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {stats?.totalStudents || 0} Students • {stats?.totalAdmins || 0} Admins
            </span>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Courses</span>
              <BookOpen size={18} color="#0ea5e9" />
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>{stats?.totalCourses || 0}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Published curricula</span>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Enrollments</span>
              <TrendingUp size={18} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>{stats?.totalEnrollments || 0}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Across all subjects</span>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Graduations</span>
              <Award size={18} color="#f59e0b" />
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>{stats?.completedEnrollments || 0}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>100% completed courses</span>
          </div>
        </div>

        {/* Manage Courses Table */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Course Inventory ({courses.length})</h2>
          </div>

          {courses.length === 0 ? (
            <EmptyState
              title="No courses created yet"
              description="Click 'Add New Course' to create your first course catalog item."
              actionText="Create Course"
              onAction={() => setShowModal(true)}
            />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Category</th>
                    <th>Level</th>
                    <th>Price</th>
                    <th>Lessons</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img
                            src={course.thumbnail}
                            alt=""
                            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div>
                            <strong>{course.title}</strong>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{course.duration}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{course.category}</span>
                      </td>
                      <td>
                        <span className={`course-level-badge level-${course.level || 'Beginner'}`}>
                          {course.level || 'Beginner'}
                        </span>
                      </td>
                      <td>
                        <strong>{course.price === 0 ? 'FREE' : `$${course.price}`}</strong>
                      </td>
                      <td>{course.lessons ? course.lessons.length : 0} modules</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteCourse(course._id, course.title)}
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem 0.65rem', color: 'var(--danger)' }}
                          title="Delete Course"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Create New Course */}
        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '1rem'
            }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Create New Course</h3>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={22} />
                </button>
              </div>

              {formError && (
                <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateCourse}>
                <div className="form-group">
                  <label className="form-label">Course Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={courseForm.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Master React 19 & Next.js"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    value={courseForm.description}
                    onChange={handleInputChange}
                    placeholder="Provide a comprehensive summary of syllabus topics and outcomes..."
                    className="form-textarea"
                    rows="3"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      value={courseForm.category}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Level</label>
                    <select
                      name="level"
                      value={courseForm.level}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Price (USD)</label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      value={courseForm.price}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={courseForm.duration}
                      onChange={handleInputChange}
                      placeholder="e.g. 6 Weeks"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Thumbnail Image URL</label>
                  <input
                    type="url"
                    name="thumbnail"
                    value={courseForm.thumbnail}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">First Lesson Title</label>
                  <input
                    type="text"
                    name="lessonTitle"
                    value={courseForm.lessonTitle}
                    onChange={handleInputChange}
                    placeholder="e.g. 1. Introduction & Setup"
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                  >
                    {submitting ? 'Creating...' : 'Publish Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
