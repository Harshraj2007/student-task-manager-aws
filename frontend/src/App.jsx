import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import AssignmentCard from './components/AssignmentCard';
import KanbanBoard from './components/KanbanBoard';
import AssignmentModal from './components/AssignmentModal';
import { api } from './services/api';
import { Search, LayoutGrid, Columns, Plus, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { formatDeadline } from './utils/dateUtils';

export default function App() {
  const [assignments, setAssignments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState(false);

  // View state: 'kanban' or 'grid'
  const [viewMode, setViewMode] = useState('kanban');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState('ALL'); // ALL, HIGH_PRIORITY, OVERDUE, DUE_SOON
  const [subjectFilter, setSubjectFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState('PENDING');

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [health, sum, list] = await Promise.all([
        api.checkHealth().catch(() => null),
        api.getDashboardSummary().catch(() => null),
        api.getAssignments().catch(() => []),
      ]);

      setBackendHealthy(!!health);
      setSummary(sum);
      setAssignments(list);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute distinct subjects for the dropdown
  const distinctSubjects = useMemo(() => {
    const subjects = new Set();
    assignments.forEach((a) => {
      if (a.subject) subjects.add(a.subject.trim());
    });
    return Array.from(subjects);
  }, [assignments]);

  // Compute overdue count
  const overdueCount = useMemo(() => {
    return assignments.filter((a) => {
      if (a.status === 'COMPLETED') return false;
      const d = formatDeadline(a.dueDate);
      return d.isOverdue;
    }).length;
  }, [assignments]);

  // Filtered assignments based on search, subject, and quick filter
  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesSubject = item.subject?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSubject && !matchesDesc) return false;
      }

      // Subject Dropdown Filter
      if (subjectFilter !== 'ALL' && item.subject !== subjectFilter) {
        return false;
      }

      // Quick Filter
      if (quickFilter === 'HIGH_PRIORITY') {
        if (item.priority !== 'HIGH') return false;
      } else if (quickFilter === 'OVERDUE') {
        if (item.status === 'COMPLETED') return false;
        const d = formatDeadline(item.dueDate);
        if (!d.isOverdue) return false;
      } else if (quickFilter === 'DUE_SOON') {
        if (item.status === 'COMPLETED') return false;
        const d = formatDeadline(item.dueDate);
        if (!d.isSoon && !d.isOverdue) return false;
      }

      return true;
    });
  }, [assignments, searchQuery, subjectFilter, quickFilter]);

  // Handlers
  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingAssignment) {
        await api.updateAssignment(editingAssignment.id, formData);
      } else {
        await api.createAssignment(formData);
      }
      setIsModalOpen(false);
      setEditingAssignment(null);
      await loadData();
    } catch (err) {
      alert(err.message || 'Error saving assignment');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment from PostgreSQL?')) {
      try {
        await api.deleteAssignment(id);
        await loadData();
      } catch (err) {
        alert('Failed to delete assignment');
      }
    }
  };

  const handleStatusChange = async (assignment, newStatus) => {
    try {
      // Optimistic UI update
      setAssignments((prev) =>
        prev.map((a) => (a.id === assignment.id ? { ...a, status: newStatus } : a))
      );
      await api.updateAssignment(assignment.id, {
        ...assignment,
        status: newStatus,
      });
      await loadData();
    } catch (err) {
      alert('Failed to update status');
      loadData();
    }
  };

  const openCreateWithStatus = (status = 'PENDING') => {
    setEditingAssignment(null);
    setDefaultStatusForNew(status);
    setIsModalOpen(true);
  };

  return (
    <div className="app-layout">
      <Navbar
        backendHealthy={backendHealthy}
        onRefresh={loadData}
        isRefreshing={isRefreshing}
        onOpenCreate={() => openCreateWithStatus('PENDING')}
      />

      <main className="main-content">
        {/* Top Analytics Summary */}
        <StatsCards summary={summary} overdueCount={overdueCount} />

        {/* Action & Filter Toolbar */}
        <div className="toolbar-card">
          <div className="toolbar-row">
            {/* Search Input */}
            <div className="search-input-wrap">
              <Search size={17} className="search-icon" />
              <input
                type="text"
                placeholder="Search by title, subject, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>
                  ×
                </button>
              )}
            </div>

            {/* Subject Selector */}
            <select
              className="toolbar-select"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="ALL">All Courses ({distinctSubjects.length})</option>
              {distinctSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* View Switcher Toggle */}
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'kanban' ? 'toggle-active' : ''}`}
                onClick={() => setViewMode('kanban')}
                title="Kanban Board View"
              >
                <Columns size={16} />
                <span>Kanban Board</span>
              </button>
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'toggle-active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Card Grid View"
              >
                <LayoutGrid size={16} />
                <span>Card Grid</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Chips Row */}
          <div className="quick-filter-row">
            <span className="filter-label">Quick Filters:</span>
            <button
              className={`filter-pill ${quickFilter === 'ALL' ? 'pill-active' : ''}`}
              onClick={() => setQuickFilter('ALL')}
            >
              All Tasks ({assignments.length})
            </button>
            <button
              className={`filter-pill ${quickFilter === 'HIGH_PRIORITY' ? 'pill-active' : ''}`}
              onClick={() => setQuickFilter('HIGH_PRIORITY')}
            >
              🔥 High Priority
            </button>
            <button
              className={`filter-pill ${quickFilter === 'DUE_SOON' ? 'pill-active' : ''}`}
              onClick={() => setQuickFilter('DUE_SOON')}
            >
              ⏰ Due Soon
            </button>
            {overdueCount > 0 && (
              <button
                className={`filter-pill pill-overdue ${quickFilter === 'OVERDUE' ? 'pill-active-overdue' : ''}`}
                onClick={() => setQuickFilter('OVERDUE')}
              >
                ⚠️ Overdue ({overdueCount})
              </button>
            )}
          </div>
        </div>

        {/* Content Body: Kanban Board or Card Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Connecting to AWS EC2 &amp; Amazon RDS PostgreSQL...</p>
          </div>
        ) : filteredAssignments.length > 0 ? (
          viewMode === 'kanban' ? (
            <KanbanBoard
              assignments={filteredAssignments}
              onEdit={(a) => {
                setEditingAssignment(a);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onOpenCreateWithStatus={openCreateWithStatus}
            />
          ) : (
            <div className="assignments-grid">
              {filteredAssignments.map((item) => (
                <AssignmentCard
                  key={item.id}
                  assignment={item}
                  onEdit={(a) => {
                    setEditingAssignment(a);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )
        ) : (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <BookOpen size={40} />
            </div>
            <h3>No assignments match your filter</h3>
            <p>Try resetting your search query or create a new assignment.</p>
            <div className="empty-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearchQuery('');
                  setQuickFilter('ALL');
                  setSubjectFilter('ALL');
                }}
              >
                Clear Filters
              </button>
              <button
                className="btn btn-primary"
                onClick={() => openCreateWithStatus('PENDING')}
              >
                <Plus size={16} />
                <span>Create Assignment</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAssignment(null);
        }}
        onSave={handleCreateOrUpdate}
        editingAssignment={editingAssignment}
        defaultStatus={defaultStatusForNew}
      />
    </div>
  );
}
