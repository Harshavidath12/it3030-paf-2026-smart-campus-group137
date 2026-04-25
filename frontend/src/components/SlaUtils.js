// Fixed 5-hour SLA window, starts when technician is assigned (ticket moves to IN_PROGRESS)
export const SLA_HOURS = 5;
const SLA_MS = SLA_HOURS * 3600 * 1000;

// Returns { deadlineMs, totalMs, remainingMs, pct, color, label, breached, isResolved, started }
export function getSlaInfo(ticket) {
  const isResolved = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED';
  const isAssigned = ticket.assigneeId != null;

  // Timer starts only once a technician is assigned
  if (!isAssigned && !isResolved) {
    return {
      started: false,
      breached: false,
      pct: 100,
      color: '#6b7280',
      label: 'Waiting for technician assignment',
      isResolved: false,
    };
  }

  // Use updatedAt as the assignment time (backend sets it when assignee is set)
  const startMs = new Date(ticket.updatedAt).getTime();
  const deadlineMs = startMs + SLA_MS;
  const endMs = isResolved && ticket.resolvedAt
    ? new Date(ticket.resolvedAt).getTime()
    : Date.now();

  const remainingMs = deadlineMs - endMs;
  const pct = Math.max(0, Math.min(100, (remainingMs / SLA_MS) * 100));
  const breached = remainingMs < 0;

  let color = '#10b981'; // green > 50%
  if (breached) color = '#ef4444';
  else if (pct < 25) color = '#f59e0b'; // yellow < 25%

  const deadline = new Date(deadlineMs);
  const label = isResolved
    ? `Resolved in ${formatDuration(endMs - startMs)}`
    : breached
    ? `SLA Breached — ${formatDuration(-remainingMs)} overdue`
    : `Expected by ${deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${isToday(deadline) ? 'today' : deadline.toLocaleDateString()}`;

  return { deadlineMs, totalMs: SLA_MS, remainingMs, pct, color, label, breached, isResolved, started: true };
}

function isToday(date) {
  const now = new Date();
  return date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
}

function formatDuration(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// Compute SLA compliance for resolved tickets (resolved within 5h of assignment)
export function computeSlaCompliance(tickets) {
  const resolved = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED');
  if (resolved.length === 0) return null;
  const onTime = resolved.filter(t => {
    const startMs = new Date(t.updatedAt).getTime();
    const resolvedMs = t.resolvedAt ? new Date(t.resolvedAt).getTime() : startMs;
    return (resolvedMs - startMs) <= SLA_MS;
  });
  return Math.round((onTime.length / resolved.length) * 100);
}
