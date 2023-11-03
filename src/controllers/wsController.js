import jwt from 'jsonwebtoken';
import { registerMessage } from '../models/message.js';

export const startConnection = async (ws, req) => {
    const token = req.headers['authorization'].split(' ')[1]

    if (!token) {
        ws.close(1008, 'Não foi possível conectar-se ao servidor.');
    } else {
        try {
            jwt.verify(token, process.env.TOKEN, (err, user) => {
                if (err) {
                    ws.close(1008, 'Sua sessão está expirada. Realize um re-login');
                } else {
                    ws.send('Conectado com sucesso!');
                }
            });
        } catch (err) {
            ws.close(1008, 'Não foi possível conectar-se ao servidor.');
        }
    }
};

export const sendMessage = async (ws, req) => {

};