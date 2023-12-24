import SideNav from "../FrontEndComponents/SideNav/SideNav";
import { Outlet } from "react-router-dom"


export default function RootNavigation() {

    return (
        <div className="w-screen h-screen flex flex-row align-center justify-evenly">
            <nav className="w-1/6 bg-gray-800">
                <SideNav></SideNav>
            </nav>
            <div className="w-5/6">
                <Outlet />
            </div>
        </div>
    )
}