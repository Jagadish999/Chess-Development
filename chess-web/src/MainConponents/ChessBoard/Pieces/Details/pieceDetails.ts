import { PieceDetail } from "./pieceTypes";

//Finds current sq, 
export function pieceDetails(pieceFenPos: string){

    const posArr = pieceFenPos.split("/").reverse();
    const pieceDetail: PieceDetail[] = [];

    for(let rank = 0; rank < posArr.length; rank++){
        for(let file = 0; file < posArr[rank].length; file++){

            if(!isNaN(parseInt(posArr[rank][file]))){
                file += parseInt(posArr[rank][file]);
            }
            else{
                const color = posArr[rank][file].toUpperCase() === posArr[rank][file] ? "w" : "b";
                pieceDetail.push({pieceName:posArr[rank][file], file: file + 1, rank: rank + 1, color: color});
            }
        }
    }

    return pieceDetail;
}