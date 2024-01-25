const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
  res.end('WebSocket server is running');
});

const wss = new WebSocket.Server({ server });
const connections = new Map();

wss.on('connection', (ws, req) => {
  const notebookCode = req.url.split('/').pop();
  connections.set(notebookCode, ws);

  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(String(message)); 
      }
    });
  });

  ws.on('close', () => {
    connections.delete(notebookCode);
  });
});

server.listen(3000, () => {
  console.log('WebSocket server is listening on port 3000');
});
