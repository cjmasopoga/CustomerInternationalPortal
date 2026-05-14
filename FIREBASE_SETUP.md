# Firebase Configuration Setup Guide

## Step-by-Step Instructions to Configure Firebase

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `CustomerInternationalPortal` (or your preferred name)
4. Click "Continue"
5. Disable Google Analytics (optional for this project)
6. Click "Create project"
7. Wait for project creation to complete

### 2. Enable Email/Password Authentication

1. In your Firebase project, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Email/Password"
5. Enable the first toggle: "Email/Password"
6. Click "Save"

### 3. Get Your Firebase Configuration

1. Click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (`</>`) to add a web app
5. Enter app nickname: "Customer Portal Web"
6. Leave "Firebase Hosting" unchecked
7. Click "Register app"
8. You will see a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

9. **COPY THESE VALUES** - You'll need them in the next step!

### 4. Update Your Application Configuration

1. Open `frontend/src/firebase/config.ts` in your code editor
2. Replace the placeholder values with your actual Firebase configuration:

**BEFORE:**
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**AFTER (with your values):**
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

3. Save the file

### 5. (Optional) Enable Additional Security Features

#### Enable Email Verification
1. In Firebase Console → Authentication → Settings
2. Scroll to "Email verification"
3. Customize the email template if desired

#### Enable Account Protection
1. In Firebase Console → Authentication → Settings
2. Under "User account management"
3. Enable "Email enumeration protection" (recommended)

#### Set Up Rate Limiting (Already Enabled by Default)
Firebase automatically implements rate limiting. To customize:
1. Go to Authentication → Settings
2. Check "Abuse Prevention" section
3. Configure as needed

### 6. Verify Configuration

1. Save all changes
2. Run the application:
   ```bash
   cd frontend
   npm run dev
   ```
3. Navigate to http://localhost:5173
4. Try to register a new user
5. Check Firebase Console → Authentication → Users
6. Your new user should appear in the list!

---

## Security Best Practices

### ✅ DO:
- Keep your Firebase configuration in the `config.ts` file
- Enable "Email enumeration protection" in Firebase Console
- Use strong passwords when testing (min 8 characters)
- Review Firebase security rules regularly

### ❌ DON'T:
- Don't commit Firebase configuration to public repositories (if using public GitHub)
- Don't share your Firebase API keys publicly
- Don't disable authentication methods you're actively using
- Don't use weak test passwords in production

---

## Alternative: Using Environment Variables (Production Recommended)

For production applications, use environment variables instead of hardcoding:

1. Create a `.env` file in the `frontend` directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. Update `config.ts`:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

3. Add `.env` to `.gitignore`

---

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- Check that you copied the API key correctly
- Ensure there are no extra spaces or quotes

### Error: "Firebase: Error (auth/configuration-not-found)"
- Verify Email/Password authentication is enabled in Firebase Console
- Check that your project ID is correct

### Users Not Appearing in Firebase Console
- Wait a few seconds and refresh the page
- Check browser console for errors
- Verify your Firebase configuration is correct

### Rate Limiting Errors
- This is normal after multiple rapid login attempts
- Wait 5-10 minutes before trying again
- This proves Firebase's brute force protection is working!

---

## Testing Your Setup

Once configured, test the following:

1. **Registration**: Create a new user with email/password
2. **Login**: Login with the created user
3. **Session**: Refresh the page while logged in (should stay logged in)
4. **Logout**: Logout and verify redirect to login page
5. **Protection**: Try accessing `/dashboard` without logging in (should redirect to login)

---

## Firebase Console Monitoring

To monitor your application:

1. Go to Firebase Console → Authentication
2. View registered users
3. Check sign-in activity
4. Review security events

---

**Need Help?** 
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
