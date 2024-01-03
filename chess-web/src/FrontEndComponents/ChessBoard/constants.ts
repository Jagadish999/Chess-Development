import { CastleDetails } from "./pieceTypes";

export const INITIAL_FEN_POSITION = "1k6/3b4/8/8/8/8/4N3/2K5 w KQkq - 0 1";
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
