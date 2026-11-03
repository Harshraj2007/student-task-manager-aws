import React from 'react';
import { BookOpen, Plus, Cloud, Database, Server, RefreshCw } from 'lucide-react';

export default function Navbar({ onOpenCreate, backendHealthy, onRefresh, isRefreshing }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand-group">
          <div className="brand-logo">
            <BookOpen size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div className="brand-headline">
              <span className="brand-title">Student Task Manager</span>
              <span className="brand-version">v2.0 • AWS Cloud</span>
            </div>
            <div className="brand-architecture">
              <span className="arch-badge">
                <Server size={11} /> EC2: Spring Boot 3
              </span>
              <span className="arch-badge">
                <Database size={11} /> RDS: PostgreSQL
              </span>
              <span className="arch-badge">
                <Cloud size={11} /> S3 + CloudFront
              </span>
            </div>
          </div>
        </div>

        <div className="nav-actions">
          <div className={`status-pill ${backendHealthy ? 'status-online' : 'status-offline'}`}>
            <span className="status-ping" />
            <span className="status-label">
              {backendHealthy ? 'AWS API Connected' : 'Connecting to API...'}
            </span>
          </div>

          <button
            className="btn btn-ghost btn-icon"
            onClick={onRefresh}
            title="Refresh assignments"
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
          </button>

          <button className="btn btn-primary" onClick={onOpenCreate}>
            <Plus size={18} strokeWidth={2.5} />
            <span>New Assignment</span>
          </button>
        </div>
      </div>
    </header>
  );
}
