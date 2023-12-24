export type PieceDetails = {
    rank: number;
    file: number;
    pieceName: string;
    color: string;
    linearMove: Move[];
    capture: Move[];
    unphasant: Move[];
    castle: Move[];
}

export type Move = {
    
    file: number,
    rank: number
}