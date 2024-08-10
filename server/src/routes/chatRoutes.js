const express = require('express');
const { Chat, UserChat } = require('../config/models/chat.model.js');
const router = express.Router();
const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');

module.exports = function (jwtSecret, io) {

    // Middleware to handle WebSocket authentication
    // io.use(socketioJwt.authorize({
    //     secret: jwtSecret,
    //     handshake: true, // Ensure handshake is used for authentication
    //     timeout: 15000 // 15 seconds to send the authentication message
    // }));
    io.engine.use((req, res, next) => {
        const isHandshake = req._query.sid === undefined;
        if (!isHandshake) {
            return next();
        }
        const header = req.headers["authorization"];
        if (!header) {
            return next(new Error("no token"));
        }
        if (!header.startsWith("bearer ")) {
            return next(new Error("invalid token"));
        }

        const token = header.substring(7);
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                // console.log("Error occured in socket-jwt verification : ", err);
                return next(new Error("invalid token"));
            }
            req.user = decoded;
            next();
        });
    });


    io.on('connection', (socket) => {
        console.log('User connected:', socket.request.user);

        // Join user rooms based on their chat data
        const joinUserRooms = async (username) => {
            try {
                const userChats = await UserChat.find({ userId: username }).select('chats').exec();
                const rooms = userChats.flatMap(doc => doc.chats.map(chat => chat.chatId));
                console.log("Rooms are ", rooms);
                rooms.forEach(room => {
                    socket.join(room);
                    console.log(`User ${username} joined room: ${room}`);
                });
            } catch (error) {
                console.error('Error joining rooms:', error);
            }
        };

        if (socket.request.user.username) {
            joinUserRooms(socket.request.user.username);
        }

        // Handle 'message' event
        socket.on('message', async (data) => {
            console.log("Receiving message from client: ", data);
            const { chatName, text, image, senderId, chatId } = data;
            const date = new Date();
        
            try {
                // Update user's chat with the new message details
                const userChatUpdateResult = await UserChat.updateOne(
                    { userId: socket.request.user.username, 'chats.chatId': chatId },
                    {
                        $set: {
                            'chats.$.senderId': senderId,
                            'chats.$.lastMessage': text,
                            'chats.$.updatedAt': date,
                            'chats.$.isSeen': true
                        }
                    }
                );
        
                console.log("UserChat update result: ", userChatUpdateResult);
        
                // Add new message to the chat
                const chatUpdateResult = await Chat.updateOne(
                    { _id: chatId },  // Assuming _id is the ObjectId for the Chat
                    {
                        $push: {
                            messages: {
                                senderId: senderId,
                                text: text,
                                image: image,
                                createdAt: date,
                                msgType: 'msg'
                            }
                        }
                    }
                );
        
                console.log("Chat update result: ", chatUpdateResult);
        
                // Construct the new message object
                const newMessage = {
                    chatName: chatName,
                    senderId: senderId,
                    text: text,
                    image: image,  // If image is provided, include it
                    createdAt: date,
                };
        
                // Emit the new message to the chat room
                console.log("Emitting message to room: ", newMessage);
                io.to(chatId).emit('message', newMessage);
                console.log("Room emitted to: ", chatId);
        
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });
        

        // Log disconnection event
        socket.on('disconnect', () => {
            console.log(`${socket.request.user.username} has disconnected:`); //, socket.decoded_token.username
        });
    });

    // Route to get chat messages
    router.get('/getChats', async (req, res) => {
        try {
            // Find user chats based on the userId from session
            const userChats = await UserChat.findOne({ userId: req.session.username });
            
            if (!userChats) {
                return res.status(200).json([]);
            }
    
            const chatIds = userChats.chats.map(chat => chat.chatId);
            const chats = await Chat.find({ _id: { $in: chatIds } });
            const enrichedChats = chats.map(chat => {
                const lastMessage = chat.messages.length ? chat.messages[chat.messages.length - 1] : null;
                    const messagesWithOwnFlag = chat.messages.map(message => ({
                    ...message.toObject(),
                    own: message.senderId === req.session.username
                }));
    
                return {
                    ...chat.toObject(),
                    lastMessage: lastMessage,
                    isSeen: userChats.chats.find(c => c._id.toString() === chat._id.toString())?.isSeen || false,
                    messages: messagesWithOwnFlag
                };
            });
    
            // Return the enriched chats
            return res.status(200).json(enrichedChats);
        } catch (error) {
            console.error('Error retrieving chats:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
    

    router.post('/updateChatName', async (req, res) => {
        const { chatId, newName } = req.body;

        if (!chatId || !newName) {
            console.log("error out 1")
            return res.status(400).json({ error: 'Invalid input' });
        }

        try {
            const updatedChat = await Chat.findByIdAndUpdate(
                chatId,
                { chatName: newName },
                { new: true }
            );
            const msg = {
                senderId: req.session.username,
                text: `${req.session.username} changed the chat name to ${newName}`,
                image: null,
                createdAt: new Date(),
                msgType: 'msg'
            }
            await Chat.updateOne(
                { _id: chatId },
                {
                    $push: {
                        message: msg

                    }
                }
            );

            io.to(chatId).emit('message', msg);

            if (!updatedChat) {
                return res.status(404).json({ error: 'Chat not found' });
            }
            // Send the updated chat data as a response
            res.status(200).json({ chat: updatedChat });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    });



    // Route to add a message
    // router.post('/addMessage', async (req, res) => {
    //     try {
    //         const { chatName, message } = req.body;

    //         if (!chatName || !message) {
    //             return res.status(400).json({ error: 'Chat ID and message are required' });
    //         }

    //         const chat = await Chat.findOne({ chatName });
    //         if (!chat) {
    //             return res.status(400).json({ error: 'Chat not found' });
    //         }

    //         const newMessage = {
    //             senderId: req.session.username,
    //             message: message,
    //             timestamp: new Date().toISOString()
    //         };

    //         chat.messages.push(newMessage);
    //         await chat.save();

    //         const userChat = await UserChat.findOne({ userId: req.session.username });
    //         const chatIndex = userChat.chats.findIndex(c => c.chatName === chatName);
    //         userChat.chats[chatIndex].lastMessage = newMessage;
    //         userChat.chats[chatIndex].isSeen = false;
    //         await userChat.save();

    //         return res.status(200).json({ message: 'Message sent successfully' });
    //     } catch (error) {
    //         console.error('Error sending message:', error);
    //         return res.status(500).json({ error: 'Internal server error' });
    //     }
    // });

    return router;
};
