const WebSocket = require("ws");
const http = require("http");

const contentStorage = {};
const server = http.createServer((req, res) => {
  res.end("WebSocket server is running");
});

const wss = new WebSocket.Server({ server });
const connections = new Map();

wss.on("connection", (ws, req) => {
  const notebookCode = req.url.split("/").pop();
  connections.set(notebookCode, ws);

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "requestContent") {
      // If it's a request for existing content, send the current content to the new user
      getNotebookContent(notebookCode, (existingContent) => {
        const response = {
          type: "existingContent",
          content: existingContent,
        };
        ws.send(JSON.stringify(response));
      });
    } else {
      // Update the current content for the notebook
      updateNotebookContent(notebookCode, data.content);

      // Broadcast the message to all connected clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          const broadcastMessage = {
            type: "contentUpdate",
            content: data.content,
          };
          client.send(JSON.stringify(broadcastMessage));
        }
      });
    }
  });

  ws.on("close", () => {
    connections.delete(notebookCode);
  });
});

function getNotebookContent(notebookCode, callback) {
  const existingContent = contentStorage[notebookCode] || "";
  callback(existingContent);
}

function updateNotebookContent(notebookCode, content) {
  contentStorage[notebookCode] = content;
}

server.listen(3000, () => {
  console.log("WebSocket server is listening on port 3000");
});
