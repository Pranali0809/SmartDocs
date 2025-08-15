import ShareDB from "sharedb/lib/client";
import ReconnectingWebSocket from "reconnecting-websocket";

ShareDB.types.register(require("rich-text").type);

// const socket = new ReconnectingWebSocket("wss://collab-doc-obej.onrender.com/graphql");
const socket = new ReconnectingWebSocket("ws://localhost:4200");

const createWebSocketConnection = () => {
  socket.addEventListener("error", (event) => {
    console.error("WebSocket error:", event);
  });
  socket.addEventListener("open", (event) => {
    console.log("WebSocket open");
  });
  socket.addEventListener("close", (event) => {
    console.log("WebSocket close");
  });
  return new ShareDB.Connection(socket);
};
const shareDBConnection = createWebSocketConnection();

export default shareDBConnection;
