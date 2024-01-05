import { useState } from "react";
import { Link } from "react-router-dom";

export default function Play() {

    const [colorSelection, setColorSelection] = useState<boolean>(false);

    return (
        <div className="mt-5 ml-5">

            <Link
                className="ml-12 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                to="/play/online">Player Vs Player
            </Link>

            <button
                className=" ml-12 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                onClick={() => {
                    setColorSelection(true);
                }}
            >
                Player Vs Computer
            </button>

            {colorSelection && (

                <>
                    <div
                        className="fixed w-screen h-screen top-[0px] left-[0px] bg-[rgba(33,33,33,0.5)]"
                        onClick={() => {
                            setColorSelection(false);
                        }}
                    >
                    </div>

                    <div className="absolute w-[320px] h-[200px] bg-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">

                        <div className="flex justify-end">
                            <span
                             className="p-[8px] text-2xl font-bold bg-red-400 cursor-pointer"
                             onClick={() => {
                                setColorSelection(false);
                             }}
                             >X</span>
                        </div>

                        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">

                            <Link
                                className=" bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                                to="/play/engine/w">
                                White
                            </Link>
                            <Link
                                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                                to="/play/engine/b">
                                Black
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}