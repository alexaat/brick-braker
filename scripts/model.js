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






