import WebSocket from 'ws';
import { startConnection } from './controllers/wsController.js';

const wss = new WebSocket.Server({
    port: 8080
});

wss.on('connection', startConnection)