const scoreLable = document.querySelector('#score');
const levelLable = document.querySelector('#level');
const paddle = document.querySelector('#paddle img');
const message = document.querySelector('#message');


let score = 0;
let level = 0;
let lives = 3;

export const updateScore = (_score) => {
    if(_score){
        score = _score;
    }else{
        score++;
    }
    scoreLable.textContent = `Score: ${score}`;
}


export const updateLevel = (_level) => {
    if(_level){
        level = _level;
    }else{
        level++;
    }
    levelLable.textContent = `Level: ${level}`;
}

export const updateLives = (_lives) => {
    if(_lives){
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

