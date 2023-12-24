import { PieceDetails, Move } from "./pieceTypes";

/*
Takes chessBoardExtended as parameter and returns all the unfiltered moves
*/
export function calculateRawMove(chessBoardExtended: number[] | string[], unphasantMove: string, castlePermission: string) {

    const rookMoveDirection = [1, -1, +10, -10];
    const bishopMoveDirection = [11, 9, -11, -9];
    const nightMoveDirection = [21, 19, 12, 8, -21, -19, -12, -8];
    const kingMoveDirection = [1, -1, 10, -10, 11, 9, -11, -9];
    const queenMoveDirection = [...rookMoveDirection, ...bishopMoveDirection];

    const tempPieceDetails: PieceDetails[] = [];

    for (let boardIndex = 22; boardIndex <= chessBoardExtended.length - 21; boardIndex++) {

        if (chessBoardExtended[boardIndex] === 0 || chessBoardExtended[boardIndex] === 1) continue;

        //Receives only index with string here
        const currentPiece = chessBoardExtended[boardIndex];

        if (currentPiece === 'p') tempPieceDetails.push(blackPawnMovement(currentPiece, boardIndex, chessBoardExtended, unphasantMove));
        else if (currentPiece === 'P') tempPieceDetails.push(whitePawnMovement(currentPiece, boardIndex, chessBoardExtended, unphasantMove));
        else if (currentPiece === 'n' || currentPiece === 'N') tempPieceDetails.push(nightMovement(currentPiece, boardIndex, chessBoardExtended, nightMoveDirection));
        else if (currentPiece === 'k' || currentPiece === 'K') tempPieceDetails.push(kingMovement(currentPiece, boardIndex, chessBoardExtended, kingMoveDirection, castlePermission));
        else if (currentPiece === 'q' || currentPiece === 'Q') tempPieceDetails.push(rookBishopQueenMovement(currentPiece, boardIndex, chessBoardExtended, queenMoveDirection));
        else if (currentPiece === 'r' || currentPiece === 'R') tempPieceDetails.push(rookBishopQueenMovement(currentPiece, boardIndex, chessBoardExtended, rookMoveDirection));
        else if (currentPiece === 'b' || currentPiece === 'B') tempPieceDetails.push(rookBishopQueenMovement(currentPiece, boardIndex, chessBoardExtended, bishopMoveDirection));
    }

    return tempPieceDetails;
}

function findRankAndFile(ExtendedBoardIdx: number) {

    const rank = Math.ceil((ExtendedBoardIdx + 1) / 10) - 2;
    const file = rank * 8 - (ExtendedBoardIdx - 20 - rank * 2); 
    // const file = 8 - (ExtendedBoardIdx - 20 + (rank - 1) * 2);

    return { rank: rank, file: file };
}

//returns true for pieces of same color and false for alternating
function checkOwnPiece(pieceColor: string, comparePiece: string): boolean{

    const comparePieceColor = comparePiece.toUpperCase() === comparePiece ? "w" : "b";
    return comparePieceColor === pieceColor;
}

function locationToSqNum(squareCode:string ){

    const fileNums = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    const rank = parseInt(squareCode[1]);
    const file = fileNums.indexOf(squareCode[0]) + 1;

    return (rank - 1) * 8 + file;
    
}

function whitePawnMovement(currentPiece: string, boardIndex: number, chessBoardExtended: number [] | string[], unphasantMove: string): PieceDetails {

    const rankAndFile = findRankAndFile(boardIndex);
    const color = currentPiece.toUpperCase() === currentPiece ? "w" : "b";

    let tempMoveDetails: PieceDetails = {
        rank: rankAndFile.rank,
        file: rankAndFile.file,
        pieceName: currentPiece,
        color: color,
        linearMove: [],
        capture: [],
        unphasant: [],
        castle: []
    }

    const singleForward = boardIndex + 10;
    const doubleForward = boardIndex + 20;
    const captureRight = boardIndex + 11;
    const captureLeft = boardIndex + 9;
    // const unphasantCapture = unphasantMove !== '-' ?  locationToSqNum(unphasantMove) + 20 + rankAndFile.rank * 2 : null;
    // console.log(unphasantCapture)
    if(chessBoardExtended[singleForward] === 0){
        tempMoveDetails.linearMove.push(findRankAndFile(singleForward));

        if(boardIndex >= 31 && boardIndex <= 38 && chessBoardExtended[doubleForward] === 0) tempMoveDetails.linearMove.push(findRankAndFile(doubleForward));
    }
    if(chessBoardExtended[captureRight] !== 1 && chessBoardExtended[captureRight] !== 0 && !checkOwnPiece(color, chessBoardExtended[captureRight].toString())) tempMoveDetails.capture.push(findRankAndFile(captureRight));

    if(chessBoardExtended[captureLeft] !== 1 && chessBoardExtended[captureLeft] !== 0 && !checkOwnPiece(color, chessBoardExtended[captureLeft].toString())) tempMoveDetails.capture.push(findRankAndFile(captureLeft));

    return tempMoveDetails;
}

function blackPawnMovement(currentPiece: string, boardIndex: number, chessBoardExtended: number[] | string[], unphasantMove: string) {

    const rankAndFile = findRankAndFile(boardIndex);
    const color = currentPiece.toUpperCase() === currentPiece ? "w" : "b";

    let tempMoveDetails: PieceDetails = {
        rank: rankAndFile.rank,
        file: rankAndFile.file,
        pieceName: currentPiece,
        color: color,
        linearMove: [],
        capture: [],
        unphasant: [],
        castle: []
    }

    const singleForward = boardIndex - 10;
    const doubleForward = boardIndex - 20;
    const captureRight = boardIndex - 9;
    const captureLeft = boardIndex - 11;
    // const unphasantCapture = unphasantMove !== '-' ?  locationToSqNum(unphasantMove) + 20 + rankAndFile.rank * 2 : null;
    // console.log(unphasantCapture)
    if(chessBoardExtended[singleForward] === 0){
        tempMoveDetails.linearMove.push(findRankAndFile(singleForward));

        if(boardIndex >= 81 && boardIndex <= 88 && chessBoardExtended[doubleForward] === 0) tempMoveDetails.linearMove.push(findRankAndFile(doubleForward));
    }
    if(chessBoardExtended[captureRight] !== 1 && chessBoardExtended[captureRight] !== 0 && !checkOwnPiece(color, chessBoardExtended[captureRight].toString())) tempMoveDetails.capture.push(findRankAndFile(captureRight));

    if(chessBoardExtended[captureLeft] !== 1 && chessBoardExtended[captureLeft] !== 0 && !checkOwnPiece(color, chessBoardExtended[captureLeft].toString())) tempMoveDetails.capture.push(findRankAndFile(captureLeft));

    return tempMoveDetails;
}

function kingMovement(currentPiece: string, boardIndex: number, chessBoardExtended: number[] | string[], kingMoveDirection: number[], castlePermission: string) {
    const rankAndFile = findRankAndFile(boardIndex);
    const color = currentPiece.toUpperCase() === currentPiece ? "w" : "b";

    let tempMoveDetails: PieceDetails = {
        rank: rankAndFile.rank,
        file: rankAndFile.file,
        pieceName: currentPiece,
        color: color,
        linearMove: [],
        capture: [],
        unphasant: [],
        castle: []
    }

    for(let i = 0; i < kingMoveDirection.length; i++){
        const nextKingPos = boardIndex + kingMoveDirection[i];

        if(chessBoardExtended[nextKingPos] === 0) tempMoveDetails.linearMove.push(findRankAndFile(nextKingPos));
        else if(typeof chessBoardExtended[nextKingPos] === 'string' && !checkOwnPiece(color, chessBoardExtended[nextKingPos].toString())) tempMoveDetails.capture.push(findRankAndFile(nextKingPos));

    }

    return tempMoveDetails;
}


function rookBishopQueenMovement(currentPiece: string, boardIndex: number, chessBoardExtended: number[] | string[], moveDirection: number[]) {
    const rankAndFile = findRankAndFile(boardIndex);
    const color = currentPiece.toUpperCase() === currentPiece ? "w" : "b";

    let tempMoveDetails: PieceDetails = {
        rank: rankAndFile.rank,
        file: rankAndFile.file,
        pieceName: currentPiece,
        color: color,
        linearMove: [],
        capture: [],
        unphasant: [],
        castle: []
    }

    for(let i = 0; i < moveDirection.length; i++){
        
        let nextPiecePosition = boardIndex + moveDirection[i];
        while(chessBoardExtended[nextPiecePosition] !== 1){

            if(chessBoardExtended[nextPiecePosition] === 0) tempMoveDetails.linearMove.push(findRankAndFile(nextPiecePosition))
            else if(typeof chessBoardExtended[nextPiecePosition] === 'string' && !checkOwnPiece(color, chessBoardExtended[nextPiecePosition].toString())){
                tempMoveDetails.capture.push(findRankAndFile(nextPiecePosition));
                break;
            }
            nextPiecePosition += moveDirection[i];
        }
    }

    return tempMoveDetails;
}

function nightMovement(currentPiece: string, boardIndex: number, chessBoardExtended: number[] | string[], nightMoveDirection: number[]) {
    const rankAndFile = findRankAndFile(boardIndex);
    const color = currentPiece.toUpperCase() === currentPiece ? "w" : "b";

    let tempMoveDetails: PieceDetails = {
        rank: rankAndFile.rank,
        file: rankAndFile.file,
        pieceName: currentPiece,
        color: color,
        linearMove: [],
        capture: [],
        unphasant: [],
        castle: []
    }

    for(let i = 0; i < nightMoveDirection.length; i++){
        const nextNightPos = boardIndex + nightMoveDirection[i];

        if(chessBoardExtended[nextNightPos] === 0) tempMoveDetails.linearMove.push(findRankAndFile(nextNightPos));
        else if(typeof chessBoardExtended[nextNightPos] === 'string' && !checkOwnPiece(color, chessBoardExtended[nextNightPos].toString())) tempMoveDetails.capture.push(findRankAndFile(nextNightPos));

    }
    return tempMoveDetails;
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

            for (let i = 0; i < numberOfEmptySpace; i++) {
                chessBoardExtended[currentExtendedPos + i] = 0;
            }
        }
    }

    return [chessBoard, chessBoardExtended]
}