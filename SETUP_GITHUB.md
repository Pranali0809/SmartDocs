# GitHub Setup Instructions

Follow these steps to sync your SmartDocs project to GitHub:

## Step 1: Download Your Project Files

Since this project is running in WebContainer, you'll need to download the files to your local machine:

1. **Download all project files** from this environment
2. **Create a new folder** on your local machine (e.g., `smartdocs`)
3. **Extract/copy all files** to this folder

## Step 2: Set Up Git Repository Locally

Open terminal/command prompt in your project folder and run:

```bash
# Initialize git repository
git init

# Add all files to staging
git add .

# Make initial commit
git commit -m "Initial commit: SmartDocs with AI autocomplete feature"
```

## Step 3: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click the **"+"** button in the top right corner
3. Select **"New repository"**
4. Fill in repository details:
   - **Repository name**: `smartdocs` (or your preferred name)
   - **Description**: "AI-powered collaborative document editor"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 4: Connect Local Repository to GitHub

Copy the commands from GitHub's "push an existing repository" section:

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

## Step 5: Set Up Environment Variables

**IMPORTANT**: Never commit sensitive information to GitHub!

1. **Backend**: Create `.env` file locally (already in .gitignore):
```env
PORT=4200
MONGODB_URI=mongodb://localhost:27017/smartdocs
JWT_SECRET=your-super-secret-jwt-key-here

# Firebase Configuration
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here
```

2. **Service Account Key**: Add your Firebase service account key as `backend/connections/serviceAccountKey.json` (already in .gitignore)

## Step 6: Install Dependencies and Test

```bash
# Backend
cd backend
npm install
npm test  # Run tests to ensure everything works

# Frontend
cd ../frontend
npm install
npm start  # Test the frontend
```

## Step 7: Set Up Development Workflow

### For future changes:
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes...

# Stage and commit changes
git add .
git commit -m "Add: description of your changes"

# Push to GitHub
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### For regular updates:
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Update: description of changes"

# Push to main branch
git push origin main
```

## Step 8: Set Up GitHub Actions (Optional)

Create `.github/workflows/ci.yml` for automated testing:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install backend dependencies
      run: |
        cd backend
        npm install
        
    - name: Install frontend dependencies
      run: |
        cd frontend
        npm install
        
    - name: Run backend tests
      run: |
        cd backend
        npm test
```

## Step 9: Update Documentation

1. **Update README.md** with your GitHub repository URL
2. **Add screenshots** to showcase your application
3. **Update installation instructions** if needed

## Troubleshooting

### Common Issues:

1. **Permission denied**: Make sure you have write access to the repository
2. **Large files**: If you have large files, consider using Git LFS
3. **Merge conflicts**: Pull latest changes before pushing: `git pull origin main`

### Security Checklist:
- ✅ `.env` files are in `.gitignore`
- ✅ `serviceAccountKey.json` is in `.gitignore`
- ✅ No API keys in committed code
- ✅ Sensitive data is properly excluded

## Next Steps

1. **Set up deployment** (Heroku, Vercel, Railway, etc.)
2. **Configure CI/CD** for automated testing and deployment
3. **Add collaborators** if working in a team
4. **Set up issue templates** for bug reports and feature requests
5. **Create project documentation** in the wiki

Your SmartDocs project is now ready for collaborative development on GitHub! 🚀