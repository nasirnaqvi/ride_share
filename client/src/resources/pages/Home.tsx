import React, { useState } from 'react';
import Navbar from './../partials/menu.jsx';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {

    setIsLoggedIn(false);
  }

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {/* idk what to put here */}
    </div>
  );
}

export default Home;
