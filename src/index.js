import './css/style.css';
import Sapper from './js/Sapper';

const sapper = new Sapper({
    totalMines: 15,
    fieldWidth: 15,
    fieldHeight: 10,
    fieldSelector: '#field',
    timerSelector: '#timer',
    movesSelector: '#moves',
    images: {
        grass: './images/grass.png',
        bombFlag: './images/bomb-flag.png',
        bomb: './images/bomb.png',
        bombFail: './images/bomb-fail.png'
    }
});

sapper.init();

document.getElementById('restartButton').addEventListener('click', () => {
    sapper.restartGame();
});
