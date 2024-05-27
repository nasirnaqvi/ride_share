import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Home from './resources/pages/Home'
import Login from './resources/pages/Login'
import Profile from './resources/pages/Profile'
import ProtectedRoute from './resources/routes/ProtectedRoute'

export default function App() {
  const signedIn = localStorage.getItem('signedIn') === 'true'

  return (
    <Router> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={
          <ProtectedRoute signedIn={signedIn}>
            <Profile />
          </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}