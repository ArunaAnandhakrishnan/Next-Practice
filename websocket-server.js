const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {

    const welcomeInterval = setInterval(() => {
    ws.send(
        JSON.stringify({
        type: "NOTIFICATION",
        message: "👋 Welcome, Notification integrated",
        timestamp: new Date().toISOString(),
        })
    );
    }, 5000); //15 * 60 * 1000); // 15 minutes

  // Send periodic notifications (every 30 seconds)
  const interval = setInterval(() => {
    ws.send(
      JSON.stringify({
        type: "NOTIFICATION",
        message: "🔔 You have new updates",
        timestamp: new Date().toISOString(),
      })
    );
  }, 30000);

  ws.on("close", () => {
    clearInterval(interval);
    console.log(" Client disconnected");
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});

console.log("🚀 WebSocket server running on ws://localhost:8080");
