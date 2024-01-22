import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

export default function PreviousMoves(props: { previousMoveDetails: string[][], currentMove: number, backAndForth: Function }) {

    const currentMoveBg = "#779954";
    const prevMoveBg = "#9d9d9d";

    const handleButtonClicked = (value: string) => {
        
        props.backAndForth(value)
    }

    return (
        <div className="w-[90%] h-[100%] max-h-[550px] bg-[rgba(38,36,33,0.8)] flex flex-col">

            <div className="w-[100%] h-[10%] bg-[rgba(33,33,33,1)]"></div>

            <div className="w-[100%] h-[80%] overflow-auto">

                <ul>
                    {
                        props.previousMoveDetails.map((movesPlayer, index) => {
                            return (
                                <li
                                    key={index}
                                    className='m-2 flex flex-row text-[42px] justify-evenly'
                                    style={{ backgroundColor: props.currentMove === index ? currentMoveBg : prevMoveBg }}
                                >
                                    <p className='w-[15%]'>{index + 1}.</p>
                                    <p className='w-[32.5%]'>{movesPlayer[0]}</p>
                                    <p className='w-[32.5%]'>{movesPlayer[1]}</p>
                                </li>
                            )
                        })
                    }
                </ul>

            </div>

            <div className="w-[100%] h-[10%] bg-[rgba(33,33,33,1)] flex flex-row justify-evenly">

                <button
                    className='w-[25%] text-xs hover:bg-green-600 text-white'
                    onClick={() => {
                        handleButtonClicked('p');
                    }}
                >
                    <KeyboardDoubleArrowLeftIcon style={{ fontSize: "4rem" }} />
                </button>

                <button
                    className='w-[25%] hover:bg-green-600 text-white'
                    onClick={() => { handleButtonClicked('p-1') }}
                >
                    <ArrowBackIosIcon style={{ fontSize: "2.8rem" }} />
                </button>

                <button
                    className='w-[25%] hover:bg-green-600 text-white'
                    onClick={() => { handleButtonClicked('n-1') }}
                >
                    <ArrowForwardIosIcon style={{ fontSize: "2.8rem" }} />
                </button>

                <button
                    className='w-[25%] hover:bg-green-600 text-white'
                    onClick={() => { handleButtonClicked('n') }}
                >
                    <KeyboardDoubleArrowRightIcon style={{ fontSize: "4rem" }} />
                </button>
            </div>

        </div>
    )
}