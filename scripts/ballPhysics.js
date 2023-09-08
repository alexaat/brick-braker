import { defaultSpeedX, defaultSpeedY } from "./constants.js";

let speedX = defaultSpeedX;
let speedY = defaultSpeedY;


const ball = document.querySelector('#ball');



export const updateBallPosition = () => {
 
    const x = parseInt(ball.style.left.replace('px',''));
    const y = parseInt(ball.style.top.replace('px',''));


    ball.style.left = `${x + speedX}px`;
    ball.style.top = `${y + speedY}px`;
    //console.log(rect.top)



}