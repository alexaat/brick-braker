import { ballSize, defaultSpeedX, defaultSpeedY, paddleWidth } from "./constants.js";
import {playBoardWidth, playBoardHeight, blockSize} from './constants.js';


let speedX = defaultSpeedX;
let speedY = defaultSpeedY;
const ball = document.querySelector('#ball');
const playBoard = document.querySelector('#board');

let ballX;
let ballY;
let paddleX;
let paddleY;

Number.prototype.isBetween = function(left, right){
    return this > left && this < right;
};

export const updateBallPosition = () => {

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

