import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/jsonDb.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'glassmorphic-super-secret-key-123!';
// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please enter all fields (name, email, password)' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    // Check if user already exists
    const existingUser = db.findOne('users', { email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    // Create user
    const newUser = db.insert('users', {
      name,
      email: email.toLowerCase(),
      passwordHash
    });
    // Create JWT
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server registration error' });
  }
});
// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password' });
    }
    // Check if user exists
    const user = db.findOne('users', { email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials. User does not exist.' });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials. Password incorrect.' });
    }
    // Create JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server login error' });
  }
});
// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.findOne('users', { id: req.user.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ error: 'Server profile fetching error' });
  }
});
export default router;