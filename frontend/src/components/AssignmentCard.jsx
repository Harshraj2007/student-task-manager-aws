import React from 'react';
import { Calendar, Trash2, Edit3, CheckCircle2, RotateCcw } from 'lucide-react';
import { formatDeadline, getSubjectColor } from '../utils/dateUtils';

export default function AssignmentCard({ assignment, onEdit, onDelete, onStatusChange }) {
  const { id, title, subject, description, dueDate, priority, status } = assignment;
  const deadline = formatDeadline(dueDate);
  const subjColor = getSubjectColor(subject);

  return (
    <div className={`assignment-card ${status === 'COMPLETED' ? 'card-completed' : ''}`}>
      <div className="assignment-card-header">
        <span
          className="subject-pill"
          style={{
            backgroundColor: subjColor.bg,
            color: subjColor.text,
            borderColor: subjColor.border,
          }}
        >
          {subject}
        </span>
        <div className="card-top-badges">
          <span className={`priority-pill priority-${priority.toLowerCase()}`}>
            {priority}
          </span>
          <span className={`status-pill-badge status-${status.toLowerCase()}`}>
            {status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <h3 className="assignment-card-title">{title}</h3>
      <p className="assignment-card-desc">{description || 'No description provided.'}</p>

      <div className="assignment-card-meta">
        <div className={`deadline-chip ${deadline.colorClass}`}>
          <Calendar size={13} />
          <span>{deadline.label}</span>
        </div>
      </div>

      <div className="assignment-card-footer">
        {status !== 'COMPLETED' ? (
          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => onStatusChange(assignment, 'COMPLETED')}
            title="Mark as Completed"
          >
            <CheckCircle2 size={14} />
            <span>Mark Complete</span>
          </button>
        ) : (
          <button
            className="btn btn-sm btn-subtle"
            onClick={() => onStatusChange(assignment, 'IN_PROGRESS')}
            title="Reopen task"
          >
            <RotateCcw size={14} />
            <span>Reopen</span>
          </button>
        )}

        <div className="footer-action-icons">
          <button
            className="btn-icon-link"
            onClick={() => onEdit(assignment)}
            title="Edit Assignment"
          >
            <Edit3 size={15} />
          </button>
          <button
            className="btn-icon-link text-danger"
            onClick={() => onDelete(id)}
            title="Delete Assignment"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
