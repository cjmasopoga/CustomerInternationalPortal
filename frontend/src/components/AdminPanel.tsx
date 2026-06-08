import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createCustomerAccount,
  listCustomers,
  type CustomerRecord
} from '../firebase/adminService';
import { useAuth } from '../firebase/AuthContext';
import './AdminPanel.css';

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export default function AdminPanel() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const refreshList = useCallback(async () => {
    setLoadingList(true);
    try {
      const list = await listCustomers();
      setCustomers(list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => { refreshList(); }, [refreshList]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');

    if (!displayName.trim()) {
      setCreateError('Display name is required.');
      return;
    }
    if (password.length < 8) {
      setCreateError('Password must be at least 8 characters.');
      return;
    }

    setCreating(true);
    try {
      await createCustomerAccount(
        displayName.trim(),
        email.trim(),
        password,
        currentUser!.uid
      );
      setCreateSuccess(`Account for ${displayName.trim()} created successfully.`);
      setDisplayName('');
      setEmail('');
      setPassword('');
      await refreshList();
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/email-already-in-use') {
        setCreateError('An account with that email already exists.');
      } else if (code === 'auth/invalid-email') {
        setCreateError('Please enter a valid email address.');
      } else {
        setCreateError('Failed to create account. Please try again.');
      }
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <div className="admin-title-row">
          <h1>Admin Panel</h1>
          <span className="admin-badge">Admin Only</span>
        </div>
        <p className="admin-subtitle">
          Create and manage customer portal accounts
        </p>
      </div>

      <div className="admin-grid">
        {/* Create customer card */}
        <section className="admin-card">
          <h2>Create Customer Account</h2>
          <p className="card-hint">
            The customer will use these credentials to sign in to the portal.
          </p>
          <form onSubmit={handleCreate} noValidate>
            <div className="form-group">
              <label htmlFor="a-displayName">Full Name</label>
              <input
                id="a-displayName"
                type="text"
                placeholder="Jane Smith"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="a-email">Email Address</label>
              <input
                id="a-email"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="a-password">Temporary Password</label>
              <input
                id="a-password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <span className="field-hint">
                Advise the customer to change this on first login.
              </span>
            </div>
            {createError && <p className="error-msg">{createError}</p>}
            {createSuccess && <p className="success-msg">{createSuccess}</p>}
            <button type="submit" className="create-btn" disabled={creating}>
              {creating ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>
        </section>

        {/* Customer list card */}
        <section className="admin-card customer-list-card">
          <h2>Customer Accounts</h2>
          <p className="card-hint">All portal accounts created by admins.</p>
          {loadingList ? (
            <p className="loading-msg">Loading…</p>
          ) : customers.length === 0 ? (
            <p className="empty-msg">No customer accounts yet.</p>
          ) : (
            <ul className="customer-list">
              {customers.map((c) => (
                <li key={c.uid} className="customer-item">
                  <div className="customer-name">{c.displayName}</div>
                  <div className="customer-email">{c.email}</div>
                  <div className="customer-meta">
                    Created {formatDate(c.createdAt)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
