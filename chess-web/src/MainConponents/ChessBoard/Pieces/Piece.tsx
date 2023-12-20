
import { useEffect, useState } from "react";
import { PieceDetail } from "./Details/pieceTypes";

export default function Piece(props: { details: PieceDetail }) {

    const pieceDetail = props.details;

    let [pieceTop, setPieceTop] = useState((8 - pieceDetail.rank) * 75);
    let [pieceLeft, setPieceLeft] = useState((8 - pieceDetail.file) * 75);

    const chagePiecePos = (valueX: number, valueY: number) => {
        setPieceTop(pieceTop + valueX);
        setPieceLeft(pieceLeft + valueY);
    }

    const currentMousePos: React.MouseEventHandler<HTMLImageElement> = (event) => {
        console.log(event.clientX);
        console.log(event.clientY);
    }

    return (
        <img
            src={`/Images/${pieceDetail.color}/${pieceDetail.pieceName}.png`}
            alt="Piece Img"
            className={`absolute w-[77px] h-[77px]`}
            style={{ top: `${(pieceTop)}px`, left: `${pieceLeft}px` }}
            onMouseDown={(event) => {
                currentMousePos(event)
            }}
            onMouseMove={() => {console.log("Bla")}}>
        </img>
    )
}