import { useState } from "react";
import { INITIAL_FEN_POSITION, INITIAL_CASTLE_PERMISSION } from "../ChessBoard/constants"
import { calculateAllPossibleMoves, fillChessBoardArray, filterMoves, movePieceInBoard, unphasantPossibility, updatedCastlePermission, verifyCheck, verifyCheckmate, verifyStalemate } from "../ChessBoard/moveLogic";
import { Location, PieceDetails } from "../ChessBoard/pieceTypes";
import Board from "../ChessBoard/Board";
import { useParams } from "react-router-dom";

export default function EngineMatch() {

    const { color } = useParams();
    
    console.log(color);

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

        // console.log("____________");
        // console.log(pieceLocation, moveLocation, moveType, piecePromoted, currentPieceDetail);
        // console.log("____________");
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
    //If turn is of computer and game status is still playable
    if(color !== splittedFenPos[1] && (!checkmate && !stalemate)){
        //Make a random move here
        console.log("Now computers turn");
        console.log(filteredMoves);

        let validMovesSelected = false;

        while(!validMovesSelected){

            const randomPieceIdx = Math.floor(Math.random() * filteredMoves.length);
            const piece = filteredMoves[randomPieceIdx];

            if(piece.linearMove.length > 0 && piece.color !== color && (piece.pieceName !== 'p' && piece.pieceName !== 'P')){

                // pieceLocation: Location, moveLocation: Location, moveType: string, piecePromoted: string | null, currentPieceDetail: PieceDetails
                const pieceLocation: Location = {rank: piece.rank, file: piece.file};
                const moveLocation: Location = piece.linearMove[0];

                console.log(piece);
                console.log(pieceLocation);
                console.log(moveLocation);
                
                handleUpdatedMoves(pieceLocation, moveLocation, 'l', null, piece);

                break;
            }

        }
    }

    return (
        <Board
            moveDetails={filteredMoves}
            updatedMoves={handleUpdatedMoves}
            turnWisePlay={true}
            currentTurn={splittedFenPos[1]}
            gamePlayable={(!checkmate || !stalemate) && color === splittedFenPos[1]}
        />
    )
}