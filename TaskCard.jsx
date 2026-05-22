import React from 'react';
import { Calendar, Trash2, Edit2, AlertTriangle, CheckCircle2 } from 'lucide-react';
export const TaskCard = ({ task, onEdit, onDelete }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };
  // Helper to format due date
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  // Check if task is overdue
  const isOverdue = () => {
    if (!task.dueDate || task.status === 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    return due < today;
  };
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="glass-panel glass-panel-interactive animate-scale-up"
      style={styles.card}
      id={`task-card-${task.id}`}
    >
      {/* Priority Pill & Quick Edit/Delete */}
      <div style={styles.cardHeader}>
        <span className={`badge badge-${task.priority}`}>
          {task.priority}
        </span>
        
        <div style={styles.actions}>
          <button 
            onClick={() => onEdit(task)} 
            style={styles.actionBtn}
            title="Edit Task"
            id={`task-card-edit-${task.id}`}
          >
            <Edit2 size={13} color="#9ca3af" />
          </button>
          <button 
            onClick={() => onDelete(task.id)} 
            style={{ ...styles.actionBtn, ...styles.deleteBtn }}
            title="Delete Task"
            id={`task-card-delete-${task.id}`}
          >
            <Trash2 size={13} color="#fda4af" />
          </button>
        </div>
      </div>
      {/* Task Content */}
      <div style={styles.content}>
        <h4 style={styles.title}>{task.title}</h4>
        {task.description && (
          <p style={styles.description}>
            {task.description.length > 80 
              ? `${task.description.substring(0, 80)}...` 
              : task.description}
          </p>
        )}
      </div>
      {/* Card Footer (Due Date / Status Indicators) */}
      <div style={styles.footer}>
        {task.dueDate ? (
          <div 
            style={{
              ...styles.dateBadge,
              ...(isOverdue() ? styles.overdue : {}),
              ...(task.status === 'completed' ? styles.completedDate : {})
            }}
          >
            {isOverdue() ? (
              <AlertTriangle size={12} color="#fb7185" style={{ marginRight: 4 }} />
            ) : (
              <Calendar size={12} style={{ marginRight: 4 }} />
            )}
            <span>{formatDueDate(task.dueDate)}</span>
          </div>
        ) : (
          <div style={{ flexGrow: 1 }} />
        )}
        <div style={styles.statusIndicator}>
          {task.status === 'completed' && (
            <CheckCircle2 size={14} color="var(--color-completed)" />
          )}
          <span 
            className={`status-dot status-${
              task.status === 'in_progress' ? 'progress' : task.status
            }`} 
          />
        </div>
      </div>
    </div>
  );
};
const styles = {
  card: {
    padding: '16px',
    cursor: 'grab',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    userSelect: 'none',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    display: 'flex',
    gap: '6px',
  },
  actionBtn: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  deleteBtn: {
    background: 'rgba(244, 63, 94, 0.08)',
    border: '1px solid rgba(244, 63, 94, 0.15)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  title: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#fff',
    lineHeight: '1.4',
  },
  description: {
    fontSize: '0.82rem',
    color: '#9ca3af',
    lineHeight: '1.5',
    wordBreak: 'break-word',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '8px',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
  },
  dateBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.75rem',
    color: '#9ca3af',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '3px 8px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
  },
  overdue: {
    background: 'rgba(244, 63, 94, 0.08)',
    borderColor: 'rgba(244, 63, 94, 0.2)',
    color: '#fda4af',
  },
  completedDate: {
    color: 'rgba(52, 211, 153, 0.6)',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
};
