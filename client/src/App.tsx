import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Home from './resources/pages/Home'
import Login from './resources/pages/Login'
import Profile from './resources/pages/Profile'

export default function App() {

  return (
    <Router> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}