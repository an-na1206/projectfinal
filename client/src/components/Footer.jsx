import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <GraduationCap size={28} color="#818cf8" />
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>EduPulse LMS</span>
            </div>
            <p style={{ maxWidth: '340px', fontSize: '0.9rem', lineHeight: 1.6 }}>
              A modern, full-stack Course & Learning Management System built in accordance with the ICTAK Full Stack MERN Curriculum standards.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/" style={{ color: '#94a3b8' }}>Home</Link></li>
              <li><Link to="/courses" style={{ color: '#94a3b8' }}>Course Catalog</Link></li>
              <li><Link to="/login" style={{ color: '#94a3b8' }}>Student Portal</Link></li>
              <li><Link to="/admin" style={{ color: '#94a3b8' }}>Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
              ICTAK Project Info
            </h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <strong>Course:</strong> Full Stack Development (MERN)
            </p>
            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <strong>Institution:</strong> ICT Academy of Kerala
            </p>
            <p style={{ fontSize: '0.85rem' }}>
              <strong>Repository:</strong> <a href="https://github.com/an-na1206/projectfinal.git" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8' }}>github.com/an-na1206/projectfinal</a>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} EduPulse LMS. Built for ICTAK Final Project Submission.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            <span>Crafted with</span>
            <Heart size={15} color="#ef4444" fill="#ef4444" />
            <span>using React, Node.js, Express & MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
