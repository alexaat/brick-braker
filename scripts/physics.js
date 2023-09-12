import { defaultSpeedX, defaultSpeedY } from "./constants.js";

let speedX = defaultSpeedX;
let speedY = defaultSpeedY;
const ball = document.querySelector('#ball');
const playBoard = document.querySelector('#board');
const rect = playBoard.getBoundingClientRect();

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

    return [toX, toY];
}