import { WebSocketServer } from "ws";

export function createWSServer(server) {
  const wss = new WebSocketServer({ server });
  console.log("WebSocket server started");

  wss.on("connection", (ws, req) => {
    console.log("Client connected:", req.socket.remoteAddress);

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        console.log("Client says:", msg);
      } catch (e) {
        console.log("Invalid client message");
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  return {
    broadcast: (payload) => {
      const data = JSON.stringify(payload);
      for (const client of wss.clients) {
        if (client.readyState === 1) {
          client.send(data);
        }
      }
    },
    broadcastEvent: (event, payload) => {
      const data = JSON.stringify({ type: event, payload });
      for (const client of wss.clients) {
        if (client.readyState === 1) {
          client.send(data);
        }
      }
    }
  };
}