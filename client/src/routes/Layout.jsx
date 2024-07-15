import { Outlet } from 'react-router-dom';

import Navbar from "../components/Navbar";


export default function Layout(props) {
    return (
        <div>
            <Navbar signedIn={props.signedIn}/>
            <Outlet />
        </div>
    )
}