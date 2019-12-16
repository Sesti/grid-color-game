import Gameboard from './Gameboard.js';

let gameboard = new Gameboard();
gameboard.attachTo('#grid');
gameboard.attachControls('#controls');

// Testing
window.gameboard = gameboard;