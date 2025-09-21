# SmartDocs - AI-Powered Collaborative Document Editor

A real-time collaborative document editor with AI-powered autocomplete features, built with React, Node.js, GraphQL, and ShareDB.

## 🚀 Features

- **Real-time Collaboration**: Multiple users can edit documents simultaneously
- **AI-Powered Autocomplete**: Intelligent text suggestions using OpenAI GPT-3.5
- **Rich Text Editing**: Full-featured editor with Quill.js
- **User Authentication**: Secure login/signup with Firebase
- **Document Management**: Create, edit, delete, and organize documents
- **WebSocket Integration**: Real-time updates via ShareDB
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

### Frontend (React)
- **Framework**: React 18 with hooks
- **State Management**: Redux Toolkit with Redux Persist
- **GraphQL Client**: Apollo Client
- **Editor**: Quill.js with collaborative cursors
- **Styling**: Tailwind CSS
- **Real-time**: ShareDB client with WebSocket

### Backend (Node.js)
- **Server**: Express.js with Apollo GraphQL
- **Database**: MongoDB with Mongoose
- **Real-time**: ShareDB with MongoDB adapter
- **Authentication**: Firebase Admin + JWT
- **AI Integration**: OpenAI GPT-3.5-turbo
- **WebSocket**: Native WebSocket server

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Firebase project
- OpenAI API key

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/smartdocs.git
cd smartdocs
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in the backend directory:
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

Add your Firebase service account key as `serviceAccountKey.json` in `backend/connections/`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Start the application

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend GraphQL: http://localhost:4200/graphql

## 🧪 Testing

Run backend tests:
```bash
cd backend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy using your preferred method (Heroku, Railway, etc.)

### Frontend Deployment
1. Update API endpoints in the frontend configuration
2. Build the production version:
   ```bash
   cd frontend
   npm run build
   ```
3. Deploy the `build` folder to your hosting platform

## 🔧 Configuration

### Environment Variables

#### Backend
- `PORT`: Server port (default: 4200)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token signing
- `FIREBASE_*`: Firebase configuration
- `OPENAI_API_KEY`: OpenAI API key for AI features

#### Frontend
- Update GraphQL endpoint in `src/index.js` for production

## 📚 API Documentation

### GraphQL Endpoints

#### Queries
- `getDocuments(userId: String!)`: Get user's documents
- `getDocument(docId: String!)`: Get specific document
- `getSmartSuggestion(fullText: String!, cursorPosition: Int!)`: Get AI suggestions

#### Mutations
- `createUser(email: String!, password: String!)`: Register new user
- `login(email: String!, password: String!)`: User login
- `createDocument(userId: String!)`: Create new document
- `deleteDocument(docId: String!)`: Delete document
- `changeDocumentTitle(docId: String!, title: String!)`: Update document title

#### Subscriptions
- `documentChanged(docId: String!)`: Real-time document updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Quill.js](https://quilljs.com/) for the rich text editor
- [ShareDB](https://github.com/share/sharedb) for real-time collaboration
- [OpenAI](https://openai.com/) for AI-powered features
- [Firebase](https://firebase.google.com/) for authentication
- [Apollo GraphQL](https://www.apollographql.com/) for API layer

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.