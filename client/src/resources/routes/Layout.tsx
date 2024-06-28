import { Outlet } from 'react-router-dom';

import Navbar from "../components/Navbar";

type LayoutProps = {
    signedIn: boolean
}

export default function Layout(props: LayoutProps) {
    return (
        <div>
            <Navbar signedIn={props.signedIn}/>
            <Outlet />
        </div>
    )
}

