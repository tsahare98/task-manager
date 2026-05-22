import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
export const KanbanBoard = ({ onEditTask, onDeleteTask, onOpenNewTaskModal }) => {
  const { filteredTasks, updateTask } = useTasks();
  const [activeOverColumn, setActiveOverColumn] = useState(null);
  const columns = [
    { id: 'todo', title: 'To Do', dotClass: 'status-todo', accentColor: 'var(--color-todo)' },
    { id: 'in_progress', title: 'In Progress', dotClass: 'status-progress', accentColor: 'var(--color-progress)' },
    { id: 'completed', title: 'Completed', dotClass: 'status-completed', accentColor: 'var(--color-completed)' }
  ];
  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setActiveOverColumn(columnId);
  };
  const handleDragLeave = () => {
    setActiveOverColumn(null);
  };
  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setActiveOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;
    try {
      await updateTask(taskId, { status: targetStatus });
      console.log(`Task ${taskId} moved to status: ${targetStatus}`);
    } catch (error) {
      console.error('Failed to drop and update task:', error);
    }
  };
  return (
    <div style={styles.board}>
      {columns.map((column) => {
        const columnTasks = filteredTasks.filter((t) => t.status === column.id);
        const isDragOver = activeOverColumn === column.id;
        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`glass-panel ${isDragOver ? 'column-drag-over' : ''}`}
            style={{
              ...styles.column,
              borderColor: isDragOver ? column.accentColor : 'rgba(255, 255, 255, 0.06)'
            }}
          >
            {/* Column Header */}
            <div style={styles.columnHeader}>
              <div style={styles.columnTitle}>
                <span className={`status-dot ${column.dotClass}`} />
                <h3 style={styles.columnText}>{column.title}</h3>
                <span style={styles.columnCount}>{columnTasks.length}</span>
              </div>
              
              {column.id === 'todo' && (
                <button 
                  onClick={() => onOpenNewTaskModal()} 
                  style={styles.addBtn}
                  title="Add new task to backlog"
                >
                  <Plus size={16} color="#9ca3af" />
                </button>
              )}
            </div>
            {/* Tasks Container */}
            <div style={styles.tasksList}>
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))
              ) : (
                <div style={styles.emptyState}>
                  <p style={styles.emptyText}>
                    {isDragOver ? 'Drop here to update status' : 'No tasks in this stage'}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
const styles = {
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    alignItems: 'stretch',
    minHeight: '400px',
  },
  column: {
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    background: 'rgba(255, 255, 255, 0.015)',
    transition: 'background-color 0.2s, border-color 0.2s',
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  columnTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  columnText: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#fff',
  },
  columnCount: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  addBtn: {
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
  },
  tasksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    flexGrow: 1,
    minHeight: '200px',
    overflowY: 'auto',
  },
  emptyState: {
    flexGrow: 1,
    border: '2px dashed rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '120px',
    padding: '20px',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: '0.8rem',
    color: '#4b5563',
  },
};
