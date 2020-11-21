const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = mongoose.Schema({
    room: {
        type: String,
    },
    message: {
        type: String,
    },
    sender: {
        type: String,
    },
    image : {
        type: String,
        default: '',
    },
}, {timestamps: true});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = { Chat }