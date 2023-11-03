import mongoose from 'mongoose';
import sharp from 'sharp';
import * as fileType from 'file-type';
import Errors from '../errors/errors.js';

export const message = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    image: {
        type: Buffer,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

function createMessageModel() {
    message.pre("save", function(next) {
        if (this.content.length > 4000) {
            throw new Errors.ContentLengthError('A mensagem não pode exceder mais de 4000 caracteres.')
        } else {
            next();
        }
    });

    message.pre("save", async function(next) {
        if (this.isModified('image') && this.image) {
            const buffer = await sharp(this.image)
                .resize({ width: 500, height: 500, fit: 'inside' })
                .toBuffer();

            const type = await fileType.fromBuffer(buffer);
            if (!['jpg', 'jpeg', 'png', 'gif'].includes(type.ext)) throw new Errors.ImageTypeError('Tipo de imagem inválida.');
            if (buffer.length > 10 * 1024 * 1024) throw new Errors.ImageSizeError('Imagem maior que 10mb.');
            
            this.image = buffer;
        }
        next();
    });

    return mongoose.model('Chats', message, 'Messages');
};

export const messageModel = new createMessageModel();

export const registerMessage = async (content, image) => {
    return await messageModel({content, image}).save();
};
