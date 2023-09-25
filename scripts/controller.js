
import { level1 } from "../levels/level1.js";
import { ballSize,
         gameStateReady,
         gameStatePaused,
         gameStateGameOver,
         gameStateRunning,
         paddleImagesSource,
         defaultSpeedX,
         defaultSpeedY,
         gameStateWin } from "./constants.js";
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
         numberOfLevels
        } from "./model.js";
import {renderBlock, renderPlayBoard, renderPaddle, renderBall, renderMessage, removeBlockFromDOM, renderScore, renderLevel} from "./view.js";


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
        ballData = checkCollisions({ballData, paddleData, playBoardWidthPx, playBoardHeightPx});        
        updateBall({...ballData});
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
            setMessage('');
            renderMessage(getMessage());
            return;
        }
        if(gameState === gameStateRunning){
            setGameState(gameStatePaused);
            setMessage('Paused');
            renderMessage(getMessage());
            return;
        }
        if(gameState === gameStateGameOver){
            
            setGameState(gameStateReady);
            setMessage('Press SPACE to play')
            renderMessage(getMessage());
          
            setLives(3);

            const paddleData = getPaddle();
            updatePaddle({left: (playBoardWidthPx - paddleData.width)/2, src: paddleImagesSource[getLives()-1]});

            const ballData = getBall();
            updateBall({top: paddleData.top - ballData.size, visibility: true, speedX: defaultSpeedX, speedY: defaultSpeedY});

            setLevel(1);
            renderLevel(getLevel());

            setScore(0);
            renderScore(getScore());

            getBricks().forEach(b => removeBlockFromDOM(b.id));
            
            resetLevels();

            getBricks().forEach(brick => renderBlock(brick));

            return;
        }
        
    }
    if(key === 'Escape'){

    }
}

const checkCollisions = ({ballData, paddleData, playBoardWidthPx, playBoardHeightPx}) => {

    const ballX = ballData.left + ballData.speedX;
    const ballY = ballData.top + ballData.speedY;
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
    }
    //Top hit
    if(ballY<0){
        ballSpeedY = Math.abs(ballSpeedY);       
    }
    //Right hit
    if (ballX>playBoardWidthPx-ballSize) {   
        ballSpeedX = -Math.abs(ballSpeedX);
    }
    if (ballY > playBoardHeightPx - ballSize){
        return ballIsOutHandler();
        //return {...ballData, left: ballX, top: ballY, speedX: ballSpeedX, speedY: ballSpeedY, visibility: true};       
    }  

    //Paddle collisions    
    //Puddle top
    if(ballX.isBetween(paddleX, paddleX+paddleWidth) && ballY>paddleY-ballSize){
        ballSpeedY = -Math.abs(ballSpeedY);
        return {...ballData, left: ballX, top: ballY, speedX: ballSpeedX, speedY: ballSpeedY};
    }
    //Paddle Left-Top
    if(rightX.isBetween(paddleX, paddleX+paddleWidth) && rightY.isBetween(paddleY, paddleY+paddleHeight/2)){
        ballSpeedX = -Math.abs(ballSpeedX);
        ballSpeedY = -Math.abs(ballSpeedY);
        return {...ballData, left: ballX, top: ballY, speedX: ballSpeedX, speedY: ballSpeedY};
    }
    
    //Paddle Right-Top
    if(leftX.isBetween(paddleX, paddleX+paddleWidth) && leftY.isBetween(paddleY, paddleY+paddleHeight/2)){
        ballSpeedX = Math.abs(ballSpeedX);
        ballSpeedY = -Math.abs(ballSpeedY);
        return {...ballData, left: ballX, top: ballY, speedX: ballSpeedX, speedY: ballSpeedY};
    }

    //Paddle Left-Bottom
    if(rightX.isBetween(paddleX, paddleX+paddleWidth) && rightY.isBetween( paddleY+paddleHeight/2, paddleY+paddleHeight)){
        ballSpeedX = -Math.abs(ballSpeedX);
        ballSpeedY = Math.abs(ballSpeedY);
        return {...ballData, left: ballX, top: ballY, speedX: ballSpeedX, speedY: ballSpeedY};
    }

    //Paddle Right-Bottom
    if(leftX.isBetween(paddleX, paddleX+paddleWidth) && leftY.isBetween(paddleY+paddleHeight/2, paddleY+paddleHeight)){
        ballSpeedX = Math.abs(ballSpeedX)
        ballSpeedY = Math.abs(ballSpeedY)
        return {...ballData, left: ballX, top: ballY, speedX: ballSpeedX, speedY: ballSpeedY};
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
            return {...getBall()};         
        }

        //Top hit
        if(bottomX.isBetween(brickLeft, brickRight) && bottomY.isBetween(brickTop, brickBottom) && ballSpeedY > 0){
            ballSpeedY = -Math.abs(ballSpeedY);
            updateBall({speedY: ballSpeedY});
            handleBrickCollision(brick);
            return {...getBall()};    
        }

        //Left hit
        if(rightX.isBetween(brickLeft, brickRight) && rightY.isBetween(brickTop, brickBottom) && ballSpeedX > 0){
            ballSpeedX = -Math.abs(ballSpeedX);
            updateBall({speedX: ballSpeedX});
            handleBrickCollision(brick);
            return {...getBall()};    
        }

        //Right hit
        if(leftX.isBetween(brickLeft, brickRight) && leftY.isBetween(brickTop, brickBottom) && ballSpeedX < 0){
            ballSpeedX = Math.abs(ballSpeedX);
            updateBall({speedX: ballSpeedX});
            handleBrickCollision(brick);
            return {...getBall()};  
        }
    }   
   
    return {...ballData, left: ballX, top: ballY, speedX: ballSpeedX, speedY: ballSpeedY};

}

const ballIsOutHandler = () => {   
    
    const lives = getLives();
    if(lives < 2){        
        //Game Over
        updateBall({visibility: false});
        renderBall({...getBall()});   
        setGameState(gameStateGameOver);
        setMessage('Game Over. Press SPACE to play again');
    }else{        
        setGameState(gameStateReady);
        setLives(lives - 1);      

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

    return getBall();
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

           //Set Next Level 
           console.log(numberOfLevels)
            if(getLevel() + 1 > numberOfLevels){
                setGameState(gameStateWin);
                setMessage('You Win!!!');
                renderMessage(getMessage());
                console.log(getMessage());
            }else{
                getBricks().forEach(b => removeBlockFromDOM(b.id));

                setLevel(getLevel() + 1);
                const level = getLevel();
                renderLevel(level);
    
                setMessage('Press SPACE to play')
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

startGame();
