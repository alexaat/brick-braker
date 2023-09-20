const scoreLable = document.querySelector('#score');
const levelLable = document.querySelector('#level');
const paddle = document.querySelector('#paddle');

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
            paddle.style.backgroundImage = "url('/images/paddle_2.jpg')";
            break;
        case 2:
            paddle.style.backgroundImage = "url('/images/paddle_1.jpg')";
            break;
        case 1:
            paddle.style.backgroundImage = "url('/images/paddle_0.jpg')";
            break;
    }
    return lives>0;

}

