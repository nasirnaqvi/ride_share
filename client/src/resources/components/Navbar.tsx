import { Link } from 'react-router-dom';

type NavbarProps = {
    signedIn: boolean
}

export default function Navbar(props: NavbarProps) {
    return (
        <nav className="bg-black text-white flex items-center p-3 w-screen">
            <h1 className="text-2xl md:text-3xl">ride share</h1>
            <Link to="/" className="ml-3 md:ml-5 mt-1 md:text-xl">
                Find Rides
            </Link>
            <Link to="/myrides" className="ml-3 md:ml-5 mt-1 md:text-xl">
                MyRides
            </Link>
            <Link to="/profile" className="ml-auto mt-1 md:text-xl">
                {props.signedIn ? 
                    <img src="/images/profile_icon.png" alt="Profile picture." className="w-10 md:w-12" />
                : 
                    "Login"
                }
            </Link>
        </nav>
    )
}