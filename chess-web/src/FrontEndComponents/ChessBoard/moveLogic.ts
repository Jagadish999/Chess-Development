/*
Author: Jagadish Parajuli
Date: January 3, 2024
Description: This module provides functions for generating valid move logic
for multiplayer, engine, and puzzle boards based on FEN positions.
*/

import { Location, PawnDetails, PieceDetails, PieceMoves, CastleDetails } from "./pieceTypes";

/**
 * Checks if an en passant move is possible for the given piece and destination.
 * 
 * @param pieceDetail - Details of the moving piece. { pieceName: string, color: string, rank: number, file: number }
 * @param chessBoard - Current state of the chess board. Array of strings or numbers.
 * @param destination - The destination location of the piece. { rank: number, file: number }
 * @returns {string} A string representing the en passant capture square in algebraic notation, or '-' if not possible.
 */
export function unphasantPossibility(pieceDetail: PieceDetails, chessBoard: (number | string)[], destination: Location): string {

    const moveSqNumIdx = fileAndRankToSq(destination.rank, destination.file) - 1;

    if (pieceDetail.pieceName === 'p' && pieceDetail.color === 'b' && pieceDetail.rank === 7 && destination.rank === 5 && (chessBoard[moveSqNumIdx + 1] === 'P' || chessBoard[moveSqNumIdx - 1] === 'P')) {
        return fileAndRankToStrCode(destination.rank + 1, destination.file);
    }
    else if (pieceDetail.pieceName === 'P' && pieceDetail.color === 'w' && pieceDetail.rank === 2 && destination.rank === 4 && (chessBoard[moveSqNumIdx + 1] === 'p' || chessBoard[moveSqNumIdx - 1] === 'p')) {
        return fileAndRankToStrCode(destination.rank - 1, destination.file);
    }

    return '-';
}

/**
 * Updates castle permissions based on the move, capturing, and checking conditions.
 * 
 * @param {CastleDetails} castleInfo - Current castle permissions.
 * @param {PieceDetails} currentPieceDetail - Details of the piece being moved.
 * @param {PieceDetails[]} pieceDetails - Details of all pieces on the board.
 * @param {(number | string)[]} chessBoard - The current state of the chess board.
 * @returns {string} A string representing the updated castle permissions in FEN notation.
 */
export function updatedCastlePermission(castleInfo: CastleDetails, currentPieceDetail: PieceDetails, pieceDetails: PieceDetails[], chessBoard: (number | string)[]): string {

    //If king or rook is moved
    if (currentPieceDetail.pieceName === 'K') {
        castleInfo.whiteKingMoved = true;
    }
    else if (currentPieceDetail.pieceName === 'k') {
        castleInfo.blackKingMoved = true;
    }
    else if (currentPieceDetail.pieceName === 'R') {
        if (currentPieceDetail.rank === 1 && currentPieceDetail.file === 8) {
            castleInfo.whiteKingSideRookMoved = true;
        }
        else if (currentPieceDetail.rank === 1 && currentPieceDetail.file === 1) {
            castleInfo.whiteQueenSideRookMoved = true;
        }
    }
    else if (currentPieceDetail.pieceName === 'r') {
        if (currentPieceDetail.rank === 8 && currentPieceDetail.file === 8) {
            castleInfo.blackKingSideRookMoved = true;
        }
        else if (currentPieceDetail.rank === 8 && currentPieceDetail.file === 1) {
            castleInfo.blackQueenSideRookMoved = true;
        }
    }

    //If rook is not present in its initial position
    if (chessBoard[0] !== 'R') {
        castleInfo.whiteQueenSideRookCaptured = true;
    }

    if (chessBoard[7] !== 'R') {
        castleInfo.whiteKingSideRookCaptured = true;
    }

    if (chessBoard[63] !== 'r') {
        castleInfo.blackKingSideRookCaptured = true;
    }

    if (chessBoard[56] !== 'r') {
        castleInfo.blackQueenSideRookCaptured = true;
    }

    //Set initially checked squares to false
    castleInfo.whiteKingSideSquaresChecked = false;
    castleInfo.whiteQueenSideSquaresChecked = false;
    castleInfo.blackKingSideSquaresChecked = false;
    castleInfo.blackQueenSideSquaresChecked = false;

    //Check if any squares of either king is checked
    pieceDetails.forEach(eachPieceDetails => {

        if (eachPieceDetails.color === 'b') {

            eachPieceDetails.linearMove.forEach(eachLocation => {
                if (eachLocation.rank === 1) {

                    if (eachLocation.file === 2 || eachLocation.file === 3 || eachLocation.file === 4) {
                        castleInfo.whiteQueenSideSquaresChecked = true;
                    }
                    else if (eachLocation.file === 6 || eachLocation.file === 7) {
                        castleInfo.whiteKingSideSquaresChecked = true;
                    }
                    else if (eachLocation.file === 5) {
                        castleInfo.whiteKingChecked = true;
                    }
                }

            });
        }
        else {
            eachPieceDetails.linearMove.forEach(eachLocation => {
                if (eachLocation.rank === 8) {

                    if (eachLocation.file === 2 || eachLocation.file === 3 || eachLocation.file === 4) {
                        castleInfo.blackQueenSideSquaresChecked = true;
                    }
                    else if (eachLocation.file === 6 || eachLocation.file === 7) {
                        castleInfo.blackKingSideSquaresChecked = true;
                    }
                    else if (eachLocation.file === 5) {
                        castleInfo.blackKingChecked = true;
                    }
                }
            });
        }
    });

    //Fill castle details based on above infomation
    let castleDetail = "";
    if (!castleInfo.whiteKingMoved && !castleInfo.whiteKingChecked) {
        if (!castleInfo.whiteKingSideRookCaptured && !castleInfo.whiteKingSideSquaresChecked) {
            castleDetail += 'K';
        }

        if (!castleInfo.whiteQueenSideRookCaptured && !castleInfo.whiteQueenSideSquaresChecked) {
            castleDetail += 'Q';
        }
    }

    if (!castleInfo.blackKingMoved && !castleInfo.blackKingChecked) {
        if (!castleInfo.blackKingSideRookCaptured && !castleInfo.blackKingSideSquaresChecked) {
            castleDetail += 'k';
        }

        if (!castleInfo.blackQueenSideRookCaptured && !castleInfo.blackQueenSideSquaresChecked) {
            castleDetail += 'q';
        }
    }

    if (castleDetail === "") return "-";

    return castleDetail;
}

/**
 * Filter moves of every piece by moving them and check if still check exists or not. Only returns filtered moves of current player to move
*
 * @param {PieceDetails[]} pieceMoveDetails - Details of moves for each piece.
 * @param {string} turnToMove - Color representing the current turn.
 * @param {(number | string)[]} chessBoard - The chess board representation.
 * @returns {PieceDetails[]} - Filtered details of moves for each piece.
*/
export function filterMoves(pieceMoveDetails: PieceDetails[], turnToMove: string, chessBoard: (number | string)[]): PieceDetails[] {

    const tempPieceDetails: PieceDetails[] = [];

    for (let eachPieceDetail of pieceMoveDetails) {

        // Create a copy of each piece detail to avoid changes in orginal object
        const tempPieceDetail: PieceDetails = Object.assign({}, eachPieceDetail);

        if (eachPieceDetail.color === turnToMove) {

            //Let all the moves be empty and will be filled after check verification
            tempPieceDetail.linearMove = [];
            tempPieceDetail.capture = [];
            tempPieceDetail.unphasant = [];
            tempPieceDetail.castle = [];

            //Filter capture moves
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
                const tempRawMoves: PieceDetails[] = calculateAllPossibleMoves(tempChessBoardExtended, '-', '-', turnToMove);

                const tempCheckStatus = verifyCheck(tempRawMoves, turnToMove);

                if (!tempCheckStatus) {
                    tempPieceDetail.capture.push(moveLocation);
                }
            });

            //Filter linear moves
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
                const tempRawMoves: PieceDetails[] = calculateAllPossibleMoves(tempChessBoardExtended, '-', '-', turnToMove);

                const tempCheckStatus = verifyCheck(tempRawMoves, turnToMove);

                if (!tempCheckStatus) {
                    tempPieceDetail.linearMove.push(moveLocation);
                }
            });

            //Filter castle moves
            eachPieceDetail.castle.forEach((moveLocation: Location) => {
                const tempUpdatedPiecePos = movePieceInBoard(chessBoard, { rank: eachPieceDetail.rank, file: eachPieceDetail.file }, moveLocation, 'c', null);

                const tempChessBoardExtended = fillChessBoardArray(tempUpdatedPiecePos)[1];
                const tempRawMoves: PieceDetails[] = calculateAllPossibleMoves(tempChessBoardExtended, '-', '-', turnToMove);

                const tempCheckStatus = verifyCheck(tempRawMoves, turnToMove);

                if (!tempCheckStatus) {
                    tempPieceDetail.castle.push(moveLocation);
                }
            });

            //Filter unphasant moves
            eachPieceDetail.unphasant.forEach((moveLocation: Location) => {
                const tempUpdatedPiecePos = movePieceInBoard(chessBoard, { rank: eachPieceDetail.rank, file: eachPieceDetail.file }, moveLocation, 'u', null);

                const tempChessBoardExtended = fillChessBoardArray(tempUpdatedPiecePos)[1];
                const tempRawMoves: PieceDetails[] = calculateAllPossibleMoves(tempChessBoardExtended, '-', '-', turnToMove);

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

/**
 * Verifies if the current player (turnToMove) is in a check position.
 * 
 * @param pieceMoveDetails - The details of the moves available for each piece on the board.
 * @param turnToMove - The color of the player whose turn it is ('w' for white, 'b' for black).
 * @returns True if the player is in check, otherwise false.
 */
export function verifyCheck(pieceMoveDetails: PieceDetails[], turnToMove: string): boolean {

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

/**
 * Checks if there are any legal moves available for the given player's turn.
 * 
 * @param pieceMoveDetails - Details of all pieces' moves on the board.
 * @param turnToMove - Color of the player's turn ('w' for white, 'b' for black).
 * @returns True if there are legal moves available, false otherwise.
 */
export function verifyMovesAvailable(pieceMoveDetails: PieceDetails[], turnToMove: string): boolean {

    for (const eachPieceDetail of pieceMoveDetails) {

        //If length of moves of any piece is greater that zero, Moves avaliable
        if (eachPieceDetail.color === turnToMove) {
            if (eachPieceDetail.linearMove.length > 0 || eachPieceDetail.capture.length > 0 || eachPieceDetail.castle.length > 0 || eachPieceDetail.unphasant.length > 0) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Verifies if the current game state represents a stalemate for the specified player.
 *
 * @param pieceMoveDetails - An array of having all details of every piece.
 * @param turnToMove - The player's turn to move, represented as a string.
 * @param previousFenPositions - An array of previous FEN positions in the game for draw by repetation detection.
 * @param currentFenPosition - The current FEN position in the game.
 * @returns A boolean indicating whether the current state is a stalemate for the specified player.
 */
export function verifyStalemate(pieceMoveDetails: PieceDetails[], turnToMove: string, previousFenPositions: string[], currentFenPosition: string): boolean {

    const check = verifyCheck(pieceMoveDetails, turnToMove);
    const movesAvailable = verifyMovesAvailable(pieceMoveDetails, turnToMove);

    //If no moves is available for current player it is stalemate
    if (!check && !movesAvailable) return true;

    //Two legel piece is only king and stalemate due to insufficient material
    if (pieceMoveDetails.length === 2) return true;

    console.log(parseInt(currentFenPosition.split(" ")[4]));
    if(parseInt(currentFenPosition.split(" ")[4]) === 50) return true;

    //Count if position has been repeated three times:- Draw by move repetation
    let repeatCount = 0;
    for (let i = 0; i < previousFenPositions.length - 1; i++) {
        if(previousFenPositions[previousFenPositions.length - 1] === previousFenPositions[i]){
            repeatCount++;
        }
    }

    //If position has been repeated for 3 times it is stalemate
    if(repeatCount > 2) return true;

    //If stalemate due to insufficient material only king and bishop or knight
    if(pieceMoveDetails.length < 5){
        let whiteInsufficientMaterial = true;
        let blackInsufficientMaterial = true;

        //If number if greater than one not insufficient
        let blackKnight = 0;
        let blackBishop = 0;

        let whiteKnight = 0;
        let whiteBishop = 0;

        for(let i = 0; i < pieceMoveDetails.length; i++){

            if(pieceMoveDetails[i].pieceName === 'R' || pieceMoveDetails[i].pieceName === 'r' || pieceMoveDetails[i].pieceName === 'P' || pieceMoveDetails[i].pieceName === 'p' || pieceMoveDetails[i].pieceName === 'Q' || pieceMoveDetails[i].pieceName === 'q'){
                whiteInsufficientMaterial = false;
                blackInsufficientMaterial = false;
    
                blackKnight = 10;
                blackBishop = 10;
                whiteKnight = 10;
                whiteBishop = 10;
    
                break;
            }
            else if(pieceMoveDetails[i].pieceName === 'n'){
                blackKnight++;
            }
            else if(pieceMoveDetails[i].pieceName === 'N'){
                whiteKnight++;
            }
            else if(pieceMoveDetails[i].pieceName === 'b'){
                blackBishop++;
            }
            else if(pieceMoveDetails[i].pieceName === 'B'){
                whiteBishop++;
            }
        }

        if((whiteBishop + whiteKnight) === 1) whiteInsufficientMaterial = true;
        if((blackBishop + blackKnight) === 1) blackInsufficientMaterial = true;
        
        if(whiteInsufficientMaterial && blackInsufficientMaterial) return true;
    }


    return false;
}

/**
 * Verifies if the current game state represents a checkmate for the specified player.
 *
 * @param pieceMoveDetails - An array of having all details of every piece.
 * @param turnToMove - The player's turn to move, represented as a string.
 * @returns A boolean indicating whether the current state is a checkmate for the specified player.
 */
export function verifyCheckmate(pieceMoveDetails: PieceDetails[], turnToMove: string):boolean {

    const check = verifyCheck(pieceMoveDetails, turnToMove);
    const movesAvailable = verifyMovesAvailable(pieceMoveDetails, turnToMove);

    if (check && !movesAvailable) return true;

    return false;
}

/**
 * Moves a chess piece on the board and returns the updated board position.
 * 
 * @param chessBoard - The current state of the chess board.
 * @param currentLocation - The current location (rank and file) of the piece.
 * @param moveLocation - The destination location (rank and file) for the piece.
 * @param moveType - The type of move ('c' for castle and 'u' for unphasant which are some special condition, 'l' for linear).
 * @param pawnPromotedTo - The piece type to which a pawn is promoted (null if not a pawn promotion).
 * @returns string -The updated chess board position after the move.
 */
export function movePieceInBoard(chessBoard: (number | string)[], currentLocation: Location, moveLocation: Location, moveType: string, pawnPromotedTo: string | null): string {

    const tempChessBrd: (number | string)[] = [...chessBoard];

    //Get current square and destination square number
    const currentSqNum = fileAndRankToSq(currentLocation.rank, currentLocation.file);
    const destinationSqNum = fileAndRankToSq(moveLocation.rank, moveLocation.file);

    //Move piece in temp board array
    tempChessBrd[currentSqNum - 1] = 0;
    tempChessBrd[destinationSqNum - 1] = chessBoard[currentSqNum - 1];

    //If pawn promotion
    if (pawnPromotedTo) {
        tempChessBrd[destinationSqNum - 1] = pawnPromotedTo;
    }
    //If castle move played
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
    //If unphasant move played
    else if (moveType === 'u') {

        //It is white piece
        if (chessBoard[currentSqNum - 1].toString().toUpperCase() === chessBoard[currentSqNum - 1]) {
            tempChessBrd[destinationSqNum - 9] = 0;
        }
        else {
            tempChessBrd[destinationSqNum + 7] = 0;
        }
    }

    return formatChessBoard(tempChessBrd)
}

/**
 * Formats the chess board pieces for the first part of the FEN (Forsyth–Edwards Notation).
 * 
 * @param tempChessBrd - The temporary chess board with updated piece positions.
 * @returns The formatted string representing the board position for the FEN.
 */
export function formatChessBoard(tempChessBrd: (number | string)[]): string {

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

    return newPieceDetail.split("/").reverse().join("/");
}

/**
 * Calculate all possible moves for each piece on the chess board.
 * Returns an array of move details for each piece.
 *
 * @param {(number | string)[]} chessBoardExtended - Extended chess board array
 * @param {string} unphasantMove - En passant move in algebraic notation ('-' if none)
 * @param {string} castlePermission - Castle permission string
 * @param {string} turn - Current turn ('w' for white, 'b' for black)
 * @returns {PieceDetails[]} - Array of move details for each piece
 */
export function calculateAllPossibleMoves(chessBoardExtended: (number | string)[], unphasantMove: string, castlePermission: string, turn: string): PieceDetails[] {

    //Possible moves of each piece in every direction
    const rookMoveDirection = [1, -1, +10, -10];
    const bishopMoveDirection = [11, 9, -11, -9];
    const nightMoveDirection = [21, 19, 12, 8, -21, -19, -12, -8];
    const kingMoveDirection = [1, -1, 10, -10, 11, 9, -11, -9];
    const queenMoveDirection = [...rookMoveDirection, ...bishopMoveDirection];

    //Piece detail holding all details of every piece to return    
    const tempPieceDetails: PieceDetails[] = [];

    //Find all details of every piece availble in board
    for (let boardIndex = 21; boardIndex <= chessBoardExtended.length - 20; boardIndex++) {

        const currentPiece = chessBoardExtended[boardIndex];

        //No need to calculate if empty space found(0) or out of board reached(1)
        if (currentPiece === 0 || currentPiece === 1) continue;

        //Get rank and file of respective piece
        const rankAndFile = findRankAndFile(boardIndex);
        //Get color of respective piece
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

        if (currentPiece === 'p') {

            //Get Unphasant index in extended chess board
            const unphasantCaptureIdx = unphasantMove !== '-' ? locationToSqNum(unphasantMove) + 19 + (parseInt(unphasantMove[1])) * 2 - 1 : null;
            const blackPawnConstants: PawnDetails = {
                singleForward: boardIndex - 10,
                doubleForward: boardIndex - 20,
                captureRight: boardIndex - 9,
                captureLeft: boardIndex - 11,
                firstPawnPos: 81,
                lastPawnPos: 88
            }

            tempEachPieceMoves = pawnMovement(color, boardIndex, chessBoardExtended, unphasantCaptureIdx, blackPawnConstants);
        }
        else if (currentPiece === 'P') {

            const unphasantCaptureIdx = unphasantMove !== '-' ? locationToSqNum(unphasantMove) + 19 + (parseInt(unphasantMove[1])) * 2 - 1 : null;
            const whitePawnConstants: PawnDetails = {
                singleForward: boardIndex + 10,
                doubleForward: boardIndex + 20,
                captureRight: boardIndex + 11,
                captureLeft: boardIndex + 9,
                firstPawnPos: 31,
                lastPawnPos: 38
            }

            tempEachPieceMoves = pawnMovement(color, boardIndex, chessBoardExtended, unphasantCaptureIdx, whitePawnConstants);

        }
        else if (currentPiece === 'n' || currentPiece === 'N') {
            tempEachPieceMoves = nightMovement(color, boardIndex, chessBoardExtended, nightMoveDirection);
        }
        else if (currentPiece === 'k' || currentPiece === 'K') {
            tempEachPieceMoves = kingMovement(color, boardIndex, chessBoardExtended, kingMoveDirection, castlePermission);
        }
        else if (currentPiece === 'q' || currentPiece === 'Q') {
            tempEachPieceMoves = rookBishopQueenMovement(color, boardIndex, chessBoardExtended, queenMoveDirection);
        }
        else if (currentPiece === 'r' || currentPiece === 'R') {
            tempEachPieceMoves = rookBishopQueenMovement(color, boardIndex, chessBoardExtended, rookMoveDirection);
        }
        else {
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

/**
 * Calculate possible moves for a rook, bishop, or queen based on its color, current position, chess board state,
 * and movement directions.
 *
 * @param {string} color - Color of the piece ('w' for white, 'b' for black).
 * @param {number} boardIndex - Index of the piece on the extended chess board.
 * @param {(number | string)[]} chessBoardExtended - Extended chess board array.
 * @param {number[]} moveDirection - Possible directions for piece movement.
 * @returns {PieceMoves} - Object containing possible linear moves, captures, en passant moves, and castling moves.
 */
function rookBishopQueenMovement(color: string, boardIndex: number, chessBoardExtended: (number | string)[], moveDirection: number[]): PieceMoves {

    let tempMoves: PieceMoves = {
        linearMove: [],
        captureMove: [],
        unphasantMove: [],
        castle: []
    }

    // Iterate through all possible piece movement directions
    for (let i = 0; i < moveDirection.length; i++) {

        let nextPiecePosition = boardIndex + moveDirection[i];

        // Continue moving along the direction until end of board is encountered
        while (chessBoardExtended[nextPiecePosition] !== 1) {

            if (chessBoardExtended[nextPiecePosition] === 0) {
                // Check for possible linear moves
                tempMoves.linearMove.push(findRankAndFile(nextPiecePosition))
            }
            // Check for possible captures
            else if (typeof chessBoardExtended[nextPiecePosition] === 'string' && !checkOwnPiece(color, chessBoardExtended[nextPiecePosition].toString())) {
                tempMoves.captureMove.push(findRankAndFile(nextPiecePosition));
                break;
            }
            // Stop if own piece is encountered
            else if (checkOwnPiece(color, chessBoardExtended[nextPiecePosition].toString())) break;
            nextPiecePosition += moveDirection[i];
        }
    }

    return tempMoves;
}

/**
 * Calculate possible moves for a king based on its color, current position, chess board state,
 * king movement directions, and castle permissions.
 *
 * @param {string} color - Color of the king ('w' for white, 'b' for black).
 * @param {number} boardIndex - Index of the king on the extended chess board.
 * @param {(number | string)[]} chessBoardExtended - Extended chess board array.
 * @param {number[]} kingMoveDirection - Possible directions for king movement.
 * @param {string} castlePermission - String indicating available castling permissions.
 * @returns {PieceMoves} - Object containing possible linear moves, captures, en passant moves, and castling moves.
 */
function kingMovement(color: string, boardIndex: number, chessBoardExtended: (number | string)[], kingMoveDirection: number[], castlePermission: string): PieceMoves {

    let tempMoves: PieceMoves = {
        linearMove: [],
        captureMove: [],
        unphasantMove: [],
        castle: []
    }

    // Iterate through all possible king movement directions
    for (let i = 0; i < kingMoveDirection.length; i++) {
        const nextKingPos = boardIndex + kingMoveDirection[i];

        //Check for any linear moves
        if (chessBoardExtended[nextKingPos] === 0) {
            tempMoves.linearMove.push(findRankAndFile(nextKingPos));
        }
        //Check for any capture
        else if (typeof chessBoardExtended[nextKingPos] === 'string' && !checkOwnPiece(color, chessBoardExtended[nextKingPos].toString())) {
            tempMoves.captureMove.push(findRankAndFile(nextKingPos));
        }
    }

    // Check for castling moves based on color and castle permissions
    if (color === 'w') {
        if (castlePermission.includes('K') && chessBoardExtended[26] === 0 && chessBoardExtended[27] === 0) {
            tempMoves.castle.push(findRankAndFile(27));
        }
        if (castlePermission.includes('Q') && chessBoardExtended[24] === 0 && chessBoardExtended[23] === 0 && chessBoardExtended[22] === 0) {
            tempMoves.castle.push(findRankAndFile(23));
        }
    }
    else {
        if (castlePermission.includes('k') && chessBoardExtended[96] === 0 && chessBoardExtended[97] === 0) {
            tempMoves.castle.push(findRankAndFile(97));
        }
        if (castlePermission.includes('q') && chessBoardExtended[94] === 0 && chessBoardExtended[93] === 0 && chessBoardExtended[92] === 0) {
            tempMoves.castle.push(findRankAndFile(93));
        }
    }

    return tempMoves;
}

/**
 * Calculate possible moves for a knight based on its color, current position, chess board state,
 * and knight movement directions.
 *
 * @param {string} color - Color of the knight ('w' for white, 'b' for black).
 * @param {number} boardIndex - Index of the knight on the extended chess board.
 * @param {(number | string)[]} chessBoardExtended - Extended chess board array.
 * @param {number[]} nightMoveDirection - Possible directions for knight movement.
 * @returns {PieceMoves} - Object containing possible linear moves, captures, en passant moves, and castling moves.
 */
function nightMovement(color: string, boardIndex: number, chessBoardExtended: (number | string)[], nightMoveDirection: number[]): PieceMoves {

    let tempMoves: PieceMoves = {
        linearMove: [],
        captureMove: [],
        unphasantMove: [],
        castle: []
    }

    // Iterate through all possible knight movement directions
    for (let i = 0; i < nightMoveDirection.length; i++) {
        const nextNightPos = boardIndex + nightMoveDirection[i];

        // Check for possible linear moves
        if (chessBoardExtended[nextNightPos] === 0) {
            tempMoves.linearMove.push(findRankAndFile(nextNightPos));
        }
        // Check for possible captures
        else if (typeof chessBoardExtended[nextNightPos] === 'string' && !checkOwnPiece(color, chessBoardExtended[nextNightPos].toString())) {
            tempMoves.captureMove.push(findRankAndFile(nextNightPos));
        }
    }

    return tempMoves;
}

/**
 * Calculate possible moves for a pawn based on its color, current position, chess board state,
 * en passant move information and pawn details.
 *
 * @param {string} color - Color of the pawn ('w' for white, 'b' for black).
 * @param {number} boardIndex - Index of the pawn on the extended chess board.
 * @param {(number | string)[]} chessBoardExtended - Extended chess board array.
 * @param {null | number} unphasantMove - En passant move index (null if none).
 * @param {PawnDetails} pawnDetails - Constants related to pawn movements.
 * @returns {PieceMoves} - Object containing possible linear moves, captures, en passant moves, and castling moves.
 */
function pawnMovement(color: string, boardIndex: number, chessBoardExtended: (number | string)[], unphasantMove: null | number, pawnDetails: PawnDetails): PieceMoves {

    let tempMoves: PieceMoves = {
        linearMove: [],
        captureMove: [],
        unphasantMove: [],
        castle: []
    }

    //move one rank at a time
    if (chessBoardExtended[pawnDetails.singleForward] === 0) {
        tempMoves.linearMove.push(findRankAndFile(pawnDetails.singleForward));

        //move two rank at a time
        if (boardIndex >= pawnDetails.firstPawnPos && boardIndex <= pawnDetails.lastPawnPos && chessBoardExtended[pawnDetails.doubleForward] === 0) {
            tempMoves.linearMove.push(findRankAndFile(pawnDetails.doubleForward));
        }
    }

    //Capture piece in right place of board
    if (chessBoardExtended[pawnDetails.captureRight] !== 1 && chessBoardExtended[pawnDetails.captureRight] !== 0 && !checkOwnPiece(color, chessBoardExtended[pawnDetails.captureRight].toString())) {
        tempMoves.captureMove.push(findRankAndFile(pawnDetails.captureRight));
    }

    //Capture piece in left place of board
    if (chessBoardExtended[pawnDetails.captureLeft] !== 1 && chessBoardExtended[pawnDetails.captureLeft] !== 0 && !checkOwnPiece(color, chessBoardExtended[pawnDetails.captureLeft].toString())) {
        tempMoves.captureMove.push(findRankAndFile(pawnDetails.captureLeft));
    }

    //If unphasant move is present
    if (unphasantMove) {
        if (color === "b") {
            if (boardIndex - 11 === unphasantMove || boardIndex - 9 === unphasantMove) {
                tempMoves.unphasantMove.push(findRankAndFile(unphasantMove));
            }
        }
        else {
            if (boardIndex + 11 === unphasantMove || boardIndex + 9 === unphasantMove) {
                tempMoves.unphasantMove.push(findRankAndFile(unphasantMove));
            }
        }
    }

    return tempMoves;
}

/**
 * Check if a given piece belongs to the specified color.
 *
 * @param {string} pieceColor - Color of the reference piece ('w' for white, 'b' for black).
 * @param {string} comparePiece - Color-agnostic representation of the piece to compare.
 * @returns {boolean} - True if the pieces have the same color, false otherwise.
 */
function checkOwnPiece(pieceColor: string, comparePiece: string): boolean {

    // Determine the color of the compare piece based on its case (uppercase for white, lowercase for black)
    const comparePieceColor = comparePiece.toUpperCase() === comparePiece ? "w" : "b";
    // Check if the colors of the reference piece and the compare piece are the same
    return comparePieceColor === pieceColor;
}

/**
 * Get the rank and file numbers of an 8x8 chess board based on the provided index
 * of a 120-square extended chess board.
 *
 * @param {number} ExtendedBoardIdx - Index of the 120-square extended chess board.
 * @returns {{ rank: number, file: number }} - Object containing rank and file numbers.
 */
function findRankAndFile(ExtendedBoardIdx: number): Location {

    const rank = Math.ceil((ExtendedBoardIdx + 1) / 10);
    const file = ExtendedBoardIdx - (rank - 1) * 10;

    return { rank: rank - 2, file: file };
}

/**
 * Get the square number on an 8x8 chess board based on the provided square code.
 *
 * @param {string} squareCode - Square code in algebraic notation (e.g., 'a1', 'e5').
 * @returns {number} - Square number on the 8x8 chess board.
 */
function locationToSqNum(squareCode: string): number {

    const fileNums = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    const rank = parseInt(squareCode[1]);
    const file = fileNums.indexOf(squareCode[0]) + 1;

    return (rank - 1) * 8 + file;
}

/**
 * Converts rank and file coordinates to a square number on an 8x8 chess board.
 *
 * @param {number} rank - The rank (row) of the square, ranging from 1 to 8.
 * @param {number} file - The file (column) of the square, ranging from 1 to 8.
 * @returns {number} - The square number corresponding to the given rank and file.
 */
export function fileAndRankToSq(rank: number, file: number): number {
    return (rank - 1) * 8 + file;
}

/**
 * Fill the empty chess board array with piece positions from FEN notation.
 * Return both the extended and normal array for move calculation and generating new FEN position.
 *
 * @param {string} pieceInfo - First Part of FEN position (pieces position)
 * @returns {[(number | string)[], (number | string)[]]} - Arrays representing the chess board(64 size) and extended board(120 size)
 */
export function fillChessBoardArray(pieceInfo: string): (number | string)[][] {

    //Empty chess board with initail value filled of zero and one
    const chessBoard: (number | string)[] = new Array(64).fill(0);
    const chessBoardExtended: (number | string)[] = new Array(120).fill(1);

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

/**
 * Converts the numeric rank and file indices to a string code.
 * 
 * @param rank - Numeric rank index (1 to 8).
 * @param file - Numeric file index (1 to 8).
 * @returns The string code representing the square (e.g., "a1", "h8").
 */
export function fileAndRankToStrCode(rank: number, file: number): string {
    const fileNums = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return fileNums[file - 1] + rank.toString();
}
