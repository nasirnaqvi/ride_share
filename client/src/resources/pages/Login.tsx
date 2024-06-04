import React, { FormEvent, useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


interface LoginProps {
    setSignedIn: () => void
}

export default function Login(props: LoginProps) {

    const [user, setUser] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    
    })
    const [onLogin, setOnLogin] = useState(true)
    const [failedLogin, setFailedLogin] = useState(false)
    const [keepSignedIn, setKeepSignedIn] = useState(true)

    const navigate = useNavigate()

    function changeForm(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target
        setUser({...user, [name]: value})
    }

    function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();  

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
            username: user.username,
            password: user.password,
            keepSignedIn: keepSignedIn
        },
        {withCredentials: true})
        .then(() => {
            props.setSignedIn()
            navigate('/home')
        })
        .catch(() => {
            setFailedLogin(true)
        })
    }

    function handleSignup(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, user)
        .then(() => {
            navigate('/login')
        })
        .catch(() => {
            alert('Failed to register user')
        })
        setOnLogin(true)
    }

    // function loginWithGoogle() {
    //     axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/google`)
    //     .then(() => {
    //         navigate('/home')
    //     })
    //     .catch(() => {
    //         alert('Failed to login with Google')
    //     })

    // }

    return (
        <div className="flex flex-col lg:flex-row lg:justify-center mt-2 w-screen font-sans p-4">
            <div className="mt-2 lg:mt-20 lg: mr-5 mb-2">
                <h1 className="text-5xl xl:text-6xl font-bold text-blue-600 mr-auto">ride share</h1>
                <h2 className="text-md xl:text-lg mr-auto roll-in-left">For all your travel needs</h2>
            </div>
            <div 
                className="flex flex-col justify-center form-background rounded-lg shadow-lg h-screen-70 lg:w-3/5 xl:w-2/5 2xl:w-1/3"
            >
                <div className="flex ml-4 mt-3 text-xl">
                    <button
                        onClick={() => setOnLogin(true)}  
                        className={onLogin ? "login-signin" : "login-signin-dark"}  
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => setOnLogin(false)}
                        className={onLogin ? "login-signin-dark" : "login-signin"}
                    >
                        Sign Up
                    </button>
                </div>
                {onLogin ? 
                    <form 
                        onSubmit={handleLogin}
                        className="flex flex-col p-4 w-full overflow-auto"
                    >  
                        <label htmlFor="username" className="text-white font-bold text-xs">USERNAME</label>
                        <input
                            className="input-field" 
                            type="text" 
                            id="username" 
                            name="username"
                            value={user.username} 
                            onChange={changeForm} 
                        />
                        <label htmlFor="password" className="text-white font-bold text-xs">PASSWORD</label>
                        <input 
                            className="input-field"
                            type="password" 
                            id="password"
                            name="password" 
                            value={user.password} 
                            onChange={changeForm}
                        />
                        <section className="flex justify-center">
                            {failedLogin && <p className="text-gray-900 p-2 font-bold bg-red-500 bg-opacity-50 rounded-md mb-4">Username or password is incorrect.</p>}
                        </section>
                        <button 
                            type="submit"
                            className="form-submit"
                        >
                            LOGIN
                        </button>
                    </form>
                    :
                    <form 
                        onSubmit={handleSignup}
                        className="flex flex-col p-4 w-full overflow-auto"
                    >  
                        <label htmlFor="username" className="text-white font-bold text-xs">USERNAME</label>
                        <input
                            className="input-field" 
                            type="text" 
                            id="username" 
                            name="username"
                            value={user.username} 
                            onChange={changeForm} 
                        />
                        <label htmlFor="first-name" className="text-white font-bold text-xs">FIRST NAME</label>
                        <input 
                            className="input-field"
                            type="text" 
                            id="first-name"
                            name="firstName" 
                            value={user.firstName} 
                            onChange={changeForm} 
                        />
                        <label htmlFor="last-name" className="text-white font-bold text-xs">LAST NAME</label>
                        <input 
                            className="input-field"
                            type="text" 
                            id="last-name"
                            name="lastName" 
                            value={user.lastName} 
                            onChange={changeForm}
                        />
                        <label htmlFor="email" className="text-white font-bold text-xs">EMAIL</label>
                        <input 
                            className="input-field"
                            type="email" 
                            id="email"
                            name="email" 
                            value={user.email} 
                            onChange={changeForm} 
                        />
                        <label htmlFor="password" className="text-white font-bold text-xs">PASSWORD</label>
                        <input 
                            className="input-field"
                            type="password" 
                            id="password"
                            name="password" 
                            value={user.password} 
                            onChange={changeForm} 
                        />
                        <button 
                            type="submit"
                            className="form-submit"
                        >
                            SIGN UP
                        </button>
                    </form>
                }
                {/* <div className="flex justify-center h-screen">
                    <div className="max-w-md w-full bg-clear rounded-lg p-2">
                        <a href="/auth/google" className="bg-red-400 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-700 transition duration-300">
                            Log In With Google
                        </a>
                    </div>
                </div> */}
            </div>
        </div>
    )
}