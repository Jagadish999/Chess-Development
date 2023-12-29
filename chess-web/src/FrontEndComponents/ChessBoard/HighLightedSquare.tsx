const HighLightedSquare = (props: { size: number, file: number, rank: number, color: string }) => {

    const topPos = (8 - props.rank) * 75;
    const leftPos = (props.file - 1) * 75;

    return (
        <div className="w-[75px] h-[75px] absolute"
            style={{ top: `${(topPos)}px`, left: `${leftPos}px`, border: `2px solid black` }}
        >
            <div
                className="mt-[17.5px] ml-[17.5px] w-[20px] h-[20px] rounded-[50%]"
                style={{background: `${props.color}`}}
            ></div>
        </div>
    )
}

export default HighLightedSquare;