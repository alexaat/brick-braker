import {playBoardWidth, playBoardHeight, blockSize, paddleWidth, paddleHeight} from './constants.js';

let board;
let boardRight;
let boardLeft;
let boardTop;
let boardBottom;


export const setUp = () => {    
    initPlayBoard(playBoardWidth,playBoardHeight,blockSize); 
    buildWalls();
    initPaddle();   
}

const initPlayBoard = (w, h, brickSize) => {

    board = document.querySelector('#board');
    boardLeft = 0;
    boardTop = 0;


    const width = w*brickSize;
    const height = h*brickSize;
    board = document.querySelector('#board');
    board.style.width = `${width}px`;
    board.style.height = `${height}px`;

    let style = window.getComputedStyle(board);
    boardRight = parseInt(style.width.replace('px', ''));
    boardBottom = parseInt(style.height.replace('px', ''));
}

const buildWalls = () => {
    for (let i = 0; i < playBoardHeight; i++) {        
        const div = createBrick();
        div.style.left = `${boardLeft - blockSize}px`;
        div.style.top = `${boardTop + i * blockSize}px`;
        board.appendChild(div);
    }
    for (let i = -1; i <= playBoardWidth; i++) {
        const div = createBrick();
        div.style.left = `${boardLeft + i * blockSize}px`;
        div.style.top = `${boardTop - blockSize}px`;
        board.appendChild(div);
    }
    for (let i = 0; i < playBoardHeight; i++) {
        const div = createBrick();
        div.style.left = `${boardLeft + boardRight}px`;
        div.style.top = `${boardTop + i * blockSize}px`;
        board.appendChild(div);
    }
}

const createBrick = () => {
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
    const paddleY = boardHeightPx-paddleHeight;

    paddle.style.left = `${paddleX}px`;
    paddle.style.top = `${paddleY}px`;
}

export const addPlayer = () => {
    alert('player added...');
}
