const scoreLable = document.querySelector('#score');
const levelLable = document.querySelector('#level');
const paddle = document.querySelector('#paddle');
const messageTitle = document.querySelector('#message #title');
const messageBody = document.querySelector('#message #body');
const playBoard = document.querySelector('#board');
const ball = document.querySelector('#ball');

const brickMap = new Map();
brickMap.set("red_block", "url('../images/red_block.jpg')");
brickMap.set("blue_block", "url('../images/blue_block.jpeg')");
brickMap.set("purple_brick", "url('../images/purple_brick.jpg')");
brickMap.set("yellow_brick", "url('../images/yellow_brick.jpg')");
brickMap.set("red_brick", "url('../images/red_brick.jpg')");
brickMap.set("green_brick", "url('../images/green_brick.jpg')");

export const renderMessage = ({title, body}) => {
    if(title !== undefined){
        messageTitle.textContent = title;
    }
    if(body !== undefined){
        messageBody.textContent = body;
    }  
}
export const renderScore = (score) => {
    scoreLable.textContent = `Score: ${score}`;
}
export const renderLevel = (level) => {
    levelLable.textContent = `Level: ${level}`;
}

export const renderPaddle = ({left, top, width, height, src}) => {

    paddle.style.left = `${left}px`; 
    paddle.style.top = `${top}px`; 

    if(src!==undefined){
        const img = paddle.querySelector('img');
        img.src=`./images/${src}`;   
    }
    if(width !== undefined){
        paddle.style.width = `${width}px`;        
    }
    if(height !== undefined){
        paddle.style.height = `${height}px`;        
    }

}
export const renderBall = ({left, top, size, visibility}) => {   
    if(left !== undefined){
        ball.style.left = `${left}px`; 
    }
    if(top !== undefined){
        ball.style.top = `${top}px`;
    } 

    if(size !== undefined){
        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;
    }

    if(visibility!== undefined){
        if(visibility === true){
            ball.style.display = 'block';
        }else if (visibility === false){
            ball.style.display = 'none';
        }
    }  
}

export const renderPlayBoard = (width, height) => {
    playBoard.style.width = `${width}px`;
    playBoard.style.height = `${height}px`;
}

export const renderBlock = (block) => {
    
    let div = document.createElement('div');
    div.classList.add('block');
    div.style.width = `${block.width}px`;
    div.style.height = `${block.height}px`;
    div.style.left = `${block.left}px`;
    div.style.top = `${block.top}px`;
    if(block.id!==undefined){
        div.setAttribute('id', block.id);
    }  
    div.style.backgroundImage = brickMap.get(block.type);
    playBoard.appendChild(div);
}

export const removeBlockFromDOM = (id) => {
    document.getElementById(id).remove();
}
