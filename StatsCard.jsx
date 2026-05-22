import React from 'react';
import { useTasks } from '../context/TaskContext';
import { ClipboardList, CheckCircle2, Flame, AlertCircle } from 'lucide-react';
export const StatsCard = () => {
  const { stats } = useTasks();
  const cards = [
    {
      title: 'Total Backlog',
      value: stats.total,
      icon: ClipboardList,
      color: '#8b5cf6',
      bgGlow: 'rgba(139, 92, 246, 0.1)',
      borderColor: 'rgba(139, 92, 246, 0.2)'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Flame,
      color: '#fbbf24',
      bgGlow: 'rgba(251, 191, 36, 0.1)',
      borderColor: 'rgba(251, 191, 36, 0.2)'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: '#34d399',
      bgGlow: 'rgba(52, 211, 153, 0.1)',
      borderColor: 'rgba(52, 211, 153, 0.2)'
    },
    {
      title: 'Urgent Action',
      value: stats.highPriority,
      icon: AlertCircle,
      color: '#f43f5e',
      bgGlow: 'rgba(244, 63, 94, 0.1)',
      borderColor: 'rgba(244, 63, 94, 0.2)'
    }
  ];
  return (
    <div style={styles.grid}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={index} 
            className="glass-panel glass-panel-interactive" 
            style={{
              ...styles.card,
              borderColor: card.borderColor,
              boxShadow: `0 8px 32px 0 rgba(0,0,0,0.2), 0 0 15px ${card.bgGlow}`
            }}
          >
            <div style={styles.cardHeader}>
              <span style={styles.title}>{card.title}</span>
              <div 
                style={{
                  ...styles.iconContainer,
                  background: card.bgGlow,
                  borderColor: card.borderColor
                }}
              >
                <Icon size={18} color={card.color} />
              </div>
            </div>
            <div style={styles.valueContainer}>
              <span style={styles.value}>{card.value}</span>
              {card.title === 'Completed' && stats.total > 0 && (
                <span style={styles.subtext}>{stats.completionRate}% completion rate</span>
              )}
              {card.title === 'Urgent Action' && card.value > 0 && (
                <span style={{ ...styles.subtext, color: 'var(--color-high)' }}>High priority active</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '28px',
  },
  card: {
    padding: '20px',
    border: '1px solid',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  title: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  iconContainer: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  value: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'var(--font-display)',
    lineHeight: '1',
  },
  subtext: {
    fontSize: '0.75rem',
    color: '#6b7280',
  },
};
