import { useState } from "react";
import Board from "../ChessBoard/Board";
import { findPieceMoveDetails, movePieceInBoard, unphasantPossibility, updatedCastlePermission } from "../ChessBoard/boardDetails";
import { CastleDetails, PieceDetails, Location } from "../ChessBoard/pieceTypes";
import { INITIAL_CASTLE_PERMISSION, INITIAL_FEN_POSITION } from "../ChessBoard/constants";
import { fillChessBoardArray, verifyCheck, verifyMovesAvailable } from "../ChessBoard/pieceDetails";

export default function OnlineMatch() {

    const [initialFenPosition, setFenPosition] = useState<string>(INITIAL_FEN_POSITION);
    const [castlePermissions, setCastlePermissions] = useState<CastleDetails>(INITIAL_CASTLE_PERMISSION);
    const [pieceDetails, setPieceDetails] = useState<PieceDetails[]>(findPieceMoveDetails(initialFenPosition, castlePermissions));

    const splittedFenPos = initialFenPosition.split(" ");

    // const check = verifyCheck(pieceDetails, splittedFenPos[1]);
    // const movesAvailble = verifyMovesAvailable(pieceDetails, splittedFenPos[1])

    const handleUpdatedMoves = (pieceLocation: Location, moveLocation: Location, moveType: string, piecePromoted: string | null, currentPieceDetail: PieceDetails) => {

        const chessBoard = fillChessBoardArray(splittedFenPos[0])[0];

        const updatedPieceLocations = movePieceInBoard(chessBoard, pieceLocation, moveLocation, moveType, piecePromoted);
        const nextTurn = splittedFenPos[1] === 'w' ? 'b' : 'w';
        const castlePerms = updatedCastlePermission(castlePermissions, moveLocation, currentPieceDetail, pieceDetails, chessBoard);
        const unphasant = unphasantPossibility(currentPieceDetail, chessBoard, moveLocation);

        const halfMove = moveType === 'x' || currentPieceDetail.pieceName === 'p' || currentPieceDetail.pieceName === 'P' ? '0' : parseInt(splittedFenPos[4]) + 1;
        const fullMove = splittedFenPos[1] === 'b' ? parseInt(splittedFenPos[5]) + 1 : splittedFenPos[5];

        const newFenPosition = `${updatedPieceLocations} ${nextTurn} ${castlePerms} ${unphasant} ${halfMove} ${fullMove}`;

        console.log(pieceLocation, moveLocation, moveType, piecePromoted, chessBoard);
        console.log(newFenPosition);

        setFenPosition(newFenPosition);
        setCastlePermissions(castlePermissions);
        setPieceDetails(findPieceMoveDetails(newFenPosition, castlePermissions));
    }

    return (
        <div>
            <Board moveDetails={pieceDetails} updatedMoves={handleUpdatedMoves} turnWisePlay={true} currentTurn={splittedFenPos[1]} />
        </div>
    )
}