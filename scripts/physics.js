import { ballSize, defaultSpeedX, defaultSpeedY, paddleWidth, paddleSpeed, gameStateReady, gameStatePaused, gameStateRunning } from "./constants.js";
import {playBoardWidth, playBoardHeight, blockSize} from './constants.js';

let gameState = gameStateReady;

const playBoardWidthPx = playBoardWidth*blockSize;
const playBoardHeightPx = playBoardHeight*blockSize;

let speedX = defaultSpeedX;
let speedY = defaultSpeedY;
const ball = document.querySelector('#ball');
const playBoard = document.querySelector('#board');
const paddle = document.querySelector('#paddle');
const message = document.querySelector('#message');

let isLeftDown = false;
let isRightDown = false;

let ballX;
let ballY;
let paddleX;
let paddleY;

let bricksAsElements;

Number.prototype.isBetween = function(left, right){
    return this > left && this < right;
};

export const updateScreen = () => {

    if(gameState === gameStateReady){
        handlePaddleMovement();
        ballX = paddleX + paddleWidth/2;       
        updateBallPosition();
    }

    if(gameState === gameStateRunning){        
        handlePaddleMovement();    
        //[ballX, ballY] = checkCollisions(ballX, ballY, ballX+speedX, ballY+speedY)
        checkCollisions();
        updateBallPosition();
    }
}

export const setInitialCoordinates = (_ballX, _ballY, _paddleX, _paddleY) => {
    ballX = _ballX;
    ballY = _ballY;
    paddleX = _paddleX;
    paddleY = _paddleY;   
}

export const setRightArrow = (val) => {
    isRightDown = val;
};

export const setLeftArrow = (val) => {
    isLeftDown = val;
};

export const setBricks = (val) => {
    console.log(val)
    bricksAsElements = val;
}

export const updateGameState = () => {
    if(gameState === gameStateReady || gameState === gameStatePaused){
        message.textContent = '';
        gameState = gameStateRunning;
        return;
    }
    if(gameState === gameStateRunning){
        message.textContent = 'Paused';
        gameState = gameStatePaused;
        return;
    }
}

const checkCollisions = () => {
    //ball model
    ballX+=speedX;
    ballY+=speedY;

    //Walls collisions
    if(ballX< 0){
        ballX -=speedX;
        ballY -=speedY;
        speedX = -speedX;
        return;
    }
    if(ballY<0){
        ballX -=speedX;
        ballY -=speedY;
        speedY = -speedY;
        return;
    }
    if (ballX>playBoardWidth*blockSize-ballSize) {   
        ballX -=speedX;
        ballY -=speedY;
        speedX = -speedX;
        return;
    }
    if (ballY >  playBoardHeight*blockSize - ballSize){
        ballX -=speedX;
        ballY -=speedY;
        speedY = -speedY;
        return;
    }

    //Paddle collisions
    if(ballX.isBetween(paddleX, paddleX+paddleWidth) && ballY>paddleY-ballSize){
        ballX -=speedX;
        ballY -=speedY;
        speedY = -speedY;
        return;
    }

    //Brick collisions
    for(let i = 0; i<bricksAsElements.length; i++){
        const brick = bricksAsElements[i];
      

   
        const topX = ballX+ballSize/2;
        const topY = ballY;
        const bottomX = ballX + ballSize/2;
        const bottmY = ballY + ballSize;
        const brickLeft = brick.offsetLeft;
        const brickTop = brick.offsetTop;
        const brickRight = brickLeft + brick.offsetWidth;
        const brickBottom = brickTop + brick.offsetHeight;
       
        //Bottom hit
        if(topX.isBetween(brickLeft, brickRight) && topY.isBetween(brickTop, brickBottom)){
            ballX -=speedX;
            ballY -=speedY;
            speedY = -speedY;
            return;
        }

        //Top hit
        if(bottomX.isBetween(brickLeft, brickRight) && bottmY.isBetween(brickTop, brickBottom)){
            ballX -=speedX;
            ballY -=speedY;
            speedY = -speedY;
            return;
        }

    }





}

/*
const checkCollisions = (fromX, fromY, toX, toY) => {

    //Middle points
    const [l, t, r, b] = calculateMiddlePoints(toX, toY);


    //Walls collisions
    if (toX<0) {         
        speedX = -speedX;
        toX=fromX;
        toY=fromY;
        return [toX, toY];
    }
    if(toY<0){
        speedY = -speedY;
        toX=fromX;
        toY=fromY;
        return [toX, toY];
    }
    if (toX>playBoardWidth*blockSize-ballSize) {         
        speedX = -speedX;
        toX=fromX;
        toY=fromY;
        return [toX, toY];
    }
    if (toY >  playBoardHeight*blockSize - ballSize){
        speedY = -speedY;
        toX=fromX;
        toY=fromY;
        return [toX, toY];
    }

    //Paddle Collisions
    if(toX.isBetween(paddleX, paddleX+paddleWidth) && toY>paddleY-ballSize){
        toX=fromX;
        toY=fromY;
        speedY = -speedY;
        return [toX, toY];
    }


    //Brick collision
    
    ball.style.left = `${toX}px`;
    ball.style.top = `${toY}px`;
    for(let i = 0; i<bricksAsElements.length; i++){
         const collision = isCollision(ball, bricksAsElements[i]);        
         if (collision){
            console.log(collision);
            toX=fromX;
            toY=fromY;
            ball.style.left = `${fromX}px`;
            ball.style.top = `${fromY}px`;
            handleCollision(collision);
            break;
         }
     }

    return [toX, toY];
}
*/

const handleCollision = (collision) => {
    console.log(collision)
    switch(collision){
        case 'bottom' :
            speedY = -speedY;
            break;
            case 'left' :
                speedX = -speedX;
            break;
            case 'top' :
                speedY = -speedY;
            break;
            case 'right' :
                speedX = -speedX;
            break;
            case 'bottomLeft' :
                speedY = -speedY;
            break;
            case 'topLeft':
                speedX = -speedX;
                break;


            
    }
}

const isCollision = (ball, obj) => {
    let rectBall = ball.getBoundingClientRect();
    let rectObj = obj.getBoundingClientRect();
    let b_left = rectBall.left;
    let b_right = rectBall.right;
    let b_top = rectBall.top;
    let b_bottom = rectBall.bottom;
    let o_left = rectObj.left;
    let o_right = rectObj.right;
    let o_top = rectObj.top;
    let o_bottom = rectObj.bottom;
    //Bottom
    if(b_top < o_bottom && b_top > o_top && b_left > o_left && b_left < o_right){
        return 'bottom';
    }
    //Top
    if(b_bottom > o_top && b_bottom <o_bottom && b_left > o_left && b_left < o_right){
        return 'top';
    }
    //Left
    if(b_right>o_right && b_right < o_left && b_top > o_top && b_bottom<o_bottom){
        return 'left';
    }
    //Right
    if(b_top>o_top && b_bottom<o_bottom && b_left<o_right && b_left>o_left){
        return 'right'
    }
    //topLeft
    if(b_bottom>o_top && b_top < o_top && b_right>o_left && b_left < o_left){
        return 'topLeft'
    }
    //topRight
    if(b_left < o_right && b_right>o_right && b_bottom>o_top && b_top < o_top){
        return 'topRight'
    }
    //bottomLeft
    if(b_top<o_bottom && b_bottom > o_bottom && b_right>o_left && b_left < o_left){
        return 'bottomLeft'
    }
    //bottomRight
    if(b_top < o_bottom && b_bottom> o_bottom && b_left < o_right && b_right > o_right){
        return 'bottomRight'
    }
    return '';
}

const calculateMiddlePoints = (toX, toY) => {
    return [{x: toX, y: toY + ballSize/2}, {x: toX + ballSize/2, y: toY},{x: toX + ballSize, y: toY+ballSize/2},{x: toX + ballSize/2, y: toY + ballSize}];
}

const handlePaddleMovement = () => {
            
    if(isLeftDown){
        if(paddleX+paddleSpeed > 0){
            paddleX -= paddleSpeed;
            paddle.style.left = `${paddleX}px`;
        }else{
            paddle.style.left = 0;
        }
    }
    if(isRightDown){
        if(paddleX+paddleSpeed < playBoardWidthPx - paddleWidth){
            paddleX += paddleSpeed;
            paddle.style.left = `${paddleX}px`;
        }else{ 
            paddle.style.left = `${playBoardWidthPx - paddleWidth}px`;
        }
    }  
}

const updateBallPosition = () => {
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

