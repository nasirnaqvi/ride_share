import {FormEvent, useState, useEffect} from 'react';

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        if (isAuthenticated) {
            window.location.replace('/home')
        }
    }, [isAuthenticated])

    function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (username === 'admin' && password === 'abc123') {
            setIsAuthenticated(true)
        }
        else {
            alert('Invalid credentials')
        }
    }

    return (
        <form onSubmit={handleLogin}>  
            <input 
                type="text" 
                placeholder="username" 
                name="username"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="password"
                name="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button type="submit">Login</button>
        </form>
    )
}