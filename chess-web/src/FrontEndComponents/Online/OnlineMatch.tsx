import { useState } from "react";
import { INITIAL_FEN_POSITION, INITIAL_CASTLE_PERMISSION } from "../ChessBoard/constants";
import { calculateAllPossibleMoves, fileAndRankToStrCode, fillChessBoardArray, filterMoves, findRankAndFileEachPiece, movePieceInBoard, unphasantPossibility, updatedCastlePermission, verifyCheck, verifyCheckmate, verifyStalemate } from "../ChessBoard/moveLogic";
import { Location, PieceDetails } from "../ChessBoard/pieceTypes";
import Board from "../ChessBoard/Board";
import PreviousMoves from "../PreviousMoves/PreviousMoves";

export default function OnlineMatch() {

    //State for recording previous FEN postion and moves 
    const [allFenPositions, setAllFenPositions] = useState([INITIAL_FEN_POSITION]);
    const [allPrevmoves, setAllPrevMoves] = useState<string[][]>([]);
    const [moveCounter, setMoveCounter] = useState<number>(-1);

    //Castle permission and current fen position
    const currentFenPosition = allFenPositions[moveCounter + 1];
    let currentCastlePermission = INITIAL_CASTLE_PERMISSION;
    const splittedFenPos = currentFenPosition.split(" ");

    // console.log(currentFenPosition);

    //Find Filtered Moves for online match
    const boardDetailsArray = fillChessBoardArray(splittedFenPos[0]);

    let filteredMoves: PieceDetails[];

    let check: boolean = false;
    let checkmate: boolean = false;
    let stalemate: boolean = false;

    if(currentFenPosition === allFenPositions[allFenPositions.length - 1]){

        const unfilteredMoves = calculateAllPossibleMoves(boardDetailsArray[1], splittedFenPos[3], splittedFenPos[2], splittedFenPos[1]);
        filteredMoves = filterMoves(unfilteredMoves, splittedFenPos[1], boardDetailsArray[0]);

        //Find check, stalemate and checkmate
         check = verifyCheck(filteredMoves, splittedFenPos[1]);
         checkmate = verifyCheckmate(filteredMoves, splittedFenPos[1]);
         stalemate = checkmate ? false : verifyStalemate(filteredMoves, splittedFenPos[1], allFenPositions, currentFenPosition);
    }
    else{
        filteredMoves = findRankAndFileEachPiece(boardDetailsArray[1]);
    }

    const handleBackAndForth = (changeStr: string) => {

        //Point at the last move played
        if (changeStr === 'p' && moveCounter !== -1) {

            setMoveCounter(-1);
        }
        //Decrease one move if available
        else if (changeStr === 'p-1') {

            if (moveCounter !== -1) {
                setMoveCounter((prevValue: number) => prevValue - 1);
            }
        }
        else if (changeStr === 'n-1') {

            if (moveCounter !== allPrevmoves.length - 1) {
                setMoveCounter((prevValue: number) => prevValue + 1);
            }
        }
        //Point to most currently played move
        else if (changeStr === 'n') {

            if (allPrevmoves.length > 0 && moveCounter !== allPrevmoves.length - 1){
                setMoveCounter(allPrevmoves.length - 1);
            }
        }
    }

    const handleUpdatedMoves = (pieceLocation: Location, moveLocation: Location, moveType: string, piecePromoted: string | null, currentPieceDetail: PieceDetails) => {

        //Generating new Fen Position
        const updatedPieceLocations = movePieceInBoard(boardDetailsArray[0], pieceLocation, moveLocation, moveType, piecePromoted);
        const nextTurn = splittedFenPos[1] === 'w' ? 'b' : 'w';

        //Temp board Details to calculate castle permissions
        const tempBrdDetails = fillChessBoardArray(updatedPieceLocations);
        const tempNextToPlay = splittedFenPos[1] === 'w' ? 'b' : 'w';
        const unfilteredMoves = calculateAllPossibleMoves(tempBrdDetails[1], '-', '-', tempNextToPlay);

        const castlePerms = updatedCastlePermission(currentCastlePermission, currentPieceDetail, unfilteredMoves, boardDetailsArray[0]);
        const unphasant = unphasantPossibility(currentPieceDetail, boardDetailsArray[0], moveLocation);
        const halfMove = moveType === 'x' || currentPieceDetail.pieceName === 'p' || currentPieceDetail.pieceName === 'P' ? '0' : parseInt(splittedFenPos[4]) + 1;
        const fullMove = splittedFenPos[1] === 'b' ? parseInt(splittedFenPos[5]) + 1 : splittedFenPos[5];

        //Set new FEN position and rerender the component
        const tempFenPos = `${updatedPieceLocations} ${nextTurn} ${castlePerms} ${unphasant} ${halfMove} ${fullMove}`;

        setAllFenPositions((prevFenPos) => {
            //Setting condition for which no checking required, if pawn moves or capture takes place
            return [...prevFenPos, tempFenPos]
        });
        setAllPrevMoves((prevAllMoves) => {

            return [...prevAllMoves, [fileAndRankToStrCode(pieceLocation.rank, pieceLocation.file), fileAndRankToStrCode(moveLocation.rank, moveLocation.file), moveType]];
        });
        setMoveCounter(prevVal => prevVal + 1);
    }

    if (allPrevmoves.length > 0 && moveCounter > -1) {

        playSounds(check, checkmate, stalemate, allPrevmoves[moveCounter][2]);
    }


    return (

        <div className="flex flex-row mt-6">
            <div className="w-[60%] flex items-center justify-center">
                <Board
                    moveDetails={filteredMoves}
                    updatedMoves={handleUpdatedMoves}
                    turnWisePlay={true}
                    currentTurn={splittedFenPos[1]}
                    gamePlayable={!checkmate || !stalemate}
                    previousMove={allPrevmoves.length > 0 && moveCounter > -1 ? [allPrevmoves[moveCounter][0], allPrevmoves[moveCounter][1]] : null}
                    backAndForth={!(currentFenPosition === allFenPositions[allFenPositions.length - 1])}
                />

            </div>

            <div className="w-[40%]">
                <PreviousMoves
                    previousMoveDetails={allPrevmoves}
                    currentMove={moveCounter}
                    backAndForth={handleBackAndForth}
                />
            </div>
        </div>
    )
}

function playSounds(check: boolean, checkmate: boolean, stalemate: boolean, moveType: string): void {

    const checkmateSound = new Audio('/Sounds/Checkmate.mp3');
    const stalemateSound = new Audio('/Sounds/Draw.mp3');
    const checkSound = new Audio('/Sounds/Check.mp3');
    const moveSound = new Audio('/Sounds/Move.mp3');
    const captureSound = new Audio('/Sounds/Capture.mp3');
    const castleSound = new Audio('/Sounds/Castling.mp3');

    if (checkmate) {
        checkmateSound.play();
    }
    else if (stalemate) {
        stalemateSound.play();
    }
    else if (check) {
        checkSound.play();
    }
    else if (moveType === 'l') {
        moveSound.play();
    }
    else if (moveType === 'x' || moveType === 'u') {
        captureSound.play();
    }
    else if (moveType === 'c') {
        castleSound.play();
    }
}