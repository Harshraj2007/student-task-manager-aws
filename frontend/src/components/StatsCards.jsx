import React from 'react';
import { Layers, Clock, Flame, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function StatsCards({ summary, overdueCount = 0 }) {
  const completionRate = summary?.completionRate ?? 0;

  return (
    <div className="stats-section">
      {/* Semester Velocity Progress Bar */}
      <div className="progress-banner">
        <div className="progress-banner-header">
          <div className="progress-title">
            <span className="progress-sparkle">✨</span>
            <div>
              <strong>Semester Assignment Completion Velocity</strong>
              <span className="progress-subtitle">
                {summary?.completed ?? 0} of {summary?.total ?? 0} academic tasks finished
              </span>
            </div>
          </div>
          <div className="progress-percentage">{completionRate}% Done</div>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(100, Math.max(0, completionRate))}%` }}
          />
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">
            <Layers size={22} />
          </div>
          <div className="stat-details">
            <div className="stat-number">{summary?.total ?? 0}</div>
            <div className="stat-name">Total Assignments</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">
            <Clock size={22} />
          </div>
          <div className="stat-details">
            <div className="stat-number">{summary?.pending ?? 0}</div>
            <div className="stat-name">Pending / To Do</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-purple">
            <Flame size={22} />
          </div>
          <div className="stat-details">
            <div className="stat-number">{summary?.inProgress ?? 0}</div>
            <div className="stat-name">In Progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-emerald">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-details">
            <div className="stat-number">{summary?.completed ?? 0}</div>
            <div className="stat-name">Completed</div>
          </div>
        </div>
      </div>

      {/* Overdue Warning Callout (if any) */}
      {overdueCount > 0 && (
        <div className="overdue-callout">
          <AlertTriangle size={18} />
          <span>
            <strong>Attention:</strong> You have <strong>{overdueCount} overdue assignment{overdueCount > 1 ? 's' : ''}</strong> that require immediate submission!
          </span>
        </div>
      )}
    </div>
  );
}
