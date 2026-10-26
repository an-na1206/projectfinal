import React from 'react';
import { AlertCircle, FolderOpen, RefreshCw } from 'lucide-react';

// 1. Loading State Component
export const LoadingState = ({ message = 'Loading course details...' }) => (
  <div className="state-box">
    <div className="state-spinner" role="status" aria-label="Loading"></div>
    <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{message}</p>
  </div>
);

// 2. Empty State Component
export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No courses found',
  description = 'Try adjusting your search query or filters to find what you are looking for.',
  actionText,
  onAction
}) => (
  <div className="state-box">
    <div
      style={{
        background: '#f1f5f9',
        padding: '1.25rem',
        borderRadius: '50%',
        marginBottom: '1rem',
        color: 'var(--text-muted)'
      }}
    >
      <Icon size={36} />
    </div>
    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', maxWidth: '420px', marginBottom: actionText ? '1.5rem' : 0 }}>
      {description}
    </p>
    {actionText && onAction && (
      <button className="btn btn-primary" onClick={onAction}>
        {actionText}
      </button>
    )}
  </div>
);

// 3. Error State Component
export const ErrorState = ({
  message = 'An error occurred while loading content.',
  onRetry
}) => (
  <div className="state-box" style={{ borderColor: 'var(--danger-light)' }}>
    <div
      style={{
        background: 'var(--danger-light)',
        padding: '1.25rem',
        borderRadius: '50%',
        marginBottom: '1rem',
        color: 'var(--danger)'
      }}
    >
      <AlertCircle size={36} />
    </div>
    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--danger)' }}>
      Something Went Wrong
    </h3>
    <p style={{ color: 'var(--text-muted)', maxWidth: '440px', marginBottom: onRetry ? '1.5rem' : 0 }}>
      {message}
    </p>
    {onRetry && (
      <button className="btn btn-secondary" onClick={onRetry}>
        <RefreshCw size={16} /> Retry
      </button>
    )}
  </div>
);
