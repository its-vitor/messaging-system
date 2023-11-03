import mongoose from 'mongoose';
import Errors from '../errors/errors.js';
import message from './message.js';

const chat = new mongoose.Schema({
    authors: {
        type: [Object],
        required: true,
    },
    messages: {
        type: [message],
        required: true,
        default: []
    },
});