import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import debounce from "lodash.debounce"

export default function Profile(props) {
  const [user, setUser] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    profile_img: null,
    trips_taken: 0,
    password: ""
  })
  const [isSettingsSaved, setIsSettingsSaved] = useState(false)
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [passwordsDontMatch, setPasswordsDontMatch] = useState(false)
  const [currentPage, setCurrentPage] = useState('profile')
  const [searchQuery, setSearchQuery] = useState("")
  const [friends, setFriends] = useState([])
  const [addFriends, setAddFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState([])
  const [toggleFriendRequests, setToggleFriendRequests] = useState(false)
  const [toggleFriends, setToggleFriends] = useState(false)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/getInfo`, {withCredentials: true})
    .then((response) => {
      setUser(response.data)
    })
    .catch(() => {
      console.log("Failed to get user profile")
    })
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/getMyFriends`, {withCredentials: true})
    .then((response) => {
      setFriends(response.data)
    })
    .catch(() => {
      console.log("Failed to get friends")
    })
  }, [toggleFriends]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/getFriendRequests`, {withCredentials: true})
    .then((response) => {
      setFriendRequests(response.data)
    })
    .catch(() => {
      console.log("Failed to get friend requests")
    })
  }, [toggleFriendRequests]);

  function fetchAddFriends(query) {
    if (query === "") {
      setAddFriends([])
      return;
    }

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/getAddFriends`, {
      withCredentials: true,
      params: { searchQuery: query }
    })
    .then((response) => {
      setAddFriends(response.data)
    })
    .catch(() => {
      console.log("Failed to get add friends")
    })
  }
  const debouncedFetchAddFriends = useCallback(debounce(fetchAddFriends, 500), [])

  function handleFileChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUser({
        ...user,
        profile_img: reader.result
      });
    }
    reader.readAsDataURL(file);
  };

  function changeForm(event) {
    const {name, value} = event.target;
    setUser({
      ...user, 
      [name]: value
    })
  }

  function handleSearchChange(event) {
    setSearchQuery(event.target.value)
    debouncedFetchAddFriends(event.target.value)
  }

  function handleProfileUpdate(event) {
    event.preventDefault()

    if (user.password !== passwordConfirm) {
      setPasswordsDontMatch(true)
      setIsSettingsSaved(false)
      return
    }

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/profile/updateInfo`, {
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      profile_img: user.profile_img
    }, {withCredentials: true})
    .then(() => {
      setIsSettingsSaved(true)
      setPasswordsDontMatch(false)
    })
    .catch(() => {
      console.log("Failed to update profile")
    })
  }

  function handleLogout() {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {withCredentials: true})
    .then(() => {
      props.setSignedIn()
    })
    .catch(() => {
      console.log("Failed to logout")
    })
  }

  function handleAddFriend(friend) {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/profile/addFriend`, {
      friendUsername: friend.username
    }, {withCredentials: true})
    .then(() => {
      fetchAddFriends(searchQuery)
    })
    .catch(() => {
      console.log("Failed to add friend")
    })
  }

  function handleAcceptFriendRequest(friendUsername) {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/profile/acceptFriendRequest`, {
      friendUsername: friendUsername
    }, {withCredentials: true})
    .then(() => {
      setToggleFriendRequests(prevToggleFriendRequests => !prevToggleFriendRequests)
      setToggleFriends(prevToggleFriends => !prevToggleFriends)
      props.acceptFriendRequest()
    })
    .catch(() => {
      console.log("Failed to accept friend request")
    })
  }

  function handleRejectFriendRequest(friendUsername) {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/profile/rejectFriendRequest`, {
      friendUsername: friendUsername
    }, {withCredentials: true})
    .then(() => {
      setToggleFriendRequests(prevToggleFriendRequests => !prevToggleFriendRequests)
    })
    .catch(() => {
      console.log("Failed to reject friend request")
    })
  }

  function handleRemoveFriend(friendUsername) {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/profile/removeFriend`, {
      friendUsername: friendUsername
    }, {withCredentials: true})
    .then(() => {
      setToggleFriends(prevToggleFriends => !prevToggleFriends)
      fetchAddFriends(searchQuery)
    })
    .catch(() => {
      console.log("Failed to remove friend")
    })
  }

  const friendsList = friends !== null && friends.length > 0 ? friends.map((friend, index) => {
    if (friend.first_name.toLowerCase().includes(searchQuery.toLowerCase()) || friend.last_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return (
        <div key={index} className="w-full md:w-1/2 lg:w-1/3 p-2">
          <div className="p-4 border rounded-lg shadow-lg">
            <img src={friend.profile_img ? friend.profile_img : "/images/default_profile_pic.jpg"} alt={`${friend.first_name} ${friend.last_name}`} className="w-16 h-16 rounded-full mx-auto"/>
            <h3 className="text-lg font-bold mt-2 text-center">{friend.first_name} {friend.last_name}</h3>
            <p className="text-center">Trips taken: {friend.trips_taken}</p>
            <button 
              onClick={() => handleRemoveFriend(friend.username)} 
              className="mt-2 w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Remove Friend
            </button>
          </div>
        </div>
      )
    }
  }) : <p className="text-center text-gray-600">No friends found</p>

  const addFriendsList = addFriends !== null && addFriends.length > 0 ? addFriends.map((friend, index) => {
    return (
      <div key={index} className="w-full md:w-1/2 lg:w-1/3 p-2">
        <div className="p-4 border rounded-lg shadow-lg">
          <img src={friend.profile_img ? friend.profile_img : "/images/default_profile_pic.jpg"} alt={`${friend.first_name} ${friend.last_name}`} className="w-16 h-16 rounded-full mx-auto"/>
          <h3 className="text-lg font-bold mt-2 text-center">{friend.first_name} {friend.last_name}</h3>
          <p className="text-center">Trips taken: {friend.trips_taken}</p>
          {/* <button
            onClick={() => handleAddFriend(friend)} 
            className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Friend
          </button> */}
          {friend.status === 'pending' ? (
            <button
              onClick={() => handleAddFriend(friend)} 
              className="mt-2 w-full bg-yellow-500 text-white p-2 rounded-l"
              disabled
            >
              Pending
            </button>
          )
          : friend.status === 'rejected' ? (
            <button
              onClick={() => handleAddFriend(friend)} 
              className="mt-2 w-full bg-red-500 text-white p-2 rounded-lg"
            >
              Rejected
            </button>
          )
          : (
            <button
              onClick={() => handleAddFriend(friend)} 
              className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Friend
            </button>
          )}
        </div>
      </div>
    )
  }) : <p className="text-center text-gray-600">No users found</p>

  const friendRequestList = friendRequests !== null && friendRequests.length > 0 ? friendRequests.map((friend, index) => {
    return (
      <div key={index} className="flex-shrink-0 w-64 bg-white border border-gray-300 rounded-lg shadow-sm p-4 h-full flex flex-col justify-between">
        <div className="flex items-center mb-2">
          <img
            src={friend.profile_img ? friend.profile_img : "/images/default_profile_pic.jpg"}
            alt={`${friend.first_name} ${friend.last_name}`}
            className="w-10 h-10 rounded-full mr-2"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold truncate">{friend.first_name} {friend.last_name}</h3>
            <p className="text-xs text-gray-600 truncate">Trips taken: {friend.trips_taken}</p>
          </div>
        </div>
        <div className="flex justify-center space-x-1">
          <button
            className="px-2 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => handleAcceptFriendRequest(friend.username)}
          >
            Accept
          </button>
          <button
            className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => handleRejectFriendRequest(friend.username)}
          >
            Reject
          </button>
        </div>
      </div>
    )
  }) : <p className="text-center text-gray-600">No friend requests</p>

  

  return (
    <>
    {currentPage === 'profile' && (
      <div className="p-4 font-sans font-medium">
        <div className="flex">
          <button 
            className={currentPage === 'profile' ? "text-2xl font-bold mr-3" : "text-2xl mr-3"}
            onClick={() => setCurrentPage('profile')}
            disabled={currentPage === 'profile'}
          >
            Profile
          </button>
          <div className="relative">
            <button 
              className={currentPage === 'friends' ? "text-2xl font-bold mr-auto" : "text-2xl mr-auto"}
              onClick={() => setCurrentPage('friends')}
              disabled={currentPage === 'friends'}
            >
              Friends
            </button>
            {props.numberOfFriendRequests > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {props.numberOfFriendRequests}
              </span>
            )}
          </div>
          <button
            className="p-1 text-xl ml-auto"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <hr />
        {isSettingsSaved && 
          <div className="flex items-center justify-center w-full h-12 mt-3 bg-green-500 bg-opacity-60">
            <h1>Settings Saved</h1>
          </div>
        }
        <form className="flex flex-col lg:flex-row lg:justify-center lg:mt-20" onSubmit={handleProfileUpdate}>
            <div className="flex flex-col items-center mt-1 lg:w-1/3 lg:mr-10">
              <input 
                type="file" 
                className="ml-24"
                id="profile_img"
                name="profile_img"
                onChange={handleFileChange}
              >
              </input>
              <img src={user.profile_img ? user.profile_img : "/images/default_profile_pic.jpg"} alt="Profile picture." className="profile-pic mt-1 lg:mt-3"/>
              <p className="mt-1 lg:mt-3">Trips taken: {user.trips_taken}</p>
            </div>
            <div className="flex flex-col mt-2 lg:w-1/2">
              <label htmlFor="username" className="mt-1">Username:</label>
              <input 
                className="border-2 rounded-lg p-1"
                type="text" 
                id="username" 
                name="username" 
                value={user.username}
                onChange={changeForm}
              />
              <div className="flex flex-col md:flex-row md:items-center md:justify-center md:w-full">
                <div className="flex flex-col w-full">
                  <label htmlFor="first_name" className="mt-1 lg:mt-5">First Name:</label>
                  <input 
                    className="border-2 rounded-lg p-1 md:mr-2"
                    type="text" 
                    id="first_name" 
                    name="first_name" 
                    value={user.first_name}
                    onChange={changeForm}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="last_name" className="mt-1 md:ml-2 lg:mt-5">Last Name:</label>
                  <input 
                    className="border-2 rounded-lg p-1 md:ml-2"
                    type="text" 
                    id="last_name" 
                    name="last_name" 
                    value={user.last_name}
                    onChange={changeForm}
                  />
                </div>
              </div>
              <label htmlFor="email" className="mt-1 lg:mt-5">Email:</label>
              <input 
                className="border-2 rounded-lg p-1"
                type="email" 
                id="email" 
                name="email" 
                value={user.email}
                onChange={changeForm}
              />
              <label htmlFor="password" className="mt-1 lg:mt-5">Password:</label>
              <input 
                className="border-2 rounded-lg p-1"
                type="password" 
                id="password" 
                name="password" 
                value={user.password}
                onChange={changeForm}
              />
              {passwordsDontMatch &&
                <div className="mx-auto mt-1 lg:mt-5 p-2 bg-red-500 bg-opacity-70">
                  <h2 className="font-bold">Passwords do not match</h2>
                </div>
              }
              <label htmlFor="passwordConfirm" className="mt-1 lg:mt-5">Confirm Password:</label>
              <input 
                className="border-2 rounded-lg p-1"
                type="password" 
                id="passwordConfirm" 
                name="passwordConfirm" 
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full max-w-xs mx-auto mt-3 lg:mt-5"
              >
                Save
              </button>
            </div>
        </form>
      </div>
    )}

    {currentPage === 'friends' && (
      <div className="p-4 font-sans font-medium">
        <div className="flex">
          <button 
            className={currentPage === 'profile' ? "text-2xl font-bold mr-3" : "text-2xl mr-3"}
            onClick={() => setCurrentPage('profile')}
            disabled={currentPage === 'profile'}
          >
            Profile
          </button>
          <div className="relative">
            <button 
              className={currentPage === 'friends' ? "text-2xl font-bold mr-auto" : "text-2xl mr-auto"}
              onClick={() => setCurrentPage('friends')}
              disabled={currentPage === 'friends'}
            >
              Friends
            </button>
            {props.numberOfFriendRequests > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {props.numberOfFriendRequests}
              </span>
            )}
          </div>
          <button
            className="p-1 text-xl ml-auto"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <hr />

        <div className="mt-4 mb-4">
          <input
            type="text"
            className="w-full p-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for a friend..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {searchQuery === '' && ( 
          <div className="mt-4">
            <h2 className="text-xl md:text-2xl mt-3 mb-1">Friend Requests:</h2>
            {friendRequestList}
          </div>
        )}

        {searchQuery !== '' && (
          <div className="mt-4">
            <h2 className="text-xl md:text-2xl mt-3 mb-1">Add Friends:</h2>
            <div className="flex flex-wrap">
              {addFriendsList}
            </div>
          </div>
        )}

        <div className="mt-4">
          <h2 className="text-xl md:text-2xl mt-3 mb-1">My Friends:</h2>
          <div className="flex flex-wrap">
            {friendsList}
          </div>
        </div>
      </div>
    )}
    </>
  )
}