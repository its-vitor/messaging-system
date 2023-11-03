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
    authorId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


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

export default message;