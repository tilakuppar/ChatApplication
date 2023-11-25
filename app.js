const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const connectedClients = new Set();

app.use(express.static(path.join(__dirname, 'public')));

function broadcastTotalClients() {
    const totalClients = connectedClients.size;
    wss.clients.forEach((client) => {
        client.send(JSON.stringify({ type: 'total-clients', data: totalClients }));
    });
}

function broadcastMessage(data, sender) {
    wss.clients.forEach((client) => {
        if (client !== sender) {
            client.send(JSON.stringify({ type: 'chat-message', data }));
        }
    });
}

wss.on('connection', (ws) => {
    console.log('WebSocket Connected');
    connectedClients.add(ws);
    broadcastTotalClients();

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        broadcastMessage(data, ws); 
    });

    ws.on('close', () => {
        console.log('WebSocket Disconnected');
        connectedClients.delete(ws);
        broadcastTotalClients();
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
