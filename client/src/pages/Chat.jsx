import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import {
  TbSearch, TbPlus, TbDots, TbEdit, TbInfoCircle,
  TbPhoto, TbCamera, TbMicrophone, TbSend, TbMoodSmile, TbMinus
} from 'react-icons/tb';
import background from './../resources/imgs/map-bg.png';
import EmojiPicker from 'emoji-picker-react';
import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
const { jwtToken } = localStorage;
// Initialize Socket.IO client
// const socket = io(import.meta.env.VITE_APP_SOCKET_URL);

const Chat = () => {
  // State variables
  const [user, setUser] = useState({
    username: '',
    first_name: '',
    last_name: '',
    profile_img: null,
    trips_taken: 0
  });

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [view, setView] = useState(null);
  const [chats, setChats] = useState([]);
  const [infoPanelVisible, setInfoPanelVisible] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [addChat, setAddChat] = useState(false);

  const emojiPickerRef = useRef(null);
  const endRef = useRef(null);

  // function getCookie(name) {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2){
  //     const x = parts.pop().split(';').shift();
  //     console.log("Cookie is ", x);
  //     return x;
  //   }
  // }
  // const token = getCookie('authtoken');

  // Fetch user profile and chat list
  useEffect(() => {
    console.log("Token in Chats is ", jwtToken);
    const socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.on('connect', function (socket) {
      socket
        .on('authenticated', function () {
          //do other things
        })
        .emit('authenticate', {jwtToken}); //send the jwt
    });


    socket.on('message', (data) => {
      console.log("Got message ", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    setSocket(socket);

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/limitedInfo`, { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.log('Failed to get user profile');
      }
    };

    fetchUserProfile();

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/chats/getChats`, { withCredentials: true })
      .then(response => {
        setChats(response.data);
        console.log("Chats are ", response.data);
      })
      .catch(error => console.log(error));
    return () => {
      socket.off('connect');
      socket.off('receiveMessage');
    };
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMessage = {
      chatId: view.chatId,
      text: message.trim(),
      image: null,
      senderId: user.username
      // Add more message properties if needed
    };
    socket.emit('message', newMessage);
    setMessage(''); // Clear input after sending
  };


  // Handle click outside of emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setEmojiPickerVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // socket.on('message', (message) => {
  //   const li = document.createElement('li');
  //   li.textContent = message;
  //   document.getElementById('messages').appendChild(li);
  // });
  // const sendMessage = () => {
  //   const socket = io(SOCKET_SERVER_URL);
  //   socket.emit('message', message);
  //   setMessage('');
  // };
  // Handle sending messages


  // Add emoji to message
  const onEmojiClick = (e) => {
    setMessage(prevMessage => prevMessage + e.emoji);
    setEmojiPickerVisible(false);
  };

  // Toggle information panel visibility
  const toggleInfoPanel = () => setInfoPanelVisible(!infoPanelVisible);

  // Generate chat list
  const chatList = chats.map((chat, index) => (
    <div key={index} className="relative">
      <div className="chat-bg rounded-md p-4 mb-2 hover:bg-black hover:bg-opacity-20 transition-all duration-300">
        <button className="text-color p-2 w-full text-left" onClick={() => {
          setMessages(chat.messages);
          setView(chat);
        }}>
          <div className="flex items-center">
            <img
              src={chat.image ? chat.image : "/images/default_profile_pic.jpg"}
              alt="Profile picture"
              className="profile-pic w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full object-cover mr-2"
            />
            <div className="max-w-xs overflow-hidden">
              <h3 className={`text-base sm:text-lg font-semibold mb-1 ${!chat.isSeen ? 'font-bold' : ''}`}>
                {chat.groupname}
              </h3>
              <h3 className={`${!chat.isSeen ? 'font-bold' : ''}`}>{chat.chatId}</h3>
              <h3 className={`${!chat.isSeen ? 'font-bold' : ''} truncate overflow-hidden`}>
                {chat.lastMessage.senderId}: {chat.lastMessage.text}
              </h3>
            </div>
          </div>
        </button>
      </div>
    </div>
  ));
  const getTimeDifference = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMinutes = (now - messageDate) / 60000;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;

    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} minutes ago`;
    } else if (diffInMinutes >= 60 && diffInMinutes < 1440) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return `${Math.floor(diffInDays)} days ago`;
    }
  };
  const shouldShowTimestamp = (current, next) => {
    const currentDate = new Date(current);
    const nextDate = new Date(next);
    const diffInMinutes = (nextDate - currentDate) / 60000;

    return diffInMinutes > 5;
  };

  // Generate message format

  const messageFormat = messages.map((msg, index) => {
    const showTimestamp = index === messages.length - 1 || shouldShowTimestamp(messages[index + 1].createdAt, msg.createdAt);

    return (
      <div key={index} className={`flex ${msg.own ? 'justify-end' : 'justify-start'} mb-2 overflow-auto`}>
        <div className={`flex flex-col ${msg.own ? 'items-end' : 'items-start'} max-w-[70%]`}>
          <div className={`p-2 rounded-lg ${msg.own ? 'bg-blue-900 bg-opacity-60 text-white' : 'bg-gray-800 bg-opacity-60 text-white'}`}>
            <p className="whitespace-normal p-1">{msg.text}</p>
          </div>
          {showTimestamp && (
            <span className={`text-xs text-gray-500 mt-1 ${msg.own ? 'text-right' : 'text-left'}`}>
              {getTimeDifference(msg.createdAt)}
            </span>
          )}
        </div>
        {index === messages.length - 1 && <div ref={endRef}></div>}
      </div>
    );
  });

  // Chat view details
  const detailChatView = view && (
    <div className={`flex flex-col h-full max-h-screen ${!infoPanelVisible ? 'flex-grow' : ''}`}>
      <div id="top" className="flex items-center text-color px-2 py-2">
        <img
          src={view.image ? view.image : "/images/default_profile_pic.jpg"}
          alt="Profile picture"
          className="profile-pic w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full object-cover mr-2"
        />
        <div className="flex flex-col flex-grow">
          <h3 className="text-base sm:text-lg font-semibold">
            {view.groupname ? view.groupname : view.name}
          </h3>
          <h4 className="text-sm sm:text-base mb-1">
            {view.description}
          </h4>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <button className="p-0">
            <TbDots className="text-white w-6 h-6" />
          </button>
          <button className="p-0" onClick={toggleInfoPanel}>
            <TbInfoCircle className="text-white w-6 h-6" />
          </button>
        </div>
      </div>
      <div id="middle" className="flex-grow overflow-auto">
        {messageFormat}
      </div>
      <div id="bottom" className="flex items-center p-2">
        <div className="flex items-center space-x-2">
          <button className="text-white"><TbPhoto className="w-6 h-6" /></button>
          <button className="text-white"><TbCamera className="w-6 h-6" /></button>
          <button className="text-white"><TbMicrophone className="w-6 h-6" /></button>
        </div>
        <div className="flex-1 mx-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="w-full px-4 py-2 rounded-md text-white chat-bg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2 relative">
          <button
            className="text-white p-0"
            onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
          >
            <TbMoodSmile className="w-6 h-6" />
          </button>
          {emojiPickerVisible && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-12 right-12 overflow-y-auto z-10"
            >
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
          <button className="text-white" onClick={handleSendMessage}>
            <TbSend className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );

  // Detailed user view
  const personDetails = (
    <div>
      Add detailed user view here :)
    </div>
  );

  return (
    <div id="main" className="relative flex lg:flex-row home-md overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={background} alt="Background" className="w-full h-full object-cover filter blur-sm" />
        <div className="absolute inset-0 bg-black opacity-75"></div>
      </div>

      {/* Sidebar */}
      <div className="relative lg:w-1/5 p-5 z-10">
        <div className="w-full">
          {/* User Profile */}
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <img
                src={user.profile_img ? user.profile_img : "/images/default_profile_pic.jpg"}
                alt="Profile"
                className="profile-pic w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full object-cover"
              />
              <h1 className="ml-3 text-white font-sans">{user.first_name} {user.last_name}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button><TbEdit className="text-white w-6 h-6" /></button>
              <button><TbDots className="text-white w-6 h-6" /></button>
            </div>
          </div>

          {/* Chat Search and Add */}
          <div className="flex text-color py-2">
            <div className="flex chat-bg rounded-md p-2 flex-1 items-center">
              <TbSearch className="text-color w-6 h-6" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent border-none outline-none w-full text-color ml-2"
              />
            </div>
            <button
              className="ml-2 p-2 chat-bg rounded-md flex items-center justify-center hover:bg-opacity-20 transition-all duration-300"
              onClick={() => setAddChat(prev => !prev)}
            >
              {addChat ? (
                <TbMinus className="text-color w-6 h-6" />
              ) : (
                <TbPlus className="text-color w-6 h-6" />
              )}
              {addChat && (
                <div className="absolute top-0 left-full ml-2 p-2 bg-white shadow-md rounded-md w-[400px] z-20">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="p-2 border rounded-md flex-grow mr-2"
                    />
                    <button className="bg-blue-400 text-white px-4 py-2 rounded-md">
                      Search
                    </button>
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Chat List */}
          <div className="py-3">
            {chatList}
          </div>
        </div>
      </div>

      {/* Chat View */}
      <div className={`chat-list ${!infoPanelVisible ? 'lg:w-3/5' : 'lg:w-4/5'} p-5 relative z-10`}>
        {detailChatView}
      </div>

      {/* Detailed User View */}
      {!infoPanelVisible && view && (
        <div className="detail-view lg:w-1/5 p-5 relative z-10">
          {personDetails}
        </div>
      )}
    </div>
  );
};

export default Chat;