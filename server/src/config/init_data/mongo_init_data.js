const mongoose = require('mongoose');
const { Chat, UserChat } = require('../models/chat.model.js'); // Adjust the path accordingly

// Sample demo data
const demoChats = [
  {
    chatId: 'chat1',
    createdAt: new Date(),
    messages: [
      {
        senderId: 'user1',
        text: 'Hello, how are you?',
        image: null,
        createdAt: new Date()
      },
      {
        senderId: 'user2',
        text: 'I am good, thanks! How about you?',
        image: null,
        createdAt: new Date()
      }
    ]
  },
  {
    chatId: 'chat2',
    createdAt: new Date(),
    messages: [
      {
        senderId: 'user1',
        text: 'Are you free this weekend?',
        image: null,
        createdAt: new Date()
      }
    ]
  }
];

const demoUserChats = [
  {
    userId: 'user1',
    chats: [
      {
        chatId: 'chat1',
        receiverId: 'user2',
        lastMessage: 'I am good, thanks! How about you?',
        updatedAt: new Date(),
        isSeen: true
      }
    ]
  },
  {
    userId: 'user2',
    chats: [
      {
        chatId: 'chat2',
        receiverId: 'user3',
        lastMessage: 'Are you free this weekend?',
        updatedAt: new Date(),
        isSeen: false
      }
    ]
  }
];

module.exports = { demoChats, demoUserChats };
