import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../firebase/AuthContext';
import './AccountSettings.css';

export default function AccountSettings() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(currentUser?.displayName ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameSuccess, setNameSuccess] = useState('');
  const [nameError, setNameError] = useState('');
  const [nameLoading, setNameLoading] = useState(false);

  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault();
    if (!auth.currentUser) return;
    setNameError('');
    setNameSuccess('');
    if (!displayName.trim()) {
      setNameError('Display name cannot be empty.');
      return;
    }
    setNameLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() });
      setNameSuccess('Display name updated successfully.');
    } catch {
      setNameError('Failed to update display name. Please try again.');
    } finally {
      setNameLoading(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!auth.currentUser || !currentUser?.email) return;
    setPassError('');
    setPassSuccess('');

    if (newPassword.length < 8) {
      setPassError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Passwords do not match.');
      return;
    }

    setPassLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setPassSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setPassError('Current password is incorrect.');
      } else {
        setPassError('Failed to update password. Please try again.');
      }
    } finally {
      setPassLoading(false);
    }
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Account Settings</h1>
        <p className="settings-subtitle">
          Manage your profile and security credentials
        </p>
      </div>

      <div className="settings-grid">
        {/* Profile section */}
        <section className="settings-card">
          <h2>Profile</h2>
          <p className="card-hint">Update the name shown in the portal.</p>
          <form onSubmit={handleUpdateName} noValidate>
            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={currentUser?.email ?? ''} disabled />
              <span className="field-hint">Email cannot be changed here.</span>
            </div>
            {nameError && <p className="error-msg">{nameError}</p>}
            {nameSuccess && <p className="success-msg">{nameSuccess}</p>}
            <button type="submit" className="save-btn" disabled={nameLoading}>
              {nameLoading ? 'Saving…' : 'Save Name'}
            </button>
          </form>
        </section>

        {/* Password section */}
        <section className="settings-card">
          <h2>Change Password</h2>
          <p className="card-hint">
            Re-enter your current password to authorise the change.
          </p>
          <form onSubmit={handleUpdatePassword} noValidate>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
              <span className="field-hint">Minimum 8 characters.</span>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            {passError && <p className="error-msg">{passError}</p>}
            {passSuccess && <p className="success-msg">{passSuccess}</p>}
            <button type="submit" className="save-btn" disabled={passLoading}>
              {passLoading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
