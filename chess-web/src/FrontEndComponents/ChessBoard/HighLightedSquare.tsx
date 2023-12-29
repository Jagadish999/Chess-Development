const HighLightedSquare = (props: { size: number, file: number, rank: number, color: string }) => {

    const topPos = (8 - props.rank) * 75;
    const leftPos = (props.file - 1) * 75;

    const dotSize = 0.3 * props.size;

    const margin = props.size/2 - dotSize/2;
    

    return (
        <div className="w-[75px] h-[75px] absolute"
            style={{ top: `${(topPos)}px`, left: `${leftPos}px` }}
        >
            <div
                className="w-[20px] h-[20px] rounded-[50%]"
                style={{background: `${props.color}`, height: `${dotSize}px`, width: `${dotSize}px`, marginTop: `${margin}px`, marginLeft: `${margin}px`}}
            ></div>
        </div>
    )
}

export default HighLightedSquare;