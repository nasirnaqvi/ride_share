import { Outlet } from 'react-router-dom';

import Navbar from "../components/Navbar";


export default function Layout(props) {
    return (
        <div>
            <Navbar signedIn={props.signedIn} numberOfFriendRequests={props.numberOfFriendRequests} numberOfRideRequests={props.numberOfRideRequests}/>
            <Outlet />
        </div>
    )
}