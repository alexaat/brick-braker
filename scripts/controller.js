
import { getWalls } from "./model.js";
import {renderBlock} from "./view.js";

const setUp = () => {
    const walls = getWalls();
    walls.forEach(block => {
        renderBlock(block);
    });
}

const updateScreen = () => {

}

const startGame = () => {
    setUp();   
    requestAnimationFrame(run);
}

const run = () => {
    //updateScreen();
    requestAnimationFrame(run);
}
startGame();


