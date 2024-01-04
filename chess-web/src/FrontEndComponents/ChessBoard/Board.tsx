import { useState } from "react";
import Piece from "./Piece";
import { PieceDetails, Location } from "./pieceTypes";
import HighLightedSquare from "./HighLightedSquare";
import PromotionOption from "./PromotionOption";

export default function Board(props: { moveDetails: PieceDetails[], updatedMoves: Function, turnWisePlay: boolean, currentTurn: string }) {
    //Initial board size
    const boardSize = 600;

    //State management for click in piece
    const [clickedPiece, setClickedPiece] = useState<null | PieceDetails>(null);
    //State management for click detection in valid move squares
    const [currentClickedLocation, setClickedLocation] = useState<null | Location>(null);
    //For Piece promotion information
    const [pawnPromotionDetail, setPawnPromotionDetails] = useState<null | {
        moveLocation: Location,
        moveType: string,
        pieceLocation: Location
    }>(null);

    //Highlight available moves of every piece in board
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

    //Move piece in board
    const handlePieceMovement = (moveLocation: Location, moveType: string, pawnPromotion: string | null, pieceLocation: Location) => {

        props.updatedMoves(pieceLocation, moveLocation, moveType, pawnPromotion, clickedPiece);

        console.log(moveLocation, moveType, pawnPromotion, pieceLocation, clickedPiece);
        

        setClickedPiece(null);
        setClickedLocation(null);
        setPawnPromotionDetails(null);
    }

    //If pawn promotion of any color
    const handlePawnPromotion = (moveLocation: Location, moveType: string, pieceLocation: Location) => {

        setPawnPromotionDetails({
            moveLocation: moveLocation,
            moveType: moveType,
            pieceLocation: pieceLocation
        });

        console.log(moveLocation, moveType, pieceLocation);

        // setClickedPiece(null);
        setClickedLocation(null);
    }

    return (
        <div
            className={`bg-no-repeat bg-fit relative`}
            style={{ backgroundImage: `url(${'/Images/brd.svg'})`, width: `${boardSize}px`, height: `${boardSize}px` }}
        >

            {props.moveDetails.map((value, index) => {
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
                                pawnPromotion={handlePawnPromotion}
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
                                pawnPromotion={handlePawnPromotion}
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
                                pawnPromotion={handlePawnPromotion}
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
                                pawnPromotion={handlePawnPromotion}
                                moveType={"c"}
                                pieceLocation={currentClickedLocation}
                                pieceName={clickedPiece.pieceName}
                            />)
                    })}
                </>
            ) : (
                <></>
            )}

            {pawnPromotionDetail && (
                <PromotionOption
                    size={boardSize / 8}
                    promotionLocation={pawnPromotionDetail.pieceLocation}
                    moveLocation={pawnPromotionDetail.moveLocation}
                    moveType={pawnPromotionDetail.moveType}
                    cancelPromo={() => {
                        setClickedPiece(null);
                        setClickedLocation(null);
                        setPawnPromotionDetails(null);
                    }}
                    optionSelected={handlePieceMovement}
                />
            )}
        </div>
    );
}

