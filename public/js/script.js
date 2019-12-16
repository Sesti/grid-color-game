import Gameboard from './Gameboard.js';
import { selectInput } from './select.js';

let inputWidth = document.getElementById('gridWidth');
let inputHeight = document.getElementById('gridHeight');

inputWidth.addEventListener('click', selectInput.bind(inputWidth));
inputHeight.addEventListener('click', selectInput.bind(inputHeight));

let gameboard = new Gameboard(inputWidth.value,inputHeight.value);
gameboard.attachTo('#grid');
gameboard.attachScore('#score');

inputWidth.addEventListener('change', updateGrid.bind(null, gameboard, "#grid", "#score"));
inputHeight.addEventListener('change', updateGrid.bind(null, gameboard, "#grid", "#score"));

function updateGrid(gameboard, selector, scoreSelector){
    console.log(gameboard, selector, inputWidth.value, inputHeight.value);
    gameboard = new Gameboard(inputWidth.value, inputHeight.value);
    gameboard.attachTo(selector);
    gameboard.attachScore(scoreSelector);
}