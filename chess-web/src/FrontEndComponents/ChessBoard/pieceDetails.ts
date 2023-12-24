import { fillChessBoardArray, calculateRawMove } from "./pieceCalculation";
import { PieceDetails } from "./pieceTypes";

export function pieceDetails(pieceFenPos: string) {

    //Initial piece positions
    const piecesInfoInFen = pieceFenPos.split(" ")[0];
    const unphasantMove = pieceFenPos.split(" ")[3];

    const [chessBoard, chessBoardExtended] = fillChessBoardArray(piecesInfoInFen);
    
    const pieceDetail: PieceDetails[] = calculateRawMove(chessBoardExtended, unphasantMove);
    
    console.log(chessBoardExtended);
    console.log(chessBoard);

    return pieceDetail;
}


