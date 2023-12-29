
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
        else if(clickedPiece.file === currentClicked.file && clickedPiece.rank === currentClicked.rank){
            setClickedPiece(null);
        }
        else{
            setClickedPiece(currentClicked);
        }
    }
    return (
        <div
            className={`bg-[url('/public/Images/brd.webp')] w-[${boardSize}px] h-[${boardSize}px] bg-no-repeat bg-cover relative`}
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
                </>
            ) : (
                <></>
            )}
        </div>
    );
}

