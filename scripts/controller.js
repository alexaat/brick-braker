
import { paddleWidth, paddleHeight, ballSize, gameStateReady, gameStatePaused, gameStateGameOver, gameStateRunning } from "./constants.js";
import { getWalls,
         playBoardHeightPx,
         playBoardWidthPx,
         getPaddle,
         getLives,
         getBall,
         setRightArrow,
         setLeftArrow,
         updatePaddle,
         updateBall,
         getBricks,
         getGameState,
         setGameState,
         getControlls,
         removeBlockFromModel,
         getScore,
         setScore
        } from "./model.js";
import {renderBlock, renderPlayBoard, renderPaddle, renderBall, renderMessage, removeBlockFromDOM, renderScore} from "./view.js";


Number.prototype.isBetween = function(left, right){
    return this > left && this < right;
};

const setUp = () => {

    renderPlayBoard(playBoardWidthPx, playBoardHeightPx);
    const walls = getWalls();
    walls.forEach(block => {
        renderBlock(block);
    });

    const lives = getLives();
    const paddlePosition = getPaddle();
    renderPaddle({left: paddlePosition.left, top: paddlePosition.top, lives, width: paddleWidth, height: paddleHeight});

    const ballPosition = getBall();
    renderBall({left: ballPosition.left, top: ballPosition.top, size: ballSize});

    initControlls();

    const bricks = getBricks();
    bricks.forEach(brick => renderBlock(brick));
}

const updateScreen = () => {

    const gameState = getGameState();
    let ballData = getBall();
    let paddleData = getPaddle();
    const controlls = getControlls();

       
    //Update Paddle  
    if(gameState === gameStateReady || gameState === gameStateRunning){       
        if(controlls.isLeft === true){
            let paddleX = paddleData.left - paddleData.speedX;
            if(paddleX < 0) {
                paddleX = 0;
            }
            updatePaddle({left: paddleX});   
        }else if (controlls.isRight === true){
            let paddleX = paddleData.left + paddleData.speedX;
            if(paddleX > playBoardWidthPx - paddleData.width){
                paddleX = playBoardWidthPx - paddleData.width;
            }
            updatePaddle({left: paddleX});   
        }
    }
    paddleData = getPaddle();
    renderPaddle({...paddleData});

    //Update Ball
    if(gameState === gameStateReady){
        const ballX = paddleData.left + paddleData.width/2;
        updateBall({left: ballX});
    } else if(gameState === gameStateRunning){
        ballData = checkCollisions({ballData, paddleData, playBoardWidthPx, playBoardHeightPx});        
        updateBall({...ballData});
    }
    ballData = getBall();
    renderBall({...ballData});
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

const checkCollisions = ({ballData, paddleData, playBoardWidthPx, playBoardHeightPx}) => {

    const ballX = ballData.left + ballData.speedX;
    const ballY = ballData.top + ballData.speedY;
    let ballSpeedX = ballData.speedX;
    let ballSpeedY = ballData.speedY;
    const paddleX = paddleData.left;
    const paddleY = paddleData.top;
    const paddleWidth = paddleData.width;
    const paddleHeight = paddleData.height;

    //Middle points of ball
    const topX = ballX+ballSize/2;
    const topY = ballY;
    const bottomX = ballX + ballSize/2;
    const bottomY = ballY + ballSize;
    const rightX = ballX + ballSize;
    const rightY = ballY+ballSize/2;
    const leftX = ballX;
    const leftY = ballY+ballSize/2;

    //Walls collisions
    //Left hit
    if(ballX< 0){
        ballSpeedX = Math.abs(ballSpeedX);
    }
    //Top hit
    if(ballY<0){
        ballSpeedY = Math.abs(ballSpeedY);       
    }
    //Right hit
    if (ballX>playBoardWidthPx-ballSize) {   
        ballSpeedX = -Math.abs(ballSpeedX);
    }
    if (ballY > playBoardHeightPx - ballSize){
        //ballIsOutHandler();
        return {...ballData, left: ballX, top: ballY, speedX: ballSpeedX, speedY: ballSpeedY, visibility: false};       
    }  

    //Paddle collisions    
    //Puddle top
    if(ballX.isBetween(paddleX, paddleX+paddleWidth) && ballY>paddleY-ballSize){
        ballSpeedY = -Math.abs(ballSpeedY);
        return {...ballData, left: ballX, top: ballY, speedX: ballSpeedX, speedY: ballSpeedY};
    }
    //Paddle Left-Top
    if(rightX.isBetween(paddleX, paddleX+paddleWidth) && rightY.isBetween(paddleY, paddleY+paddleHeight/2)){
        ballSpeedX = -Math.abs(ballSpeedX);
        ballSpeedY = -Math.abs(ballSpeedY);
        return {...ballData, left: ballX, top: ballY, speedX: ballSpeedX, speedY: ballSpeedY};
    }
    
    //Paddle Right-Top
    if(leftX.isBetween(paddleX, paddleX+paddleWidth) && leftY.isBetween(paddleY, paddleY+paddleHeight/2)){
        ballSpeedX = Math.abs(ballSpeedX);
        ballSpeedY = -Math.abs(ballSpeedY);
        return {...ballData, left: ballX, top: ballY, speedX: ballSpeedX, speedY: ballSpeedY};
    }

    //Paddle Left-Bottom
    if(rightX.isBetween(paddleX, paddleX+paddleWidth) && rightY.isBetween( paddleY+paddleHeight/2, paddleY+paddleHeight)){
        ballSpeedX = -Math.abs(ballSpeedX);
        ballSpeedY = Math.abs(ballSpeedY);
        return {...ballData, left: ballX, top: ballY, speedX: ballSpeedX, speedY: ballSpeedY};
    }

    //Paddle Right-Bottom
    if(leftX.isBetween(paddleX, paddleX+paddleWidth) && leftY.isBetween(paddleY+paddleHeight/2, paddleY+paddleHeight)){
        ballSpeedX = Math.abs(ballSpeedX)
        ballSpeedY = Math.abs(ballSpeedY)
        return {...ballData, left: ballX, top: ballY, speedX: ballSpeedX, speedY: ballSpeedY};
    }


    //Brick Collisions
    const bricks = getBricks();
    for(let i = 0; i< bricks.length; i++){
        const brick = bricks[i];

        const brickLeft = brick.left;
        const brickTop = brick.top;
        const brickRight = brickLeft + brick.width;
        const brickBottom = brickTop + brick.height;

        //Bottom hit
        if(topX.isBetween(brickLeft, brickRight) && topY.isBetween(brickTop, brickBottom) && ballSpeedY<0){
            console.log('Bottom hit');
            ballSpeedY = Math.abs(ballSpeedY);
           // handleBrickCollisionEffect(brick);
            removeBlockFromModel(brick.id);
            removeBlockFromDOM(brick.id);
            const score = getScore() + 1;
            setScore(score);
            renderScore(score);
            if(bricks.length === 1){
                //Level Complete
            }
            return {...ballData, left: ballX, top: ballY, speedX: ballSpeedX, speedY: ballSpeedY};         
        }

    }


   
    
    /*

    //Brick collisions
    for(let i = 0; i<bricksAsElements.length; i++){
        console.log(bricksAsElements.length);
        const brick = bricksAsElements[i];
        const brickLeft = brick.offsetLeft;
        const brickTop = brick.offsetTop;
        const brickRight = brickLeft + brick.offsetWidth;
        const brickBottom = brickTop + brick.offsetHeight;
       
        //Bottom hit
        if(topX.isBetween(brickLeft, brickRight) && topY.isBetween(brickTop, brickBottom) && speedY<0){
            console.log('Bottom hit');
            ballX -=speedX;
            ballY -=speedY;
            //speedY = -speedY;
            speedY = Math.abs(speedY);
            handleBrickCollisionEffect(brick);
            //return;
        }

        //Top hit
        if(bottomX.isBetween(brickLeft, brickRight) && bottomY.isBetween(brickTop, brickBottom) && speedY > 0){
            console.log('Top hit');
            ballX -=speedX;
            ballY -=speedY;
            //speedY = -speedY;
            speedY = -Math.abs(speedY);
            handleBrickCollisionEffect(brick);
            //return;
        }

        //Left hit
        if(rightX.isBetween(brickLeft, brickRight) && rightY.isBetween(brickTop, brickBottom) && speedX > 0){
            console.log('Left hit');
            ballX -=speedX;
            ballY -=speedY;
            //speedX = -speedX;
            speedX = -Math.abs(speedX);
            handleBrickCollisionEffect(brick);
            //return;
        }

        //Right hit
        if(leftX.isBetween(brickLeft, brickRight) && leftY.isBetween(brickTop, brickBottom) && speedX < 0){
            console.log('Right hit');
            ballX -=speedX;
            ballY -=speedY;
            //speedX = -speedX;
            speedX = Math.abs(speedX);
            handleBrickCollisionEffect(brick);
            //return;
        }

    }
    */

    return {...ballData, left: ballX, top: ballY, speedX: ballSpeedX, speedY: ballSpeedY};

}

startGame();


