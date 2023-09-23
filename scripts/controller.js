
import { paddleWidth, paddleHeight, ballSize, gameStateReady, gameStatePaused, gameStateGameOver, gameStateRunning } from "./constants.js";
import { getWalls,
         playBoardHeightPx,
         playBoardWidthPx,
         getPaddlePosition,
         getLives,
         getBallPosition,
         setRightArrow,
         setLeftArrow,
         updatePuddlePosition,
         updateBallPosition,
         getBricks,
         getGameState,
         setGameState
        } from "./model.js";
import {renderBlock, renderPlayBoard, renderPaddle, renderBall, renderMessage} from "./view.js";

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

    initControlls();

    const bricks = getBricks();
    bricks.forEach(brick => renderBlock(brick));
}

const updateScreen = () => {
    updatePuddlePosition();
    const paddlePosition = getPaddlePosition();
    renderPaddle({left: paddlePosition.left});

    updateBallPosition();
    const ballPosition = getBallPosition();
    renderBall({left: ballPosition.left, top: ballPosition.top});
}

const startGame = () => {
    setUp();   
    requestAnimationFrame(run);
}

const run = () => {
    updateScreen();
    requestAnimationFrame(run);
}

const initControlls = () => {
    document.addEventListener("keydown", e => {
        if (e.isComposing || e.keyCode === 229) {
            return;
        }
        if (e.key === 'ArrowRight') {
            setRightArrow(true);            
        }
        if (e.key === 'ArrowLeft') {
            setLeftArrow(true);           
        }

        if(e.key === ' '){
            handleKeyPress(' ');            
        }
        if(e.key === 'Escape'){
            handleKeyPress('Escape');   
        }
    });
    
    document.addEventListener("keyup", (e) => {
        if (e.isComposing || e.keyCode === 229) {
            return;
        }
        if (e.key === 'ArrowRight') {
            setRightArrow(false);          
        }
        if (e.key === 'ArrowLeft') {
            setLeftArrow(false);            
        }
    });

}

export const handleKeyPress = (key) => {
    if(key === ' '){
        
        const gameState = getGameState();

        if(gameState === gameStateReady || gameState === gameStatePaused){
            setGameState(gameStateRunning);
            renderMessage('');
            return;
        }
        if(gameState === gameStateRunning){
            setGameState(gameStatePaused);
            renderMessage('Paused');
            return;
        }
        if(gameState === gameStateGameOver){
            //resetGame();
            setGameState(gameStateReady);
            renderMessage('Game over. Press SPACE to play again.');
            return;
        }
        
    }
    if(key === 'Escape'){

    }
}

startGame();


