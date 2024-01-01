import { useState } from "react";
import Board from "../ChessBoard/Board";
import { findPieceMoveDetails, movePieceInBoard, unphasantPossibility, updatedCastlePermission } from "../ChessBoard/boardDetails";
import { CastleDetails, PieceDetails } from "../ChessBoard/pieceTypes";
import { INITIAL_CASTLE_PERMISSION, INITIAL_FEN_POSITION } from "../ChessBoard/constants";
import { calculateRawMove, fillChessBoardArray } from "../ChessBoard/pieceDetails";
import { Location } from "../ChessBoard/pieceTypes";

export default function Puzzle(){

    const [initialFenPosition, setFenPosition] = useState<string>(INITIAL_FEN_POSITION);

    const splittedFenPos = initialFenPosition.split(" ");
    const chessBoardArray = fillChessBoardArray(splittedFenPos[0]);

    const [castlePermissions, setCastlePermissions] = useState<CastleDetails>(INITIAL_CASTLE_PERMISSION);
    const [pieceDetails, setPieceDetails] = useState<PieceDetails[]>(calculateRawMove(chessBoardArray[1], splittedFenPos[3] , splittedFenPos[2], splittedFenPos[1]));

    // const check = verifyCheck(pieceDetails, splittedFenPos[1]);
    // const movesAvailble = verifyMovesAvailable(pieceDetails, splittedFenPos[1])

    const handleUpdatedMoves = (pieceLocation: Location, moveLocation: Location, moveType: string, piecePromoted: string | null, currentPieceDetail: PieceDetails) => {

        const updatedPieceLocations = movePieceInBoard(chessBoardArray[0], pieceLocation, moveLocation, moveType, piecePromoted);
        const nextTurn = splittedFenPos[1] === 'w' ? 'b' : 'w';
        const castlePerms = updatedCastlePermission(castlePermissions, moveLocation, currentPieceDetail, pieceDetails, chessBoardArray[0]);
        const unphasant = unphasantPossibility(currentPieceDetail, chessBoardArray[0], moveLocation);

        const halfMove = moveType === 'x' || currentPieceDetail.pieceName === 'p' || currentPieceDetail.pieceName === 'P' ? '0' : parseInt(splittedFenPos[4]) + 1;
        const fullMove = splittedFenPos[1] === 'b' ? parseInt(splittedFenPos[5]) + 1 : splittedFenPos[5];

        const newFenPosition = `${updatedPieceLocations} ${nextTurn} ${castlePerms} ${unphasant} ${halfMove} ${fullMove}`;

        console.log(pieceLocation, moveLocation, moveType, piecePromoted, chessBoardArray[0]);
        console.log(newFenPosition);

        setFenPosition(newFenPosition);
        setCastlePermissions(castlePermissions);
        setPieceDetails(findPieceMoveDetails(newFenPosition, castlePermissions));
    }

    return (
        <div>
            <Board moveDetails={pieceDetails} updatedMoves={handleUpdatedMoves} turnWisePlay={false} currentTurn={splittedFenPos[1]} />
        </div>
    )
}