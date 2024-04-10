
import {
    ballSize,
    gameStateReady,
    gameStatePaused,
    gameStateGameOver,
    gameStateRunning,
    paddleImagesSource,
    defaultSpeedX,
    defaultSpeedY,
    gameStateWin,
    ballMinSpeedX,
    ballMinSpeedY,
    moveingPaddleSpeedConst,
    allowedCharacters,
    gameStatePlayerNameRequest,
    gameStateDisplayScoresBoard,
    maxItemsPerPage,
    maxNameLength
} from "./constants.js";
import {
    getWalls,
    playBoardHeightPx,
    playBoardWidthPx,
    getPaddle,
    getLives,
    setLives,
    getBall,
    setRightArrow,
    setLeftArrow,
    updatePaddle,
    updateBall,
    getBricks,
    getGameState,
    setGameState,
    getControlls,
    removeBlockFromModel,
    getScore,
    setScore,
    updateBrick,
    setMessage,
    getMessage,
    resetLevels,
    setLevel,
    getLevel,
    getMaxScore,
    numberOfLevels,
    getPaddleMoveDirection,
    setElapsedSeconds,
    getElapsedSeconds,
    getPage,
    setPage,
    setIsLastPage,
    getIsLastPage,
    setDataLoading,
    getDataLoading
} from "./model.js";
import { renderBlock, renderPlayBoard, renderPaddle, renderBall, renderMessage, removeBlockFromDOM, renderScore, renderLevel, renderElapsedSeconds, renderScoresFrame, removeScoresFrame, renderScores } from "./view.js";
import { fetchRank, fetchScores, uploadScore } from "./network.js";

let interval = null;

let dataLoadingStatus = null;

let cursorCounter = 0;

Number.prototype.isBetween = function (left, right) {
    return this > left && this < right;
};

const setUp = () => {

    renderPlayBoard(playBoardWidthPx, playBoardHeightPx);
    const walls = getWalls();
    walls.forEach(block => {
        renderBlock(block);
    });

    const lives = getLives();
    const paddleData = getPaddle();
    renderPaddle({ ...paddleData });

    const ballData = getBall();
    renderBall({ ...ballData });

    initControlls();

    const bricks = getBricks();
    bricks.forEach(brick => renderBlock(brick));
}

const updateScreen = () => {

    const gameState = getGameState();

    if (gameState === gameStatePlayerNameRequest) {

        //Make Cursor
        cursorCounter++;
        const el = document.querySelector('.input-name');
        if (el && el.textContent.length < maxNameLength) {
            const content = el.textContent;
            if (cursorCounter === 1) {
                el.textContent = el.textContent.slice(0, -1);
                el.textContent += ' ';
            }
            if (cursorCounter === 25) {
                el.textContent = el.textContent.slice(0, -1);
                el.textContent += '_';
            }
            if (cursorCounter > 50) {
                cursorCounter = 0;
            }
        }


        if (dataLoadingStatus === null) {
            dataLoadingStatus = 'load';
            renderScoresFrame();

            const score = getScore();
            const time = getElapsedSeconds();

            fetchRank(score, time)
                .then(resp => resp.json())
                .then(data => {
                    if (data.message && data.message.includes('error')) {
                        alert(data.message);
                    } else {
                        const rank = data.rank;
                        const page = Math.ceil(data.rank / maxItemsPerPage);
                        fetchScores(page)
                            .then(resp => resp.json())
                            .then(data => {

                                if (data.message && data.message.includes('error')) {
                                    alert(data.message);
                                } else {
                                    const isLastPage = data.is_last_page;
                                    const page = data.page;
                                    const items = data.payload;
                                    const total = data.total;
                                    setPage(page);

                                    if (items.length === 0) {
                                        items.push({ rank, name: '', time, score })
                                    } else {
                                        items.splice(rank - 1, 0, { rank, name: '', score, time });
                                        if (items.length > maxItemsPerPage) {
                                            items.pop();
                                        }
                                    }
                                    renderScores(items, page, isLastPage, rank, 'Enter you name and press Enter. Use Escape key to cancel');
                                }
                            })
                    }
                })
        }
        return;
    }

    if (gameState === gameStateDisplayScoresBoard) {
        if (dataLoadingStatus === null) {
            dataLoadingStatus = 'load';
            fetchScores(getPage())
                .then(resp => resp.json())
                .then(data => {
                    if (data.message && data.message.includes('error')) {
                        alert(data.message);
                    } else {
                        const isLastPage = data.is_last_page;
                        setIsLastPage(isLastPage);
                        const page = data.page;
                        const items = data.payload;
                        const total = data.total;
                        renderScores(items, page, isLastPage, undefined, 'Use left or right arrows for different pages. Press any other key to continue');
                    }
                    setDataLoading(false);
                });

        }
        return;
    }

    let ballData = getBall();
    let paddleData = getPaddle();
    const controlls = getControlls();

    //Update Paddle  
    if (gameState === gameStateReady || gameState === gameStateRunning) {
        if (controlls.isLeft === true) {
            let paddleX = paddleData.left - paddleData.speedX;
            if (paddleX < 0) {
                paddleX = 0;
            }
            updatePaddle({ left: paddleX });
        } else if (controlls.isRight === true) {
            let paddleX = paddleData.left + paddleData.speedX;
            if (paddleX > playBoardWidthPx - paddleData.width) {
                paddleX = playBoardWidthPx - paddleData.width;
            }
            updatePaddle({ left: paddleX });
        }
    }
    paddleData = getPaddle();
    renderPaddle({ ...paddleData });

    //Update Ball
    if (gameState === gameStateReady) {
        const left = paddleData.left + paddleData.width / 2;
        updateBall({ left });
    } else if (gameState === gameStateRunning) {
        checkCollisions({ ballData, paddleData, playBoardWidthPx, playBoardHeightPx });
    }
    renderBall({ ...getBall() });
}

const startGame = () => {
    setUp();
    requestAnimationFrame(run);
}

const run = () => {
    updateScreen();
    requestAnimationFrame(run);
}

const initControlls = () => {
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

        handleKeyPress(e.key);

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

export const handleKeyPress = (key) => {
    const gameState = getGameState();

    switch (gameState) {
        case gameStateReady:
            if (key === ' ') {
                setGameState(gameStateRunning);
                setMessage({ title: '', body: '' });
                renderMessage(getMessage());
                startTimer();
            }

            if (key === 'Escape') {
                resetGame();
            }

            break;

        case gameStatePaused:
            if (key === ' ') {
                setGameState(gameStateRunning);
                setMessage({ title: '', body: '' });
                renderMessage(getMessage());
                startTimer();
            }
            if (key === 'Escape') {
                resetGame();
            }

            break;

        case gameStateRunning:
            if (key === ' ') {
                setGameState(gameStatePaused);
                setMessage({ title: 'Paused', body: 'Press SPACE to continue or ESC to restart' });
                renderMessage(getMessage());
                pauseTimer();
            }
            if (key === 'Escape') {
                resetGame();
            }
            break;

        case gameStateGameOver:
            if (key === ' ') {
                stopTimer();

                setGameState(gameStateReady);
                setMessage({ title: 'Ready', body: 'Press SPACE to play' })
                renderMessage(getMessage());

                setLives(3);

                const paddleData = getPaddle();
                updatePaddle({ left: (playBoardWidthPx - paddleData.width) / 2, src: paddleImagesSource[getLives() - 1] });

                const ballData = getBall();
                updateBall({ top: paddleData.top - ballData.size, visibility: true, speedX: defaultSpeedX, speedY: defaultSpeedY });

                getBricks().forEach(b => {
                    removeBlockFromModel(b.id);
                    removeBlockFromDOM(b.id);
                });

                setLevel(1);
                renderLevel(getLevel());

                setScore(0);
                renderScore(getScore());

                resetLevels();

                getBricks().forEach(brick => renderBlock(brick));
            }
            if (key === 'Escape') {
                resetGame();
            }

            break;

        case gameStateWin:
            if (key === ' ') {
                stopTimer();
                setMessage({ title: 'Ready', body: 'Press SPACE to play' });
                renderMessage(getMessage());
                setScore(0);
                renderScore(getScore());
                setLives(3);

                let bricks = getBricks();
                if (bricks) {
                    bricks.forEach(b => {
                        removeBlockFromModel(b.id);
                        removeBlockFromDOM(b.id);
                    });

                }
                setLevel(1);
                renderLevel(getLevel());

                const paddleData = getPaddle();
                updatePaddle({ left: (playBoardWidthPx - paddleData.width) / 2, src: paddleImagesSource[getLives() - 1] });
                const ballData = getBall();
                updateBall({ top: paddleData.top - ballData.size, visibility: true, speedX: defaultSpeedX, speedY: defaultSpeedY });
                setLevel(1);
                renderLevel(getLevel());

                resetLevels();
                bricks = getBricks();

                if (bricks) {
                    bricks.forEach(brick => renderBlock(brick));
                }

                setGameState(gameStateReady);
            }
            if (key === 'Escape') {
                resetGame();
            }

            break;

        case gameStatePlayerNameRequest:
            if (allowedCharacters.includes(key)) {
                //User player name
                const inputName = document.querySelector('.input-name');
                if (key === 'Backspace') {
                    inputName.textContent = inputName.textContent.slice(0, -1);
                } else {
                    if (inputName.textContent.length < maxNameLength) {
                        //inputName.textContent += key;
                        inputName.textContent = inputName.textContent.slice(0, -1) + key + ' ';

                    }

                }

            }
            if (key === 'Enter') {
                const inputName = document.querySelector('.input-name');
                const score = getScore();
                const time = getElapsedSeconds();

                if (inputName) {
                    let content = inputName.textContent;
                    if (content.charAt(content.length - 1) === '_' || content.charAt(content.length - 1) === ' ') {
                        content = content.slice(0, -1);
                    }
                    const name = content.trim();
                    if (name != '') {
                        uploadScore(name, score, time).then(() => {
                            dataLoadingStatus = null;
                            setGameState(gameStateDisplayScoresBoard);
                        });
                    }
                }

            }
            if (key === 'Escape') {
                //Player wants to skip name save
                dataLoadingStatus = null;
                setGameState(gameStateDisplayScoresBoard);
            }
            break;

        case gameStateDisplayScoresBoard:
            if (key === 'ArrowLeft') {
                //Previous Page                
                if (!getDataLoading()) {
                    const page = getPage();
                    if (page > 1) {
                        setPage(page - 1);
                        dataLoadingStatus = null;
                    }
                }
            } else if (key === 'ArrowRight') {
                if (!getDataLoading()) {
                    const page = getPage();
                    const isLastPage = getIsLastPage();
                    if (!isLastPage) {
                        setPage(page + 1);
                        dataLoadingStatus = null;
                    }
                }

            } else {
                //Go to ready state
                removeScoresFrame();
                resetGame();
            }
            break;
    }
}

const checkCollisions = ({ ballData, paddleData, playBoardWidthPx, playBoardHeightPx }) => {

    const ballX = ballData.left + ballData.speedX;
    const ballY = ballData.top + ballData.speedY;
    updateBall({ left: ballX, top: ballY });
    let ballSpeedX = ballData.speedX;
    let ballSpeedY = ballData.speedY;
    const paddleX = paddleData.left;
    const paddleY = paddleData.top;
    const paddleWidth = paddleData.width;
    const paddleHeight = paddleData.height;

    //Middle points of ball
    const topX = ballX + ballSize / 2;
    const topY = ballY;
    const bottomX = ballX + ballSize / 2;
    const bottomY = ballY + ballSize;
    const rightX = ballX + ballSize;
    const rightY = ballY + ballSize / 2;
    const leftX = ballX;
    const leftY = ballY + ballSize / 2;

    //Walls collisions
    //Left hit
    if (ballX < 0) {
        ballSpeedX = Math.abs(ballSpeedX);
        updateBall({ speedX: ballSpeedX });
    }
    //Top hit
    if (ballY < 0) {
        ballSpeedY = Math.abs(ballSpeedY);
        updateBall({ speedY: ballSpeedY });
    }
    //Right hit
    if (ballX > playBoardWidthPx - ballSize) {
        ballSpeedX = -Math.abs(ballSpeedX);
        updateBall({ speedX: ballSpeedX });
    }
    if (ballY > playBoardHeightPx - ballSize) {
        ballIsOutHandler();
        return;
    }

    //Paddle collisions    
    //Puddle top
    if (ballX.isBetween(paddleX, paddleX + paddleWidth) && ballY > paddleY - ballSize) {
        const paddleMoveDirection = getPaddleMoveDirection();
        const vSq = ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY;
        if (paddleMoveDirection === 'left') {
            if (ballSpeedX > 0) {
                if (Math.abs(ballSpeedY * moveingPaddleSpeedConst) > ballMinSpeedY) {
                    ballSpeedY = -Math.abs(ballSpeedY) * moveingPaddleSpeedConst;
                    ballSpeedX = Math.sqrt(vSq - ballSpeedY * ballSpeedY);
                } else {
                    ballSpeedY = -Math.abs(ballSpeedY);
                }
            } else if (ballSpeedX < 0) {
                if (Math.abs(ballSpeedX * moveingPaddleSpeedConst) > ballMinSpeedX) {
                    ballSpeedX = ballSpeedX * moveingPaddleSpeedConst;
                    ballSpeedY = -Math.sqrt(vSq - ballSpeedX * ballSpeedX);
                } else {
                    ballSpeedY = -Math.abs(ballSpeedY);
                }
            }
        } else if (paddleMoveDirection === 'right') {
            if (ballSpeedX > 0) {
                if (Math.abs(ballSpeedX * moveingPaddleSpeedConst) > ballMinSpeedX) {
                    ballSpeedX = ballSpeedX * moveingPaddleSpeedConst;
                    ballSpeedY = -Math.sqrt(vSq - ballSpeedX * ballSpeedX);
                } else {
                    ballSpeedY = -Math.abs(ballSpeedY);
                }
            } else if (ballSpeedX < 0) {
                if (Math.abs(ballSpeedY * moveingPaddleSpeedConst) > ballMinSpeedY) {
                    ballSpeedY = -Math.abs(ballSpeedY) * moveingPaddleSpeedConst;
                    ballSpeedX = -Math.sqrt(vSq - ballSpeedY * ballSpeedY);
                }
                ballSpeedY = -Math.abs(ballSpeedY);
            }
        } else {
            ballSpeedY = -Math.abs(ballSpeedY);
        }
        updateBall({ speedX: ballSpeedX, speedY: ballSpeedY });
        return;
    }
    //Paddle Left-Top
    if (rightX.isBetween(paddleX, paddleX + paddleWidth) && rightY.isBetween(paddleY, paddleY + paddleHeight / 2)) {
        ballSpeedX = -Math.abs(ballSpeedX);
        ballSpeedY = -Math.abs(ballSpeedY);
        updateBall({ speedX: ballSpeedX, speedY: ballSpeedY });
        return;
    }

    //Paddle Right-Top
    if (leftX.isBetween(paddleX, paddleX + paddleWidth) && leftY.isBetween(paddleY, paddleY + paddleHeight / 2)) {
        ballSpeedX = Math.abs(ballSpeedX);
        ballSpeedY = -Math.abs(ballSpeedY);
        updateBall({ speedX: ballSpeedX, speedY: ballSpeedY });
        return;
    }

    //Paddle Left-Bottom
    if (rightX.isBetween(paddleX, paddleX + paddleWidth) && rightY.isBetween(paddleY + paddleHeight / 2, paddleY + paddleHeight)) {
        ballSpeedX = -Math.abs(ballSpeedX);
        ballSpeedY = Math.abs(ballSpeedY);
        updateBall({ speedX: ballSpeedX, speedY: ballSpeedY });
        return;
    }

    //Paddle Right-Bottom
    if (leftX.isBetween(paddleX, paddleX + paddleWidth) && leftY.isBetween(paddleY + paddleHeight / 2, paddleY + paddleHeight)) {
        ballSpeedX = Math.abs(ballSpeedX)
        ballSpeedY = Math.abs(ballSpeedY)
        updateBall({ speedX: ballSpeedX, speedY: ballSpeedY });
        return;
    }

    //Brick Collisions
    const bricks = getBricks();
    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];

        const brickLeft = brick.left;
        const brickTop = brick.top;
        const brickRight = brickLeft + brick.width;
        const brickBottom = brickTop + brick.height;

        //Bottom hit
        if (topX.isBetween(brickLeft, brickRight) && topY.isBetween(brickTop, brickBottom) && ballSpeedY < 0) {
            ballSpeedY = Math.abs(ballSpeedY);
            updateBall({ speedY: ballSpeedY });
            handleBrickCollision(brick);
            return;
        }

        //Top hit
        if (bottomX.isBetween(brickLeft, brickRight) && bottomY.isBetween(brickTop, brickBottom) && ballSpeedY > 0) {
            ballSpeedY = -Math.abs(ballSpeedY);
            updateBall({ speedY: ballSpeedY });
            handleBrickCollision(brick);
            return;
        }

        //Left hit
        if (rightX.isBetween(brickLeft, brickRight) && rightY.isBetween(brickTop, brickBottom) && ballSpeedX > 0) {
            ballSpeedX = -Math.abs(ballSpeedX);
            updateBall({ speedX: ballSpeedX });
            handleBrickCollision(brick);
            return;
        }

        //Right hit
        if (leftX.isBetween(brickLeft, brickRight) && leftY.isBetween(brickTop, brickBottom) && ballSpeedX < 0) {
            ballSpeedX = Math.abs(ballSpeedX);
            updateBall({ speedX: ballSpeedX });
            handleBrickCollision(brick);
            return;
        }
    }
}

const ballIsOutHandler = () => {

    pauseTimer();

    const lives = getLives();
    if (lives < 2) {
        //Game Over
        updateBall({ visibility: false });
        renderBall({ ...getBall() });
        //setGameState(gameStateGameOver);
        setGameState(gameStatePlayerNameRequest);
        setMessage({ title: 'Game Over', body: 'Press SPACE to play again' });
    } else {
        setGameState(gameStateReady);
        setLives(lives - 1);

        setMessage({ title: 'Lost a life', body: 'Press SPACE to play' });

        let paddleData = getPaddle();
        paddleData.src = paddleImagesSource[getLives() - 1];
        updatePaddle({ ...paddleData });

        let ballData = getBall();
        ballData.top = paddleData.top - ballData.size;
        ballData.speedX = defaultSpeedX;
        ballData.speedY = defaultSpeedY;
        updateBall({ ...ballData });
    }

    renderMessage(getMessage());
}

const handleBrickCollision = (brick) => {

    const hits = brick.hits;

    if (hits !== undefined) {
        if (hits > 1) {
            updateBrick({ ...brick, hits: hits - 1 });
        } else {
            removeBlockFromModel(brick.id);
            removeBlockFromDOM(brick.id);
        }

        setScore(getScore() + 1);

        const score = getScore();
        renderScore(score);

        const maxScore = getMaxScore(getLevel());

        if (maxScore === score) {

            pauseTimer();
            //Set Next Level 
            if (getLevel() + 1 > numberOfLevels) {
                setGameState(gameStatePlayerNameRequest);
                //setGameState(gameStateWin);
                //setMessage({ title: 'You Win!!!', body: 'Press SPACE to play again' });
                //renderMessage(getMessage());
            } else {
                getBricks().forEach(b => {
                    removeBlockFromModel(b.id);
                    removeBlockFromDOM(b.id);
                }
                );
                setLevel(getLevel() + 1);
                const level = getLevel();
                renderLevel(level);

                setMessage({ title: 'Next Level', body: 'Press SPACE to play' });
                renderMessage(getMessage());

                const paddleData = getPaddle();
                updatePaddle({ left: (playBoardWidthPx - paddleData.width) / 2 });

                const ballData = getBall();
                updateBall({ top: paddleData.top - ballData.size, speedX: defaultSpeedX, speedY: defaultSpeedY });

                const bricks = getBricks();
                if (bricks) {
                    bricks.forEach(brick => renderBlock(brick));
                }
                setGameState(gameStateReady);
            }
        }
    }
}

const startTimer = () => {
    if (interval) return;
    interval = setInterval(() => {
        const seconds = getElapsedSeconds();
        setElapsedSeconds(seconds + 1);
        renderElapsedSeconds(seconds + 1);
    }, 1000);
}

const pauseTimer = () => {
    clearInterval(interval);
    interval = null;
    const seconds = getElapsedSeconds();
    renderElapsedSeconds(seconds);
}

const stopTimer = () => {
    setElapsedSeconds(0);
    clearInterval(interval);
    interval = null;
    const seconds = getElapsedSeconds();
    renderElapsedSeconds(seconds);
}

const resetGame = () => {
    dataLoadingStatus = null;
    setDataLoading(false);

    setGameState(gameStateReady);
    stopTimer();

    setMessage({ title: 'Ready', body: 'Press SPACE to play' })
    renderMessage(getMessage());

    setLives(3);

    const paddleData = getPaddle();
    updatePaddle({ left: (playBoardWidthPx - paddleData.width) / 2, src: paddleImagesSource[getLives() - 1] });

    const ballData = getBall();
    updateBall({ top: paddleData.top - ballData.size, visibility: true, speedX: defaultSpeedX, speedY: defaultSpeedY });

    getBricks().forEach(b => {
        removeBlockFromModel(b.id);
        removeBlockFromDOM(b.id);
    });

    setLevel(1);
    renderLevel(getLevel());

    setScore(0);
    renderScore(getScore());

    resetLevels();

    getBricks().forEach(brick => renderBlock(brick));
}

startGame();