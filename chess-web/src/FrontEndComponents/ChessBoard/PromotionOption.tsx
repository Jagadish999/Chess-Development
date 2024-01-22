import { Location } from "./pieceTypes";

const PromotionOption = (props: { size: number, promotionLocation: Location, moveLocation: Location, moveType: string, cancelPromo: Function, optionSelected: Function }) => {

    // console.log("Promotion Option");
    const piecePromoOpt = ['q', 'r', 'b', 'n'];

    // const temoTopPos = (8 - props.moveLocation.rank) * props.size;
    const topPos = props.moveLocation.rank === 8 ? (8 - props.moveLocation.rank) * props.size : ((5 - props.moveLocation.rank) * props.size - 0.4 * props.size);
    const leftPos = (props.moveLocation.file - 1) * props.size;

    const totalHeight = 4 * props.size + 0.4 * props.size;

    const handleOptionSelected = (promotedTo: string) => {

        //moveLocation: Location, moveType: string, pawnPromotion: string | null, pieceLocation: Location)
        props.optionSelected(props.moveLocation, props.moveType, promotedTo, props.promotionLocation);
    }
    return (
        <>
            <div
                className="fixed w-screen h-screen top-[0px] left-[0px] bg-[rgba(33,33,33,0.5)]"
                onClick={() => {
                    props.cancelPromo();
                }}
            >
            </div>
            {/* Promotion Option */}
            <div
                className="absolute bg-[rgba(33,33,33,0.4)]"
                style={{ height: `${totalHeight}px`, width: `${props.size}px`, top: `${topPos}px`, left: `${leftPos}px` }}
                onClick={() => {
                    console.log("Clicked in option");
                }}
            >
                {props.moveLocation.rank === 1 ? (
                    <>
                        <div
                            className=" text-center font-bold cursor-pointer bg-[rgba(33,33,33,0.8)] text-white hover:bg-[rgba(200,0,0,1)]"
                            style={{ width: `${props.size}px`, height: `${0.4 * props.size}px` }}
                            onClick={() => {
                                props.cancelPromo();
                            }}
                        >
                            X
                        </div>
                        {piecePromoOpt.reverse().map((pieceImg, index) => {
                            return (
                                <div
                                    className="flex items-center justify-center rounded-[50%] bg-[#9d9d9d] cursor-pointer hover:rounded-none hover:bg-[#e05916]"
                                    style={{ width: `${props.size}px`, height: `${props.size}px` }}
                                    key={index}
                                >
                                    <img
                                        className="hover:scale-125"
                                        src={`/Images/b/${pieceImg}.png`}
                                        alt="Piece Img"
                                        style={{ width: `${0.8 * props.size}px`, height: `${0.8 * props.size}px` }}
                                        onClick={() => {
                                            handleOptionSelected(pieceImg);
                                            console.log(pieceImg);
                                        }}
                                    >
                                    </img>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <>
                        {piecePromoOpt.map((pieceImg, index) => {
                            return (
                                <div
                                    className="flex items-center justify-center rounded-[50%] bg-[#9d9d9d] cursor-pointer hover:rounded-none hover:bg-[#e05916]"
                                    style={{ width: `${props.size}px`, height: `${props.size}px` }}
                                    key={index}
                                >
                                    <img
                                        className="hover:scale-125"
                                        src={`/Images/w/${pieceImg.toUpperCase()}.png`}
                                        alt="Piece Img"
                                        style={{ width: `${0.8 * props.size}px`, height: `${0.8 * props.size}px` }}
                                        onClick={() => {
                                            handleOptionSelected(pieceImg.toUpperCase());
                                            console.log(pieceImg.toUpperCase());
                                        }}
                                    >
                                    </img>
                                </div>
                            );
                        })}
                        <div
                            className=" text-center font-bold cursor-pointer bg-[rgba(33,33,33,0.8)] text-white  hover:bg-[rgba(200,0,0,1)]"
                            style={{ width: `${props.size}px`, height: `${0.4 * props.size}px` }}
                            onClick={() => {
                                props.cancelPromo();
                            }}
                        >
                            X
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default PromotionOption;