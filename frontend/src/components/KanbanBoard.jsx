import React from 'react';
import { Plus, Calendar, Edit3, Trash2, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react';
import { formatDeadline, getSubjectColor } from '../utils/dateUtils';

export default function KanbanBoard({
  assignments,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenCreateWithStatus,
}) {
  const columns = [
    {
      id: 'PENDING',
      title: 'To Do',
      badgeClass: 'badge-col-pending',
      accentColor: '#64748b',
      items: assignments.filter((a) => a.status === 'PENDING'),
    },
    {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      badgeClass: 'badge-col-progress',
      accentColor: '#3b82f6',
      items: assignments.filter((a) => a.status === 'IN_PROGRESS'),
    },
    {
      id: 'COMPLETED',
      title: 'Completed',
      badgeClass: 'badge-col-completed',
      accentColor: '#10b981',
      items: assignments.filter((a) => a.status === 'COMPLETED'),
    },
  ];

  return (
    <div className="kanban-container">
      {columns.map((col) => (
        <div key={col.id} className="kanban-column">
          <div className="kanban-column-header">
            <div className="col-title-group">
              <span className="col-indicator" style={{ backgroundColor: col.accentColor }} />
              <h3 className="col-title">{col.title}</h3>
              <span className="col-count">{col.items.length}</span>
            </div>
            <button
              className="btn-icon-subtle"
              onClick={() => onOpenCreateWithStatus(col.id)}
              title={`Add assignment to ${col.title}`}
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="kanban-cards-wrapper">
            {col.items.length > 0 ? (
              col.items.map((assignment) => {
                const deadline = formatDeadline(assignment.dueDate);
                const subjColor = getSubjectColor(assignment.subject);

                return (
                  <div key={assignment.id} className="kanban-card">
                    {/* Top Row: Subject pill & Priority badge */}
                    <div className="kanban-card-top">
                      <span
                        className="subject-pill"
                        style={{
                          backgroundColor: subjColor.bg,
                          color: subjColor.text,
                          borderColor: subjColor.border,
                        }}
                      >
                        {assignment.subject}
                      </span>
                      <span className={`priority-pill priority-${assignment.priority.toLowerCase()}`}>
                        {assignment.priority}
                      </span>
                    </div>

                    {/* Card Title & Description */}
                    <h4 className="kanban-card-title">{assignment.title}</h4>
                    {assignment.description && (
                      <p className="kanban-card-desc">{assignment.description}</p>
                    )}

                    {/* Deadline Chip */}
                    <div className={`deadline-chip ${deadline.colorClass}`}>
                      <Calendar size={13} />
                      <span>{deadline.label}</span>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="kanban-card-footer">
                      <div className="card-quick-actions">
                        {col.id === 'PENDING' && (
                          <button
                            className="btn btn-sm btn-action"
                            onClick={() => onStatusChange(assignment, 'IN_PROGRESS')}
                            title="Start assignment"
                          >
                            <span>Start</span>
                            <ArrowRight size={13} />
                          </button>
                        )}

                        {col.id === 'IN_PROGRESS' && (
                          <>
                            <button
                              className="btn btn-sm btn-subtle"
                              onClick={() => onStatusChange(assignment, 'PENDING')}
                              title="Move back to To Do"
                            >
                              <ArrowLeft size={13} />
                            </button>
                            <button
                              className="btn btn-sm btn-action btn-success-action"
                              onClick={() => onStatusChange(assignment, 'COMPLETED')}
                              title="Mark complete"
                            >
                              <CheckCircle2 size={13} />
                              <span>Done</span>
                            </button>
                          </>
                        )}

                        {col.id === 'COMPLETED' && (
                          <button
                            className="btn btn-sm btn-subtle"
                            onClick={() => onStatusChange(assignment, 'IN_PROGRESS')}
                            title="Reopen assignment"
                          >
                            <RotateCcw size={13} />
                            <span>Reopen</span>
                          </button>
                        )}
                      </div>

                      <div className="card-manage-actions">
                        <button
                          className="btn-icon-link"
                          onClick={() => onEdit(assignment)}
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="btn-icon-link text-danger"
                          onClick={() => onDelete(assignment.id)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="kanban-empty">
                <p>No {col.title.toLowerCase()} assignments</p>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => onOpenCreateWithStatus(col.id)}
                >
                  <Plus size={14} /> Add task
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
