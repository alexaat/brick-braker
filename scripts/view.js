import { maxItemsPerPage } from './constants.js';
import { blockSize } from './constants.js';

const scoreLable = document.querySelector('#score');
const levelLable = document.querySelector('#level');
const paddle = document.querySelector('#paddle');
const messageTitle = document.querySelector('#message #title');
const messageBody = document.querySelector('#message #body');
const playBoard = document.querySelector('#board');
const ball = document.querySelector('#ball');
const time = document.querySelector('#time');

const brickMap = new Map();
brickMap.set("red_block", "url('images/red_block.jpg')");
brickMap.set("blue_block", "url('images/blue_block.jpeg')");
brickMap.set("purple_brick", "url('images/purple_brick.jpg')");
brickMap.set("yellow_brick", "url('images/yellow_brick.jpg')");
brickMap.set("red_brick", "url('images/red_brick.jpg')");
brickMap.set("green_brick", "url('images/green_brick.jpg')");

export const renderMessage = ({ title, body }) => {
    if (title !== undefined) {
        messageTitle.textContent = title;
    }
    if (body !== undefined) {
        messageBody.textContent = body;
    }
}
export const renderScore = (score) => {
    scoreLable.textContent = `Score: ${score}`;
}
export const renderLevel = (level) => {
    levelLable.textContent = `Level: ${level}`;
}

export const renderPaddle = ({ left, top, width, height, src }) => {

    paddle.style.left = `${left}px`;
    paddle.style.top = `${top}px`;

    if (src !== undefined) {
        const img = paddle.querySelector('img');
        img.src = `./images/${src}`;
    }
    if (width !== undefined) {
        paddle.style.width = `${width}px`;
    }
    if (height !== undefined) {
        paddle.style.height = `${height}px`;
    }

}
export const renderBall = ({ left, top, size, visibility }) => {
    if (left !== undefined) {
        ball.style.left = `${left}px`;
    }
    if (top !== undefined) {
        ball.style.top = `${top}px`;
    }

    if (size !== undefined) {
        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;
    }

    if (visibility !== undefined) {
        if (visibility === true) {
            ball.style.display = 'block';
        } else if (visibility === false) {
            ball.style.display = 'none';
        }
    }
}

export const renderPlayBoard = (width, height) => {
    playBoard.style.width = `${width}px`;
    playBoard.style.height = `${height}px`; 
    let w = window.innerWidth;
    playBoard.style.left = `calc((${w}px - ${width}px)/2 + ${blockSize}px)`;
}

export const renderBlock = (block) => {

    let div = document.createElement('div');
    div.classList.add('block');
    div.style.width = `${block.width}px`;
    div.style.height = `${block.height}px`;
    div.style.left = `${block.left}px`;
    div.style.top = `${block.top}px`;
    if (block.id !== undefined) {
        div.setAttribute('id', block.id);
    }
    div.style.backgroundImage = brickMap.get(block.type);
    playBoard.appendChild(div);
}

export const removeBlockFromDOM = (id) => {
    document.getElementById(id).remove();
}

export const renderElapsedSeconds = (secs) => {

    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs - hours * 3600) / 60);
    const seconds = secs - hours * 3600 - minutes * 60;

    const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
    const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;

    time.textContent = hoursStr + ':' + minutesStr + ':' + secondsStr;
}

export const renderScoresFrame = () => {
    let scoresFrame = document.querySelector('.scores-frame');
    if (scoresFrame) {
        return;
    }
    scoresFrame = document.createElement('div');
    scoresFrame.classList.add('scores-frame'); 
    let w = window.innerWidth;
    scoresFrame.style.left = `calc((${w}px - 400px)/2 + ${blockSize}px)`;

    //Draw bricks border left wall
    for (let i = 0; i < 24; i++) {
        const brick = document.createElement('div');
        brick.classList.add('block');
        brick.style.position = 'absolute';
        brick.style.left = '0'
        brick.style.top = `${i * 25}px`;
        scoresFrame.appendChild(brick);
    }
    //Draw bricks border right wall
    for (let i = 0; i < 24; i++) {
        const brick = document.createElement('div');
        brick.classList.add('block');
        brick.style.position = 'absolute';
        brick.style.left = '375px'
        brick.style.top = `${i * 25}px`;
        scoresFrame.appendChild(brick);
    }
    //Draw bricks border top wall
    for (let i = 1; i < 15; i++) {
        const brick = document.createElement('div');
        brick.classList.add('block');
        brick.style.position = 'absolute';
        brick.style.left = `calc(50% - 200px + ${i * 25}px)`
        brick.style.top = `0`;
        scoresFrame.appendChild(brick);
    }
    //Draw bricks border bottom wall
    for (let i = 1; i < 15; i++) {
        const brick = document.createElement('div');
        brick.classList.add('block');
        brick.style.position = 'absolute';
        brick.style.left = `calc(50% - 200px + ${i * 25}px)`
        brick.style.top = `${575}px`;
        scoresFrame.appendChild(brick);
    }
    //Title
    const title = document.createElement('div');
    title.classList.add('scores-title');
    title.textContent = 'Scores';
    title.style.color = '#800000'
    const header = document.createElement('div');
    header.classList.add('scores-header');
    const headerTitles = ['Rank', 'Name', 'Time', 'Score'];
    const headerWidth = ['60px', '220px', '60px', '60px'];
    for (let i = 0; i < headerTitles.length; i++) {
        const column = document.createElement('div');
        column.classList.add('scores-title-column');
        column.style.width = headerWidth[i];
        column.textContent = headerTitles[i];
        column.style.color = 'gold'
        header.appendChild(column);
    }
    title.appendChild(header);
    scoresFrame.appendChild(title);

    const scoresContainer = document.createElement('div');
    scoresContainer.classList.add('scores-container');
    scoresFrame.appendChild(scoresContainer);

    document.body.appendChild(scoresFrame);

}

export const removeScoresFrame = () => {
    const frame = document.querySelector('.scores-frame');
    frame.remove();
}

export const renderScores = (scores, page, isLastPage, inputPosition, message) => {

    let scoresFrame = document.querySelector('.scores-frame');
    if (!scoresFrame) {
        renderScoresFrame();
    }

    let scoresContaner = document.querySelector('.scores-container');
    scoresContaner.innerHTML = '';

    const headerWidth = ['60px', '220px', '60px', '60px'];
    let rank = (page - 1) * maxItemsPerPage + 1;

    scores.forEach(item => {
        const row = document.createElement('div');
        row.classList.add('scores-header');
        let i = 0;
        let cell = document.createElement('div');
        cell.classList.add('scores-title-column');
        cell.style.width = headerWidth[i];
        cell.textContent = rank;
        i++;
        row.appendChild(cell);
        cell = document.createElement('div');
        cell.classList.add('scores-title-column');
        cell.style.width = headerWidth[i];
        cell.textContent = item.name;
        if (inputPosition === rank) {
            cell.classList.add('input-name');
            cell.textContent = '';
        }
        i++;
        row.appendChild(cell);
        cell = document.createElement('div');
        cell.classList.add('scores-title-column');
        cell.style.width = headerWidth[i];
        cell.textContent = item.time;
        i++;
        row.appendChild(cell);
        cell = document.createElement('div');
        cell.classList.add('scores-title-column');
        cell.style.width = headerWidth[i];
        cell.textContent = item.score;
        i++;
        row.appendChild(cell);
        rank++;
        scoresContaner.append(row);
    });

    //Page
    const scorePageContainer = document.createElement('div');
    scorePageContainer.classList.add('score-page-container');

    const buttonLeft = document.createElement('div');
    buttonLeft.classList.add('score-page-left');
    buttonLeft.textContent = "<";
    scorePageContainer.appendChild(buttonLeft);
    if (page === 1 || inputPosition) {
        buttonLeft.style.display = 'none';
    } else {
        buttonLeft.style.display = 'block';
    }
    const pageNumber = document.createElement('div');
    pageNumber.classList.add('score-page-number');
    pageNumber.textContent = page;
    scorePageContainer.appendChild(pageNumber);

    const buttonRight = document.createElement('div');
    buttonRight.classList.add('score-page-right');
    buttonRight.textContent = ">";
    scorePageContainer.appendChild(buttonRight);
    if (isLastPage === true || inputPosition) {
        buttonRight.style.visibility = 'hidden';
    } else {
        buttonRight.style.visibility = 'visible';
    }
    scoresContaner.appendChild(scorePageContainer);
    scoresFrame.appendChild(scoresContaner);

    if (message) {
        let messageElement = document.querySelector('.score-board-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.classList.add('score-board-message');
            messageElement.textContent = message;
            scoresFrame.appendChild(messageElement);
        } else {
            messageElement.textContent = message;
        }
    }
}
