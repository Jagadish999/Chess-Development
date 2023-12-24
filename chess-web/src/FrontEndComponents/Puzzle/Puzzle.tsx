import Board from "../ChessBoard/Board";
import { findPieceMoveDetails } from "../ChessBoard/pieceDetails";
import { PieceDetails } from "../ChessBoard/pieceTypes";

export default function Puzzle(){

    const initialFenPosition = "r3k2r/p3p1pp/1ppnp1b1/2q2p2/PPNnBPQb/R2P1N2/3P2PP/2B1K2R w KQkq - 0 1";
    const pieceDetails:PieceDetails [] = findPieceMoveDetails(initialFenPosition);

    return (
        <div className="block mt-[4%] ml-[16%]">
            <Board moveDetails={pieceDetails}/>
        </div>
    )
}