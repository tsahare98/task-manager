import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Sparkles, Loader2 } from 'lucide-react';
export const AuthModal = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };
  const toggleTab = () => {
    setIsLogin(!isLogin);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };
  return (
    <div style={styles.overlay} className="animate-fade-in">
      <div style={styles.card} className="glass-panel animate-scale-up">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <Sparkles size={24} color="#8b5cf6" />
          </div>
          <h2 style={styles.title}>
            {isLogin ? 'Welcome back to AetherFlow' : 'Create your workspace'}
          </h2>
          <p style={styles.subtitle}>
            {isLogin ? 'Access your cloud tasks and sync workspace' : 'Build a personalized space for tracking goals'}
          </p>
        </div>
        {/* Tab Toggle */}
        <div style={styles.tabContainer}>
          <button
            onClick={() => !isLogin && toggleTab()}
            style={{
              ...styles.tabButton,
              ...(isLogin ? styles.tabButtonActive : {})
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => isLogin && toggleTab()}
            style={{
              ...styles.tabButton,
              ...(!isLogin ? styles.tabButtonActive : {})
            }}
          >
            Sign Up
          </button>
        </div>
        {/* Error Notification */}
        {error && (
          <div style={styles.errorBox} className="animate-fade-in">
            {error}
          </div>
        )}
        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="auth-name">Full Name</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.inputIcon} />
                <input
                  id="auth-name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="auth-email">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={styles.submitBtn}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                Authenticating...
              </>
            ) : (
              isLogin ? 'Sign In to Dashboard' : 'Register Workspace'
            )}
          </button>
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
    background: 'rgba(5, 7, 15, 0.85)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    padding: '40px 30px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '28px',
  },
  iconContainer: {
    width: '52px',
    height: '52px',
    borderRadius: '16px',
    background: 'rgba(139, 92, 246, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    boxShadow: '0 0 15px rgba(139, 92, 246, 0.15)',
  },
  title: {
    fontSize: '1.6rem',
    color: '#f3f4f6',
    fontWeight: '700',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '0.88rem',
    color: '#9ca3af',
    maxWidth: '340px',
  },
  tabContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '10px',
    padding: '4px',
    marginBottom: '24px',
  },
  tabButton: {
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    padding: '10px 0',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabButtonActive: {
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#f3f4f6',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  },
  errorBox: {
    background: 'rgba(244, 63, 94, 0.12)',
    border: '1px solid rgba(244, 63, 94, 0.25)',
    color: '#fca5a5',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginBottom: '20px',
    lineHeight: '1.4',
    textAlign: 'center',
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
    paddingLeft: '44px', // Space for icon
  },
  submitBtn: {
    marginTop: '10px',
    width: '100%',
    padding: '14px',
    fontSize: '1rem',
    fontWeight: '600',
  },
};
