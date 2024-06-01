import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="flex items-center bg-black text-white text-lg space-x-3 h-14">
            <h1 className="ml-5 text-2xl">ride share</h1>
            <Link to="/">
                <button className="ml-16">Find Rides</button>
            </Link>
            <Link to="/myrides">
                <button>My Rides</button>
            </Link>
            <Link to="/profile">
                <button>Profile</button>
            </Link>
        </nav>
    )
}