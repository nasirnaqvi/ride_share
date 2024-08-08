const express = require('express');
const { Chat, UserChat } = require('../config/models/chat.model.js');
const router = express.Router();
const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');

module.exports = function (jwtSecret, io) {

    // Middleware to handle WebSocket authentication
    io.use(socketioJwt.authorize({
        secret: jwtSecret,
        handshake: true, // Ensure handshake is used for authentication
        timeout: 15000 // 15 seconds to send the authentication message
    }));

    io.on('connection', function (socket) {
        console.log('User connected:', socket.decoded_token.username);

        // Join user rooms based on their chat data
        const joinUserRooms = async (username) => {
            try {
                const userChats = await UserChat.find({ userId: username }).select('chats').exec();
                console.log("USER CHATS ARE ", userChats);
                const rooms = userChats.flatMap(doc => doc.chats.map(chat => chat.chatId));
                console.log("USER ROOMS ARE ", rooms);

                rooms.forEach(room => {
                    socket.join(room);
                    console.log(`User ${username} joined room: ${room}`);
                });
            } catch (error) {
                console.error('Error joining rooms:', error);
            }
        };

        if (socket.decoded_token && socket.decoded_token.username) {
            joinUserRooms(socket.decoded_token.username);
        }

        // Handle 'message' event
        socket.on('message', async (data) => {
            const { chatId, text, image, senderId } = data;
            const date = new Date();
            try {
                // Update user's chat with the new message details
                await UserChat.updateOne(
                    { userId: senderId, 'chats.chatId': chatId },
                    {
                        $set: {
                            'chats.$.receiverId': senderId,
                            'chats.$.lastMessage': text,
                            'chats.$.updatedAt': date,
                            'chats.$.isSeen': true
                        }
                    }
                );

                // Add new message to the chat
                await Chat.updateOne(
                    { chatId: chatId },
                    {
                        $push: {
                            messages: {
                                senderId: senderId,
                                text: text,
                                image: image,
                                createdAt: date
                            }
                        }
                    }
                );

                // Construct the new message object
                const newMessage = {
                    chatId: chatId,
                    senderId: senderId,
                    text: text,
                    image: null,
                    createdAt: date,
                    own: senderId === socket.decoded_token.username
                };

                // Emit the new message to the chat room
                io.to(chatId).emit('message', newMessage);

            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        // Log disconnection event
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.decoded_token.username);
        });
    });

    // Route to get chat messages
    router.get('/getChats', async (req, res) => {
        try {
            const userChats = await UserChat.findOne({ userId: req.session.username });
            if (!userChats) {
                return res.status(200).json([]);
            }

            const chatIds = userChats.chats.map(chat => chat.chatId);
            const chats = await Chat.find({ chatId: { $in: chatIds } });

            const enrichedChats = chats.map(chat => {
                const lastMessage = chat.messages.length ? chat.messages[chat.messages.length - 1] : null;
                const messagesWithOwnFlag = chat.messages.map(message => ({
                    ...message.toObject(),
                    own: message.senderId === req.session.username
                }));
                return {
                    ...chat.toObject(),
                    lastMessage: lastMessage,
                    isSeen: userChats.chats.find(c => c.chatId === chat.chatId)?.isSeen || false,
                    messages: messagesWithOwnFlag
                };
            });

            return res.status(200).json(enrichedChats);
        } catch (error) {
            console.error('Error retrieving chats:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Route to add a message
    router.post('/addMessage', async (req, res) => {
        try {
            const { chatId, message } = req.body;

            if (!chatId || !message) {
                return res.status(400).json({ error: 'Chat ID and message are required' });
            }

            const chat = await Chat.findOne({ chatId });
            if (!chat) {
                return res.status(400).json({ error: 'Chat not found' });
            }

            const newMessage = {
                senderId: req.session.username,
                message: message,
                timestamp: new Date().toISOString()
            };

            chat.messages.push(newMessage);
            await chat.save();

            const userChat = await UserChat.findOne({ userId: req.session.username });
            const chatIndex = userChat.chats.findIndex(c => c.chatId === chatId);
            userChat.chats[chatIndex].lastMessage = newMessage;
            userChat.chats[chatIndex].isSeen = false;
            await userChat.save();

            return res.status(200).json({ message: 'Message sent successfully' });
        } catch (error) {
            console.error('Error sending message:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};
