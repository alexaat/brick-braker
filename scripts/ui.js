const scoreLable = document.querySelector('#score');
const levelLable = document.querySelector('#level');
const paddle = document.querySelector('#paddle img');
const message = document.querySelector('#message');
const playBoard = document.querySelector('#board');


let score = 0;
let level = 0;
let lives = 3;

export const updateScore = (_score) => {
    if(_score != undefined){
        score = _score;
    }else{
        score++;
    }
    scoreLable.textContent = `Score: ${score}`;
}

export const updateLevel = (_level) => {
    if(_level != undefined){
        level = _level;
    }else{
        level++;
    }
    levelLable.textContent = `Level: ${level}`;
}

export const updateLives = (_lives) => {
    if(_lives != undefined){
        lives = _lives
    }else{
        lives --;
    }

    switch(lives){
        case 3:
            paddle.src='./images/paddle_2.jpg';          
            break;
        case 2:
            paddle.src='./images/paddle_1.jpg';            
            break;
        case 1:
            paddle.src='./images/paddle_0.jpg';           
            break;
    }
    return lives>0;
}

export const setMessage = (val) => {
    message.textContent = val;
}

export const placeBricks = (bricks) => {
    
    bricks.forEach(brick => {
        const b = initBrick(brick);
        bricksAsElements.push(b);
        playBoard.appendChild(b);
    });
}

const initBrick = (brick) => {
    const div = document.createElement('div');
    div.style.position='absolute';
    div.style.width = `${brick.width}px`;
    div.style.height = `${brick.height}px`;
    div.style.backgroundImage = selectBrickImage(brick);
    div.style.top = `${brick.y}px`;
    div.style.left = `${brick.x}px`;
    div.dataset.type = brick.type;
    div.dataset.id = brick.id;
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

