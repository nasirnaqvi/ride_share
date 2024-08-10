import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'

import Layout from './routes/Layout'
import ProtectedRoute from './routes/ProtectedRoute'
import RedirectIfSignedIn from './routes/RedirectIfSignedIn'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import MyRides from './pages/MyRides'
import Chat from './pages/Chat'

export default function App() {
  const [signedIn, setSignedIn] = useState(false)
  const [numberOfFriendRequests, setNumberOfFriendRequests] = useState(0)
  const [numberOfRideRequests, setNumberOfRideRequests] = useState(0)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/isLoggedIn`, {withCredentials: true})
      .then(response => {
        setSignedIn(response.data.isLoggedIn)
      })
      .catch(error => {
        console.log(error)
      })
  }, []);

  useEffect(() => {
    if (signedIn) {

    }
  }, [signedIn]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/getNumberOfFriendRequests`, {withCredentials: true})
      .then(response => {
        setNumberOfFriendRequests(response.data.count)
      })
      .catch(error => {
        console.log(error)
      })
  }, [signedIn]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/getNumberOfRideRequests`, {withCredentials: true})
      .then(response => {
        setNumberOfRideRequests(response.data.count)
      })
      .catch(error => {
        console.log(error)
      })
  }, [signedIn]);

  return (
    <Router> 
      <Routes>
        <Route element={<Layout signedIn={signedIn} numberOfFriendRequests={numberOfFriendRequests} numberOfRideRequests={numberOfRideRequests}/>}>
        <Route path="/" element={
            <ProtectedRoute signedIn={signedIn}>
              <Home />
            </ProtectedRoute>
            } 
        />
          <Route path="/login" element={
            <RedirectIfSignedIn signedIn={signedIn}>
              <Login setSignedIn={() => setSignedIn(true)}/>
            </RedirectIfSignedIn>
            }
          />
          <Route path="/profile" element={
            <ProtectedRoute signedIn={signedIn}>
              <Profile 
                setSignedIn={() => setSignedIn(false)} 
                acceptFriendRequest={() => setNumberOfFriendRequests(prevNumberOfFriendRequests => prevNumberOfFriendRequests - 1)}
                numberOfFriendRequests={numberOfFriendRequests}
              />
            </ProtectedRoute>
            } 
          />
          <Route path="/myrides" element={
            <ProtectedRoute signedIn={signedIn}>
              <MyRides acceptRide={() => setNumberOfRideRequests(prevNumberOfRideRequests => prevNumberOfRideRequests - 1)}/>
            </ProtectedRoute>
            } 
          />
          <Route path="/chat" element={
            <ProtectedRoute signedIn={signedIn}>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  )
}