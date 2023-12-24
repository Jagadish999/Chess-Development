import Board from "../ChessBoard/Board";

export default function Puzzle(){

    const initialFenPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";


    return (
        <div>    
            <Board initialFenPos={initialFenPosition} />
        </div>
    )
}