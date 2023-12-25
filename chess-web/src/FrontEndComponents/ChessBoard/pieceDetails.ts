import { fillChessBoardArray, calculateRawMove } from "./pieceCalculation";
import { PieceDetails } from "./pieceTypes";

export function findPieceMoveDetails(pieceFenPos: string) {

    const fenPosInfo = pieceFenPos.split(" ");
    const [chessBoard, chessBoardExtended] = fillChessBoardArray(fenPosInfo[0]);
    
    const pieceDetail: PieceDetails[] = calculateRawMove(chessBoardExtended, fenPosInfo[3], fenPosInfo[2], fenPosInfo[1]);
    
    console.log(pieceDetail);

    return pieceDetail;
}


