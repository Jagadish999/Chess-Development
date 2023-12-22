import { fillChessBoardArray, calculateRawMove } from "./pieceCalculation";
import { PieceDetails } from "./pieceTypes";

export function pieceDetails(pieceFenPos: string) {

    //Initial piece positions
    const piecesInfoInFen = pieceFenPos.split(" ")[0];
    
    const [chessBoard, chessBoardExtended] = fillChessBoardArray(piecesInfoInFen);
    
    const pieceDetail: PieceDetails[] = calculateRawMove(chessBoardExtended);
    
    console.log(chessBoardExtended);
    console.log(chessBoard);

    return pieceDetail;
}


