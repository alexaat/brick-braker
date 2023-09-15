import {playBoardWidth, playBoardHeight, blockSize, paddleWidth, paddleHeight, ballSize} from 
'./constants.js';

import {setInitialCoordinates, setRightArrow, setLeftArrow, updateGameState, setBricks} from  "./physics.js";

import { level1 } from '../levels/level1.js';

let levels = [level1];

let playBoard;
let bricks;

export const setUp = () => {   
    initPlayBoard(playBoardWidth,playBoardHeight,blockSize); 
    buildWalls();
    const [paddleX, paddleY] = initPaddle();
    const [ballX, ballY] = initBall(paddleX, paddleY); 
    initControls();
    setLevel(1);
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

const initBrick = (brick) => {
    const div = document.createElement('div');
    div.style.position='absolute';
    div.style.width = `${brick.width}px`;
    div.style.height = `${brick.height}px`;
    div.style.backgroundImage = selectBrickImage(brick);
    div.style.top = `${brick.y}px`;
    div.style.left = `${brick.x}px`;
    div.classList.add('brick');
    return div;
}

const selectBrickImage = (brick) => {
    if(brick.type === 'normal'){
        switch(brick.color){
            case 'red':
                return "url('/images/red_brick.jpg')";
            case 'yellow':
                return "url('/images/yellow_brick.jpg')";
            case 'purple':
                return "url('/images/purple_brick.jpg')";
            case 'green':
                return "url('/images/green_brick.jpg')";
            default :
                return "url('/images/grey_brick.jpg')";
        }
    }
    if(brick.type === 'block'){
        switch(brick.color){
            case 'blue':
                return "url('/images/blue_block.jpeg')";
            default :
                return "url('/images/grey_block.jpeg')";
        }
    }
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

export const setLevel = (level) => {

    const bricksAsElements = [];

    bricks = JSON.parse(JSON.stringify(levels[level-1]));
    
    bricks.forEach(brick => {
        const b = initBrick(brick);
        bricksAsElements.push(b);
        playBoard.appendChild(b);
    });

    setBricks(bricksAsElements);

    // numberOfBlocks = 0;
    // //Clear Bricks and Blocks
    // let el = document.getElementsByClassName('brick');
    // while (el.length > 0) {
    //     el[0].parentNode.removeChild(el[0]);
    // }
    // el = document.getElementsByClassName('block');
    // while (el.length > 0) {
    //     el[0].parentNode.removeChild(el[0]);
    // }
    // //Bricks
    // bricks = JSON.parse(JSON.stringify(levels[currentLevel - 1]));
    // bricks.forEach(brick => {
    //     let div = document.createElement('div');
    //     div.setAttribute('id', brick.id);
    //     div.style.position = 'absolute';
    //     div.style.width = brick.width + 'px';
    //     div.style.height = brick.height + 'px';
    //     let left = parseInt(brick.x) + parseInt(boardLeft);
    //     div.style.left = left.toString() + 'px';
    //     let top = parseInt(brick.y) + parseInt(boardTop);
    //     div.style.top = top.toString() + 'px';
    //     div.style.backgroundSize = 'cover';
    //     div.style.zIndex = 1;
    //     if (brick.type === 'normal') {
    //         if (brick.color === 'red') {
    //             div.style.backgroundImage = "url('/images/red_brick.jpg')";
    //         } else if (brick.color === 'yellow') {
    //             div.style.backgroundImage = "url('/images/yellow_brick.jpg')";
    //         } else if (brick.color === 'purple') {
    //             div.style.backgroundImage = "url('/images/purple_brick.jpg')";
    //         } else if (brick.color === 'green') {
    //             div.style.backgroundImage = "url('/images/green_brick.jpg')";
    //         }
    //         else {
    //             div.style.backgroundColor = brick.color;
    //         }
    //         div.classList.add('brick');
    //     }
    //     if (brick.type === 'block') {
    //         numberOfBlocks++;
    //         if (brick.color === 'blue') {
    //             div.style.backgroundImage = "url('/images/blue_block.jpeg')";
    //         }
    //         div.classList.add('block');
    //     }
    //     board.appendChild(div);
    // });
    // setBridgeImage();
}

export const addPlayer = () => {
}


