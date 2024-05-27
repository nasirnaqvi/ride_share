import {FormEvent, useState, ChangeEvent} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [user, setUser] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    
    })
    const [onLogin, setOnLogin] = useState(true)
    const [failedLogin, setFailedLogin] = useState(false)

    const navigate = useNavigate()

    function changeForm(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target
        setUser({...user, [name]: value})
    }

    function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
            username: user.username,
            password: user.password
        })
        .then(() => {
            navigate('/home')
        })
        .catch(() => {
            setFailedLogin(true)
        })
    }

    function handleSignup(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        alert("Signup successful! Please login.")
        setOnLogin(true)
    }

    return (
        <div className="flex h-screen w-screen pt-32 justify-center font-sans bg-blur">
            <div className="mt-20 mr-10">
                <h1 className="text-5xl font-bold text-blue-600 mr-auto">ride share</h1>
                <h2 className="text-md mr-auto roll-in-left">For all your travel needs</h2>
            </div>
            <div 
                className="flex flex-col justify-center form-background w-1/4 h-4/5 rounded-lg shadow-lg"
            >
                <div className="flex ml-4 text-xl">
                    <button
                        onClick={() => setOnLogin(true)}  
                        className={onLogin ? "login-signin" : "login-signin-dark"}  
                    >
                        LOG IN
                    </button>
                    <button
                        onClick={() => setOnLogin(false)}
                        className={onLogin ? "login-signin-dark" : "login-signin"}
                    >
                        SIGN UP
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
            </div>
        </div>
    )
}