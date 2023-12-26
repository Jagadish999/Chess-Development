import { calculateRawMove, fillChessBoardArray } from "./pieceDetails";
import { BoardStatus, CastleDetails, PieceDetails } from "./pieceTypes";

//Takes fen position and returns all the valid moves
export function findPieceMoveDetails(pieceFenPos: string, castleInfo: CastleDetails) {

    const fenPosInfo = pieceFenPos.split(" ");
    const [chessBoard, chessBoardExtended] = fillChessBoardArray(fenPosInfo[0]);

    const pieceDetail: PieceDetails[] = calculateRawMove(chessBoardExtended, fenPosInfo[3], fenPosInfo[2], fenPosInfo[1]);
    // const checkStatus = checkBoardStatus(pieceDetail, fenPosInfo[1]);
    const filteredMoves: PieceDetails[] = filterMoves(pieceDetail, fenPosInfo[1]);
    console.log(filteredMoves);

    return pieceDetail;
}

export function filterMoves(pieceMoveDetails: PieceDetails[], turnToMove: string){
    const tempPieceDetails: PieceDetails[] = [...pieceMoveDetails];

    for(let eachPieceDetail of tempPieceDetails){

        eachPieceDetail.capture.filter(value => {
            
        });
        eachPieceDetail.linearMove.filter(value => {
            console.log("askjfkjasdfn");
            return false;
        });
        eachPieceDetail.castle.filter(value => {
           
        });
        eachPieceDetail.unphasant.filter(value => {

        })

    }

    return tempPieceDetails;
}

export function checkBoardStatus(pieceMoveDetails: PieceDetails[], turnToMove: string) {

    let gameStatus: BoardStatus = {
        check: false,
        checkmate: false,
        stalemate: false
    }

    let tempMovesAvailable: boolean = false;

    //find king location
    const kingPiece = turnToMove === "w" ? pieceMoveDetails.find(pieceDetail => pieceDetail.pieceName === "K") : pieceMoveDetails.find(pieceDetail => pieceDetail.pieceName === "k");
    const kingLocation = { file: kingPiece?.file, rank: kingPiece?.rank };

    //Check if king is in check or not and if any moves is available or not
    for (const eachPieceDetail of pieceMoveDetails) {

        //Check until king has been spotted in check with opposite piece
        if (eachPieceDetail.color !== turnToMove && eachPieceDetail.pieceName !== "K" && eachPieceDetail.pieceName !== "k" && !gameStatus.check) {

            for (const eachPieceCapture of eachPieceDetail.capture) {
                if (eachPieceCapture.file === kingLocation.file && eachPieceCapture.rank === kingLocation.rank) {
                    gameStatus.check = true;
                    break;
                }
            }
        }

        //Check moves lenght if opposite color for checkmate or stalemate checking
        if (eachPieceDetail.color !== turnToMove && !tempMovesAvailable) {
            if (eachPieceDetail.linearMove.length > 0 || eachPieceDetail.capture.length > 0 || eachPieceDetail.castle.length > 0 || eachPieceDetail.unphasant.length > 0) {
                tempMovesAvailable = true;
            }
        }

        //Break the loop if check and moves available spotted
        if (gameStatus.check && tempMovesAvailable) break;
    }

    //If no moves is available to current player
    if (!tempMovesAvailable) {
        //If check and no moves it is checkmate else stalemate
        if (gameStatus.check) {
            gameStatus.checkmate = true;
        }
        else {
            gameStatus.stalemate = true;
        }
    }
    return gameStatus;
}