import { FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignUpPanel, setShowSignUpPanel] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const textToType = "For all your travel needs.";
    const delay = 100;
    let i = 0;
    const typewriterElement = document.getElementById('description');

    function type() {
      if (typewriterElement && i < textToType.length) {
        typewriterElement.innerHTML += textToType.charAt(i);
        i++;
        setTimeout(type, delay);
      }
    }

    type();
  }, []);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, { username, password, keepSignedIn })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        alert("Username or password is incorrect.");
      });
  }

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, { username, password, firstName, lastName, email })
      .then((response) => {
        setMessage("Registration successful. Please log in.");
        setShowSignUpPanel(false);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "Registration failed.";
        setMessage(errorMessage);
      });
  }

  return (
    <div id="logindiv">
      <div id="textblock">
        <h1>
          <header id="name">ride share</header>
        </h1>
        <h6 id="description"></h6>
      </div>

      <div className="login-wrap">
        <div className="login-html">
          {message && <div className="error-message">{message}</div>}
          <input
            id="tab-1"
            type="radio"
            name="tab"
            className="sign-in"
            checked={!showSignUpPanel}
            onChange={() => setShowSignUpPanel(false)}
          />
          <label htmlFor="tab-1" className="tab">Sign In</label>
          <input
            id="tab-2"
            type="radio"
            name="tab"
            className="sign-up"
            checked={showSignUpPanel}
            onChange={() => setShowSignUpPanel(true)}
          />
          <label htmlFor="tab-2" className="tab">Sign Up</label>

          <div className="login-form">
            {!showSignUpPanel && (
              <div className="sign-in-htm">
                <form onSubmit={handleLogin}>
                  <div className="group">
                    <label htmlFor="signin-username" className="label">Username</label>
                    <input
                      id="signin-username"
                      type="text"
                      className="input"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="signin-password" className="label">Password</label>
                    <input
                      id="signin-password"
                      type="password"
                      className="input"
                      data-type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="group">
                    <input
                      id="check"
                      type="checkbox"
                      className="check"
                      name="keepSignedIn"
                      onChange={(e) => setKeepSignedIn(e.target.checked)}
                    />
                    <label htmlFor="check"><span className="icon"></span> Keep me Signed in</label>
                  </div>
                  <div className="group">
                    <input type="submit" className="button" value="Sign In" />
                  </div>
                  <div className="hr"></div>
                  <div className="foot-lnk">
                    <a href="#forgot">Forgot Password?</a>
                  </div>
                </form>
              </div>
            )}
            {showSignUpPanel && (
              <div className="sign-up-htm">
                <form onSubmit={handleRegister}>
                  <div className="group">
                    <label htmlFor="signup-username" className="label">Username</label>
                    <input
                      id="signup-username"
                      type="text"
                      className="input"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="first_name" className="label">First Name</label>
                    <input
                      id="first_name"
                      type="text"
                      className="input"
                      name="first_name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="last_name" className="label">Last Name</label>
                    <input
                      id="last_name"
                      type="text"
                      className="input"
                      name="last_name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="signup-password" className="label">Password</label>
                    <input
                      id="signup-password"
                      type="password"
                      className="input"
                      data-type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="email" className="label">Email Address</label>
                    <input
                      id="email"
                      type="text"
                      className="input"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="group">
                    <input type="submit" className="button" value="Register" />
                  </div>
                  <div className="hr"></div>
                  <div className="foot-lnk">
                    <label htmlFor="tab-1" onClick={() => setShowSignUpPanel(false)}>Already Member?</label>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
