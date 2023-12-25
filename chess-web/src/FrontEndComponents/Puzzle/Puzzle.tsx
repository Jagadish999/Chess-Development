import Board from "../ChessBoard/Board";
import { findPieceMoveDetails } from "../ChessBoard/pieceDetails";
import { PieceDetails } from "../ChessBoard/pieceTypes";

export default function Puzzle(){

    const initialFenPosition = "r3k2r/5b2/3nq3/P5pP/1PNnBpP1/3PN3/3P1P2/R3K2R w KQkq g6 0 1";
    const pieceDetails:PieceDetails [] = findPieceMoveDetails(initialFenPosition);

    return (
        <div className="block mt-[4%] ml-[16%]">
            <Board moveDetails={pieceDetails}/>
        </div>
    )
}