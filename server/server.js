import express from 'express';
import { WebSocketServer } from 'ws';  // Импортируем WebSocketServer

const app = express();
const port = 8080;

// Создаем сервер WebSocket
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    ws.on('message', (message) => {
        console.log('received: %s', message);
    });
});

app.use(express.json());

// Настроим основной HTTP сервер
app.server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// Обработаем апгрейд запроса для WebSocket
app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});