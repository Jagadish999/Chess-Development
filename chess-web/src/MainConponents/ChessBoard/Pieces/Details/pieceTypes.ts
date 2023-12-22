export type PieceDetails = {
    rank: number;
    file: number;
    pieceName: string;
    color: string;
    move: Move[];
    capture: Move[];
    unphasant: Move[];
    castle: Move[];
}

type Move = {
    
    file: number,
    rank: number
}