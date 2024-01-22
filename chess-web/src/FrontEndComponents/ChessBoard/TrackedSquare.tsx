import { Location } from "./pieceTypes";

export default function TrackedSquare(props: { squareLocation: Location, size: number }) {

    const topPos = (8 - props.squareLocation.rank) * props.size;
    const leftPos = (props.squareLocation.file - 1) * props.size;

    return (
        <div
            className="absolute bg-[rgba(86,146,63,0.5)]"
            style={{ top: `${(topPos)}px`, left: `${leftPos}px`, width: `${props.size}px`, height: `${props.size}px` }}>
        </div>
    )
}