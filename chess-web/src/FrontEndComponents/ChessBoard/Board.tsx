
import Piece from "./Piece";
import { PieceDetails } from "./pieceTypes";

export default function Board(props: { moveDetails: PieceDetails [] }) {

    
    const details = props.moveDetails;

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

