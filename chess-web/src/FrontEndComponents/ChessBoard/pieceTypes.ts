export type PieceDetails = {
    rank: number;//Which rank piece exist
    file: number;//Which file piece exist
    pieceName: string;//Piece name like: 'p', 'P', 'q', 'Q'
    color: string;//'w' or 'b'
    linearMove: Location[];//move in empty squares
    capture:Location [];//move to capture pices
    unphasant:Location[];//special move for pawn for unphasant
    castle: Location[];//king permission to castle
}

//Move to respective file and rank
export type Location = {
    file: number,
    rank: number
}

//Details for move of a pawn
export type PawnDetails = {
    singleForward: number,
    doubleForward: number,
    captureRight: number,
    captureLeft: number,
    firstPawnPos: number,
    lastPawnPos: number
}

//Piece moves details
export type PieceMoves = {
    linearMove: Location[],
    captureMove: Location[],
    unphasantMove: Location[],
    castle: Location[]
}

export type CastleDetails = {
    whiteKingMoved: boolean;
    whiteKingChecked: boolean;
    whiteKingSideRookMoved: boolean;
    whiteKingSideRookCaptured: boolean;
    whiteKingSideSquaresChecked: boolean;
    whiteQueenSideRookMoved: boolean;
    whiteQueenSideRookCaptured: boolean;
    whiteQueenSideSquaresChecked: boolean;
    blackKingMoved: boolean;
    blackKingChecked: boolean;
    blackKingSideRookMoved: boolean;
    blackKingSideRookCaptured: boolean;
    blackKingSideSquaresChecked: boolean;
    blackQueenSideRookMoved: boolean;
    blackQueenSideRookCaptured: boolean;
    blackQueenSideSquaresChecked: boolean;
};
