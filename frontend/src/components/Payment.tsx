import { useState, type FormEvent } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Transaction } from '../types/Transaction';
import './Payment.css';

interface PaymentFormData {
  recipientName: string;
  recipientEmail: string;
  recipientCountry: string;
  recipientBankName: string;
  accountNumber: string;
  swiftCode: string;
  amount: string;
  currency: string;
  purpose: string;
}

export default function Payment() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<PaymentFormData>({
    recipientName: '',
    recipientEmail: '',
    recipientCountry: '',
    recipientBankName: '',
    accountNumber: '',
    swiftCode: '',
    amount: '',
    currency: 'USD',
    purpose: ''
  });

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Spain', 'Italy', 'Netherlands', 'Switzerland', 'Japan',
    'Singapore', 'Hong Kong', 'United Arab Emirates', 'India', 'South Africa'
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'AED', name: 'UAE Dirham' }
  ];

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    // Validation
    if (parseFloat(formData.amount) <= 0) {
      return setError('Amount must be greater than 0');
    }

    if (formData.swiftCode.length < 8 || formData.swiftCode.length > 11) {
      return setError('SWIFT/BIC code must be 8-11 characters');
    }

    try {
      setLoading(true);

      // Generate unique transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Save transaction to Firestore
      if (currentUser) {
        const transaction: Omit<Transaction, 'id'> = {
          userId: currentUser.uid,
          recipientName: formData.recipientName,
          recipientEmail: formData.recipientEmail,
          recipientCountry: formData.recipientCountry,
          recipientBankName: formData.recipientBankName,
          accountNumber: formData.accountNumber,
          swiftCode: formData.swiftCode,
          amount: formData.amount,
          currency: formData.currency,
          purpose: formData.purpose,
          status: 'completed',
          createdAt: new Date(),
          transactionId: transactionId
        };

        // Add to Firestore
        await addDoc(collection(db, 'transactions'), {
          ...transaction,
          createdAt: serverTimestamp()
        });
      }

      // Simulate payment processing delay
      await simulatePaymentProcessing();

      setSuccess(true);

      // Reset form after 3 seconds and redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Payment failed: ' + err.message);
      } else {
        setError('Payment processing failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  function simulatePaymentProcessing(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Payment processed for user:', currentUser?.email);
        console.log('Payment details:', formData);
        resolve();
      }, 2000);
    });
  }

  if (success) {
    return (
      <div className="payment-container">
        <div className="payment-card success-card">
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Your international payment of {formData.amount} {formData.currency} has been processed.</p>
          <p className="success-subtext">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            ← Back to Dashboard
          </button>
          <h2>International Payment</h2>
          <p className="payment-subtitle">Send money securely across borders</p>
        </div>

        {error && (
          <div className="error-alert" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="payment-form">
          <section className="form-section">
            <h3>Recipient Information</h3>

            <div className="form-group">
              <label htmlFor="recipientName">Recipient Full Name *</label>
              <input
                id="recipientName"
                name="recipientName"
                type="text"
                value={formData.recipientName}
                onChange={handleInputChange}
                required
                placeholder="Enter recipient's full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipientEmail">Recipient Email *</label>
              <input
                id="recipientEmail"
                name="recipientEmail"
                type="email"
                value={formData.recipientEmail}
                onChange={handleInputChange}
                required
                placeholder="recipient@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipientCountry">Recipient Country *</label>
              <select
                id="recipientCountry"
                name="recipientCountry"
                value={formData.recipientCountry}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </section>

          <section className="form-section">
            <h3>Banking Details</h3>

            <div className="form-group">
              <label htmlFor="recipientBankName">Bank Name *</label>
              <input
                id="recipientBankName"
                name="recipientBankName"
                type="text"
                value={formData.recipientBankName}
                onChange={handleInputChange}
                required
                placeholder="Enter bank name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="accountNumber">Account Number *</label>
              <input
                id="accountNumber"
                name="accountNumber"
                type="text"
                value={formData.accountNumber}
                onChange={handleInputChange}
                required
                placeholder="Enter account number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="swiftCode">SWIFT/BIC Code *</label>
              <input
                id="swiftCode"
                name="swiftCode"
                type="text"
                value={formData.swiftCode}
                onChange={handleInputChange}
                required
                placeholder="8-11 characters"
                maxLength={11}
              />
              <small className="form-help">
                SWIFT/BIC code is required for international transfers
              </small>
            </div>
          </section>

          <section className="form-section">
            <h3>Payment Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount">Amount *</label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="currency">Currency *</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  required
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="purpose">Purpose of Transfer *</label>
              <textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                required
                placeholder="E.g., Payment for services, Family support, etc."
                rows={3}
              />
            </div>
          </section>

          <div className="payment-summary">
            <div className="summary-row">
              <span>Amount:</span>
              <strong>{formData.amount || '0.00'} {formData.currency}</strong>
            </div>
            <div className="summary-row">
              <span>Transaction Fee:</span>
              <strong>0.00 {formData.currency}</strong>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <strong>{formData.amount || '0.00'} {formData.currency}</strong>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-submit"
          >
            {loading ? 'Processing Payment...' : 'Submit Payment'}
          </button>

          <div className="security-notice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>This is a simulated payment. No real money will be transferred.</span>
          </div>
        </form>
      </div>
    </div>
  );
}
