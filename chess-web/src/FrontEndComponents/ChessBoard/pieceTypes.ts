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