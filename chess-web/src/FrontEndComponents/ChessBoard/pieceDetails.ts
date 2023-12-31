import { PieceDetails, PawnDetails, PieceMoves } from "./pieceTypes";

export function verifyCheck(pieceMoveDetails: PieceDetails[], turnToMove: string){

    //find king location
    const kingPiece = turnToMove === "w" ? pieceMoveDetails.find(pieceDetail => pieceDetail.pieceName === "K") : pieceMoveDetails.find(pieceDetail => pieceDetail.pieceName === "k");
    const kingLocation = { file: kingPiece?.file, rank: kingPiece?.rank };


    for (const eachPieceDetail of pieceMoveDetails) {

        //Check until king has been spotted in check with opposite piece
        if (eachPieceDetail.color !== turnToMove && eachPieceDetail.pieceName !== "K" && eachPieceDetail.pieceName !== "k") {

            for (const eachPieceCapture of eachPieceDetail.capture) {
                if (eachPieceCapture.file === kingLocation.file && eachPieceCapture.rank === kingLocation.rank) {
                    return true;
                }
            }
        }
    }

    return false;
}

export function verifyMovesAvailable(pieceMoveDetails: PieceDetails[], turnToMove: string){

    for (const eachPieceDetail of pieceMoveDetails) {

        //Check moves lenght if opposite color for checkmate or stalemate checking
        if (eachPieceDetail.color !== turnToMove) {
            if (eachPieceDetail.linearMove.length > 0 || eachPieceDetail.capture.length > 0 || eachPieceDetail.castle.length > 0 || eachPieceDetail.unphasant.length > 0) {
                return true;
            }
        }
    }

    return false;
}

/*
Takes chessBoardExtended as parameter and returns all the unfiltered moves
*/
export function calculateRawMove(chessBoardExtended: number[] | string[], unphasantMove: string, castlePermission: string, turn: string) {

    const rookMoveDirection = [1, -1, +10, -10];
    const bishopMoveDirection = [11, 9, -11, -9];
    const nightMoveDirection = [21, 19, 12, 8, -21, -19, -12, -8];
    const kingMoveDirection = [1, -1, 10, -10, 11, 9, -11, -9];
    const queenMoveDirection = [...rookMoveDirection, ...bishopMoveDirection];

    
    const tempPieceDetails: PieceDetails[] = [];

    for (let boardIndex = 21; boardIndex <= chessBoardExtended.length - 20; boardIndex++) {

        const currentPiece = chessBoardExtended[boardIndex];

        if (currentPiece === 0 || currentPiece === 1) continue;

        const rankAndFile = findRankAndFile(boardIndex);
        const color = currentPiece.toString().toUpperCase() === currentPiece ? "w" : "b";

        let tempMoveDetails: PieceDetails = {
            rank: rankAndFile.rank,
            file: rankAndFile.file,
            pieceName: currentPiece.toString(),
            color: color,
            linearMove: [],
            capture: [],
            unphasant: [],
            castle: []
        };

        let tempEachPieceMoves: PieceMoves;
            
        if(currentPiece === 'p'){

            const unphasantCaptureIdx = unphasantMove !== '-' ?  locationToSqNum(unphasantMove) + 19 + (parseInt(unphasantMove[1])) * 2 - 1: null;
            const blackPawnConstants: PawnDetails = {
                singleForward: boardIndex - 10,
                doubleForward: boardIndex - 20,
                captureRight: boardIndex - 9,
                captureLeft: boardIndex - 11,
                firstPawnPos: 81,
                lastPawnPos: 88
            }

            tempEachPieceMoves = pawnMovement(color, boardIndex, chessBoardExtended, unphasantCaptureIdx, blackPawnConstants, turn);
        }
        else if(currentPiece === 'P'){

            const unphasantCaptureIdx = unphasantMove !== '-' ?  locationToSqNum(unphasantMove) + 19 + (parseInt(unphasantMove[1])) * 2 - 1: null;
            const whitePawnConstants: PawnDetails = {
                singleForward: boardIndex + 10,
                doubleForward: boardIndex + 20,
                captureRight: boardIndex + 11,
                captureLeft: boardIndex + 9,
                firstPawnPos: 31,
                lastPawnPos: 38
            }

            tempEachPieceMoves = pawnMovement(color, boardIndex, chessBoardExtended, unphasantCaptureIdx, whitePawnConstants, turn);

        }
        else if(currentPiece === 'n' || currentPiece === 'N'){
            tempEachPieceMoves= nightMovement(color, boardIndex, chessBoardExtended, nightMoveDirection);
        }
        else if (currentPiece === 'k' || currentPiece === 'K'){
            tempEachPieceMoves = kingMovement(color, boardIndex, chessBoardExtended, kingMoveDirection, castlePermission);
        }
        else if (currentPiece === 'q' || currentPiece === 'Q'){
            tempEachPieceMoves = rookBishopQueenMovement(color, boardIndex, chessBoardExtended, queenMoveDirection);
        } 
        else if (currentPiece === 'r' || currentPiece === 'R'){
            tempEachPieceMoves = rookBishopQueenMovement(color, boardIndex, chessBoardExtended, rookMoveDirection);
        } 
        else{
            tempEachPieceMoves = rookBishopQueenMovement(color, boardIndex, chessBoardExtended, bishopMoveDirection);
        } 
   
        tempMoveDetails.linearMove = tempEachPieceMoves.linearMove;
        tempMoveDetails.capture = tempEachPieceMoves.captureMove;
        tempMoveDetails.unphasant = tempEachPieceMoves.unphasantMove;
        tempMoveDetails.castle = tempEachPieceMoves.castle;

        tempPieceDetails.push(tempMoveDetails);
    }

    return tempPieceDetails;
}

function rookBishopQueenMovement(color:string, boardIndex: number, chessBoardExtended: number[] | string[], moveDirection: number[]){

    let tempMoves: PieceMoves = {
        linearMove: [],
        captureMove: [],
        unphasantMove: [],
        castle: []
    }

    for (let i = 0; i < moveDirection.length; i++) {

        let nextPiecePosition = boardIndex + moveDirection[i];
        while (chessBoardExtended[nextPiecePosition] !== 1) {

            if (chessBoardExtended[nextPiecePosition] === 0){

                tempMoves.linearMove.push(findRankAndFile(nextPiecePosition))
            } 
            else if (typeof chessBoardExtended[nextPiecePosition] === 'string' && !checkOwnPiece(color, chessBoardExtended[nextPiecePosition].toString())) {
                tempMoves.captureMove.push(findRankAndFile(nextPiecePosition));
                break;
            }
            else if (checkOwnPiece(color, chessBoardExtended[nextPiecePosition].toString())) break;
            nextPiecePosition += moveDirection[i];
        }
    }

    return tempMoves;
}

function kingMovement(color:string, boardIndex: number, chessBoardExtended: number[] | string[], kingMoveDirection: number[], castlePermission: string){

    let tempMoves: PieceMoves = {
        linearMove: [],
        captureMove: [],
        unphasantMove: [],
        castle: []
    }

    for (let i = 0; i < kingMoveDirection.length; i++) {
        const nextKingPos = boardIndex + kingMoveDirection[i];

        if (chessBoardExtended[nextKingPos] === 0){
            tempMoves.linearMove.push(findRankAndFile(nextKingPos));
        } 
        else if (typeof chessBoardExtended[nextKingPos] === 'string' && !checkOwnPiece(color, chessBoardExtended[nextKingPos].toString())){
            tempMoves.captureMove.push(findRankAndFile(nextKingPos));
        }
    }

    if(color === 'w'){
        if(castlePermission.includes('K') && chessBoardExtended[26] === 0 && chessBoardExtended[27] === 0){
            tempMoves.castle.push(findRankAndFile(27));
        }
        if(castlePermission.includes('Q') && chessBoardExtended[24] === 0 && chessBoardExtended[23] === 0 && chessBoardExtended[22] === 0){
            tempMoves.castle.push(findRankAndFile(23));
        }
    }
    else{
        if(castlePermission.includes('k') && chessBoardExtended[96] === 0 && chessBoardExtended[97] === 0){
            tempMoves.castle.push(findRankAndFile(97));
        }
        if(castlePermission.includes('q') && chessBoardExtended[94] === 0 && chessBoardExtended[93] === 0 && chessBoardExtended[92] === 0){
            tempMoves.castle.push(findRankAndFile(93));
        }
    }
    return tempMoves;
}

function nightMovement(color:string, boardIndex: number, chessBoardExtended: number[] | string[], nightMoveDirection: number[]){

    let tempMoves: PieceMoves = {
        linearMove: [],
        captureMove: [],
        unphasantMove: [],
        castle: []
    }
    
    for (let i = 0; i < nightMoveDirection.length; i++) {
        const nextNightPos = boardIndex + nightMoveDirection[i];

        if (chessBoardExtended[nextNightPos] === 0){
            tempMoves.linearMove.push(findRankAndFile(nextNightPos));
        } 
        else if (typeof chessBoardExtended[nextNightPos] === 'string' && !checkOwnPiece(color, chessBoardExtended[nextNightPos].toString())){
            tempMoves.captureMove.push(findRankAndFile(nextNightPos));
        }
    }

    return tempMoves;
}

function pawnMovement(color: string, boardIndex: number, chessBoardExtended: number[] | string[], unphasantMove: null | number, pawnDetails: PawnDetails, turn: string){

    let tempMoves: PieceMoves = {
        linearMove: [],
        captureMove: [],
        unphasantMove: [],
        castle: []
    }

    if (chessBoardExtended[pawnDetails.singleForward] === 0) {
        tempMoves.linearMove.push(findRankAndFile(pawnDetails.singleForward));

        if (boardIndex >= pawnDetails.firstPawnPos && boardIndex <= pawnDetails.lastPawnPos && chessBoardExtended[pawnDetails.doubleForward] === 0){
            tempMoves.linearMove.push(findRankAndFile(pawnDetails.doubleForward));
        }
    }
    if (chessBoardExtended[pawnDetails.captureRight] !== 1 && chessBoardExtended[pawnDetails.captureRight] !== 0 && !checkOwnPiece(color, chessBoardExtended[pawnDetails.captureRight].toString())) {
        tempMoves.captureMove.push(findRankAndFile(pawnDetails.captureRight));
    }

    if (chessBoardExtended[pawnDetails.captureLeft] !== 1 && chessBoardExtended[pawnDetails.captureLeft] !== 0 && !checkOwnPiece(color, chessBoardExtended[pawnDetails.captureLeft].toString())){
        tempMoves.captureMove.push(findRankAndFile(pawnDetails.captureLeft));
    }

    if(unphasantMove){
        if(color === "b" && color === turn){
            if(boardIndex - 11 === unphasantMove || boardIndex - 9 === unphasantMove ){
                tempMoves.unphasantMove.push(findRankAndFile(unphasantMove));
            }
        }
        else if(color === "w" && color === turn){
            if(boardIndex + 11 === unphasantMove || boardIndex + 9 === unphasantMove ){
                tempMoves.unphasantMove.push(findRankAndFile(unphasantMove));
            }
        }
    }
    
    return tempMoves;
}

//Get rank and file number of 8x8 board by providing index of 120sq board
function findRankAndFile(ExtendedBoardIdx: number) {

    const rank = Math.ceil((ExtendedBoardIdx + 1) / 10);
    const file = ExtendedBoardIdx - (rank - 1) * 10;

    return { rank: rank - 2, file: file};
}

//returns true for pieces of same color and false for alternating
function checkOwnPiece(pieceColor: string, comparePiece: string): boolean {

    const comparePieceColor = comparePiece.toUpperCase() === comparePiece ? "w" : "b";
    return comparePieceColor === pieceColor;
}
export function fileAndRankToStrCode(rank: number, file:number): string{

    const fileNums = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    return fileNums[file - 1] + rank.toString();
}

//Get square number in 8X8 board with sqauare code
function locationToSqNum(squareCode: string) {

    const fileNums = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    const rank = parseInt(squareCode[1]);
    const file = fileNums.indexOf(squareCode[0]) + 1;

    return (rank - 1) * 8 + file;
}

export function fileAndRankToSq(rank: number, file: number): number{
    return (rank - 1) * 8 + file;
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
        const currentExtendedPos = positionCounter + 19 + rank * 2;

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

    return [chessBoard, chessBoardExtended];
}