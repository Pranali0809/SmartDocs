import ShareDB from "sharedb/lib/client";
import ReconnectingWebSocket from "reconnecting-websocket";

ShareDB.types.register(require("rich-text").type);

// const socket = new ReconnectingWebSocket("wss://collab-doc-obej.onrender.com/graphql");
const socket = new ReconnectingWebSocket("ws://localhost:4200");

const createWebSocketConnection = () => {
  socket.addEventListener("error", (event) => {
    console.error("❌ WebSocket error:", event);
  });
  socket.addEventListener("open", (event) => {
    console.log("✅ WebSocket connected");
  });
  socket.addEventListener("close", (event) => {
    console.log("🔌 WebSocket disconnected");
  });
  socket.addEventListener("message", (event) => {
    console.log("📨 WebSocket message received:", event.data?.length || 0, "bytes");
  });
  return new ShareDB.Connection(socket);
};

console.log("🔌 Creating ShareDB connection...");
const shareDBConnection = createWebSocketConnection();
console.log("✅ ShareDB connection created:", shareDBConnection);

export default shareDBConnection;
