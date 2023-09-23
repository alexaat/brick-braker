import {playBoardHeight, playBoardWidth, blockSize} from './constants.js'
const boardRight = playBoardWidth*blockSize;

export const getWalls = () => {
    const walls = [];
    for (let i = 0; i < playBoardHeight; i++) {        
        
        //div.style.left = `${-blockSize}px`;
        //div.style.top = `${i * blockSize}px`;
        
        walls.push({left: -blockSize, top: i * blockSize, width: blockSize, height: blockSize, type: 'red_block'});

    }
    for (let i = -1; i <= playBoardWidth; i++) {
        //const div = createBlock();
        //div.style.left = `${i * blockSize}px`;
        //div.style.top = `${-blockSize}px`;
        walls.push({left: i*blockSize, top: -blockSize, width: blockSize, height: blockSize, type: 'red_block'});
        //playBoard.appendChild(div);
    }
    for (let i = 0; i < playBoardHeight; i++) {
        // const div = createBlock();
        // div.style.left = `${boardRight}px`;
        // div.style.top = `${i * blockSize}px`;
        // playBoard.appendChild(div);
        walls.push({left: boardRight, top: i * blockSize, width: blockSize, height: blockSize, type: 'red_block'});
    }

    return walls;

}



