
import { ballSize,
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
         moveingPaddleSpeedConst  } from "./constants.js";
import { getWalls,
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
         getElapsedSeconds
        } from "./model.js";
import {renderBlock, renderPlayBoard, renderPaddle, renderBall, renderMessage, removeBlockFromDOM, renderScore, renderLevel, renderElapsedSeconds} from "./view.js";

let interval = null;

Number.prototype.isBetween = function(left, right){
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
    renderPaddle({...paddleData});

    const ballData = getBall();
    renderBall({...ballData});

    initControlls();

    const bricks = getBricks();
    bricks.forEach(brick => renderBlock(brick));
}

const updateScreen = () => {

    const gameState = getGameState();
    let ballData = getBall();
    let paddleData = getPaddle();
    const controlls = getControlls();

    //Update Paddle  
    if(gameState === gameStateReady || gameState === gameStateRunning){       
        if(controlls.isLeft === true){
            let paddleX = paddleData.left - paddleData.speedX;
            if(paddleX < 0) {
                paddleX = 0;               
            }
            updatePaddle({left: paddleX});   
        }else if (controlls.isRight === true){
            let paddleX = paddleData.left + paddleData.speedX;
            if(paddleX > playBoardWidthPx - paddleData.width){
                paddleX = playBoardWidthPx - paddleData.width;               
            }
            updatePaddle({left: paddleX});   
        }
    }
    paddleData = getPaddle();
    renderPaddle({...paddleData});

    //Update Ball
    if(gameState === gameStateReady){       
        const left = paddleData.left + paddleData.width/2;
        updateBall({left});
    } else if(gameState === gameStateRunning){
        checkCollisions({ballData, paddleData, playBoardWidthPx, playBoardHeightPx});       
    }
    renderBall({...getBall()});
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

        if(e.key === ' '){
            handleKeyPress(' ');            
        }
        if(e.key === 'Escape'){
            handleKeyPress('Escape');   
        }
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
    if(key === ' '){

        const gameState = getGameState();

        if(gameState === gameStateReady || gameState === gameStatePaused){
            setGameState(gameStateRunning);
            setMessage({title: '', body: ''});
            renderMessage(getMessage());
            startTimer();
            return;
        }
        if(gameState === gameStateRunning){
            setGameState(gameStatePaused);
            setMessage({title: 'Paused', body: 'Press SPACE to continue or ESC to restart'});
            renderMessage(getMessage());
            pauseTimer();
            return;
        }
        if(gameState === gameStateGameOver){
            
            stopTimer();

            setGameState(gameStateReady);
            setMessage({title: 'Ready', body: 'Press SPACE to play'})
            renderMessage(getMessage());
          
            setLives(3);

            const paddleData = getPaddle();
            updatePaddle({left: (playBoardWidthPx - paddleData.width)/2, src: paddleImagesSource[getLives()-1]});

            const ballData = getBall();
            updateBall({top: paddleData.top - ballData.size, visibility: true, speedX: defaultSpeedX, speedY: defaultSpeedY});

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

            return;
        }
        if(gameState === gameStateWin){
    
            stopTimer();
            setMessage({title: 'Ready', body: 'Press SPACE to play'});
            renderMessage(getMessage());
            setScore(0);
            renderScore(getScore());
            setLevel(1);
            renderLevel(getLevel());
            setLives(3);
            let bricks = getBricks();           
            if(bricks){                
                bricks.forEach(b =>{
                    removeBlockFromModel(b.id);
                    removeBlockFromDOM(b.id);
                });              
                    
            }
            const paddleData = getPaddle();
            updatePaddle({left: (playBoardWidthPx - paddleData.width)/2, src: paddleImagesSource[getLives()-1]});
            const ballData = getBall();
            updateBall({top: paddleData.top - ballData.size, visibility: true, speedX: defaultSpeedX, speedY: defaultSpeedY});
            setLevel(1);
            renderLevel(getLevel());

            resetLevels();
            bricks = getBricks();

            if(bricks){
                bricks.forEach(brick => renderBlock(brick));
            }    

            setGameState(gameStateReady);

        }
        
    }
    if(key === 'Escape'){

        setGameState(gameStateReady);
        stopTimer();

            setMessage({title: 'Ready', body: 'Press SPACE to play'})
            renderMessage(getMessage());
          
            setLives(3);

            const paddleData = getPaddle();
            updatePaddle({left: (playBoardWidthPx - paddleData.width)/2, src: paddleImagesSource[getLives()-1]});

            const ballData = getBall();
            updateBall({top: paddleData.top - ballData.size, visibility: true, speedX: defaultSpeedX, speedY: defaultSpeedY});

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
}

const checkCollisions = ({ballData, paddleData, playBoardWidthPx, playBoardHeightPx}) => {

    const ballX = ballData.left + ballData.speedX;
    const ballY = ballData.top + ballData.speedY;
    updateBall({left: ballX, top: ballY});
    let ballSpeedX = ballData.speedX;
    let ballSpeedY = ballData.speedY;
    const paddleX = paddleData.left;
    const paddleY = paddleData.top;
    const paddleWidth = paddleData.width;
    const paddleHeight = paddleData.height;

    //Middle points of ball
    const topX = ballX+ballSize/2;
    const topY = ballY;
    const bottomX = ballX + ballSize/2;
    const bottomY = ballY + ballSize;
    const rightX = ballX + ballSize;
    const rightY = ballY+ballSize/2;
    const leftX = ballX;
    const leftY = ballY+ballSize/2;    

    //Walls collisions
    //Left hit
    if(ballX< 0){
        ballSpeedX = Math.abs(ballSpeedX);
        updateBall({speedX: ballSpeedX});
    }
    //Top hit
    if(ballY<0){
        ballSpeedY = Math.abs(ballSpeedY); 
        updateBall({speedY: ballSpeedY});      
    }
    //Right hit
    if (ballX>playBoardWidthPx-ballSize) {   
        ballSpeedX = -Math.abs(ballSpeedX);
        updateBall({speedX: ballSpeedX});
    }
    if (ballY > playBoardHeightPx - ballSize){
        ballIsOutHandler();
        return;        
    }  

    //Paddle collisions    
    //Puddle top
    if(ballX.isBetween(paddleX, paddleX+paddleWidth) && ballY>paddleY-ballSize){
        const paddleMoveDirection = getPaddleMoveDirection();
        const vSq = ballSpeedX*ballSpeedX + ballSpeedY*ballSpeedY;
        if(paddleMoveDirection === 'left'){
            if(ballSpeedX>0){  
                if(Math.abs(ballSpeedY*moveingPaddleSpeedConst) > ballMinSpeedY){
                    ballSpeedY = -Math.abs(ballSpeedY)*moveingPaddleSpeedConst;
                    ballSpeedX = Math.sqrt(vSq - ballSpeedY*ballSpeedY);
                }else{
                    ballSpeedY = -Math.abs(ballSpeedY);
                }              
            }else if(ballSpeedX<0){
                if(Math.abs(ballSpeedX*moveingPaddleSpeedConst) > ballMinSpeedX){
                    ballSpeedX = ballSpeedX*moveingPaddleSpeedConst;
                    ballSpeedY= -Math.sqrt(vSq - ballSpeedX*ballSpeedX);
                }else{
                    ballSpeedY = -Math.abs(ballSpeedY);
                }              
            }        
        }else if (paddleMoveDirection === 'right'){
            if(ballSpeedX>0){
                if(Math.abs(ballSpeedX*moveingPaddleSpeedConst) > ballMinSpeedX){
                    ballSpeedX = ballSpeedX*moveingPaddleSpeedConst;
                    ballSpeedY= -Math.sqrt(vSq - ballSpeedX*ballSpeedX);
                }else{
                    ballSpeedY = -Math.abs(ballSpeedY);
                }             
            }else if(ballSpeedX<0){
                if(Math.abs(ballSpeedY*moveingPaddleSpeedConst) > ballMinSpeedY){
                    ballSpeedY = -Math.abs(ballSpeedY)*moveingPaddleSpeedConst;
                    ballSpeedX = -Math.sqrt(vSq - ballSpeedY*ballSpeedY);
                }
                ballSpeedY = -Math.abs(ballSpeedY);              
            }
        }else{
            ballSpeedY = -Math.abs(ballSpeedY);
        }        
        updateBall({speedX: ballSpeedX, speedY: ballSpeedY});
        return;
    }
    //Paddle Left-Top
    if(rightX.isBetween(paddleX, paddleX+paddleWidth) && rightY.isBetween(paddleY, paddleY+paddleHeight/2)){
        ballSpeedX = -Math.abs(ballSpeedX);
        ballSpeedY = -Math.abs(ballSpeedY);
        updateBall({speedX: ballSpeedX, speedY: ballSpeedY});
        return;
    }
    
    //Paddle Right-Top
    if(leftX.isBetween(paddleX, paddleX+paddleWidth) && leftY.isBetween(paddleY, paddleY+paddleHeight/2)){
        ballSpeedX = Math.abs(ballSpeedX);
        ballSpeedY = -Math.abs(ballSpeedY);
        updateBall({speedX: ballSpeedX, speedY: ballSpeedY});
        return;
    }

    //Paddle Left-Bottom
    if(rightX.isBetween(paddleX, paddleX+paddleWidth) && rightY.isBetween( paddleY+paddleHeight/2, paddleY+paddleHeight)){
        ballSpeedX = -Math.abs(ballSpeedX);
        ballSpeedY = Math.abs(ballSpeedY);
        updateBall({speedX: ballSpeedX, speedY: ballSpeedY});
        return;
    }

    //Paddle Right-Bottom
    if(leftX.isBetween(paddleX, paddleX+paddleWidth) && leftY.isBetween(paddleY+paddleHeight/2, paddleY+paddleHeight)){
        ballSpeedX = Math.abs(ballSpeedX)
        ballSpeedY = Math.abs(ballSpeedY)
        updateBall({speedX: ballSpeedX, speedY: ballSpeedY});
        return;
    }

    //Brick Collisions
    const bricks = getBricks();
    for(let i = 0; i< bricks.length; i++){
        const brick = bricks[i];

        const brickLeft = brick.left;
        const brickTop = brick.top;
        const brickRight = brickLeft + brick.width;
        const brickBottom = brickTop + brick.height;

        //Bottom hit
        if(topX.isBetween(brickLeft, brickRight) && topY.isBetween(brickTop, brickBottom) && ballSpeedY<0){            
            ballSpeedY = Math.abs(ballSpeedY);
            updateBall({speedY: ballSpeedY});
            handleBrickCollision(brick);
            return;         
        }

        //Top hit
        if(bottomX.isBetween(brickLeft, brickRight) && bottomY.isBetween(brickTop, brickBottom) && ballSpeedY > 0){
            ballSpeedY = -Math.abs(ballSpeedY);
            updateBall({speedY: ballSpeedY});
            handleBrickCollision(brick);
            return;    
        }

        //Left hit
        if(rightX.isBetween(brickLeft, brickRight) && rightY.isBetween(brickTop, brickBottom) && ballSpeedX > 0){
            ballSpeedX = -Math.abs(ballSpeedX);
            updateBall({speedX: ballSpeedX});
            handleBrickCollision(brick);
            return;    
        }

        //Right hit
        if(leftX.isBetween(brickLeft, brickRight) && leftY.isBetween(brickTop, brickBottom) && ballSpeedX < 0){
            ballSpeedX = Math.abs(ballSpeedX);
            updateBall({speedX: ballSpeedX});
            handleBrickCollision(brick);
            return;  
        }
    }
}

const ballIsOutHandler = () => {    
    
    pauseTimer();

    const lives = getLives();
    if(lives < 2){        
        //Game Over
        updateBall({visibility: false});
        renderBall({...getBall()});   
        setGameState(gameStateGameOver);
        setMessage({title: 'Game Over', body: 'Press SPACE to play again'});
    }else{        
        setGameState(gameStateReady);
        setLives(lives - 1);   
        
        setMessage({title: 'Lost a life', body: 'Press SPACE to play'});

        let paddleData = getPaddle();
        paddleData.src = paddleImagesSource[getLives() - 1];
        updatePaddle({...paddleData});

        let ballData = getBall();
        ballData.top = paddleData.top - ballData.size;
        ballData.speedX = defaultSpeedX;
        ballData.speedY = defaultSpeedY;
        updateBall({...ballData});      
    }

    renderMessage(getMessage());   
}

const handleBrickCollision = (brick) => {
    
    const hits = brick.hits;

    if(hits !== undefined){
        if(hits>1){
            updateBrick({...brick, hits: hits-1});
        }else{
            removeBlockFromModel(brick.id);
            removeBlockFromDOM(brick.id);
        }
      
        setScore(getScore() + 1);
        
        const score = getScore();
        renderScore(score);
        
        const maxScore = getMaxScore(getLevel());

        if(maxScore === score){

            pauseTimer();
           //Set Next Level 
            if(getLevel() + 1 > numberOfLevels){
                setGameState(gameStateWin);
                setMessage({title: 'You Win!!!', body: 'Press SPACE to play again'});
                renderMessage(getMessage());
            }else{
                getBricks().forEach(b =>
                    {   
                        removeBlockFromModel(b.id);
                        removeBlockFromDOM(b.id);
                    }                   
                );
                setLevel(getLevel() + 1);
                const level = getLevel();
                renderLevel(level);
    
                setMessage({title: 'Next Level', body: 'Press SPACE to play'});
                renderMessage(getMessage());
    
                const paddleData = getPaddle();
                updatePaddle({left: (playBoardWidthPx - paddleData.width)/2});
    
                const ballData = getBall();
                updateBall({top: paddleData.top - ballData.size, speedX: defaultSpeedX, speedY: defaultSpeedY});
                
                const bricks = getBricks();
                if(bricks){
                    bricks.forEach(brick => renderBlock(brick));
                }   
                setGameState(gameStateReady);
            }
        }
    }
}

const startTimer = () => {
    if(interval) return;
    interval = setInterval(() => {
        const seconds = getElapsedSeconds();
        setElapsedSeconds(seconds + 1);
        renderElapsedSeconds(seconds + 1);
    },1000);
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

startGame();