import { useState } from "react";
import { INITIAL_FEN_POSITION, INITIAL_CASTLE_PERMISSION } from "../ChessBoard/constants"
import { calculateAllPossibleMoves, fillChessBoardArray, filterMoves, movePieceInBoard, unphasantPossibility, updatedCastlePermission, verifyCheck, verifyCheckmate, verifyStalemate } from "../ChessBoard/moveLogic";
import { Location, PieceDetails } from "../ChessBoard/pieceTypes";
import Board from "../ChessBoard/Board";

export default function Puzzle(){


    //Record all previous played FEN to detect stalemate
    const [allFenPositions, setallFenPositions] = useState([INITIAL_FEN_POSITION.split(" ")[0]]);

    //Current FEN position and castle permission
    const [currentFenPosition, setCurrentFenPosition] = useState(INITIAL_FEN_POSITION);

    //Castle permission
    let currentCastlePermission = INITIAL_CASTLE_PERMISSION;

    //splitted FEN position for all moves calculation
    const splittedFenPos = currentFenPosition.split(" ");

    //Find Filtered Moves for online match
    const boardDetailsArray = fillChessBoardArray(splittedFenPos[0]);
    const unfilteredMoves = calculateAllPossibleMoves(boardDetailsArray[1], splittedFenPos[3], splittedFenPos[2], splittedFenPos[1]);
    const filteredMoves = filterMoves(unfilteredMoves, splittedFenPos[1], boardDetailsArray[0]);

    //Find check, stalemate and checkmate
    const check: boolean = verifyCheck(filteredMoves, splittedFenPos[1]);
    const checkmate:boolean = verifyCheckmate(filteredMoves, splittedFenPos[1]);
    const stalemate:boolean = checkmate ? false : verifyStalemate(filteredMoves, splittedFenPos[1], allFenPositions, currentFenPosition);

    console.log("Check: " + check);
    console.log("CheckMate: " + checkmate);
    console.log("Stalemate: " + stalemate);

    const handleUpdatedMoves = (pieceLocation: Location, moveLocation: Location, moveType: string, piecePromoted: string | null, currentPieceDetail: PieceDetails) => {

        //Generating new Fen Position
        const updatedPieceLocations = movePieceInBoard(boardDetailsArray[0], pieceLocation, moveLocation, moveType, piecePromoted);
        const nextTurn = splittedFenPos[1] === 'w' ? 'b' : 'w';
        const castlePerms = updatedCastlePermission(currentCastlePermission, currentPieceDetail, filteredMoves, boardDetailsArray[0]);
        const unphasant = unphasantPossibility(currentPieceDetail, boardDetailsArray[0], moveLocation);
        const halfMove = moveType === 'x' || currentPieceDetail.pieceName === 'p' || currentPieceDetail.pieceName === 'P' ? '0' : parseInt(splittedFenPos[4]) + 1;
        const fullMove = splittedFenPos[1] === 'b' ? parseInt(splittedFenPos[5]) + 1 : splittedFenPos[5];

        //Set new FEN position and rerender the component
        const tempFenPos = `${updatedPieceLocations} ${nextTurn} ${castlePerms} ${unphasant} ${halfMove} ${fullMove}`;
        setCurrentFenPosition(tempFenPos);
        setallFenPositions((prevFenPos) => {
            return [...prevFenPos, tempFenPos.split(" ")[0]]
        })

        console.log(tempFenPos);
        console.log(currentFenPosition);
    }

    return (
        <Board
            moveDetails={unfilteredMoves}
            updatedMoves={handleUpdatedMoves}
            turnWisePlay={false}
            currentTurn={splittedFenPos[1]}
            gamePlayable={true}
            previousMove={null}
            backAndForth={false}
        />
    )
}