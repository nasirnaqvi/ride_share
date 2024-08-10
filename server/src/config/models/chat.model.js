const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { Schema } = mongoose;

// id: { type: String, default: uuidv4 }, 

const messageSchema = new Schema({
    chatName: { type: String, required: true },
    senderId: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    msgType: { 
        type: String, 
        enum: ['info', 'msg'],
        default: 'msg' 
    }});

const chatInfoSchema = new Schema({
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    chatName: { type: String, required: true },
    senderId: { type: String, required: true },
    lastMessage: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    isSeen: { type: Boolean, default: false }
});

const chatSchema = new Schema({
    chatName: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    users: { type: [String], default: () => [] },
    messages: { type: [messageSchema], default: () => [] }
});

const userChatsSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    chats: { type: [chatInfoSchema], default: () => [] }
});

const Chat = mongoose.model('chats', chatSchema);
const UserChat = mongoose.model('userchats', userChatsSchema);

module.exports = { Chat, UserChat };
