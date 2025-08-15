# SmartDocs Backend

A GraphQL-based backend for collaborative document editing with real-time features.

## Features

- GraphQL API with Apollo Server
- Real-time collaborative editing with ShareDB
- User authentication with Firebase and JWT
- MongoDB database integration
- WebSocket support for real-time updates

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `env.example`:
```bash
cp env.example .env
```

3. Fill in your environment variables in the `.env` file:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret for JWT tokens
   - Firebase configuration (API key, project ID, etc.)

4. Start the development server:
```bash
npm run dev
```

5. The GraphQL playground will be available at: `http://localhost:4200/graphql`

## Environment Variables

- `PORT`: Server port (default: 4200)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `FIREBASE_API_KEY`: Firebase API key
- `FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `FIREBASE_APP_ID`: Firebase app ID

## API Endpoints

- GraphQL: `/graphql`
- WebSocket: WebSocket connection for real-time collaboration

## Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests (not implemented yet) 