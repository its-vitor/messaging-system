import WebSocket from 'ws';
import dotenv from 'dotenv';
import { startConnection, sendMessage, deleteMessage } from './controllers/wsController.js';

const wss = new WebSocket.Server({
    port: 8080
});


dotenv.config();

mongoose.connect(process.env.MONGODB)
    .then(() => console.log('Conexão foi estabelecida.'))
    .catch(err => console.error('Conexão não foi estabelecida. Error: ', err));

wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
        const route = JSON.parse(message).route;

        switch (route) {
            case 'start':
                startConnection(ws, req);
                break;
            case 'chat/send':
                sendMessage(ws, req);
                break;
            case 'chat/delete':
                deleteMessage(ws, req);
                break;
            default:
                ws.send('Ops!');
        }
    });
});
