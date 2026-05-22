import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useTasks } from './context/TaskContext';
import { AuthModal } from './components/AuthModal';
import { Sidebar } from './components/Sidebar';
import { StatsCard } from './components/StatsCard';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { Search, Plus, Loader2, Grid, List as ListIcon, HelpCircle } from 'lucide-react';
export const App = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { filters, setFilters, deleteTask } = useTasks();
  
  const [view, setView] = useState('kanban'); // kanban or list
  const [activeTask, setActiveTask] = useState(null); // task currently being edited
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenNewTask = () => {
    setActiveTask(null);
    setIsModalOpen(true);
  };
  const handleOpenEditTask = (task) => {
    setActiveTask(task);
    setIsModalOpen(true);
  };
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to permanently delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (err) {
        alert('Failed to delete task. Please try again.');
      }
    }
  };
  // Render Loader while checking session
  if (authLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loaderBox} className="glass-panel">
          <Loader2 size={36} color="#8b5cf6" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <h3 style={styles.loadingText}>Synchronizing Secure Workspace...</h3>
        </div>
      </div>
    );
  }
  // Render Login overlay if unauthenticated
  if (!isAuthenticated) {
    return <AuthModal />;
  }
  return (
    <div className="app-container" style={styles.app}>
      {/* Sidebar navigation */}
      <Sidebar 
        view={view} 
        setView={setView} 
        onOpenNewTaskModal={handleOpenNewTask} 
      />
      {/* Main workspace area */}
      <main style={styles.mainContent}>
        {/* Workspace header */}
        <header style={styles.header}>
          <div style={styles.headerTitleGroup}>
            <h1 style={styles.headerTitle}>Task Workspace</h1>
            <p style={styles.headerSubtitle}>Manage your deliverables and synchronize project tasks</p>
          </div>
          
          <button 
            onClick={handleOpenNewTask} 
            className="btn-primary" 
            style={styles.headerAddBtn}
            id="header-new-task-btn"
          >
            <Plus size={16} />
            <span>Create Task</span>
          </button>
        </header>
        {/* Search & Sort Panel */}
        <div style={styles.searchBarRow} className="glass-panel">
          <div style={styles.searchWrapper}>
            <Search size={16} color="#6b7280" style={styles.searchIcon} />
            <input
              id="task-search-input"
              type="text"
              placeholder="Search tasks, descriptions, backlogs..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              style={styles.searchInput}
            />
          </div>
          
          <div style={styles.sortWrapper}>
            <label htmlFor="task-sort-select" style={styles.sortLabel}>Sort By:</label>
            <select
              id="task-sort-select"
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              style={styles.sortSelect}
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority Weight</option>
              <option value="title">Alphabetical (A-Z)</option>
              <option value="createdAt">Date Created</option>
            </select>
          </div>
        </div>
        {/* Stats Grid */}
        <StatsCard />
        {/* Workspace Body - Boards or List */}
        <section style={styles.workspaceSection}>
          {view === 'kanban' ? (
            <KanbanBoard 
              onEditTask={handleOpenEditTask}
              onDeleteTask={handleDeleteTask}
              onOpenNewTaskModal={handleOpenNewTask}
            />
          ) : (
            <TaskList 
              onEditTask={handleOpenEditTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </section>
      </main>
      {/* Task Modal Popup */}
      {isModalOpen && (
        <TaskModal 
          task={activeTask}
          onClose={() => {
            setIsModalOpen(false);
            setActiveTask(null);
          }}
        />
      )}
    </div>
  );
};
const styles = {
  app: {
    background: 'var(--bg-primary)',
    color: '#fff',
  },
  loadingContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-primary)',
  },
  loaderBox: {
    padding: '30px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  loadingText: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#9ca3af',
  },
  mainContent: {
    padding: '40px 30px',
    overflowY: 'auto',
    height: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerTitleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  headerTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    background: 'linear-gradient(to right, #ffffff, #9ca3af)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: '1.2',
  },
  headerSubtitle: {
    fontSize: '0.88rem',
    color: '#6b7280',
  },
  headerAddBtn: {
    padding: '10px 18px',
    fontSize: '0.88rem',
    borderRadius: '8px',
  },
  searchBarRow: {
    display: 'flex',
    padding: '12px 16px',
    borderRadius: '12px',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '24px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    maxWidth: '460px',
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px 8px 36px',
    fontSize: '0.88rem',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.02)',
  },
  sortWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sortLabel: {
    fontSize: '0.8rem',
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  sortSelect: {
    padding: '8px 30px 8px 12px',
    fontSize: '0.85rem',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.03) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239ca3af\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E") no-repeat right 8px center',
    backgroundSize: '14px',
    appearance: 'none',
  },
  workspaceSection: {
    marginTop: '10px',
  },
};
// CSS animations keyframe injectors
const injectAnimations = () => {
  if (typeof document === 'undefined') return;
  const styleId = 'global-keyframes-styles';
  if (document.getElementById(styleId)) return;
  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `;
  document.head.appendChild(style);
};
injectAnimations();
export default App;
