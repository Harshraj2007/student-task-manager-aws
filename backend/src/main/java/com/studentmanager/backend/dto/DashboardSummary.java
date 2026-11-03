package com.studentmanager.backend.dto;

public class DashboardSummary {
    private long total;
    private long pending;
    private long inProgress;
    private long completed;
    private long highPriority;
    private double completionRate;

    public DashboardSummary(long total, long pending, long inProgress, long completed, long highPriority) {
        this.total = total;
        this.pending = pending;
        this.inProgress = inProgress;
        this.completed = completed;
        this.highPriority = highPriority;
        this.completionRate = total > 0 ? Math.round(((double) completed / total) * 100.0) : 0.0;
    }

    public long getTotal() { return total; }
    public long getPending() { return pending; }
    public long getInProgress() { return inProgress; }
    public long getCompleted() { return completed; }
    public long getHighPriority() { return highPriority; }
    public double getCompletionRate() { return completionRate; }
}
