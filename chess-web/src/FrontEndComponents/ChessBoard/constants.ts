import { CastleDetails } from "./pieceTypes";

export const INITIAL_FEN_POSITION = "rnbqkbnr/pp1pppPp/8/8/8/8/PpPPP1PP/RNBQKBNR w KQkq - 0 1";
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
