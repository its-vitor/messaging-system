import jwt from 'jsonwebtoken';
import { message } from '../models/message.js';
import Chat from '../models/chat.js';

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
    const token = req.headers['authorization'].split(' ')[1];
    const recipientId = req.headers['recipientId'];

    if (!token) {
        ws.close(1008, 'Por favor, faça re-login.')
    } else {
        try {
            jwt.verify(token, process.env.TOKEN, async (err, user) => {
                if (err) {
                    ws.close(1008, 'Sua sessão está expirada. Realize um re-login');
                } else {
                    let chat = await Chat.findOne({ authors: { $all: [user._id, recipientId] } });

                    if (!chat) {
                        chat = new Chat({ authors: [user._id, recipientId] });
                    }

                    let messageId = await chat.messages.push(await new message({ content: req.body.content, image: req.body.image })).save()._id;
                    ws.send(JSON.stringify({'messageId': messageId}));
                }
            });
        } catch (err) {
            ws.close(1008, 'Não foi possível conectar-se ao servidor.');
        }
    }
};

export const deleteMessage = async (ws, req) => {
    const token = req.headers['authorization'].split(' ')[1];
    const messageId = req.headers['messageId'];

    if (!token) {
        ws.close(1008, 'Por favor, faça re-login.')
    } else {
        try {
            jwt.verify(token, process.env.TOKEN, async (err, user) => {
                if (err) {
                    ws.close(1008, 'Sua sessão está expirada. Realize um re-login');
                } else {
                    let chat = await Chat.findOne({ 'messages._id': messageId });

                    if (!chat) {
                        ws.send('Mensagem não encontrada.');
                    } else {
                        await chat.messages.id(messageId).remove().save();
                    }
                }
            });
        } catch (err) {
            ws.close(1008, 'Não foi possível conectar-se ao servidor.');
        }
    }
};

