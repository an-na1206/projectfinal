import React from 'react';

const ProgressBar = ({ progress = 0, showLabel = true, height = 8 }) => {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.25rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Progress</span>
          <span style={{ fontWeight: 700, color: clamped === 100 ? 'var(--success)' : 'var(--primary)' }}>
            {clamped}%
          </span>
        </div>
      )}
      <div className="progress-bar-container" style={{ height: `${height}px` }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${clamped}%`,
            background: clamped === 100 ? 'var(--success)' : 'linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%)'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
