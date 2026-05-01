import http from "node:http";

import { WebSocketServer, WebSocket } from "ws";

const port = Number(process.env.WEBSLIDES_WS_PORT ?? 8787);
const sessions = new Map();

function getSessionClients(sessionId) {
  const existing = sessions.get(sessionId);
  if (existing) return existing;

  const clients = new Set();
  sessions.set(sessionId, clients);
  return clients;
}

function send(ws, message) {
  if (ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify(message));
}

function broadcast(message) {
  const clients = sessions.get(message.sessionId);
  if (!clients) return;

  for (const client of clients) {
    send(client, message);
  }
}

const server = http.createServer((request, response) => {
  response.writeHead(200, { "content-type": "text/plain" });
  response.end("WebSlides WebSocket relay is running.\n");
});

const wss = new WebSocketServer({ server });

function handleServerError(error) {
  if (error && typeof error === "object" && "code" in error && error.code === "EADDRINUSE") {
    console.log(`WebSlides WebSocket relay already running on ws://localhost:${port}`);
    process.exit(0);
  }

  throw error;
}

wss.on("connection", (ws) => {
  ws.data = {
    sessionId: null,
    clientId: null,
  };

  ws.on("message", (raw) => {
    let message;

    try {
      message = JSON.parse(String(raw));
    } catch {
      send(ws, { type: "error", message: "Invalid JSON" });
      return;
    }

    if (!message || typeof message !== "object" || !message.sessionId) {
      send(ws, { type: "error", message: "Missing sessionId" });
      return;
    }

    if (message.type === "hello") {
      ws.data.sessionId = message.sessionId;
      ws.data.clientId = message.clientId ?? null;
      getSessionClients(message.sessionId).add(ws);
    }

    broadcast(message);
  });

  ws.on("close", () => {
    const { sessionId } = ws.data;
    if (!sessionId) return;

    const clients = sessions.get(sessionId);
    if (!clients) return;

    clients.delete(ws);
    if (clients.size === 0) {
      sessions.delete(sessionId);
    }
  });
});

server.on("error", handleServerError);
wss.on("error", handleServerError);

server.listen(port, () => {
  console.log(`WebSlides WebSocket relay listening on ws://localhost:${port}`);
});
