import {FormEvent, useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home')
        }
    }, [isAuthenticated])

    function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
            username,
            password
        })
        .then(() => {
            setIsAuthenticated(true)
        })
        .catch(() => {
            alert("Username or password is incorrect.")
        })
    }

    return (
        <div className="flex h-screen pt-32 justify-center">
            <div className="mt-20 mr-10">
                <h1 className="text-3xl mr-auto">ride share</h1>
                <h2 className="text-xl mr-auto">For all your travel needs</h2>
            </div>
            <div 
                style={{backgroundImage: "url(https://newyorkrentalbyowner.com/blog/wp-content/uploads/2019/09/Skiing-in-Upstate-New-York-10-Best-Ski-Resorts-For-Your-Winter-Vacation.jpeg)"}}
                className="flex items-center justify-center w-1/5 h-4/6 bg-cover bg-center bg-no-repeat rounded-lg shadow-lg"
            >
                <form 
                    onSubmit={handleLogin}
                    className="flex flex-col p-4 w-full overflow-hidden"
                >  
                    <label htmlFor="username" className="text-white">Username</label>
                    <input
                        className="mb-3 p-2 rounded-md" 
                        type="text" 
                        id="username"
                        placeholder="username" 
                        name="username"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                    <label htmlFor="password" className="text-white">Username</label>
                    <input 
                        className="p-2 rounded-md"
                        type="password" 
                        id="password"
                        placeholder="password"
                        name="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <button 
                        type="submit"
                        className="m-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}