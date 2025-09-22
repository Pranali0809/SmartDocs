# Firebase Setup Guide for SmartDocs

## Overview
Firebase is used in SmartDocs for:
- **User Authentication** (Sign up, Login, JWT tokens)
- **User Management** (Server-side user creation with Admin SDK)

## Current Implementation

### Frontend Firebase (Client-side)
- Currently **NOT** directly used in frontend
- Authentication is handled via GraphQL mutations to backend
- Backend creates Firebase users and returns JWT tokens

### Backend Firebase (Server-side)
- Uses Firebase Admin SDK
- Creates users server-side
- Manages authentication tokens

## Setup Instructions

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `smartdocs` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Click **Save**

### Step 3: Get Configuration Keys

#### For Frontend (Client Config):
1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click **Web app** icon (`</>`)
4. Register app with name: `smartdocs-frontend`
5. Copy the config object:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

#### For Backend (Admin SDK):
1. Go to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Rename it to `serviceAccountKey.json`
5. Place it in `backend/connections/` directory

### Step 4: Configure Environment Variables

#### Backend `.env` file:
```env
# From the frontend config
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=your-app-id

# Alternative to serviceAccountKey.json (for deployment)
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
```

### Step 5: File Structure

```
backend/
├── connections/
│   ├── firebaseconfig.js          ✅ Already exists
│   └── serviceAccountKey.json     ❌ You need to add this
├── .env                           ❌ You need to create this
└── .env.example                   ✅ Template provided
```

## Deployment Options

### Option 1: Using Service Account File (Local Development)
- Place `serviceAccountKey.json` in `backend/connections/`
- File is automatically excluded from Git

### Option 2: Using Environment Variables (Production/Deployment)
- Set Firebase credentials as environment variables
- Safer for cloud deployment (Heroku, Railway, etc.)
- No files to manage

## Security Notes

### ✅ Safe (Already configured):
- `serviceAccountKey.json` is in `.gitignore`
- Environment variables are not committed to Git
- Firebase Admin SDK runs server-side only

### ⚠️ Important:
- Never commit `serviceAccountKey.json` to Git
- Never expose Firebase Admin SDK credentials in frontend
- Use environment variables for production deployment

## Testing Firebase Setup

### Test Backend Connection:
```bash
cd backend
npm run test
```

### Test User Creation:
1. Start backend: `npm run dev`
2. Go to GraphQL playground: `http://localhost:4200/graphql`
3. Run mutation:
```graphql
mutation {
  createUser(email: "test@example.com", password: "password123") {
    userId
    token
    tokenExpiration
  }
}
```

### Verify in Firebase Console:
1. Go to **Authentication** → **Users**
2. Check if test user appears in the list

## Troubleshooting

### Common Issues:

1. **"Service account key not found"**
   - Download service account key from Firebase Console
   - Place in `backend/connections/serviceAccountKey.json`

2. **"Firebase project not found"**
   - Check `FIREBASE_PROJECT_ID` in `.env`
   - Verify project exists in Firebase Console

3. **"Invalid credentials"**
   - Regenerate service account key
   - Check environment variables are correctly set

4. **"User creation failed"**
   - Ensure Email/Password auth is enabled in Firebase Console
   - Check Firebase Admin SDK permissions

## Next Steps

After Firebase setup:
1. ✅ User authentication works
2. ✅ JWT tokens are generated
3. ✅ Users are stored in both Firebase and MongoDB
4. 🔄 Ready for production deployment

## Additional Features (Optional)

You can extend Firebase usage:
- **Firestore Database** (alternative to MongoDB)
- **Cloud Storage** (file uploads)
- **Cloud Functions** (serverless functions)
- **Push Notifications** (FCM)
- **Analytics** (user behavior tracking)