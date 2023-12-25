
import { useState } from "react";
import { PieceDetails } from "./pieceTypes";

export default function Piece(props: { details: PieceDetails }) {

    const pieceDetail = props.details;

    const topPos = (8 - pieceDetail.rank) * 75;
    const leftPos = (pieceDetail.file - 1) * 75;
    return (
        <img
            src={`/Images/${pieceDetail.color}/${pieceDetail.pieceName}.png`}
            alt="Piece Img"
            className={"absolute w-[75px] h-[75px]"}
            style={{ top: `${(topPos)}px`, left: `${leftPos}px` }}
            >
        </img>
    )
}