import {playBoardHeight, playBoardWidth, blockSize, paddleWidth, paddleHeight, ballSize, paddleSpeed, gameStateReady, gameStateRunning, defaultSpeedX, defaultSpeedY} from './constants.js'
import { level1 } from '../levels/level1.js';

const levels = [level1];

const boardRight = playBoardWidth*blockSize;

export const playBoardWidthPx = playBoardWidth*blockSize;
export const playBoardHeightPx = playBoardHeight*blockSize;

let level = 1;
let lives = 3;
let paddleX = (playBoardWidthPx - paddleWidth)/2;
let paddleY = playBoardHeightPx - paddleHeight;

let ballX = playBoardWidthPx/2;
let ballY = paddleY - ballSize ;

let isLeftDown = false;
let isRightDown = false;

let gameState = gameStateReady;

let ballSpeedX = defaultSpeedX;
let ballSpeedY = defaultSpeedY;

Number.prototype.isBetween = function(left, right){
    return this > left && this < right;
};

export const getWalls = () => {
    const walls = [];
    for (let i = 0; i < playBoardHeight; i++) {       
        walls.push({left: -blockSize, top: i * blockSize, width: blockSize, height: blockSize, type: 'red_block'});

    }
    for (let i = -1; i <= playBoardWidth; i++) {
        walls.push({left: i*blockSize, top: -blockSize, width: blockSize, height: blockSize, type: 'red_block'});
    }
    for (let i = 0; i < playBoardHeight; i++) {
        walls.push({left: boardRight, top: i * blockSize, width: blockSize, height: blockSize, type: 'red_block'});
    }
    return walls;
}

export const getPaddlePosition = () => {
    return {left: paddleX, top: paddleY}
}

export const getLives = () => {
    return lives;
}

export const getBallPosition = () => {
    return {left: ballX, top: ballY}
} 

export const setRightArrow = (val) => {
    isRightDown = val;
};

export const setLeftArrow = (val) => {
    isLeftDown = val;
};

export const updatePuddlePosition = () => {
    
    if(gameState === gameStateReady || gameState === gameStateRunning){
        if(isLeftDown === true){
            if(paddleX-paddleSpeed < 0) {
                paddleX = 0;
            }else{
                paddleX -= paddleSpeed;
            }       
        }else if (isRightDown === true){
            if(paddleX + paddleSpeed > playBoardWidthPx - paddleWidth){
                paddleX = playBoardWidthPx - paddleWidth;
            }else{
                paddleX += paddleSpeed;
            }        
        }
    }
}

export const updateBallPosition = () => {
    switch (gameState){
        case gameStateReady:
            ballX = paddleX + paddleWidth/2;
        break;
        case gameStateRunning:
            ballX += ballSpeedX;
            ballY += ballSpeedY;
            checkCollisions();
            
        break;
    }
}

export const getBricks = () => {
    return levels[level - 1];
}

export const getGameState = () => {
    return gameState;
}

export const setGameState = (state) => {
    gameState = state;
}

const checkCollisions = () => {
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
    if (ballX>playBoardWidth*blockSize-ballSize) {   
        ballSpeedX = -Math.abs(ballSpeedX);
    }
    if (ballY > playBoardHeight*blockSize - ballSize){
        //ballIsOutHandler();
        return;        
    }

    //Paddle collisions    
    //Puddle top
    if(ballX.isBetween(paddleX, paddleX+paddleWidth) && ballY>paddleY-ballSize){
        ballSpeedY = -Math.abs(ballSpeedY);
        return;
    }
    //Paddle Left-Top
    if(rightX.isBetween(paddleX, paddleX+paddleWidth) && rightY.isBetween(paddleY, paddleY+paddleHeight/2)){
        ballSpeedX = -Math.abs(ballSpeedX);
        ballSpeedY = -Math.abs(ballSpeedY);
        return;
    }
    
    //Paddle Right-Top
    if(leftX.isBetween(paddleX, paddleX+paddleWidth) && leftY.isBetween(paddleY, paddleY+paddleHeight/2)){
        ballSpeedX = Math.abs(ballSpeedX);
        ballSpeedY = -Math.abs(ballSpeedY);
        return;
    }

    //Paddle Left-Bottom
    if(rightX.isBetween(paddleX, paddleX+paddleWidth) && rightY.isBetween( paddleY+paddleHeight/2, paddleY+paddleHeight)){
        ballSpeedX = -Math.abs(ballSpeedX);
        ballSpeedY = Math.abs(ballSpeedY);
        return;
    }

    //Paddle Right-Bottom
    if(leftX.isBetween(paddleX, paddleX+paddleWidth) && leftY.isBetween(paddleY+paddleHeight/2, paddleY+paddleHeight)){
        ballSpeedX = Math.abs(ballSpeedX)
        ballSpeedY = Math.abs(ballSpeedY)
        return;
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

}