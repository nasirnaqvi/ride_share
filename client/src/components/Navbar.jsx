import { Link } from 'react-router-dom';

export default function Navbar(props) {

    return (
        <nav className="bg-black text-white flex items-center p-3">
            <h1 className="text-2xl md:text-3xl">ride share</h1>
            <Link to="/" className="ml-3 md:ml-5 mt-1 md:text-xl">
                Find Rides
            </Link>
            <div className="relative ml-3 md:ml-5 mt-1">
                <Link to="/myrides" className="relative md:text-xl">
                    MyRides
                </Link>
                <Link to="/chat" className="ml-3 md:ml-5 mt-1 md:text-xl">
                Chats 
                </Link>
                {props.numberOfRideRequests > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {props.numberOfRideRequests}
                    </span>
                )}
            </div>
            <div className="relative ml-auto mt-1">
                <Link to="/profile" className="relative md:text-xl">
                    {props.signedIn ? 
                        <img src="/images/profile_icon.png" alt="Profile picture." className="w-10 md:w-12" />
                    : 
                        "Login"
                    }
                </Link>
                {props.numberOfFriendRequests > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {props.numberOfFriendRequests}
                    </span>
                )}
            </div>
        </nav>
    )
}