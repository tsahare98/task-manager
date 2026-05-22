import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Calendar, Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react';
export const TaskList = ({ onEditTask, onDeleteTask }) => {
  const { filteredTasks, updateTask } = useTasks();
  // Helper to format due date
  const formatDueDate = (dateString) => {
    if (!dateString) return 'No due date';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const handleStatusToggle = async (task) => {
    const nextStatusMap = {
      'todo': 'in_progress',
      'in_progress': 'completed',
      'completed': 'todo'
    };
    const nextStatus = nextStatusMap[task.status] || 'todo';
    
    try {
      await updateTask(task.id, { status: nextStatus });
    } catch (err) {
      console.error('Failed to toggle task status:', err);
    }
  };
  if (filteredTasks.length === 0) {
    return (
      <div className="glass-panel" style={styles.emptyContainer}>
        <p style={styles.emptyText}>No tasks match the active filters or search criteria.</p>
      </div>
    );
  }
  return (
    <div style={styles.container}>
      {/* Header Row for large screens */}
      <div style={styles.headerRow} className="glass-panel">
        <div style={styles.colTitle}>Task Details</div>
        <div style={styles.colStatus}>Status</div>
        <div style={styles.colPriority}>Priority</div>
        <div style={styles.colDate}>Due Date</div>
        <div style={styles.colActions}>Actions</div>
      </div>
      {/* Task Rows */}
      <div style={styles.rowsList}>
        {filteredTasks.map((task) => (
          <div 
            key={task.id} 
            className="glass-panel glass-panel-interactive animate-scale-up" 
            style={styles.taskRow}
            id={`task-row-${task.id}`}
          >
            {/* Title & Checkbox */}
            <div style={styles.detailsGroup}>
              <button 
                onClick={() => handleStatusToggle(task)}
                style={styles.checkboxBtn}
                title="Toggle status"
                id={`task-row-check-${task.id}`}
              >
                {task.status === 'completed' ? (
                  <CheckCircle2 size={18} color="var(--color-completed)" />
                ) : (
                  <Circle size={18} color="#4b5563" />
                )}
              </button>
              
              <div style={styles.titleTextContainer}>
                <h4 
                  style={{
                    ...styles.title,
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    color: task.status === 'completed' ? 'var(--text-muted)' : '#fff'
                  }}
                >
                  {task.title}
                </h4>
                {task.description && (
                  <p style={styles.description}>{task.description}</p>
                )}
              </div>
            </div>
            {/* Status badge */}
            <div style={styles.statusGroup}>
              <span style={styles.mobileLabel}>Status:</span>
              <span 
                onClick={() => handleStatusToggle(task)}
                style={{
                  ...styles.statusBadge,
                  borderColor: 
                    task.status === 'todo' ? 'var(--color-todo)' : 
                    task.status === 'in_progress' ? 'var(--color-progress)' : 
                    'var(--color-completed)'
                }}
              >
                <span className={`status-dot status-${task.status === 'in_progress' ? 'progress' : task.status}`} />
                <span style={{ textTransform: 'capitalize' }}>
                  {task.status.replace('_', ' ')}
                </span>
              </span>
            </div>
            {/* Priority badge */}
            <div style={styles.priorityGroup}>
              <span style={styles.mobileLabel}>Priority:</span>
              <span className={`badge badge-${task.priority}`}>
                {task.priority}
              </span>
            </div>
            {/* Due date */}
            <div style={styles.dateGroup}>
              <span style={styles.mobileLabel}>Due Date:</span>
              <div style={styles.dateVal}>
                <Calendar size={13} style={{ marginRight: 6 }} color="#9ca3af" />
                <span>{formatDueDate(task.dueDate)}</span>
              </div>
            </div>
            {/* Action buttons */}
            <div style={styles.actionsGroup}>
              <button 
                onClick={() => onEditTask(task)} 
                style={styles.actionBtn}
                title="Edit details"
                id={`task-row-edit-${task.id}`}
              >
                <Edit2 size={13} color="#9ca3af" />
                <span style={styles.actionLabel}>Edit</span>
              </button>
              <button 
                onClick={() => onDeleteTask(task.id)} 
                style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                title="Remove task"
                id={`task-row-delete-${task.id}`}
              >
                <Trash2 size={13} color="#fda4af" />
                <span style={styles.actionLabel}>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  headerRow: {
    display: 'flex',
    padding: '12px 20px',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    color: '#6b7280',
    fontSize: '0.8rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  rowsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  taskRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  detailsGroup: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    flex: '2 1 0%',
    minWidth: '240px',
  },
  checkboxBtn: {
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    marginTop: '2px',
  },
  titleTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontSize: '0.95rem',
    fontWeight: '600',
  },
  description: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    wordBreak: 'break-word',
  },
  statusGroup: {
    flex: '1 1 0%',
    minWidth: '120px',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid',
    cursor: 'pointer',
  },
  priorityGroup: {
    flex: '1 1 0%',
    minWidth: '100px',
  },
  dateGroup: {
    flex: '1 1 0%',
    minWidth: '130px',
  },
  dateVal: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.82rem',
    color: '#9ca3af',
  },
  actionsGroup: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
    minWidth: '150px',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    color: '#9ca3af',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  actionLabel: {
    display: 'inline',
  },
  deleteBtn: {
    background: 'rgba(244, 63, 94, 0.08)',
    border: '1px solid rgba(244, 63, 94, 0.15)',
    color: '#fda4af',
  },
  mobileLabel: {
    display: 'none',
  },
  emptyContainer: {
    padding: '40px',
    textAlign: 'center',
  },
  emptyText: {
    color: '#9ca3af',
  },
};
// CSS media queries simulation for responsive row layout (handles mobile breakpoints)
const injectResponsiveStyles = () => {
  if (typeof document === 'undefined') return;
  const styleId = 'responsive-task-list-styles';
  if (document.getElementById(styleId)) return;
  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    @media (max-width: 768px) {
      div[style*="headerRow"] {
        display: none !important;
      }
      div[style*="taskRow"] {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 12px !important;
        padding: 16px !important;
      }
      div[style*="detailsGroup"] {
        width: 100% !important;
        min-width: 0 !important;
      }
      div[style*="statusGroup"], 
      div[style*="priorityGroup"], 
      div[style*="dateGroup"] {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        width: 100% !important;
        min-width: 0 !important;
      }
      span[style*="mobileLabel"] {
        display: inline !important;
        font-size: 0.75rem !important;
        font-weight: 700 !important;
        color: #6b7280 !important;
        text-transform: uppercase !important;
        width: 80px !important;
        flex-shrink: 0 !important;
      }
      div[style*="actionsGroup"] {
        width: 100% !important;
        justify-content: flex-start !important;
        padding-top: 10px !important;
        border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
      }
    }
  `;
  document.head.appendChild(style);
};
injectResponsiveStyles();
export default TaskList;
