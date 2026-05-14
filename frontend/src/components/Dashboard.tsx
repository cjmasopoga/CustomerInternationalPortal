import { useAuth } from '../firebase/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  }

  function handleMakePayment() {
    navigate('/payment');
  }

  function handleViewHistory() {
    navigate('/history');
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Customer International Portal</h1>
          <div className="header-actions">
            <span className="user-info">
              Welcome, {currentUser?.displayName || currentUser?.email}
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-card">
          <div className="card-icon">💳</div>
          <h2>International Payments</h2>
          <p>Send money internationally with secure and fast transfers</p>
          <button onClick={handleMakePayment} className="btn-action">
            Make a Payment
          </button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📊</div>
          <h2>Transaction History</h2>
          <p>View your past international transactions and receipts</p>
          <button onClick={handleViewHistory} className="btn-action">
            View History
          </button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">⚙️</div>
          <h2>Account Settings</h2>
          <p>Manage your profile and security settings</p>
          <button className="btn-action" disabled>
            Coming Soon
          </button>
        </div>
      </main>

      <footer className="dashboard-footer">
        <div className="security-badge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>Secured by Firebase Authentication</span>
        </div>
      </footer>
    </div>
  );
}
