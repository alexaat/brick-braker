import { ballSize, defaultSpeedX, defaultSpeedY } from "./constants.js";
import {playBoardWidth, playBoardHeight, blockSize} from './constants.js';


let speedX = defaultSpeedX;
let speedY = defaultSpeedY;
const ball = document.querySelector('#ball');
const playBoard = document.querySelector('#board');

let ballX;
let ballY;


export const updateBallPosition = () => { 

    [ballX, ballY] = checkCollisions(ballX, ballY, ballX+speedX, ballY+speedY)
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

}

export const setInitialCoordinates = (_ballX, _ballY) => {
    ballX = _ballX;
    ballY = _ballY;
}


const checkCollisions = (fromX, fromY, toX, toY) => {

    if (toX<0) {         
        speedX = -speedX;
        toX=fromX;
        toY=fromY;
    }

    if(toY<0){
        speedY = -speedY;
        toX=fromX;
        toY=fromY;
    }

    if (toX>playBoardWidth*blockSize-ballSize) {         
        speedX = -speedX;
        toX=fromX;
        toY=fromY;
    }
    if (toY >  playBoardHeight*blockSize - ballSize){
        speedY = -speedY;
        toX=fromX;
        toY=fromY;
    }
    return [toX, toY];
}