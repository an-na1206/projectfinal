import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand */}
        <Link to="/" className="logo">
          <GraduationCap size={30} color="var(--primary)" />
          <span>EduPulse</span>
          <span className="logo-badge">LMS</span>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/courses"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <BookOpen size={16} />
            Explore Courses
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/my-learning"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <LayoutDashboard size={16} />
              My Learning
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <ShieldCheck size={16} />
              Admin Portal
            </NavLink>
          )}
        </nav>

        {/* Auth / Profile Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={user.name}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--border)'
                }}
              />
              <div style={{ display: 'none', flexDirection: 'column' }} className="d-md-flex">
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    color: isAdmin ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: 700
                  }}
                >
                  {user.role}
                </span>
              </div>
              <button
                className="btn btn-secondary"
                onClick={handleLogout}
                title="Log out"
                style={{ padding: '0.5rem 0.85rem' }}
              >
                <LogOut size={16} />
                <span style={{ fontSize: '0.85rem' }}>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                <LogIn size={16} />
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.1rem' }}>
                <UserPlus size={16} />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
