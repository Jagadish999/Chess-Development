import {Link} from "react-router-dom";

export default function Play(){

    return (
        <div className="mt-5 ml-5">

            <Link className="ml-12 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" to="/play/online">Player Vs Player</Link>
            <Link className="ml-12 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" to="/play/engine">Player Vs Computer</Link>
        </div>
    )
}