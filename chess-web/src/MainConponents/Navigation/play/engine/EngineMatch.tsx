import Board from "../../../ChessBoard/Board";

export default function EngineMatch() {

    const playMode = "Engine";
    const initialFenPos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    return (
        <div>
            <Board gameType={playMode} initialFenPos={initialFenPos}></Board>
        </div>
    )
}