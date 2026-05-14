# 🚀 Quick Start Guide

## Get Your Customer Portal Running in 5 Minutes!

### Step 1: Configure Firebase (2 minutes)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create a new project** or select existing one
3. **Enable Authentication**:
   - Click "Authentication" → "Get started"
   - Click "Email/Password" → Enable it → Save
4. **Get your config**:
   - Click ⚙️ → "Project settings"
   - Scroll down → Click web icon `</>`
   - Register app → Copy the config values
5. **Update the code**:
   - Open `frontend/src/firebase/config.ts`
   - Replace `YOUR_API_KEY_HERE` etc. with your actual values

**Need detailed help?** See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

---

### Step 2: Install Dependencies (1 minute)

```bash
cd frontend
npm install
```

---

### Step 3: Run the Application (30 seconds)

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend (optional):**
```bash
dotnet run --project CustomerInternationalPortal.AppHost
```

---

### Step 4: Test It! (1 minute)

1. **Open browser**: http://localhost:5173
2. **Register a new user**:
   - Full Name: "John Doe"
   - Email: "test@example.com"
   - Password: "SecurePass123"
3. **Make a test payment**:
   - Click "Make a Payment"
   - Fill in the form
   - Submit (it's simulated)
4. **Verify in Firebase**:
   - Go to Firebase Console → Authentication → Users
   - Your test user should appear!

---

## ✅ You're Done!

You now have a fully functional, secure customer portal with:
- ✓ User Registration
- ✓ User Login
- ✓ International Payment Form
- ✓ Firebase Authentication (password hashing, salting, HTTPS, session management, brute force protection)

---

## 🔐 Security Features Included

All required security features are implemented via **Firebase Authentication**:

| Security Feature | Status | How It Works |
|-----------------|--------|--------------|
| Password Hashing | ✅ | Firebase uses bcrypt automatically |
| Password Salting | ✅ | Unique salt per password |
| HTTPS/SSL | ✅ | All Firebase requests encrypted |
| Session Protection | ✅ | JWT tokens with auto-refresh |
| Brute Force Protection | ✅ | Rate limiting built-in |

---

## 📚 Documentation

- **[README.md](./README.md)** - Full project documentation
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Detailed Firebase setup
- **Security explanation** - See README.md section "Security Implementation"

---

## 🆘 Common Issues

**Problem: "Firebase: Error (auth/invalid-api-key)"**
- Solution: Check you copied Firebase config correctly in `config.ts`

**Problem: Registration not working**
- Solution: Make sure Email/Password is enabled in Firebase Console

**Problem: Build errors**
- Solution: Delete `node_modules`, run `npm install` again

---

## 🎯 Project Requirements Checklist

- [x] User registration form
- [x] User login form
- [x] International payment form (simulated)
- [x] Password hashing and salting (Firebase)
- [x] HTTPS encryption (Firebase)
- [x] Session protection (Firebase JWT)
- [x] Brute force protection (Firebase rate limiting)
- [x] Security documentation
- [x] Tool disclosure (Firebase, GitHub Copilot, ChatGPT)

---

**Need help?** Check the full [README.md](./README.md) or [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
