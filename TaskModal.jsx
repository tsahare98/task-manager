import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { X, Calendar, Type, FileText, CheckCircle2, AlertOctagon } from 'lucide-react';
export const TaskModal = ({ task, onClose }) => {
  const { createTask, updateTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isEditMode = !!task;
  // Initialize fields if editing
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      // Date input format: YYYY-MM-DD
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    }
  }, [task]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }
    setSubmitting(true);
    const taskPayload = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null
    };
    try {
      if (isEditMode) {
        await updateTask(task.id, taskPayload);
      } else {
        await createTask(taskPayload);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to persist task data. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div style={styles.overlay} className="animate-fade-in" id="task-modal-overlay">
      <div style={styles.card} className="glass-panel animate-scale-up">
        {/* Header */}
        <div style={styles.header}>
          <h3 style={styles.title}>{isEditMode ? 'Modify Task Details' : 'Create New Backlog Task'}</h3>
          <button onClick={onClose} style={styles.closeBtn} id="task-modal-close-btn">
            <X size={18} color="#9ca3af" />
          </button>
        </div>
        {/* Error notification */}
        {error && (
          <div style={styles.errorBox}>
            <AlertOctagon size={16} style={{ marginRight: 8, flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}
        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label htmlFor="task-title-input">Task Title</label>
            <div style={styles.inputWrapper}>
              <Type size={16} style={styles.inputIcon} />
              <input
                id="task-title-input"
                type="text"
                placeholder="Name your task or goal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="task-desc-input">Description</label>
            <div style={styles.inputWrapper}>
              <FileText size={16} style={{ ...styles.inputIcon, top: '14px' }} />
              <textarea
                id="task-desc-input"
                placeholder="Describe the objective or steps needed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ ...styles.input, ...styles.textarea }}
                rows="3"
              />
            </div>
          </div>
          {/* Side by side selections */}
          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="task-status-select">Stage</label>
              <select
                id="task-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={styles.select}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="task-priority-select">Priority</label>
              <select
                id="task-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={styles.select}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="task-date-input">Due Date</label>
            <div style={styles.inputWrapper}>
              <Calendar size={16} style={styles.inputIcon} />
              <input
                id="task-date-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>
          {/* Action Buttons */}
          <div style={styles.footerButtons}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary" 
              style={styles.btn}
              id="task-modal-cancel-btn"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting} 
              className="btn-primary" 
              style={styles.btn}
              id="task-modal-submit-btn"
            >
              {submitting ? 'Saving changes...' : (isEditMode ? 'Apply Updates' : 'Add Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(5, 7, 15, 0.75)',
    zIndex: 1001,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backdropFilter: 'blur(4px)',
  },
  card: {
    width: '100%',
    maxWidth: '520px',
    padding: '30px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  title: {
    fontSize: '1.25rem',
    color: '#fff',
    fontWeight: '600',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    }
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(244, 63, 94, 0.12)',
    border: '1px solid rgba(244, 63, 94, 0.25)',
    color: '#fda4af',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    color: '#6b7280',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    paddingLeft: '40px',
  },
  textarea: {
    resize: 'vertical',
    minHeight: '80px',
    paddingTop: '10px',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  select: {
    width: '100%',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.05) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239ca3af\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E") no-repeat right 12px center',
    backgroundSize: '16px',
    appearance: 'none',
    paddingRight: '36px',
  },
  footerButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '16px',
  },
  btn: {
    padding: '10px 20px',
    fontSize: '0.88rem',
  },
};
