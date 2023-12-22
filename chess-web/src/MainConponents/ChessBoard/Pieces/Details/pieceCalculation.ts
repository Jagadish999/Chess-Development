import { PieceDetails } from "./pieceTypes";

/*
Takes chessBoardExtended as parameter and returns all the unfiltered moves
*/
export function calculateRawMove(chessBoardExtended: number[] | string[]){

    const temppPieceDetails: PieceDetails[] = [];
    
    for(let boardIndex = 22; boardIndex <= chessBoardExtended.length - 21; boardIndex++){

        if(chessBoardExtended[boardIndex] === 0 || chessBoardExtended[boardIndex] === 1) continue;

       //Receives only index with string here

    }
    
    return temppPieceDetails;
    
}

export function calculateMove(pieceName: string, pieceIndex: number, chessBoardExtended: number[]| string[]){
    
    const rookMoveDirection = [1, -1, +10, -10];
    const bishopMoveDirection = [11, 9, -11, -9];
    const nightMoveDirection = [21, 19, 12, 8, -21, -19, -12, -8];
    const kingMoveDirection = [1, -1, 10, -10, 11, 9, -11, -9];
    const queenMoveDirection = [...rookMoveDirection, ...bishopMoveDirection];
    
    //pawn movement exception

    if(pieceName === 'p'){}
}
/*
Accepts: first part of FEN position
Returns: chessBoard: array with pieces char && chessBoardExtended: array with pieces char and border of 1
*/
export function fillChessBoardArray(pieceInfo: string) {
//Empty chess board with initail value filled of zero and one
    const chessBoard: number[] | string[] = new Array(64).fill(0);
    const chessBoardExtended: number[] | string[] = new Array(120).fill(1);

    //piecesInRanks has piece details from rank 1 to rank 8
    const piecesInRanks = pieceInfo.split("/").reverse().join("");

    let positionCounter = 0;
    let pieceCounter = 0;

    while (positionCounter < 64) {

        const currentChar = piecesInRanks[pieceCounter];
        pieceCounter++;

        const rank = Math.ceil((positionCounter + 1) / 8);
        // const file = 8 - (rank * 8 - (positionCounter + 1));

        //Position of extendedChessBoard equivalent to chessboard array
        const currentExtendedPos = positionCounter + 20 + rank * 2;

        //Place piece char in chessboard and extended chess board
        if (currentChar === 'R' || currentChar === 'r' || currentChar === 'N' || currentChar === 'n' || currentChar === 'B' || currentChar === 'b' || currentChar === 'k' || currentChar === 'K' || currentChar === 'q' || currentChar === 'Q' || currentChar === 'p' || currentChar === 'P') {
            chessBoard[positionCounter] = currentChar;
            chessBoardExtended[currentExtendedPos] = currentChar;
            positionCounter++;
        }
        //place zero in extended chess board
        else {
            let numberOfEmptySpace = parseInt(currentChar);
            positionCounter += numberOfEmptySpace;

            for(let i = 0; i < numberOfEmptySpace; i++){
                chessBoardExtended[currentExtendedPos + i] = 0;
            }
        }
    }

    return [chessBoard, chessBoardExtended]
}