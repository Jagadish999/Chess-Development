
import { useState } from "react";
import Piece from "./Piece";
import { PieceDetails, Location } from "./pieceTypes";
import HighLightedSquare from "./HighLightedSquare";

export default function Board(props: { moveDetails: PieceDetails[] }) {

    const boardSize = 600;
    const details = props.moveDetails;

    // let clickedPiece: null | PieceDetails = null;
    const [clickedPiece, setClickedPiece] = useState<null | PieceDetails>(null);

    const handelPieceClicked = (currentClicked: PieceDetails) => {
        console.log("Piece Clicked");

        if (clickedPiece === null) {
            setClickedPiece(currentClicked);
        }
        else if (clickedPiece.file === currentClicked.file && clickedPiece.rank === currentClicked.rank) {
            setClickedPiece(null);
        }
        else {
            setClickedPiece(currentClicked);
        }
    }
    return (
        <div
            className={`bg-no-repeat bg-cover relative`}
            style={{ backgroundImage: `url(${'/Images/Board.png'})`, width: `${boardSize}px`, height: `${boardSize}px` }}
        >

            {details.map((value, index) => {
                return (
                    <Piece details={value} key={index} pieceClicked={handelPieceClicked} />
                )
            })}

            {clickedPiece !== null ? (
                <>
                    {clickedPiece.linearMove.map((value: Location, index) => {
                        return (
                            <HighLightedSquare
                                key={index}
                                size={boardSize / 8}
                                file={value.file}
                                rank={value.rank}
                                color={"green"}
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
                            />)
                    })}
                </>
            ) : (
                <></>
            )}
        </div>
    );
}

