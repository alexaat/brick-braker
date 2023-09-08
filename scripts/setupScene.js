import {playBoardWidth, playBoardHeight, blockSize, paddleWidth, paddleHeight, ballSize} from 
'./constants.js';

let playBoard;



export const setUp = () => {    
    initPlayBoard(playBoardWidth,playBoardHeight,blockSize); 
    buildWalls();
    initPaddle();
    initBall();   
}

const initPlayBoard = (w, h, brickSize) => {
    playBoard = document.querySelector('#board');
    const width = w*brickSize;
    const height = h*brickSize;
    playBoard = document.querySelector('#board');
    playBoard.style.width = `${width}px`;
    playBoard.style.height = `${height}px`;
}

const buildWalls = () => {

    let style = window.getComputedStyle(board);
    const boardRight = parseInt(style.width.replace('px', ''));
    
    for (let i = 0; i < playBoardHeight; i++) {        
        const div = createBlock();
        div.style.left = `${-blockSize}px`;
        div.style.top = `${i * blockSize}px`;
        playBoard.appendChild(div);
    }
    for (let i = -1; i <= playBoardWidth; i++) {
        const div = createBlock();
        div.style.left = `${i * blockSize}px`;
        div.style.top = `${-blockSize}px`;
        playBoard.appendChild(div);
    }
    for (let i = 0; i < playBoardHeight; i++) {
        const div = createBlock();
        div.style.left = `${boardRight}px`;
        div.style.top = `${i * blockSize}px`;
        playBoard.appendChild(div);
    }
}

const createBlock = () => {
    let div = document.createElement('div');
    div.classList.add('wall-block');
    div.style.width = `${blockSize}px`;
    div.style.height = `${blockSize}px`;
    return div;
}

const initPaddle = () => {
    const paddle = document.querySelector('#paddle');
    paddle.style.width = `${paddleWidth}px`;
    paddle.style.height = `${paddleHeight}px`;
 
    const boardHeightPx = parseInt(board.style.height.replace('px', ''));
    const boardWidthPx =  parseInt(board.style.width.replace('px', ''));

    const paddleX = (boardWidthPx - paddleWidth)/2;
    const paddleY = boardHeightPx;

    paddle.style.left = `${paddleX}px`;
    paddle.style.top = `${paddleY - paddleHeight}px`;
}

const initBall = () => {
    const ball = document.querySelector('#ball');
    ball.style.width = `${ballSize}px`;
    ball.style.height = `${ballSize}px`;
    ball.style.top = '350px';
    ball.style.left = "90px";
}

export const addPlayer = () => {
    alert('player added...');
}


