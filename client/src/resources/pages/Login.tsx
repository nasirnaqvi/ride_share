import {FormEvent, useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

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

        if (username === 'admin' && password === 'admin') {
            setIsAuthenticated(true)
        }
        else {
            alert('Invalid credentials')
        }
    }

    return (
        <form 
            onSubmit={handleLogin}
            className="flex flex-col w-1/4 mx-auto mt-20 p-4 bg-gray-200 rounded-lg shadow-lg"
        >  
            <input
                className="mb-2 p-2 rounded-md" 
                type="text" 
                placeholder="username" 
                name="username"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
                className="mb-2 p-2 rounded-md"
                type="password" 
                placeholder="password"
                name="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button 
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
                Login
            </button>
        </form>
    )
}