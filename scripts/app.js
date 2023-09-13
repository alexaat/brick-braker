import { updateScreen } from './physics.js';
import {setUp, addPlayer} from './setupScene.js';


const startGame = () => {
    setUp();
    addPlayer();
    requestAnimationFrame(run);
}

const run = () => {
    updateScreen();
    requestAnimationFrame(run);
}

startGame();


