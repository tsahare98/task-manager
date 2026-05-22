import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { wsService } from '../services/websocket';
import { useAuth } from './AuthContext';
const TaskContext = createContext(null);
export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all', // all, todo, in_progress, completed
    priority: 'all', // all, low, medium, high
    sortBy: 'dueDate' // dueDate, priority, title, createdAt
  });
  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const data = await api.tasks.getAll();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoadingTasks(false);
    }
  };
  // Sync tasks via WebSocket on authentication
  useEffect(() => {
    if (!isAuthenticated) {
      setTasks([]);
      return;
    }
    fetchTasks();
    const unsubscribe = wsService.subscribe((message) => {
      console.log('Real-time WS event received in context:', message);
      
      switch (message.type) {
        case 'TASK_CREATED':
          setTasks((prev) => {
            // Avoid duplicates
            if (prev.some((t) => t.id === message.payload.id)) return prev;
            return [message.payload, ...prev];
          });
          break;
        case 'TASK_UPDATED':
          setTasks((prev) =>
            prev.map((t) => (t.id === message.payload.id ? message.payload : t))
          );
          break;
        case 'TASK_DELETED':
          setTasks((prev) => prev.filter((t) => t.id !== message.payload.id));
          break;
        default:
          break;
      }
    });
    return () => {
      unsubscribe();
    };
  }, [isAuthenticated]);
  const createTask = async (taskData) => {
    try {
      const newTask = await api.tasks.create(taskData);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  };
  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await api.tasks.update(id, taskData);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedTask : t))
      );
      return updatedTask;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };
  const deleteTask = async (id) => {
    try {
      await api.tasks.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };
  // Computed / filtered task listing
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    // Filter by search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    // Filter by status
    if (filters.status !== 'all') {
      result = result.filter((t) => t.status === filters.status);
    }
    // Filter by priority
    if (filters.priority !== 'all') {
      result = result.filter((t) => t.priority === filters.priority);
    }
    // Sorting logic
    result.sort((a, b) => {
      if (filters.sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      
      if (filters.sortBy === 'priority') {
        const priorityWeights = { high: 3, medium: 2, low: 1 };
        const weightA = priorityWeights[a.priority] || 0;
        const weightB = priorityWeights[b.priority] || 0;
        return weightB - weightA; // High priority first
      }
      if (filters.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (filters.sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
      }
      return 0;
    });
    return result;
  }, [tasks, filters]);
  // Statistics calculation for Dashboard
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const highPriority = tasks.filter((t) => t.priority === 'high' && t.status !== 'completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, todo, highPriority, completionRate };
  }, [tasks]);
  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        loadingTasks,
        filters,
        setFilters,
        createTask,
        updateTask,
        deleteTask,
        stats,
        refresh: fetchTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
