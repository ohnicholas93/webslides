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

Bun.serve({
  port,
  fetch(request, server) {
    const upgraded = server.upgrade(request, {
      data: {
        sessionId: null,
        clientId: null,
      },
    });

    if (upgraded) return undefined;

    return new Response("WebSlides WebSocket relay is running.\n", {
      headers: { "content-type": "text/plain" },
    });
  },
  websocket: {
    message(ws, raw) {
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
    },
    close(ws) {
      const { sessionId } = ws.data;
      if (!sessionId) return;

      const clients = sessions.get(sessionId);
      if (!clients) return;

      clients.delete(ws);
      if (clients.size === 0) {
        sessions.delete(sessionId);
      }
    },
  },
});

console.log(`WebSlides WebSocket relay listening on ws://localhost:${port}`);
