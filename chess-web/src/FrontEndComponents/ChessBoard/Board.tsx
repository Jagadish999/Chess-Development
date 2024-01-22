import { useState } from "react";
import Piece from "./Piece";
import { PieceDetails, Location } from "./pieceTypes";
import HighLightedSquare from "./HighLightedSquare";
import PromotionOption from "./PromotionOption";
import TrackedSquare from "./TrackedSquare";
import { sqCodeToRankAndFile } from "./moveLogic";

export default function Board(props: { moveDetails: PieceDetails[], updatedMoves: Function, turnWisePlay: boolean, currentTurn: string, gamePlayable: boolean, previousMove: string[] | null, backAndForth: boolean }) {

    //Initial board size
    const boardSize = 550;

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
    // const [previousMovedSquare, setPreviousMovedSquare] = useState<null | Location[]>(null);

    let previousMovedSquare: null | Location[] = props.previousMove === null ? null : [sqCodeToRankAndFile(props.previousMove[0]), sqCodeToRankAndFile(props.previousMove[1])];

    if(props.backAndForth && (clickedPiece || currentClickedLocation || pawnPromotionDetail)){

        if(clickedPiece) setClickedPiece(null);
        if(currentClickedLocation) setClickedLocation(null);
        if(pawnPromotionDetail) setPawnPromotionDetails(null);

        // setPreviousMovedSquare([sqCodeToRankAndFile(props.previousMove[0]), sqCodeToRankAndFile(props.previousMove[1])]);
    }

    //Highlight available moves of every piece in board
    const handlePieceClicked = (currentClicked: PieceDetails) => {

        //If no piece is selected and turnwise play is
        if (clickedPiece === null) {

            //If turn wise play is not required make any piece moveable
            if (!props.turnWisePlay) {

                setClickedPiece(currentClicked);
                setClickedLocation({ file: currentClicked.file, rank: currentClicked.rank });
            }
            else {
                //If turn wise game is of priority avoid piece selection for invalid pieces
                if ((currentClicked.color === props.currentTurn)) {
                    setClickedPiece(currentClicked);
                    setClickedLocation({ file: currentClicked.file, rank: currentClicked.rank });
                }
            }
        }
        else {

            //If same piece is clicked twice remove piece from clicked list
            if ((clickedPiece.file === currentClicked.file && clickedPiece.rank === currentClicked.rank)) {

                setClickedPiece(null);
                setClickedLocation(null);
            }

            //If turn wise game is not of priority let any piece to be clicked
            else if (!props.turnWisePlay) {

                setClickedPiece(currentClicked);
                setClickedLocation({ file: currentClicked.file, rank: currentClicked.rank });
            }
            //If turn wise game is priority and selected a valid piece
            else if (props.turnWisePlay && props.currentTurn === currentClicked.color) {
                setClickedPiece(currentClicked);
                setClickedLocation({ file: currentClicked.file, rank: currentClicked.rank });
            }
            else if (props.turnWisePlay && props.currentTurn !== currentClicked.color) {
                setClickedPiece(null);
                setClickedLocation(null);
            }
        }
    }

    //Move piece in board
    const handlePieceMovement = (moveLocation: Location, moveType: string, pawnPromotion: string | null, pieceLocation: Location) => {

        props.updatedMoves(pieceLocation, moveLocation, moveType, pawnPromotion, clickedPiece);

        setClickedPiece(null);
        setClickedLocation(null);
        setPawnPromotionDetails(null);

        // setPreviousMovedSquare([moveLocation, pieceLocation]);
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
            <div
                className={`absolute`}
                style={{ width: `${boardSize}px`, height: `${boardSize}px` }}
                onClick={
                    () => { setClickedPiece(null) }
                }
            >
            </div>

            {previousMovedSquare !== null && previousMovedSquare.map((value, index) => <TrackedSquare squareLocation={value} size={boardSize / 8} key={index} />)}
            {props.moveDetails.map((value, index) => {
                return (
                    <Piece
                        details={value}
                        key={index}
                        pieceClicked={handlePieceClicked}
                        size={boardSize / 8}
                        currentlyClicked={clickedPiece !== null && clickedPiece.file === value.file && clickedPiece.rank === value.rank}
                        gamePlayable={props.gamePlayable}
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
                                color={"rgba(255,0,0,0.9)"}
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