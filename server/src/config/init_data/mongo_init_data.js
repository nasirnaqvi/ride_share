const mongoose = require('mongoose');
const { Chat, UserChat } = require('../models/chat.model.js'); // Adjust the path accordingly

// Sample demo data
const demoChats = [
  {
    chatName: 'chat1',
    createdAt: new Date(),
    users: ['user1', 'user2'],
    messages: []
  }
];

const messages = [
  {
    senderId: 'user1',
    text: 'Hello, how are you?',
    image: null,
    createdAt: new Date(),
    msgType: 'msg'
  },
  {
    senderId: 'user2',
    text: 'I am good, thanks! How about you?',
    image: null,
    createdAt: new Date(),
    msgType: 'msg'
  },
  {
    senderId: 'user1',
    text: 'I am good too, thanks for asking bitch.',
    image: null,
    createdAt: new Date(),
    msgType: 'msg'
  }
];
const user1chats = 
  {
    chatName: 'chat1',
    senderId: 'user2',
    lastMessage: 'I am good, thanks! How about you?',
    updatedAt: new Date(),
    isSeen: true
  }

const user2chats =       
{
  chatName: 'chat2',
  senderId: 'user1',
  lastMessage: 'Are you free this weekend?',
  updatedAt: new Date(),
  isSeen: false
}


const demoUserChats = [
  {
    userId: 'user1',
    chats: []
  },
  {
    userId: 'user2',
    chats: []
  }
];

module.exports = { demoChats, demoUserChats, messages, user1chats, user2chats };
