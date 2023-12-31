import { CastleDetails } from "./pieceTypes";

export const INITIAL_FEN_POSITION = "rnbqkbnr/1p1ppppp/p7/4P3/2pP4/8/PPP2PPP/RNBQKBNR w KQkq - 0 1";
export const INITIAL_CASTLE_PERMISSION: CastleDetails = {
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
