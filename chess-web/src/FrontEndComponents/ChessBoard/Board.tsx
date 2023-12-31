import { useState } from "react";
import Piece from "./Piece";
import { PieceDetails, Location } from "./pieceTypes";
import HighLightedSquare from "./HighLightedSquare";

export default function Board(props: { moveDetails: PieceDetails[], updatedMoves: Function, turnWisePlay: boolean, currentTurn: string}) {

    const boardSize = 600;
    const details = props.moveDetails;

    const [clickedPiece, setClickedPiece] = useState<null | PieceDetails>(null);
    const [currentClickedLocation, setClickedLocation] = useState<null | Location>(null);

    const handlePieceClicked = (currentClicked: PieceDetails) => {

        if (clickedPiece === null) {
            setClickedPiece(currentClicked);
            setClickedLocation({ file: currentClicked.file, rank: currentClicked.rank });
        }
        else if (clickedPiece.file === currentClicked.file && clickedPiece.rank === currentClicked.rank) {
            setClickedPiece(null);
            setClickedLocation(null);
        }
        else {
            setClickedPiece(currentClicked);
            setClickedLocation({ file: currentClicked.file, rank: currentClicked.rank });
        }
    }

    const handlePieceMovement = (moveLocation: Location, moveType: string, piecePromoted: string | null, pieceLocation: Location) => {

        if (clickedPiece?.pieceName === 'p' && moveLocation.rank === 1) {
            piecePromoted = 'q';
        }
        else if (clickedPiece?.pieceName === 'P' && moveLocation.rank === 8) {
            piecePromoted = 'Q'
        }
        props.updatedMoves(pieceLocation, moveLocation, moveType, piecePromoted, clickedPiece);

        setClickedPiece(null);

    }
    return (
        <div
            className={`bg-no-repeat bg-fit relative`}
            style={{ backgroundImage: `url(${'/Images/brd.svg'})`, width: `${boardSize}px`, height: `${boardSize}px` }}
        >

            {details.map((value, index) => {
                return (
                    <Piece
                        details={value}
                        key={index}
                        pieceClicked={handlePieceClicked}
                        size={boardSize / 8}
                        currentlyClicked={clickedPiece !== null && clickedPiece.file === value.file && clickedPiece.rank === value.rank}
                        turnWisePlay={props.turnWisePlay}
                        currentTurn={props.currentTurn}
                    />
                )
            })}

            {clickedPiece !== null ? (
                <>
                    {clickedPiece.linearMove.map((value: Location, index) => {
                        // const currentPieceLocation = {clickedPiece.rank, clickedPiece.file};
                        return (
                            <HighLightedSquare
                                key={index}
                                size={boardSize / 8}
                                file={value.file}
                                rank={value.rank}
                                color={"green"}
                                pieceMoved={handlePieceMovement}
                                moveType={"l"}
                                pieceLocation={currentClickedLocation}
                                pieceName={clickedPiece.pieceName}
                            />)
                    })}

                    {clickedPiece.capture.map((value: Location, index) => {
                        return (
                            <HighLightedSquare
                                key={index}
                                size={boardSize / 8}
                                file={value.file}
                                rank={value.rank}
                                color={"red"}
                                pieceMoved={handlePieceMovement}
                                moveType={"x"}
                                pieceLocation={currentClickedLocation}
                                pieceName={clickedPiece.pieceName}
                            />)
                    })}

                    {clickedPiece.unphasant.map((value: Location, index) => {
                        return (
                            <HighLightedSquare
                                key={index}
                                size={boardSize / 8}
                                file={value.file}
                                rank={value.rank}
                                color={"blue"}
                                pieceMoved={handlePieceMovement}
                                moveType={"u"}
                                pieceLocation={currentClickedLocation}
                                pieceName={clickedPiece.pieceName}
                            />)
                    })}

                    {clickedPiece.castle.map((value: Location, index) => {
                        return (
                            <HighLightedSquare
                                key={index}
                                size={boardSize / 8}
                                file={value.file}
                                rank={value.rank}
                                color={"purple"}
                                pieceMoved={handlePieceMovement}
                                moveType={"c"}
                                pieceLocation={currentClickedLocation}
                                pieceName={clickedPiece.pieceName}
                            />)
                    })}
                </>
            ) : (
                <></>
            )}
        </div>
    );
}

