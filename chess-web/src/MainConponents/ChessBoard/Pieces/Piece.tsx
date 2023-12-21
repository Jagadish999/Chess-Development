
import { useState } from "react";
import { PieceDetail } from "./Details/pieceTypes";

export default function Piece(props: { details: PieceDetail }) {

    const pieceDetail = props.details;

    const topPos = (8 - pieceDetail.rank) * 75;
    const leftPos = (8 - pieceDetail.file) * 75;
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