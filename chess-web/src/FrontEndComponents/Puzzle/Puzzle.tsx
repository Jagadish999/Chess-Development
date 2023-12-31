import Board from "../ChessBoard/Board";
import { findPieceMoveDetails } from "../ChessBoard/boardDetails";
import { CastleDetails, PieceDetails } from "../ChessBoard/pieceTypes";

export default function Puzzle(){

    const initialFenPosition = "r3k2r/8/3nq3/P5pP/1PNnBpPb/3PNP2/3P4/R3K2R w KQkq - 0 1";
    
    const castleDetails: CastleDetails = {
        whiteKingMoved: false,
        whiteKingChecked: false,
        whiteKingSideRookMoved: false,
        whiteKingSideRookCaptured: false,
        whiteKingSideSquaresChecked: false,
        whiteQueenSideRookMoved: false,
        whiteQueenSideRookCaptured: false,
        whiteQueenSideSquaresChecked: false,
        blackKingMoved: false,
        blackKingChecked: false,
        blackKingSideRookMoved: false,
        blackKingSideRookCaptured: false,
        blackKingSideSquaresChecked: false,
        blackQueenSideRookMoved: false,
        blackQueenSideRookCaptured: false,
        blackQueenSideSquaresChecked: false,
    };

    const pieceDetails:PieceDetails [] = findPieceMoveDetails(initialFenPosition, castleDetails);

    return (
        <div className="block mt-[4%] ml-[16%]">
            {/* <Board moveDetails={pieceDetails}/> */}
        </div>
    )
}