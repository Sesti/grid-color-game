import Gameboard from './Gameboard.js';
import { selectInput } from './select.js';

let defaultWidth = localStorage.getItem('gridWidth') || 10;
let defaultHeight = localStorage.getItem('gridHeight') || 10;

let inputWidth = document.getElementById('gridWidth');
let inputHeight = document.getElementById('gridHeight');

inputWidth.value = defaultWidth;
inputHeight.value = defaultHeight;

inputWidth.addEventListener('click', selectInput.bind(inputWidth));
inputHeight.addEventListener('click', selectInput.bind(inputHeight));

let gameboard = new Gameboard(inputWidth.value,inputHeight.value);
gameboard.attachTo('#grid');
gameboard.attachScore('#score');

inputWidth.addEventListener('change', updateGrid.bind(null, gameboard, "#grid", "#score"));
inputHeight.addEventListener('change', updateGrid.bind(null, gameboard, "#grid", "#score"));

function updateGrid(gameboard, selector, scoreSelector){
    if(inputWidth.value <= 3)
        inputWidth.value = 4;

    if(inputHeight.value <= 3)
        inputHeight.value = 4;
    gameboard = new Gameboard(inputWidth.value, inputHeight.value);
    gameboard.attachTo(selector);
    gameboard.attachScore(scoreSelector);

    localStorage.setItem('gridWidth', inputWidth.value);
    localStorage.setItem('gridHeight', inputHeight.value);
}