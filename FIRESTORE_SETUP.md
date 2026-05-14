# Enable Firestore Database

## Steps to Enable Firestore in Firebase Console

### 1. Go to Firebase Console
- Navigate to https://console.firebase.google.com/
- Select your project: **customerinternationalportal**

### 2. Enable Firestore Database
1. Click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. **Choose mode:**
   - Select **"Start in test mode"** (for development)
   - Click **"Next"**

4. **Choose location:**
   - Select a location close to you (e.g., `us-central`, `europe-west`, etc.)
   - Click **"Enable"**

5. Wait for Firestore to be provisioned (takes ~30 seconds)

### 3. Set Up Security Rules (Important!)

After Firestore is created, update the security rules:

1. Go to **"Firestore Database"** → **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own transactions
    match /transactions/{transactionId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update, delete: if false; // Transactions cannot be modified or deleted
    }
  }
}
```

3. Click **"Publish"**

### 4. Verify Setup

You should now see:
- ✅ Firestore Database enabled
- ✅ Security rules protecting user data
- ✅ A `transactions` collection will be created automatically when you make your first payment

---

## What These Security Rules Do

- ✅ **Users can only see their own transactions** (privacy)
- ✅ **Users can create transactions** (when making payments)
- ❌ **Transactions cannot be edited or deleted** (audit trail)
- ❌ **Unauthenticated users cannot access any data** (security)

---

## Testing

After enabling Firestore:

1. **Make a payment** via the Payment form
2. **Check Firestore Console:**
   - Go to Firestore Database → Data
   - You should see a `transactions` collection
   - Click on it to see your transaction data
3. **View Transaction History:**
   - Go to Dashboard → Click "View History"
   - You should see your payment listed!

---

**Ready to test? Enable Firestore in Firebase Console now!** 🚀
