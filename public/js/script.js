import Gameboard from './Gameboard.js';
import { selectInput } from './select.js';

let inputWidth = document.getElementById('gridWidth');
let inputHeight = document.getElementById('gridHeight');

let gridWidth = inputWidth.value;
let gridHeight = inputHeight.value;

inputWidth.addEventListener('click', selectInput.bind(inputWidth));
inputHeight.addEventListener('click', selectInput.bind(inputHeight));

let gameboard = new Gameboard(gridWidth,gridHeight);
gameboard.attachTo('#app');

inputWidth.addEventListener('change', gameboard.updateGrid);
inputHeight.addEventListener('change', gameboard.updateGrid);