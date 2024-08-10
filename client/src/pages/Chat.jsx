import React, { useMemo, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import {
  TbSearch, TbPlus, TbDots, TbEdit, TbInfoCircle,
  TbPhoto, TbCamera, TbMicrophone, TbSend, TbMoodSmile, TbMinus
} from 'react-icons/tb';
import background from './../resources/imgs/map-bg.png';
import EmojiPicker from 'emoji-picker-react';
import { add, formatDistanceToNow } from 'date-fns';

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


  //Used for panel when clicking on chat
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  //Chats are visible on the left side
  const [chats, setChats] = useState([]);
  const [chatList, setChatList] = useState(null);



  const [displayOtherContent, setDisplayOtherContent] = useState(false);

  const [infoPanelVisible, setInfoPanelVisible] = useState(false);
  const [chatPanelVisible, setChatPanelVisible] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [addChatWindowVisible, setAddChatWindowVisible] = useState(false);
  const [friendSearch, setFriendSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');



  const emojiPickerRef = useRef(null);
  const endRef = useRef(null);

  const [editedName, setEditedName] = useState(currentUser?.chatName || currentUser?.name || '');
  const [chatNameWidth, setChatNameWidth] = useState('auto');


  const changeChatName = async (newName) => {
    if (!newName || newName.length > 50) {
      console.error('Invalid chat name. It must be between 1 and 50 characters.');
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/chats/updateChatName`,
        { chatId: currentUser._id, chatName: currentUser.chatName, newName: newName },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log('Chat updated successfully:', response.data);
        console.log("Chats to change for name is ", chats)
        const updatedChats = chats.map(chat =>
          chat._id === currentUser._id ? { ...chat, chatName: newName } : chat
        );
        setChats(updatedChats);


      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error updating chat:', error.response?.data || error.message);
    }

  };

  const handleChatNameChange = (event) => {
    const newChatName = event.target.value;

    // Limit the chat name length to 50 characters
    if (newChatName.length > 50) return;

    // Update state for edited chat name and width
    setEditedName(newChatName);
    const estimatedWidth = Math.min(newChatName.length * 8 + 20, 300); // Adjust multiplier and max width as needed
    setChatNameWidth(`${estimatedWidth}px`);
  };




  // Fetch user profile and chat list
  useEffect(() => {

    //#region socket-connection
    const { token } = sessionStorage;
    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      extraHeaders: {
        authorization: `bearer ${token}`
      }
    });
    socket.on('message', (data) => {
      console.log("Got message ", data);

      // Assuming `data` is a single message object, we directly update the state
      setMessages((prevMessages) => {
        // Check if the new message already exists in the state to avoid duplication
        const messageExists = prevMessages.some((msg) => msg.id === data.id); // Assuming messages have a unique 'id'

        if (!messageExists) {
          return [...prevMessages, data];
        }

        return prevMessages; // No change if message already exists
      });
      setChats((prevChats) => {
        const chatIndex = prevChats.findIndex((chat) => chat.chatName === data.chatName);
        const updatedChat = {
          ...prevChats[chatIndex],
          lastMessage: data,
          isSeen: data.senderId === user.username
        };

        const updatedChats = [...prevChats];
        updatedChats[chatIndex] = updatedChat;

        return updatedChats;
      });

    });


    setSocket(socket);

    //#endregion

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/limitedInfo`, { withCredentials: true })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => console.log(error));


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
    console.log("Sending message ", message);
    if (!message.trim()) return;
    const newMessage = {
      chatName: currentUser.chatName,
      text: message.trim(),
      image: null,
      senderId: user.username,
      chatId: currentUser._id
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

  // Add emoji to message
  const onEmojiClick = (e) => {
    setMessage(prevMessage => prevMessage + e.emoji);
    setEmojiPickerVisible(false);
  };

  const getTimeDifference = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMinutes = (now - messageDate) / 60000;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;


    if (diffInMinutes < 1) {
      return "now";
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m`;
    } else if (diffInMinutes >= 60 && diffInMinutes < 1440) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return `${Math.floor(diffInDays)}d`;
    }
  };
  const shouldShowTimestamp = (current, next) => {
    const currentDate = new Date(current);
    const nextDate = new Date(next);
    const diffInMinutes = (nextDate - currentDate) / 60000;

    return diffInMinutes > 5;
  };
  // Toggle information panel visibility
  const toggleInfoPanel = () => setInfoPanelVisible(!infoPanelVisible);
  const toggleChatPanel = () => setChatPanelVisible(!chatPanelVisible);

  function generateChatList() {
    // Filter chats based on friendSearch and sort if needed
    const filteredChats = chats
      .filter((chat) =>
        chat.chatName.toLowerCase().includes(friendSearch.toLowerCase())
        || chat.users.some((user) => user.toLowerCase().includes(friendSearch.toLowerCase()))

      );

    return (
      filteredChats.map((chat, index) => (
        <div key={index} className="">
          <div className="chat-bg rounded-md p-4 mb-2 hover:bg-black hover:bg-opacity-20 transition-all duration-300">
            <button
              className="text-color p-2 w-full text-left"
              onClick={() => {
                setMessages(chat.messages);
                setCurrentUser(chat);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center flex-grow truncate">
                  <img
                    src={chat.image ? chat.image : "/images/default_profile_pic.jpg"}
                    alt="Profile picture"
                    className="profile-format"
                  />
                  <div className="flex flex-col truncate max-w-full flex-grow">
                    <h3 className={`text-base sm:text-md font-semibold mb-1 ${!chat.isSeen ? 'font-bold' : ''}`}>
                      {chat.groupname}
                    </h3>
                    <h3 className={`truncate ${!chat.isSeen ? 'font-bold' : ''}`}>
                      {chat.chatName}
                    </h3>
                    <h3 className={`truncate text-sm ${!chat.isSeen ? 'font-bold' : ''}`}>
                      {chat.lastMessage.senderId}: {chat.lastMessage.text}
                    </h3>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <h3 className="text-right whitespace-nowrap">
                    {getTimeDifference(chat.createdAt)}
                  </h3>
                </div>
              </div>



            </button>
          </div>
        </div>
      ))
    );
  }


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(friendSearch);
    }, 500);
    setChatList(generateChatList);
    return () => {
      clearTimeout(handler);
    };
  }, [friendSearch, chats]);



  // Generate message format

  const messageFormat = messages.map((msg, index) => {
    const showTimestamp = index === messages.length - 1 || shouldShowTimestamp(messages[index + 1].createdAt, msg.createdAt);

    const isCurrentUser = msg.senderId === user.username;
    const isMsgTypeMessage = msg.msgType === 'info';

    return (
      <div
        key={index}
        className={`flex mb-2 overflow-auto ${isMsgTypeMessage ? 'justify-center' : isCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`flex flex-col ${isMsgTypeMessage ? 'items-center' : isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
          <div
            className={`p-2 rounded-lg ${isMsgTypeMessage ? 'bg-gray-500 bg-opacity-50 text-white' : isCurrentUser ? 'bg-blue-900 bg-opacity-60 text-white' : 'bg-gray-800 bg-opacity-60 text-white'}`}
          >
            <p className="whitespace-normal p-1">{msg.text}</p>
          </div>
          {showTimestamp && (
            <span
              className={`text-xs text-gray-500 mt-1 ${isCurrentUser && !isMsgTypeMessage ? 'text-right' : 'text-left'}`}
            >
              {getTimeDifference(msg.createdAt)}
            </span>
          )}
        </div>
        {index === messages.length - 1 && <div ref={endRef}></div>}
      </div>
    );
  });

  const addChatWindow = addChatWindowVisible && (
    <div className="p-2 rounded-md chat-bg">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for a user..."
        className="bg-transparent border-none outline-none w-full text-color ml-2"
      />

      {/* Other content can go here */}
      {/* ... */}

    </div>
  );





  // Chat view details
  const detailChatView = currentUser && (
    <div className={`flex flex-col h-full max-h-screen ${!infoPanelVisible ? 'flex-grow' : ''}`}>
      <div id="top" className="flex items-center text-color px-2 py-2">
        <img
          src={currentUser.image ? currentUser.image : "/images/default_profile_pic.jpg"}
          alt="Profile picture"
          className="profile-pic w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full object-cover mr-2"
        />
        <div className="flex-col"
          style={{ width: chatNameWidth }}>
          <input className="text-base sm:text-lg font-semibold bg-transparent hover:bg-opacity-20 transition-all duration-300"
            value={editedName}
            onChange={handleChatNameChange}
            onFocus={() => setEditedName(currentUser.chatName ? currentUser.chatName : currentUser.name)}
            placeholder={currentUser.chatName ? currentUser.chatName : currentUser.name}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                changeChatName(e.target.value);
              }
            }}
          >
          </input>
          <h4 className="text-sm sm:text-base mb-1">
            [{currentUser.description}]
          </h4>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <button className="p-0" onClick={toggleChatPanel}>
            <TbDots className="text-white icon-formatting" />
          </button>
          <button className="p-0" onClick={toggleInfoPanel}>
            <TbInfoCircle className="text-white icon-formatting" />
          </button>
        </div>
      </div>
      <div id="middle" className="flex-grow overflow-auto">
        {messageFormat}
      </div>
      <div id="bottom" className="flex items-center p-2">
        <div className="flex items-center space-x-2">
          <button className="text-white"><TbPhoto className="icon-formatting" /></button>
          <button className="text-white"><TbCamera className="icon-formatting" /></button>
          <button className="text-white"><TbMicrophone className="icon-formatting" /></button>
        </div>
        <div className="flex-1 mx-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="w-full px-4 py-2 rounded-md text-white chat-bg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage(e.target.value);
              }
            }}
          />
        </div>
        <div className="flex items-center space-x-2 relative">
          <button
            className="text-white p-0"
            onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
          >
            <TbMoodSmile className="icon-formatting" />
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
            <TbSend className="icon-formatting" />
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
    <div id="main" className="relative flex lg:flex-row home-md overflow-hidden text-xs sm:text-sm md:text-md lg:text-lg xl:text-lg">
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
              <button><TbEdit className="text-white icon-formatting"
                onClick={() => {
                  setAddChatWindowVisible(!addChatWindowVisible)
                  setCurrentUser(null);
                }}
              /></button>
              <button><TbDots className="text-white icon-formatting" /></button>
            </div>
          </div>

          {/* Chat Search and Add */}
          <div className="flex text-color py-2">
            <div className="flex chat-bg rounded-md p-2 flex-1 items-center">
              <TbSearch className="text-color icon-formatting" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent border-none outline-none w-full text-color ml-2"
                value={friendSearch}
                onChange={(e) => setFriendSearch(e.target.value)}
              />
            </div>
            <button
              className="ml-2 p-2 chat-bg rounded-md flex items-center justify-center hover:bg-opacity-20 transition-all duration-300"
              onClick={() => {

                setAddChatWindowVisible(false);
                setCurrentUser(null);

              }}
            >
              {displayOtherContent || currentUser || addChatWindowVisible ? (
                <TbMinus className="text-color icon-formatting" />
              ) : (
                <TbPlus className="text-color icon-formatting" />
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
      <div className={`chat-list ${!infoPanelVisible ? 'lg:w-3/5' : 'lg:w-4/5'} p-5 z-10`}>
        {detailChatView || addChatWindow}
      </div>

      {/* Detailed User View */}
      {!infoPanelVisible && currentUser && (
        <div className="detail-view lg:w-1/5 p-5 z-10">
          {personDetails}
        </div>
      )}
    </div>
  );
};

export default Chat;