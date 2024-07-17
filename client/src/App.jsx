import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'

import Layout from './routes/Layout'
import ProtectedRoute from './routes/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import MyRides from './pages/MyRides'

export default function App() {
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/isLoggedIn`, {withCredentials: true})
      .then(response => {
        setSignedIn(response.data.isLoggedIn)
      })
      .catch(error => {
        console.log(error)
      })
  }, []);

  return (
    <Router> 
      <Routes>
        <Route element={<Layout signedIn={signedIn}/>}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setSignedIn={() => setSignedIn(true)}/>} />
          <Route path="/profile" element={
            <ProtectedRoute signedIn={signedIn}>
              <Profile setSignedIn={() => setSignedIn(false)}/>
            </ProtectedRoute>
            } 
          />
          <Route path="/myrides" element={
            <ProtectedRoute signedIn={signedIn}>
              <MyRides />
            </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  )
}