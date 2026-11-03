export function formatDeadline(dueDateString) {
  if (!dueDateString) return { label: 'No deadline', isOverdue: false, isSoon: false, colorClass: 'text-muted' };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDateString);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      label: overdueDays === 1 ? 'Overdue by 1 day' : `Overdue by ${overdueDays} days`,
      isOverdue: true,
      isSoon: false,
      colorClass: 'deadline-overdue',
    };
  } else if (diffDays === 0) {
    return {
      label: 'Due Today',
      isOverdue: false,
      isSoon: true,
      colorClass: 'deadline-today',
    };
  } else if (diffDays === 1) {
    return {
      label: 'Due Tomorrow',
      isOverdue: false,
      isSoon: true,
      colorClass: 'deadline-soon',
    };
  } else if (diffDays <= 3) {
    return {
      label: `Due in ${diffDays} days`,
      isOverdue: false,
      isSoon: true,
      colorClass: 'deadline-soon',
    };
  } else {
    // Formatted date e.g. "Nov 12, 2026"
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return {
      label: due.toLocaleDateString(undefined, options),
      isOverdue: false,
      isSoon: false,
      colorClass: 'deadline-normal',
    };
  }
}

export function getSubjectColor(subject = '') {
  const s = subject.toLowerCase().trim();
  if (s.includes('cloud') || s.includes('aws')) return { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' };
  if (s.includes('dbms') || s.includes('database') || s.includes('sql')) return { bg: '#ede9fe', text: '#6d28d9', border: '#ddd6fe' };
  if (s.includes('network') || s.includes('cyber')) return { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' };
  if (s.includes('ai') || s.includes('ml') || s.includes('data')) return { bg: '#fef3c7', text: '#b45309', border: '#fde68a' };
  if (s.includes('web') || s.includes('dev') || s.includes('software')) return { bg: '#ffe4e6', text: '#be123c', border: '#fecdd3' };
  return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
}
