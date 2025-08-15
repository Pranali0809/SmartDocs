// Import required modules and libraries
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const schema = require("./graphql/schema/index.js");
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");
const WebSocket = require("ws");

// Load environment variables from .env file
dotenv.config();
const port = process.env.PORT || 4200;

// ShareDB
const initShareDB = require("./connections/sharedb.js");

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

let connection = null;
let backendInstance = null;

// Main server startup function
async function startServer() {
  // ✅ Wait for ShareDB before starting Apollo
  backendInstance = await initShareDB();
  connection = backendInstance.connect();

  // Create Express app and HTTP server
  const app = express();
  const httpServer = createServer(app);

  // Configure CORS options for allowed origins
  const corsOption = {
    origin: ["http://localhost:3000", "http://localhost:4200"],
    credentials: true,
  };
  app.use(cors(corsOption));

  // Serve static files (for Quill editor and other assets)
  app.use(express.static("static"));
  app.use(express.static("node_modules/quill/dist"));

  // Set up WebSocket server for ShareDB real-time collaboration
  const wss = new WebSocket.Server({ server: httpServer });
  wss.on("connection", function (ws) {
    const stream = new WebSocketJSONStream(ws);
    backendInstance.listen(stream);
  });

  // Initialize Apollo GraphQL server with schema
  const server = new ApolloServer({
    schema,
  });

  // Start Apollo server
  await server.start();

  // Mount GraphQL endpoint
  app.use(
    "/graphql",
    bodyParser.json(),
    cookieParser(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req,
        res,
        user: req.user, // If using authentication middleware
        sharedbBackend: backendInstance, // ✅ Make backend available to resolvers
        sharedbConnection: connection,  // ✅ Also pass connection
      }),
    })
  );

  // Start HTTP server
  httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/graphql`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

// ✅ Utility for non-resolver code to use ShareDB connection
module.exports.getShareDBConnection = () => connection;
