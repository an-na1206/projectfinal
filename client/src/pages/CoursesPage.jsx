import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courseService } from '../services/api';
import CourseCard from '../components/CourseCard';
import { LoadingState, EmptyState, ErrorState } from '../components/StateViews';
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Full Stack MERN',
  'Web Development',
  'Data Science',
  'UI/UX Design',
  'Cloud & DevOps'
];

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and pagination states from URL or defaults
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'All');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 6,
        search: searchTerm,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        level: selectedLevel !== 'All' ? selectedLevel : undefined
      };

      const data = await courseService.getAll(params);
      setCourses(data.courses || []);
      setTotalPages(data.totalPages || 1);
      setTotalCourses(data.total || 0);
    } catch (err) {
      setError(err.message || 'Unable to load course catalogue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLevel, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCourses();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setCurrentPage(1);
  };

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
            Comprehensive Syllabus
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.35rem' }}>Explore All Courses</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', marginTop: '0.5rem' }}>
            Browse through our industry-vetted courses in full stack development, cloud, and emerging technologies.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search by title, keywords, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)'
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          {/* Categories and Level */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Category pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Level selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} color="var(--text-muted)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setCurrentPage(1);
                }}
                className="form-select"
                style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results summary */}
        {!loading && !error && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Showing <strong>{courses.length}</strong> of <strong>{totalCourses}</strong> available courses
            </span>
            {(selectedCategory !== 'All' || selectedLevel !== 'All' || searchTerm) && (
              <button
                onClick={handleResetFilters}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* 4 States: Loading, Error, Empty, Success */}
        {loading && <LoadingState message="Filtering courses..." />}
        {error && <ErrorState message={error} onRetry={fetchCourses} />}

        {!loading && !error && courses.length === 0 && (
          <EmptyState
            title="No matching courses found"
            description="We couldn't find any courses matching your selected criteria. Try removing some filters."
            actionText="Clear Filters"
            onAction={handleResetFilters}
          />
        )}

        {!loading && !error && courses.length > 0 && (
          <>
            <div className="course-grid">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginTop: '3.5rem'
                }}
              >
                <button
                  className="btn btn-secondary"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{ padding: '0.5rem 0.85rem' }}
                >
                  <ChevronLeft size={18} /> Prev
                </button>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`btn ${currentPage === pg ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ width: '40px', height: '40px', padding: 0 }}
                    >
                      {pg}
                    </button>
                  ))}
                </div>

                <button
                  className="btn btn-secondary"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{ padding: '0.5rem 0.85rem' }}
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
