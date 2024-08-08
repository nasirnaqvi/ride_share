const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    chatId: { type: String, required: true },
    senderId: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const chatInfoSchema = new Schema({
    chatId: { type: String, required: true },
    receiverId: { type: String, required: true },
    lastMessage: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    isSeen: { type: Boolean, default: false }
});

const chatSchema = new Schema({
    chatId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    messages: { type: [messageSchema], default: () => [] }
});

const userChatsSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    chats: { type: [chatInfoSchema], default: () => [] }
});

const Chat = mongoose.model('chats', chatSchema);
const UserChat = mongoose.model('userchats', userChatsSchema);

module.exports = { Chat, UserChat };
