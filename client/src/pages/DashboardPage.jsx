import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentService } from '../services/api';
import CourseCard from '../components/CourseCard';
import { LoadingState, EmptyState, ErrorState } from '../components/StateViews';
import {
  BookOpen,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'completed'

  const fetchEnrollments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await enrollmentService.getMyEnrollments();
      setEnrollments(data.enrollments || []);
    } catch (err) {
      setError(err.message || 'Unable to retrieve your enrolled courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // Compute metrics
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.status === 'completed' || e.progress === 100).length;
  const inProgressCourses = totalCourses - completedCourses;
  const avgProgress =
    totalCourses > 0
      ? Math.round(enrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalCourses)
      : 0;

  // Filter enrollments based on selected tab
  const filteredEnrollments = enrollments.filter((e) => {
    if (activeTab === 'active') return e.status !== 'completed' && e.progress < 100;
    if (activeTab === 'completed') return e.status === 'completed' || e.progress === 100;
    return true;
  });

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Student Profile Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            color: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name}
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid rgba(255, 255, 255, 0.3)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Welcome back, {user?.name}!</h1>
                <span className="logo-badge" style={{ background: '#38bdf8', color: '#0f172a' }}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              <p style={{ color: '#c7d2fe', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                {user?.email} • Keep up the momentum in your full-stack journey.
              </p>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
              marginTop: '2rem'
            }}
          >
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Enrolled</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{totalCourses}</h3>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>In Progress</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{inProgressCourses}</h3>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Completed</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{completedCourses}</h3>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Avg Progress</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{avgProgress}%</h3>
            </div>
          </div>
        </div>

        {/* Course Filters Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('all')}
              style={{ padding: '0.5rem 1rem' }}
            >
              All Courses ({totalCourses})
            </button>
            <button
              className={`btn ${activeTab === 'active' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('active')}
              style={{ padding: '0.5rem 1rem' }}
            >
              In Progress ({inProgressCourses})
            </button>
            <button
              className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('completed')}
              style={{ padding: '0.5rem 1rem' }}
            >
              Completed ({completedCourses})
            </button>
          </div>

          <Link to="/courses" className="btn btn-outline">
            Browse More Courses <ArrowRight size={16} />
          </Link>
        </div>

        {/* 4 States Handling: Loading, Error, Empty, Success */}
        {loading && <LoadingState message="Fetching your enrolled courses..." />}
        {error && <ErrorState message={error} onRetry={fetchEnrollments} />}

        {!loading && !error && filteredEnrollments.length === 0 && (
          <EmptyState
            title={totalCourses === 0 ? "You haven't enrolled in any courses yet" : "No courses in this section"}
            description={
              totalCourses === 0
                ? "Start your learning journey by exploring our full stack courses."
                : "Check your other tabs to see your active or completed courses."
            }
            actionText="Explore Course Catalog"
            onAction={() => (window.location.href = '/courses')}
          />
        )}

        {!loading && !error && filteredEnrollments.length > 0 && (
          <div className="course-grid">
            {filteredEnrollments.map((enr) => {
              if (!enr.course) return null;
              return (
                <CourseCard
                  key={enr._id}
                  course={enr.course}
                  enrollment={enr}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
