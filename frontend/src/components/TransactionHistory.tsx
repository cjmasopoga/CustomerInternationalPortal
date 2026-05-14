import { useState, useEffect } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import type { Transaction } from '../types/Transaction';
import './TransactionHistory.css';

export default function TransactionHistory() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTransactions() {
      if (!currentUser) return;

      try {
        setLoading(true);
        const q = query(
          collection(db, 'transactions'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const txns: Transaction[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          txns.push({
            id: doc.id,
            userId: data.userId,
            recipientName: data.recipientName,
            recipientEmail: data.recipientEmail,
            recipientCountry: data.recipientCountry,
            recipientBankName: data.recipientBankName,
            accountNumber: data.accountNumber,
            swiftCode: data.swiftCode,
            amount: data.amount,
            currency: data.currency,
            purpose: data.purpose,
            status: data.status,
            createdAt: data.createdAt?.toDate() || new Date(),
            transactionId: data.transactionId
          });
        });

        setTransactions(txns);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError('Failed to load transactions: ' + err.message);
        } else {
          setError('Failed to load transaction history');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [currentUser]);

  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getStatusBadge(status: string) {
    const statusClasses = {
      completed: 'status-completed',
      pending: 'status-pending',
      failed: 'status-failed'
    };

    return (
      <span className={`status-badge ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  return (
    <div className="transaction-history-container">
      <div className="transaction-history-card">
        <div className="history-header">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            ← Back to Dashboard
          </button>
          <h2>Transaction History</h2>
          <p className="history-subtitle">View your past international transactions and receipts</p>
        </div>

        {error && (
          <div className="error-alert" role="alert">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading transactions...</p>
          </div>
        )}

        {!loading && transactions.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No transactions yet</h3>
            <p>You haven't made any international payments yet.</p>
            <button onClick={() => navigate('/payment')} className="btn-action">
              Make Your First Payment
            </button>
          </div>
        )}

        {!loading && transactions.length > 0 && (
          <div className="transactions-list">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-header-row">
                  <div className="transaction-id">
                    <strong>Transaction ID:</strong> {transaction.transactionId}
                  </div>
                  {getStatusBadge(transaction.status)}
                </div>

                <div className="transaction-details">
                  <div className="detail-row">
                    <div className="detail-group">
                      <label>Recipient</label>
                      <span>{transaction.recipientName}</span>
                    </div>
                    <div className="detail-group">
                      <label>Amount</label>
                      <span className="amount">
                        {transaction.amount} {transaction.currency}
                      </span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-group">
                      <label>Bank</label>
                      <span>{transaction.recipientBankName}</span>
                    </div>
                    <div className="detail-group">
                      <label>Country</label>
                      <span>{transaction.recipientCountry}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-group">
                      <label>SWIFT/BIC</label>
                      <span>{transaction.swiftCode}</span>
                    </div>
                    <div className="detail-group">
                      <label>Date</label>
                      <span>{formatDate(transaction.createdAt)}</span>
                    </div>
                  </div>

                  <div className="detail-row full-width">
                    <div className="detail-group">
                      <label>Purpose</label>
                      <span>{transaction.purpose}</span>
                    </div>
                  </div>
                </div>

                <div className="transaction-actions">
                  <button className="btn-view-receipt" disabled>
                    View Receipt (Coming Soon)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
