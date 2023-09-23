const scoreLable = document.querySelector('#score');
const levelLable = document.querySelector('#level');
const paddle = document.querySelector('#paddle');
const message = document.querySelector('#message');
const playBoard = document.querySelector('#board');
const ball = document.querySelector('#ball');



const renderMessage = (text) => {
    message.textContent = text;
}
const renderScore = (score) => {
    scoreLable.textContent = `Score: ${score}`;
}
const renderLevel = (level) => {
    levelLable.textContent = `Level: ${level}`;
}
const renderPaddle = (lives) => {
    const img = paddle.querySelector('img');
    switch(lives){
        case 3:
            img.src='./images/paddle_2.jpg';          
            break;
        case 2:
            img.src='./images/paddle_1.jpg';            
            break;
        case 1:
            img.src='./images/paddle_0.jpg';           
            break;
    }
}
const updatePaddlePosition = (left, top) => {
    if(left !== undefined){
        paddle.style.left = `${left}px`;
    }
    if(top !== undefined){
        paddle.style.top = `${top}px`;
    }
}
const updateBallPosition = (left,top) => {
    if(left !== undefined){
        ball.style.left = `${left}px`;
    }
    if(top !== undefined){
        ball.style.top = `${top}px`;
    }
}
export const renderBlock = (block) => {
    let div = document.createElement('div');
    div.classList.add('wall-block');
    div.style.width = `${block.width}px`;
    div.style.height = `${block.block}px`;
    div.style.left = `${block.left}px`;
    div.style.top = `${block.top}px`;
    div.style.backgroundImage = "url('/images/red_block.jpg')";
    playBoard.appendChild(div);
}


