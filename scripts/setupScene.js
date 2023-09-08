let board;
let boardRight;
let boardLeft;
let boardTop;
let boardBottom;
const blockSize = 25;


export const setUp = () => {    
    initPlayBoard();    
    buildWalls(20, 13);
}

const initPlayBoard = () => {
    board = document.querySelector('#board');
    boardLeft = 0;
    boardTop = 0;
    let style = window.getComputedStyle(board);
    boardRight = parseInt(style.width.replace('px', ''));
    boardBottom = parseInt(style.height.replace('px', ''));
}

const buildWalls = (height, width) => {
    for (let i = 0; i < height; i++) {
        let div = document.createElement('div');
        div.classList.add('wall-block')
        div.style.left = `${boardLeft - blockSize}px`;
        div.style.top = `${boardTop + i * blockSize}px`;
        board.appendChild(div);
    }
    for (let i = -1; i < width; i++) {
        let div = document.createElement('div');
        div.classList.add('wall-block')
        div.style.left = `${boardLeft + i * blockSize}px`;
        div.style.top = `${boardTop - blockSize}px`;
        board.appendChild(div);
    }
    for (let i = 0; i < height; i++) {
        let div = document.createElement('div');
        div.classList.add('wall-block')
        div.style.left = `${boardLeft + boardRight}px`;
        div.style.top = `${boardTop + i * blockSize}px`;
        board.appendChild(div);
    }
}

export const addPlayer = () => {
    alert('player added...');
}

