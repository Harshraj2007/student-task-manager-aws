import React, { useState, useEffect } from 'react';
import { X, Calendar, BookOpen, AlertCircle } from 'lucide-react';

export default function AssignmentModal({
  isOpen,
  onClose,
  onSave,
  editingAssignment,
  defaultStatus = 'PENDING',
}) {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    status: 'PENDING',
  });

  const popularSubjects = [
    'Cloud Computing',
    'Database Management',
    'Computer Networks',
    'Operating Systems',
    'Web Engineering',
    'AI & Machine Learning',
  ];

  useEffect(() => {
    if (editingAssignment) {
      setFormData({
        title: editingAssignment.title || '',
        subject: editingAssignment.subject || '',
        description: editingAssignment.description || '',
        dueDate: editingAssignment.dueDate || '',
        priority: editingAssignment.priority || 'MEDIUM',
        status: editingAssignment.status || 'PENDING',
      });
    } else {
      // Default due date: 3 days from now
      const defaultDue = new Date();
      defaultDue.setDate(defaultDue.getDate() + 3);

      setFormData({
        title: '',
        subject: '',
        description: '',
        dueDate: defaultDue.toISOString().split('T')[0],
        priority: 'MEDIUM',
        status: defaultStatus || 'PENDING',
      });
    }
  }, [editingAssignment, isOpen, defaultStatus]);

  if (!isOpen) return null;

  const setQuickDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setFormData({ ...formData, dueDate: d.toISOString().split('T')[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subject.trim()) {
      alert('Please fill in both Assignment Title and Subject');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {editingAssignment ? 'Edit Academic Assignment' : 'Create New Academic Assignment'}
            </h2>
            <p className="modal-subtitle">
              Synchronized in real-time to your Amazon RDS PostgreSQL database
            </p>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Assignment Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AWS VPC & Subnetting Lab Report"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                autoFocus
              />
            </div>

            {/* Subject with Quick Suggestion Pills */}
            <div className="form-group">
              <label className="form-label">Subject / Course Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Cloud Computing"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
              <div className="quick-suggestions">
                <span className="suggestion-label">Quick select:</span>
                {popularSubjects.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="suggestion-chip"
                    onClick={() => setFormData({ ...formData, subject: s })}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description / Rubric & Requirements</label>
              <textarea
                rows="3"
                className="form-textarea"
                placeholder="Detail the submission instructions, diagram requirements, or references..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Due Date with Quick Select */}
            <div className="form-group">
              <div className="label-with-actions">
                <label className="form-label">Due Date / Deadline</label>
                <div className="quick-date-buttons">
                  <button type="button" onClick={() => setQuickDate(0)} className="btn-date-preset">
                    Today
                  </button>
                  <button type="button" onClick={() => setQuickDate(1)} className="btn-date-preset">
                    Tomorrow
                  </button>
                  <button type="button" onClick={() => setQuickDate(7)} className="btn-date-preset">
                    +1 Week
                  </button>
                </div>
              </div>
              <input
                type="date"
                className="form-input"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            {/* Priority & Status Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Priority Level</label>
                <div className="radio-chip-group">
                  {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                    <label
                      key={p}
                      className={`radio-chip ${formData.priority === p ? `radio-active-${p.toLowerCase()}` : ''}`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={formData.priority === p}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="PENDING">Pending (To Do)</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
