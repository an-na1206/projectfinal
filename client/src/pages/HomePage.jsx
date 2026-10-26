import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/api';
import CourseCard from '../components/CourseCard';
import { LoadingState, EmptyState, ErrorState } from '../components/StateViews';
import {
  Sparkles,
  ArrowRight,
  Code2,
  Database,
  Palette,
  Terminal,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.getAll({ limit: 3 });
      setCourses(data.courses || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch featured courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  const categories = [
    { title: 'Full Stack MERN', count: '12 Courses', icon: Code2, color: '#4f46e5' },
    { title: 'Web Development', count: '18 Courses', icon: Terminal, color: '#0ea5e9' },
    { title: 'Data Science', count: '8 Courses', icon: Database, color: '#10b981' },
    { title: 'UI/UX Design', count: '10 Courses', icon: Palette, color: '#f59e0b' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-pill">
              <Sparkles size={16} color="#38bdf8" />
              <span>Full Stack Learning Management System</span>
            </div>
            <h1 className="hero-title">
              Empower Your Tech Career with <span className="hero-highlight">EduPulse</span>
            </h1>
            <p className="hero-desc">
              Master modern software engineering with project-based courses. Designed for learners seeking end-to-end expertise in MERN Stack, React, Cloud Architecture, and Data Science.
            </p>
            <div className="hero-actions">
              <Link to="/courses" className="btn btn-primary" style={{ padding: '0.85rem 1.6rem', fontSize: '1rem' }}>
                Browse Catalog <ArrowRight size={18} />
              </Link>
              {isAuthenticated ? (
                <Link to="/my-learning" className="btn btn-secondary" style={{ padding: '0.85rem 1.6rem', fontSize: '1rem' }}>
                  Go to My Learning
                </Link>
              ) : (
                <Link to="/register" className="btn btn-secondary" style={{ padding: '0.85rem 1.6rem', fontSize: '1rem' }}>
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>2,400+</h3>
              <p>Active Students Enrolled</p>
            </div>
            <div className="stat-item">
              <h3>24+</h3>
              <p>Industry-Aligned Courses</p>
            </div>
            <div className="stat-item">
              <h3>96%</h3>
              <p>Curriculum Completion Rate</p>
            </div>
            <div className="stat-item">
              <h3>4.9 / 5</h3>
              <p>Student Satisfaction Score</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '4.5rem 0 2rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
              Explore Domains
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.35rem' }}>Popular Categories</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={i}
                  to={`/courses?category=${encodeURIComponent(cat.title)}`}
                  style={{
                    background: 'white',
                    padding: '1.75rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <div
                    style={{
                      background: `${cat.color}15`,
                      color: cat.color,
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{cat.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{cat.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section style={{ padding: '3.5rem 0 5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                Handpicked Curriculum
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.35rem' }}>Featured Courses</h2>
            </div>
            <Link to="/courses" className="btn btn-outline">
              View All Courses <ArrowRight size={16} />
            </Link>
          </div>

          {/* 4 States handling: Loading, Success, Empty, Error */}
          {loading && <LoadingState message="Fetching featured courses from API..." />}
          {error && <ErrorState message={error} onRetry={fetchFeaturedCourses} />}
          {!loading && !error && courses.length === 0 && (
            <EmptyState
              title="No courses published yet"
              description="Check back soon as our instructors are preparing new curricula."
            />
          )}

          {!loading && !error && courses.length > 0 && (
            <div className="course-grid">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose EduPulse Banner */}
      <section style={{ background: '#f1f5f9', padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Built for Practical, Hands-on Competency
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Every curriculum follows structured learning paths aligned with modern software engineering industry benchmarks.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Code2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Full Stack Architecture</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
                Complete coverage of backend REST APIs, authentication security, database design, and high-performance React frontends.
              </p>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ background: 'var(--success-light)', color: 'var(--success)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Interactive Lesson Tracking</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
                Track video lectures, mark completed lessons in real time, and monitor your exact completion percentage via personal dashboard.
              </p>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ background: 'var(--warning-light)', color: '#b45309', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Role-Based Access</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
                Dedicated interfaces for Students and Admins. Instructors manage course catalogues, metrics, and syllabus content effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
