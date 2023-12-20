import DashboardIcon from '@mui/icons-material/Dashboard';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ExtensionIcon from '@mui/icons-material/Extension';
import LogoutIcon from '@mui/icons-material/Logout';

import { Link } from "react-router-dom";

const NAV_LINKS = [
    {
        title: "Dashboard",
        icon: <DashboardIcon />,
        redirect: "/dashboard"
    },
    {
        title: "Play",
        icon: <SportsEsportsIcon />,
        redirect: "/play"
    },
    {
        title: "Analysis",
        icon: <QueryStatsIcon />,
        redirect: "/analysis"
    },
    {
        title: "Puzzle",
        icon: <ExtensionIcon />,
        redirect: "/puzzle"
    },
    {
        title: "LogOut",
        icon: <LogoutIcon />,
        redirect: "/logout"
    },
];

export default function SideNav() {

    return (
        <ul className='mt-14'>
            {NAV_LINKS.map((value, index) => {

                return (
                    <li key={index} className=''>

                        <Link to={value.redirect} className="mt-2 pt-3 pb-3 pl-4 text-xl w-full block hover:bg-blue-800 text-white">
                            <span>
                                {value.icon}
                            </span>
                            <span className='ml-4'>
                                {value.title}
                            </span>
                        </Link>
                    </li>
                )
            })}
        </ul>
    );
}