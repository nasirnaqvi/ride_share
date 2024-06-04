import { ChangeEvent, useEffect, useState } from "react"
import axios from "axios"


interface ProfileProps {
  setSignedIn: () => void
}

interface User {
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  password: string
}

export default function Profile(props: ProfileProps) {
  const [user, setUser] = useState<User>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  })

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/getInfo`, {withCredentials: true})
    .then((response) => {
      setUser(response.data)
    })
    .catch(() => {
      console.log("Failed to get user profile")
    })
  }, [])

  function changeForm(event: ChangeEvent<HTMLInputElement>) {
    const {name, value} = event.target
    setUser({
      ...user, 
      [name]: value
    })
}

  function handleProfileUpdate() {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/profile/updateInfo`, user, {withCredentials: true})
    .then(() => {
      console.log("Profile updated")
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
      <form className="flex flex-col mt-2 space-y-1">
        <label htmlFor="username">Username:</label>
        <input 
          className="border-2 rounded-lg p-1"
          type="text" 
          id="username" 
          name="username" 
          value={user.username}
          onChange={changeForm}
        />
        <label htmlFor="first_name">First Name:</label>
        <input 
          className="border-2 rounded-lg p-1"
          type="text" 
          id="first_name" 
          name="first_name" 
          value={user.first_name}
          onChange={changeForm}
        />
        <label htmlFor="last_name">Last Name:</label>
        <input 
          className="border-2 rounded-lg p-1"
          type="text" 
          id="last_name" 
          name="last_name" 
          value={user.last_name}
          onChange={changeForm}
        />
        <label htmlFor="email">Email:</label>
        <input 
          className="border-2 rounded-lg p-1"
          type="email" 
          id="email" 
          name="email" 
          value={user.email}
          onChange={changeForm}
        />
        <label htmlFor="password">Password:</label>
        <input 
          className="border-2 rounded-lg p-1"
          type="password" 
          id="password" 
          name="password" 
          value={user.password}
          onChange={changeForm}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={handleProfileUpdate}
      >
        Update
      </button>
      </form>
    </div>
  )
}