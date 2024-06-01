import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Layout from './resources/routes/Layout'
import ProtectedRoute from './resources/routes/ProtectedRoute'
import Home from './resources/pages/Home'
import Login from './resources/pages/Login'
import Profile from './resources/pages/Profile'
import MyRides from './resources/pages/MyRides'

export default function App() {
  const [signedIn, setSignedIn] = useState(false)

  return (
    <Router> 
      <Routes>
        <Route element={<Layout />}>
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