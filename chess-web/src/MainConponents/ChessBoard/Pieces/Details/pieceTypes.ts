export type PieceDetail = {
    rank: number;
    file: number;
    pieceName: string;
    color: string;
}


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
    from: {file: number, rank: number}
    to: {file: number, rank: number}
}