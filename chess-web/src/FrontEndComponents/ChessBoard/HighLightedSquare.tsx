import { Location } from './pieceTypes';

const HighLightedSquare = (props: { size: number, file: number, rank: number, color: string, pieceMoved: Function, pawnPromotion: Function, moveType: string, pieceLocation: Location | null, pieceName: string }) => {

    // console.log("Highlighted Squares")
    const topPos = (8 - props.rank) * props.size;
    const leftPos = (props.file - 1) * props.size;

    const dotSize = 0.3 * props.size;

    return (
        <div
            className="absolute hover:bg-[rgba(33,33,33,0.5)] flex items-center justify-center"
            style={{ top: `${(topPos)}px`, left: `${leftPos}px`, width: `${props.size}px`, height: `${props.size}px` }}
            onClick={() => {

                let piecePromoted: string | null = null;

                if ((props.pieceName === 'p' && props.rank === 1) || (props.pieceName === 'P' && props.rank === 8)) {
                    props.pawnPromotion({ rank: props.rank, file: props.file }, props.moveType, props.pieceLocation);
                }
                else {
                    props.pieceMoved({ rank: props.rank, file: props.file }, props.moveType, piecePromoted, props.pieceLocation);
                }
            }}
        >
            <div
                className="rounded-[50%]"
                style={{ background: `${props.color}`, height: `${dotSize}px`, width: `${dotSize}px` }}
            ></div>
        </div>
    )
}

export default HighLightedSquare;