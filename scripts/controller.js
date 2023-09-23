
import { paddleWidth, paddleHeight, ballSize } from "./constants.js";
import { getWalls, playBoardHeightPx, playBoardWidthPx, getPaddlePosition, getLives, getBallPosition} from "./model.js";
import {renderBlock, renderPlayBoard, renderPaddle, renderBall} from "./view.js";


const setUp = () => {

    renderPlayBoard(playBoardWidthPx, playBoardHeightPx);
    const walls = getWalls();
    walls.forEach(block => {
        renderBlock(block);
    });

    const lives = getLives();
    const paddlePosition = getPaddlePosition();
    renderPaddle({left: paddlePosition.left, top: paddlePosition.top, lives, width: paddleWidth, height: paddleHeight});

    const ballPosition = getBallPosition();
    renderBall({left: ballPosition.left, top: ballPosition.top, size: ballSize});
}

const updateScreen = () => {

}

const startGame = () => {
    setUp();   
    requestAnimationFrame(run);
}

const run = () => {
    //updateScreen();
    requestAnimationFrame(run);
}
startGame();


