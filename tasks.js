import express from 'express';
import { db } from '../db/jsonDb.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();
// GET all tasks for the logged-in user
router.get('/', authenticateToken, (req, res) => {
  try {
    const tasks = db.find('tasks', { userId: req.user.userId });
    
    // Sort by createdAt descending by default
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});
// CREATE a new task
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }
    const newTask = db.insert('tasks', {
      title,
      description: description || '',
      status: status || 'todo', // todo, in_progress, completed
      priority: priority || 'medium', // low, medium, high
      dueDate: dueDate || null,
      userId: req.user.userId
    });
    // Notify other active client connections for this user
    if (req.broadcast) {
      req.broadcast({
        type: 'TASK_CREATED',
        payload: newTask,
        userId: req.user.userId
      });
    }
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});
// UPDATE a task
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;
    // Verify task exists and belongs to the user
    const task = db.findOne('tasks', { id, userId: req.user.userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    const updatedTasks = db.update('tasks', { id, userId: req.user.userId }, updates);
    const updatedTask = updatedTasks[0];
    // Notify other active client connections for this user
    if (req.broadcast) {
      req.broadcast({
        type: 'TASK_UPDATED',
        payload: updatedTask,
        userId: req.user.userId
      });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});
// DELETE a task
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    // Verify task exists and belongs to user
    const task = db.findOne('tasks', { id, userId: req.user.userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    db.delete('tasks', { id, userId: req.user.userId });
    // Notify other active client connections for this user
    if (req.broadcast) {
      req.broadcast({
        type: 'TASK_DELETED',
        payload: { id },
        userId: req.user.userId
      });
    }
    res.json({ message: 'Task deleted successfully', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});
export default router;
