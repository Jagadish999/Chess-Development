export type PieceDetails = {
    rank: number;//Which rank piece exist
    file: number;//Which file piece exist
    pieceName: string;//Piece name like: 'p', 'P', 'q', 'Q'
    color: string;//'w' or 'b'
    linearMove: Move[];//move in empty squares
    capture: Move[];//move to capture pices
    unphasant: Move[];//special move for pawn for unphasant
    castle: Move[];//king permission to castle
}

//Move to respective file and rank
export type Move = { 
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
    linearMove: Move[],
    captureMove: Move[],
    unphasantMove: Move[],
    castle: Move[]
}

export type BoardStatus = {
    check: boolean;
    checkmate: boolean;
    stalemate: boolean;
    
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
