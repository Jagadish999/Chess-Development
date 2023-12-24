import { pieceDetails } from "./pieceDetails";
import Piece from "./Piece";

export default function Board(props: { initialFenPos: string }) {

    
    const details = pieceDetails(props.initialFenPos);


    return (
        <div className="bg-[url('/public/Images/brd.webp')] w-[600px] h-[600px] bg-no-repeat bg-cover relative">

            {details.map((value, index) => {
                return (
                    <Piece details = {value} key={index}/>
                )
            })}
            </div>
    );
}

