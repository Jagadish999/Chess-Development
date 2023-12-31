import { PieceDetails } from "./pieceTypes";

export default function Piece(props: { details: PieceDetails, pieceClicked: Function, size: number, currentlyClicked: boolean, turnWisePlay: boolean, currentTurn: string}) {

    const pieceDetail = props.details;

    const topPos = (8 - pieceDetail.rank) * props.size;
    const leftPos = (pieceDetail.file - 1) * props.size;

    const backgroundColor = props.currentlyClicked === true ? 'rgba(84, 129, 84, 1)' : 'rgba(0, 0, 0, 0)';
    
    return (
        <div
            className="absolute flex items-center justify-center"
            style={{top: `${(topPos)}px`, left: `${leftPos}px`, width: `${props.size}px`, height: `${props.size}px`, backgroundColor: `${backgroundColor}`}}
        >
            <img
                src={`/Images/${pieceDetail.color}/${pieceDetail.pieceName}.png`}
                alt="Piece Img"
                style={{ width: `${0.9 * props.size}px`, height: `${0.9 * props.size}px` }}
                onClick={() => { 

                    if(!props.turnWisePlay){
                    
                        props.pieceClicked(pieceDetail);
                        return;
                    } 
                    else if(pieceDetail.color === props.currentTurn && props.turnWisePlay){
                
                        props.pieceClicked(pieceDetail);
                        return;
                    }

                    console.log("Not turn to play");
                }}
            >
            </img>
        </div>

    )
}