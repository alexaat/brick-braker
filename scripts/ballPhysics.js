import { defaultSpeedX, defaultSpeedY } from "./constants.js";

let speedX = defaultSpeedX;
let speedY = defaultSpeedY;
const ball = document.querySelector('#ball');
const playBoard = document.querySelector('#board');
const rect = playBoard.getBoundingClientRect();

export const updateBallPosition = () => {
 
    const x = parseInt(ball.style.left.replace('px',''));
    const y = parseInt(ball.style.top.replace('px',''));

    let x1 = x + speedX;
    let y1 = y + speedY;

    x1, y1 = checkCollisions(x1, y1)

    ball.style.left = `${x1}px`;
    ball.style.top = `${y1}px`;
}





const checkCollisions = (x1, y1) => {

    if (x1<0) {
        speedX = !speedX;
    }
    return x1, y1;
}