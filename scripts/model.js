import {playBoardHeight, playBoardWidth, blockSize, paddleWidth, paddleHeight, ballSize, paddleSpeedX, gameStateReady, gameStateRunning, defaultSpeedX, defaultSpeedY} from './constants.js'
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
let ballVisibility = true;

let isLeftDown = false;
let isRightDown = false;

let gameState = gameStateReady;

let ballSpeedX = defaultSpeedX;
let ballSpeedY = defaultSpeedY;

let score = 0;


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

export const getPaddle = () => {
    return {left: paddleX, top: paddleY, width: paddleWidth, height: paddleHeight, speedX: paddleSpeedX}
}

export const getLives = () => {
    return lives;
}

export const getBall = () => {
    return {left: ballX, top: ballY, visibility: ballVisibility, speedX: ballSpeedX, speedY: ballSpeedY}
} 

export const setRightArrow = (val) => {
    isRightDown = val;
};

export const setLeftArrow = (val) => {
    isLeftDown = val;
};

export const updatePaddle = ({left, top}) => {
    if(left !== undefined){
        paddleX = left;
    }
    if(top !== undefined){
        paddleY = top;
    }
    
    // if(gameState === gameStateReady || gameState === gameStateRunning){
    //     if(isLeftDown === true){
    //         if(paddleX-paddleSpeed < 0) {
    //             paddleX = 0;
    //         }else{
    //             paddleX -= paddleSpeed;
    //         }       
    //     }else if (isRightDown === true){
    //         if(paddleX + paddleSpeed > playBoardWidthPx - paddleWidth){
    //             paddleX = playBoardWidthPx - paddleWidth;
    //         }else{
    //             paddleX += paddleSpeed;
    //         }        
    //     }
    // }
}

export const updateBall = ({left, top, visibility, speedX, speedY}) => {
    if(left !== undefined){
        ballX = left;
    }
    if(top != undefined ){
        ballY = top;
    }
    if(visibility != undefined){
        ballVisibility = visibility;
    }
    if(speedX !== undefined){
        ballSpeedX = speedX;
    }
    if(speedY !== undefined){
        ballSpeedY = speedY;
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

export const getControlls = () => {
    return {isLeft: isLeftDown, isRight: isRightDown};
}

export const getScore = () => {
    return score;
}

export const setScore = (val) => {
    score = val;
}

export const removeBlockFromModel = (id) => {
    
}

