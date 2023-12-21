import { pieceDetails } from "./Pieces/Details/pieceDetails";
import Piece from "./Pieces/Piece";

export default function Board(props: { gameType: string, initialFenPos: string }) {

    const details = pieceDetails(props.initialFenPos);

    return (
        <div className="bg-[url('/public/Images/Board.png')] w-[600px] h-[600px] bg-no-repeat bg-cover relative">

            {details.map((value, index) => {
                return (
                    <Piece details = {value} key={index}/>
                )
            })}
            </div>
    );
}

