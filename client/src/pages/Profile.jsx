import { ChangeEvent, useEffect, useState } from "react"
import axios from "axios"

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

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/getInfo`, {withCredentials: true})
    .then((response) => {
      setUser(response.data)
    })
    .catch(() => {
      console.log("Failed to get user profile")
    })
  }, [])

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
    const {name, value} = event.target
    setUser({
      ...user, 
      [name]: value
    })
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

  return (
    <div className="p-4 font-sans font-medium">
      <div className="flex">
        <h1 className="text-2xl font-bold mr-auto">Profile</h1>
        <button
          className="p-1 text-xl"
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
  )
}