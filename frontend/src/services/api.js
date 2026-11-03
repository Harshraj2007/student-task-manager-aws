const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? '/api'
  : 'http://65.0.6.148:8080/api';

export const api = {
  // Get all assignments with optional filters
  async getAssignments(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.subject) params.append('subject', filters.subject);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/assignments${query}`);
    if (!res.ok) throw new Error('Failed to fetch assignments');
    return res.json();
  },

  // Get single assignment
  async getAssignment(id) {
    const res = await fetch(`${API_BASE}/assignments/${id}`);
    if (!res.ok) throw new Error('Failed to fetch assignment');
    return res.json();
  },

  // Create new assignment
  async createAssignment(data) {
    const res = await fetch(`${API_BASE}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create assignment');
    }
    return res.json();
  },

  // Update existing assignment
  async updateAssignment(id, data) {
    const res = await fetch(`${API_BASE}/assignments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update assignment');
    return res.json();
  },

  // Delete assignment
  async deleteAssignment(id) {
    const res = await fetch(`${API_BASE}/assignments/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok && res.status !== 204) throw new Error('Failed to delete assignment');
    return true;
  },

  // Get dashboard metrics
  async getDashboardSummary() {
    const res = await fetch(`${API_BASE}/dashboard/summary`);
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    return res.json();
  },

  // Health check
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Backend health check failed');
    return res.json();
  },
};
