import { chessBoard, chessBoardExtended } from "./constants";
import { PieceDetails, PieceDetail } from "./pieceTypes";

export function pieceDetails(pieceFenPos: string) {

    const piecesInfoInFen = pieceFenPos.split(" ")[0];

    const pieceDetail: PieceDetail[] = pieceFileAndRanks(piecesInfoInFen);

    const bla = fillChessBoardArray(piecesInfoInFen);

    return pieceDetail;
}


function fillChessBoardArray(pieceInfo: string) {

    const chessBoardPieces: number[] | string[] = [...chessBoard];

    //piecesInRanks has piece details from rank 1 to rank 8
    const piecesInRanks = pieceInfo.split("/").reverse();
    
    //Fill chessBoardPieces array with pieces available in FEN position
    let counter = 0;
    for(let RANK = 0; RANK < 8; RANK++){
        for(let FILE = 0; FILE < 8; FILE++){
            if (!isNaN(parseInt(piecesInRanks[RANK][FILE]))) {
                counter += parseInt(piecesInRanks[RANK][FILE]);
                FILE += parseInt(piecesInRanks[RANK][FILE]);
            }
            else {
                chessBoardPieces[counter] = piecesInRanks[RANK][FILE];
                counter++;
            }
        }
    }

    console.log(chessBoardPieces);
}



//Adding files and ranks of each pieces
function pieceFileAndRanks(initialPiecesCollection: string): PieceDetail[] {

    const posArr = initialPiecesCollection.split("/").reverse();
    let tempPieceDetails: PieceDetail[] = [];

    for (let rank = 0; rank < posArr.length; rank++) {
        for (let file = 0; file < posArr[rank].length; file++) {

            if (!isNaN(parseInt(posArr[rank][file]))) {
                file += parseInt(posArr[rank][file]);
            }
            else {
                const color = posArr[rank][file].toUpperCase() === posArr[rank][file] ? "w" : "b";
                tempPieceDetails.push({ pieceName: posArr[rank][file], file: file + 1, rank: rank + 1, color: color });
            }
        }
    }
    return tempPieceDetails;
}