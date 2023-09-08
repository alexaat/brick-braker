import { updateBallPosition } from './ballPhysics.js';
import {setUp, addPlayer} from './setupScene.js';


const startGame = () => {
    setUp();
    addPlayer();
    requestAnimationFrame(run);
}

const run = () => {
    updateBallPosition();

    requestAnimationFrame(run);
}

startGame();


