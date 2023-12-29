import { calculateRawMove, fileAndRankToSq, fileAndRankToStrCode, fillChessBoardArray, verifyCheck } from "./pieceDetails";
import { CastleDetails, Location, PieceDetails } from "./pieceTypes";

//Takes fen position and castle details and returns all the valid moves
export function findPieceMoveDetails(pieceFenPos: string, castleInfo: CastleDetails) {

    const fenPosInfo = pieceFenPos.split(" ");
    const [chessBoard, chessBoardExtended] = fillChessBoardArray(fenPosInfo[0]);

    const pieceDetail: PieceDetails[] = calculateRawMove(chessBoardExtended, fenPosInfo[3], fenPosInfo[2], fenPosInfo[1]);
    // const checkStatus = checkBoardStatus(pieceDetail, fenPosInfo[1]);
    const filteredMoves: PieceDetails[] = filterMoves(pieceDetail, fenPosInfo[1], chessBoard, castleInfo);
    console.log(filteredMoves);

    return pieceDetail;
}

//Filter moves of every piece by moving them and check if still check exist or not
export function filterMoves(pieceMoveDetails: PieceDetails[], turnToMove: string, chessBoard: string[] | number[], castleInfo: CastleDetails) {
    const tempPieceDetails: PieceDetails[] = [];

    for (let eachPieceDetail of pieceMoveDetails) {

        const tempPieceDetail: PieceDetails = Object.assign({}, eachPieceDetail);

        if (eachPieceDetail.color === turnToMove) {
            tempPieceDetail.linearMove = [];
            tempPieceDetail.capture = [];
            tempPieceDetail.unphasant = [];
            tempPieceDetail.castle = [];

            eachPieceDetail.capture.forEach((moveLocation: Location) => {

                let tempUpdatedPiecePos: string;
                if (eachPieceDetail.pieceName === 'p' && moveLocation.rank === 1) {
                    tempUpdatedPiecePos = movePieceInBoard(chessBoard, { rank: eachPieceDetail.rank, file: eachPieceDetail.file }, moveLocation, 'p', 'q');
                }
                else if (eachPieceDetail.pieceName === 'P' && moveLocation.rank === 8) {
                    tempUpdatedPiecePos = movePieceInBoard(chessBoard, { rank: eachPieceDetail.rank, file: eachPieceDetail.file }, moveLocation, 'p', 'Q');
                }
                else {
                    tempUpdatedPiecePos = movePieceInBoard(chessBoard, { rank: eachPieceDetail.rank, file: eachPieceDetail.file }, moveLocation, 'x', null);
                }

                const tempChessBoardExtended = fillChessBoardArray(tempUpdatedPiecePos)[1];
                const tempRawMoves: PieceDetails[] = calculateRawMove(tempChessBoardExtended, '-', '-', turnToMove);

                const tempCheckStatus = verifyCheck(tempRawMoves, turnToMove);

                if (!tempCheckStatus) {
                    tempPieceDetail.capture.push(moveLocation);
                }
            });

            eachPieceDetail.linearMove.forEach((moveLocation: Location) => {

                let tempUpdatedPiecePos: string;
                if (eachPieceDetail.pieceName === 'p' && moveLocation.rank === 1) {
                    tempUpdatedPiecePos = movePieceInBoard(chessBoard, { rank: eachPieceDetail.rank, file: eachPieceDetail.file }, moveLocation, 'l', 'q');
                }
                else if (eachPieceDetail.pieceName === 'P' && moveLocation.rank === 8) {
                    tempUpdatedPiecePos = movePieceInBoard(chessBoard, { rank: eachPieceDetail.rank, file: eachPieceDetail.file }, moveLocation, 'l', 'Q');
                }
                else {
                    tempUpdatedPiecePos = movePieceInBoard(chessBoard, { rank: eachPieceDetail.rank, file: eachPieceDetail.file }, moveLocation, 'l', null);
                }

                const tempChessBoardExtended = fillChessBoardArray(tempUpdatedPiecePos)[1];
                const tempRawMoves: PieceDetails[] = calculateRawMove(tempChessBoardExtended, '-', '-', turnToMove);

                const tempCheckStatus = verifyCheck(tempRawMoves, turnToMove);

                if (!tempCheckStatus) {
                    tempPieceDetail.linearMove.push(moveLocation);
                }
            });

            eachPieceDetail.castle.forEach((moveLocation: Location) => {
                const tempUpdatedPiecePos = movePieceInBoard(chessBoard, { rank: eachPieceDetail.rank, file: eachPieceDetail.file }, moveLocation, 'c', null);

                const tempChessBoardExtended = fillChessBoardArray(tempUpdatedPiecePos)[1];
                const tempRawMoves: PieceDetails[] = calculateRawMove(tempChessBoardExtended, '-', '-', turnToMove);

                const tempCheckStatus = verifyCheck(tempRawMoves, turnToMove);

                if (!tempCheckStatus) {
                    tempPieceDetail.castle.push(moveLocation);
                }
            });

            eachPieceDetail.unphasant.forEach((moveLocation: Location) => {
                const tempUpdatedPiecePos = movePieceInBoard(chessBoard, { rank: eachPieceDetail.rank, file: eachPieceDetail.file }, moveLocation, 'u', null);

                const tempChessBoardExtended = fillChessBoardArray(tempUpdatedPiecePos)[1];
                const tempRawMoves: PieceDetails[] = calculateRawMove(tempChessBoardExtended, '-', '-', turnToMove);

                const tempCheckStatus = verifyCheck(tempRawMoves, turnToMove);

                if (!tempCheckStatus) {
                    tempPieceDetail.unphasant.push(moveLocation);
                }
            });
        }

        tempPieceDetails.push(tempPieceDetail);
    }

    return tempPieceDetails;
}

//To Find If unphasant move is possible or not
export function unphasantPossibility(pieceDetail: PieceDetails, chessBoard: number[] | string[], destination: Location): string{

    const moveSqNumIdx = fileAndRankToSq(destination.rank, destination.file) - 1;

    if(pieceDetail.color === 'p' && pieceDetail.rank === 7 && destination.rank === 5 && (chessBoard[moveSqNumIdx + 1] === 'P' || chessBoard[moveSqNumIdx - 1]) === 'P'){
        return fileAndRankToStrCode(destination.rank + 1, destination.file);
    }
    else if(pieceDetail.color === 'P' && pieceDetail.rank === 2 && destination.rank === 4 && (chessBoard[moveSqNumIdx + 1] === 'p' || chessBoard[moveSqNumIdx - 1]) === 'p'){
        return fileAndRankToStrCode(destination.rank - 1, destination.file);
    }

    return '-';
}

export function updatedCastlePermission(castleInfo: CastleDetails, moveLocation: Location, currentPieceDetail: PieceDetails, pieceDetails: PieceDetails[], chessBoard: number[] | string[]):string {

    const tempCastleInfo = Object.assign({}, castleInfo);

    if (currentPieceDetail.pieceName === 'K') {
        tempCastleInfo.whiteKingMoved = true;
    }
    else if (currentPieceDetail.pieceName === 'k') {
        tempCastleInfo.blackKingMoved = true;
    }
    else if (currentPieceDetail.pieceName === 'R') {
        if (currentPieceDetail.rank === 1 && currentPieceDetail.file === 8) {
            tempCastleInfo.whiteKingSideRookMoved = true;
        }
        else if (currentPieceDetail.rank === 1 && currentPieceDetail.file === 1) {
            tempCastleInfo.whiteQueenSideRookMoved = true;
        }
    }
    else if (currentPieceDetail.pieceName === 'r') {
        if (currentPieceDetail.rank === 8 && currentPieceDetail.file === 8) {
            tempCastleInfo.blackKingSideRookMoved = true;
        }
        else if (currentPieceDetail.rank === 1 && currentPieceDetail.file === 1) {
            tempCastleInfo.blackQueenSideRookMoved = true;
        }
    }

    if (chessBoard[0] !== 'R') {
        tempCastleInfo.whiteQueenSideRookCaptured = true;
    }

    if (chessBoard[7] !== 'R') {
        tempCastleInfo.whiteKingSideRookCaptured = true;
    }

    if (chessBoard[63] !== 'r') {
        tempCastleInfo.blackKingSideRookCaptured = true;
    }

    if(chessBoard[57] !== 'r'){
        tempCastleInfo.blackQueenSideRookCaptured = true;
    }

    tempCastleInfo.whiteKingSideSquaresChecked = false;
    tempCastleInfo.whiteQueenSideSquaresChecked = false;
    tempCastleInfo.blackKingSideSquaresChecked = false;
    tempCastleInfo.blackQueenSideSquaresChecked = false;


    pieceDetails.forEach(eachPieceDetails => {
        
        if(eachPieceDetails.color === 'b'){

            eachPieceDetails.linearMove.forEach(eachLocation => {
                if(eachLocation.rank === 1){

                    if(eachLocation.file === 2 || eachLocation.file === 3 || eachLocation.file === 4){
                        tempCastleInfo.whiteQueenSideSquaresChecked = true;
                    }
                    else if(eachLocation.file === 6 || eachLocation.file === 7){
                        tempCastleInfo.whiteKingSideSquaresChecked = true;
                    }
                    else if(eachLocation.file === 5){
                        tempCastleInfo.whiteKingChecked = true;
                    }
                }
                
            });
        }
        else{
            eachPieceDetails.linearMove.forEach(eachLocation => {
                if(eachLocation.rank === 8){

                    if(eachLocation.file === 2 || eachLocation.file === 3 || eachLocation.file === 4){
                        tempCastleInfo.blackQueenSideSquaresChecked = true;
                    }
                    else if(eachLocation.file === 6 || eachLocation.file === 7){
                       tempCastleInfo.blackKingSideSquaresChecked = true;
                    }
                    else if(eachLocation.file === 5){
                        tempCastleInfo.blackKingChecked = true;
                    }
                }
            });
        }
    });

    let castleDetail = "";
    if(!tempCastleInfo.whiteKingMoved && !tempCastleInfo.whiteKingChecked){
        if(!tempCastleInfo.whiteKingSideRookCaptured && !tempCastleInfo.whiteKingSideSquaresChecked){
           castleDetail += 'K';
        }

        if(!tempCastleInfo.whiteQueenSideRookCaptured && !tempCastleInfo.whiteQueenSideSquaresChecked){
            castleDetail += 'Q';
        }
    }

    if(!tempCastleInfo.blackKingMoved && !tempCastleInfo.blackKingChecked){
        if(!tempCastleInfo.blackKingSideRookCaptured && !tempCastleInfo.blackKingSideSquaresChecked){
            castleDetail += 'k';
        }

        if(!tempCastleInfo.blackQueenSideRookCaptured && !tempCastleInfo.blackQueenSideSquaresChecked){
            castleDetail += 'q';
        }
    }

    if(castleDetail === "") return "-";

    return castleDetail;
}

//Move piece and get new piece position
export function movePieceInBoard(chessBoard: number[] | string[], currentLocation: Location, moveLocation: Location, moveType: string, pawnPromotedTo: string | null): string {

    const tempChessBrd = [...chessBoard];

    //Get current square and destination square number
    const currentSqNum = fileAndRankToSq(currentLocation.rank, currentLocation.file);
    const destinationSqNum = fileAndRankToSq(moveLocation.rank, moveLocation.file);

    //Move piece in temp board array
    tempChessBrd[currentSqNum - 1] = 0;
    tempChessBrd[destinationSqNum - 1] = chessBoard[currentSqNum - 1];

    //If unphasant or castle or pawn promotion
    if (moveType === 'p' && pawnPromotedTo) {
        tempChessBrd[destinationSqNum - 1] = pawnPromotedTo;
    }
    else if (moveType === 'c') {
        if (moveLocation.rank === 1 && moveLocation.file === 7) {
            tempChessBrd[7] = 0;
            tempChessBrd[5] = 'R';
        }
        else if (moveLocation.rank === 1 && moveLocation.file === 3) {
            tempChessBrd[0] = 0;
            tempChessBrd[3] = 'R';
        }

        else if (moveLocation.rank === 8 && moveLocation.file === 7) {
            tempChessBrd[63] = 0;
            tempChessBrd[61] = 'r';
        }
        else if (moveLocation.rank === 8 && moveLocation.file === 3) {
            tempChessBrd[56] = 0;
            tempChessBrd[59] = 'r';
        }
    }

    else if (moveType === 'u') {
        //It is white piece
        if (chessBoard[currentSqNum].toString().toUpperCase() === chessBoard[currentSqNum]) {
            tempChessBrd[destinationSqNum - 9] = 0;
        }
        else {
            tempChessBrd[destinationSqNum + 9] = 0;
        }
    }

    let newPieceDetail: string = "";
    let emptyCount = 0;

    for (let i = 0; i < tempChessBrd.length; i++) {

        //If space is empty in board array
        if (tempChessBrd[i] === 0) {
            emptyCount++;
        }
        else {
            //If piece exist in board array
            if (emptyCount > 0) {
                newPieceDetail += emptyCount.toString();
                emptyCount = 0;
            }
            newPieceDetail += tempChessBrd[i];
        }

        //If single rank piece count over
        if ((i + 1) % 8 === 0) {
            if (emptyCount > 0) {
                newPieceDetail += emptyCount.toString();
                emptyCount = 0;
            }

            if (i < tempChessBrd.length - 1) {
                newPieceDetail += "/";
            }
        }
    }

    return newPieceDetail;
}