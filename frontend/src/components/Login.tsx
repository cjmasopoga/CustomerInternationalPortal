import { useState, type FormEvent } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

type View = 'login' | 'forgot';

export default function Login() {
  const [view, setView] = useState<View>('login');

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot-password fields
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Incorrect email or password. Please try again.');
      } else {
        setError('Failed to login. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    if (!resetEmail.trim()) {
      setResetError('Please enter your email address.');
      return;
    }
    setResetLoading(true);
    try {
      await resetPassword(resetEmail.trim());
      setResetSuccess('Password reset email sent. Please check your inbox (and spam folder).');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        setResetError('No account found with that email address.');
      } else {
        setResetError('Failed to send reset email. Please try again.');
      }
    } finally {
      setResetLoading(false);
    }
  }

  function switchToForgot() {
    setResetEmail(email);
    setResetError('');
    setResetSuccess('');
    setView('forgot');
  }

  function switchToLogin() {
    setError('');
    setView('login');
  }

  if (view === 'forgot') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {resetError && (
            <div className="error-alert" role="alert">{resetError}</div>
          )}
          {resetSuccess && (
            <div className="success-alert" role="status">{resetSuccess}</div>
          )}

          {!resetSuccess && (
            <form onSubmit={handleResetPassword} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="reset-email">Email Address</label>
                <input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={resetLoading}>
                {resetLoading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="auth-footer">
            <button className="btn-text-link" onClick={switchToLogin}>
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Customer International Payments Portal</h2>
        <p className="auth-subtitle">Secure international payments — authorised customers only</p>

        {error && (
          <div className="error-alert" role="alert">{error}</div>
        )}

        <form onSubmit={handleLogin} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div className="password-label-row">
              <label htmlFor="password">Password</label>
              <button type="button" className="btn-forgot" onClick={switchToForgot}>
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-admin-note">
            🔒 Access is by invitation only.<br />
            Contact your account manager if you need access.
          </p>
        </div>
      </div>
    </div>
  );
}
