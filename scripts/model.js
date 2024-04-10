import {
    playBoardHeight,
    playBoardWidth,
    blockSize,
    paddleWidth,
    paddleHeight,
    ballSize,
    paddleSpeedX,
    gameStateReady,
    defaultSpeedX,
    defaultSpeedY,
    paddleImagesSource
} from './constants.js';

import { level1 } from '../levels/level1.js';
import { level2 } from '../levels/level2.js';
import { level3 } from '../levels/level3.js';

let levels = [level1, level2, level3];

const maxScores = levels.map(level => {
    return level.reduce((sum, brick) => {
        const hits = brick.hits === undefined ? 0 : brick.hits
        return sum + hits;
    },
        0);
});

export const numberOfLevels = levels.length;

const boardRight = playBoardWidth * blockSize;

export const playBoardWidthPx = playBoardWidth * blockSize;
export const playBoardHeightPx = playBoardHeight * blockSize;

let level = 1;
let lives = 3;
let paddleX = (playBoardWidthPx - paddleWidth) / 2;
let paddleY = playBoardHeightPx - paddleHeight;
let paddleSrc = paddleImagesSource[lives - 1];

let ballX = playBoardWidthPx / 2;
let ballY = paddleY - ballSize;
let ballVisibility = true;

let isLeftDown = false;
let isRightDown = false;

let gameState = gameStateReady;

let ballSpeedX = defaultSpeedX;
let ballSpeedY = defaultSpeedY;

let score = 0;
let messageTitle = '';
let messageBody = '';

let movingDirection = '';

let prevPaddleLeft = 0;

let elapsedSeconds = 0;

let page = 1;

let isLastPage = false;

let dataLoading = false;

export const getDataLoading = () => {
    return dataLoading;
}

export const setDataLoading = (_dataLoading) => {
    dataLoading = _dataLoading;
}

export const setIsLastPage = (_lastPage) => {
    isLastPage = _lastPage;
}

export const getIsLastPage = () => {
    return isLastPage;
}

export const getPage = () => {
    return page;
}

export const setPage = (_page) => {
    page = _page
}

export const setElapsedSeconds = (val) => {
    elapsedSeconds = val;
}

export const getElapsedSeconds = () => {
    return elapsedSeconds;
}

export const getWalls = () => {
    const walls = [];
    for (let i = 0; i < playBoardHeight; i++) {
        walls.push({ left: -blockSize, top: i * blockSize, width: blockSize, height: blockSize, type: 'red_block' });

    }
    for (let i = -1; i <= playBoardWidth; i++) {
        walls.push({ left: i * blockSize, top: -blockSize, width: blockSize, height: blockSize, type: 'red_block' });
    }
    for (let i = 0; i < playBoardHeight; i++) {
        walls.push({ left: boardRight, top: i * blockSize, width: blockSize, height: blockSize, type: 'red_block' });
    }
    return walls;
};
export const getPaddle = () => {
    return { left: paddleX, top: paddleY, width: paddleWidth, height: paddleHeight, speedX: paddleSpeedX, src: paddleSrc }
};
export const getLives = () => {
    return lives;
};
export const getBall = () => {
    return { left: ballX, top: ballY, visibility: ballVisibility, speedX: ballSpeedX, speedY: ballSpeedY, size: ballSize }
};
export const setRightArrow = (val) => {
    isRightDown = val;
    if (val === false) {
        setPaddleMoveDirection('');
    }
};
export const setLeftArrow = (val) => {
    isLeftDown = val;
    if (val === false) {
        setPaddleMoveDirection('');
    }
};
export const updatePaddle = ({ left, top, src }) => {
    if (left !== undefined) {
        paddleX = left;
        if (paddleX > prevPaddleLeft) {
            setPaddleMoveDirection('right')
        } else if (paddleX < prevPaddleLeft) {
            setPaddleMoveDirection('left')
        } else {
            setPaddleMoveDirection('');
        }
        prevPaddleLeft = paddleX;
    }
    if (top !== undefined) {
        paddleY = top;
    }
    if (src !== undefined) {
        paddleSrc = src;
    }
};
export const updateBall = ({ left, top, visibility, speedX, speedY }) => {
    if (left !== undefined) {
        ballX = left;
    }
    if (top != undefined) {
        ballY = top;
    }
    if (visibility != undefined) {
        ballVisibility = visibility;
    }
    if (speedX !== undefined) {
        ballSpeedX = speedX;
    }
    if (speedY !== undefined) {
        ballSpeedY = speedY;
    }
};
export const getBricks = () => {
    if (level > levels.length) {
        return null;
    }
    return levels[level - 1];
};
export const getGameState = () => {
    return gameState;
};
export const setGameState = (state) => {
    gameState = state;
};
export const getControlls = () => {
    return { isLeft: isLeftDown, isRight: isRightDown };
};
export const getScore = () => {
    return score;
};
export const setScore = (val) => {
    score = val;
};
export const removeBlockFromModel = (id) => {
    levels[level - 1] = levels[level - 1].filter(b => b.id !== id);
};
export const updateBrick = (brick) => {
    levels[level - 1] = [...levels[level - 1].filter(b => b.id !== brick.id), brick];
};
export const setLives = (val) => {
    lives = val;
};
export const setMessage = ({ title, body }) => {
    if (title !== undefined) {
        messageTitle = title;
    }
    if (body !== undefined) {
        messageBody = body;
    }
};
export const getMessage = () => {
    return { title: messageTitle, body: messageBody };
};
export const resetLevels = () => {
    levels = [level1, level2, level3];
};
export const setLevel = (val) => {
    level = val;
};
export const getLevel = () => {
    return level;
};
export const getMaxScore = (level) => {
    return maxScores.reduce((acc, val, index) => index < level ? acc + val : acc);
}

export const setPaddleMoveDirection = (val) => {
    movingDirection = val;
}
export const getPaddleMoveDirection = () => {
    return movingDirection;
}
