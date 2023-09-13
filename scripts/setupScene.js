import {playBoardWidth, playBoardHeight, blockSize, paddleWidth, paddleHeight, ballSize} from 
'./constants.js';

import {setInitialCoordinates, setRightArrow, setLeftArrow, updateGameState} from  "./physics.js";

let playBoard;



export const setUp = () => {   
    initPlayBoard(playBoardWidth,playBoardHeight,blockSize); 
    buildWalls();
    const [paddleX, paddleY] = initPaddle();
    const [ballX, ballY] = initBall(paddleX, paddleY); 
    initControls();
    initBrick();  
    setInitialCoordinates(ballX, ballY, paddleX, paddleY);
}

const initPlayBoard = (w, h, brickSize) => {
    playBoard = document.querySelector('#board');
    const width = w*brickSize;
    const height = h*brickSize;
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
    const paddleY = boardHeightPx - paddleHeight;

    paddle.style.left = `${paddleX}px`;
    paddle.style.top = `${paddleY}px`;

    return [paddleX, paddleY];
}

const initBall = (paddleX, paddleY) => {
    const ball = document.querySelector('#ball');
    ball.style.width = `${ballSize}px`;
    ball.style.height = `${ballSize}px`;
    const ballX = paddleX + paddleWidth/2;
    const ballY = paddleY-ballSize;
    ball.style.top = `${ballY}px`;
    ball.style.left = `${ballX}px`;
    return [ballX, ballY];

}

const initBrick = () => {
    playBoard = document.querySelector('#board');
    const brick = document.createElement('div');
    brick.style.width = `60px`;
    brick.style.height = `40px`;
    brick.style.background = '#cccccc';
    brick.style.top = `0px`;
    brick.style.left = `0px`;
    playBoard.appendChild(brick);
}

const initControls = () => {
    document.addEventListener("keydown", e => {
        if (e.isComposing || e.keyCode === 229) {
            return;
        }
        if (e.key === 'ArrowRight') {
            setRightArrow(true);            
        }
        if (e.key === 'ArrowLeft') {
            setLeftArrow(true);           
        }

        if(e.key === ' '){
            updateGameState();
        }
    });
    
    document.addEventListener("keyup", (e) => {
        if (e.isComposing || e.keyCode === 229) {
            return;
        }
        if (e.key === 'ArrowRight') {
            setRightArrow(false);          
        }
        if (e.key === 'ArrowLeft') {
            setLeftArrow(false);            
        }
    });

}



export const addPlayer = () => {
}


