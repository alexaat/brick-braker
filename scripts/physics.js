import { ballSize, defaultSpeedX, defaultSpeedY, paddleWidth, paddleSpeed } from "./constants.js";
import {playBoardWidth, playBoardHeight, blockSize} from './constants.js';

const playBoardWidthPx = playBoardWidth*blockSize;
const playBoardHeightPx = playBoardHeight*blockSize;

let speedX = defaultSpeedX;
let speedY = defaultSpeedY;
const ball = document.querySelector('#ball');
const playBoard = document.querySelector('#board');
const paddle = document.querySelector('#paddle');

let isLeftDown = false;
let isRightDown = false;

let ballX;
let ballY;
let paddleX;
let paddleY;




Number.prototype.isBetween = function(left, right){
    return this > left && this < right;
};

export const updateScreen = () => {
    if(isLeftDown){
        if(paddleX+paddleSpeed > 0){
            paddleX -= paddleSpeed;
            paddle.style.left = `${paddleX}px`;
        }else{
            paddle.style.left = `0px`;
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

    [ballX, ballY] = checkCollisions(ballX, ballY, ballX+speedX, ballY+speedY)
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

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

const checkCollisions = (fromX, fromY, toX, toY) => {



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

    return [toX, toY];
}

