import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { 
  CheckSquare, 
  LayoutGrid, 
  List, 
  LogOut, 
  User, 
  SlidersHorizontal,
  CircleDot,
  BarChart2
} from 'lucide-react';
export const Sidebar = ({ view, setView, onOpenNewTaskModal }) => {
  const { user, logout } = useAuth();
  const { stats, filters, setFilters } = useTasks();
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  // SVG circular loader properties
  const radius = 24;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (stats.completionRate / 100) * circumference;
  return (
    <aside style={styles.sidebar} className="glass-panel">
      {/* Brand Header */}
      <div style={styles.brand}>
        <div style={styles.logoContainer}>
          <CheckSquare size={22} color="white" />
        </div>
        <span style={styles.brandName}>AetherFlow</span>
      </div>
      {/* User Info */}
      <div style={styles.profileBox}>
        <div style={styles.avatar}>
          <User size={18} color="#a78bfa" />
        </div>
        <div style={styles.profileDetails}>
          <span style={styles.profileName}>{user?.name || 'Workspace User'}</span>
          <span style={styles.profileEmail}>{user?.email || 'free-tier'}</span>
        </div>
      </div>
      {/* Dynamic Completion Ring */}
      <div style={styles.statsRingContainer}>
        <svg height={radius * 2} width={radius * 2} style={styles.svg}>
          <circle
            stroke="rgba(255, 255, 255, 0.05)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="url(#purplePinkGradient)"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <defs>
            <linearGradient id="purplePinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div style={styles.statsRingText}>
          <span style={styles.statsRingPct}>{stats.completionRate}%</span>
          <span style={styles.statsRingLabel}>Done</span>
        </div>
      </div>
      {/* Navigation View Modes */}
      <div style={styles.section}>
        <h4 style={styles.sectionHeader}>Layout Mode</h4>
        <div style={styles.viewToggles}>
          <button
            onClick={() => setView('kanban')}
            style={{
              ...styles.toggleBtn,
              ...(view === 'kanban' ? styles.toggleBtnActive : {})
            }}
          >
            <LayoutGrid size={16} />
            <span>Kanban Board</span>
          </button>
          <button
            onClick={() => setView('list')}
            style={{
              ...styles.toggleBtn,
              ...(view === 'list' ? styles.toggleBtnActive : {})
            }}
          >
            <List size={16} />
            <span>List View</span>
          </button>
        </div>
      </div>
      {/* Tasks Filters */}
      <div style={styles.section}>
        <h4 style={styles.sectionHeader}>
          <SlidersHorizontal size={12} style={{ marginRight: 6 }} />
          Status Filter
        </h4>
        <div style={styles.filterList}>
          {['all', 'todo', 'in_progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange('status', status)}
              style={{
                ...styles.filterItem,
                ...(filters.status === status ? styles.filterItemActive : {})
              }}
            >
              <CircleDot 
                size={12} 
                color={
                  status === 'todo' ? 'var(--color-todo)' : 
                  status === 'in_progress' ? 'var(--color-progress)' : 
                  status === 'completed' ? 'var(--color-completed)' : 
                  '#9ca3af'
                }
              />
              <span style={styles.filterText}>
                {status === 'all' && 'All Tasks'}
                {status === 'todo' && 'To Do'}
                {status === 'in_progress' && 'In Progress'}
                {status === 'completed' && 'Completed'}
              </span>
              <span style={styles.badgeCount}>
                {status === 'all' && stats.total}
                {status === 'todo' && stats.todo}
                {status === 'in_progress' && stats.inProgress}
                {status === 'completed' && stats.completed}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Priority Filters */}
      <div style={styles.section}>
        <h4 style={styles.sectionHeader}>Priority</h4>
        <div style={styles.prioritySelector}>
          {['all', 'low', 'medium', 'high'].map((priority) => (
            <button
              key={priority}
              onClick={() => handleFilterChange('priority', priority)}
              style={{
                ...styles.priorityChip,
                ...(filters.priority === priority ? styles.priorityChipActive : {}),
                borderColor: 
                  priority === 'low' ? 'rgba(56, 189, 248, 0.3)' : 
                  priority === 'medium' ? 'rgba(245, 158, 11, 0.3)' : 
                  priority === 'high' ? 'rgba(244, 63, 94, 0.3)' : 
                  'rgba(255, 255, 255, 0.1)'
              }}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>
      {/* Quick Add and Logout */}
      <div style={styles.footer}>
        <button 
          onClick={onOpenNewTaskModal} 
          className="btn-primary" 
          style={styles.addBtn}
          id="sidebar-new-task-btn"
        >
          + Add New Task
        </button>
        <button onClick={logout} style={styles.logoutBtn} id="sidebar-logout-btn">
          <LogOut size={16} />
          <span>Exit Workspace</span>
        </button>
      </div>
    </aside>
  );
};
const styles = {
  sidebar: {
    padding: '24px 20px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    borderRadius: 0,
    borderRight: '1px solid rgba(255, 255, 255, 0.06)',
    borderTop: 'none',
    borderBottom: 'none',
    borderLeft: 'none',
    overflowY: 'auto',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '28px',
  },
  logoContainer: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'var(--accent-gradient)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
  },
  brandName: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.3rem',
    fontWeight: '700',
    background: 'var(--accent-gradient)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  profileBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '12px',
    marginBottom: '20px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(167, 139, 250, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(167, 139, 250, 0.2)',
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  profileName: {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: '#f3f4f6',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  profileEmail: {
    fontSize: '0.75rem',
    color: '#6b7280',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  statsRingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 16px',
    background: 'var(--accent-gradient-glow)',
    border: '1px solid rgba(139, 92, 246, 0.15)',
    borderRadius: '16px',
    marginBottom: '24px',
  },
  svg: {
    transform: 'rotate(-90deg)',
    filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.4))',
  },
  statsRingText: {
    display: 'flex',
    flexDirection: 'column',
  },
  statsRingPct: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#fff',
    lineHeight: '1.2',
  },
  statsRingLabel: {
    fontSize: '0.72rem',
    color: '#c084fc',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '500',
  },
  section: {
    marginBottom: '22px',
  },
  sectionHeader: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  viewToggles: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  toggleBtn: {
    background: 'transparent',
    border: '1px solid transparent',
    color: '#9ca3af',
    padding: '10px 12px',
    borderRadius: '8px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.88rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease',
  },
  toggleBtnActive: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#fff',
  },
  filterList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  filterItem: {
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    padding: '8px 10px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    cursor: 'pointer',
    fontSize: '0.88rem',
    textAlign: 'left',
    transition: 'all 0.15s ease',
  },
  filterItemActive: {
    background: 'rgba(255, 255, 255, 0.03)',
    color: '#fff',
    fontWeight: '500',
  },
  filterText: {
    marginLeft: '10px',
    flexGrow: 1,
  },
  badgeCount: {
    fontSize: '0.75rem',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#9ca3af',
    padding: '2px 6px',
    borderRadius: '6px',
  },
  prioritySelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '4px',
  },
  priorityChip: {
    background: 'transparent',
    border: '1px solid',
    color: '#9ca3af',
    padding: '6px 0',
    borderRadius: '6px',
    fontSize: '0.72rem',
    textTransform: 'capitalize',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s',
  },
  priorityChipActive: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#fff',
    fontWeight: '600',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.05)',
  },
  footer: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingTop: '20px',
  },
  addBtn: {
    width: '100%',
    padding: '12px',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid transparent',
    color: '#9ca3af',
    width: '100%',
    padding: '10px',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};
