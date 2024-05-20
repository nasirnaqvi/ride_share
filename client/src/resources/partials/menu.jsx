import React from 'react';
import './../css/menu.css'

const menu = ({ isLoggedIn, onLogout }) => {
  return (
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
        {isLoggedIn ? (
          <li><button onClick={onLogout}>Logout</button></li>
        ) : (
          <li><a href="/login">Login</a></li>
        )}
      </ul>
    </nav>
  );
}

export default menu;