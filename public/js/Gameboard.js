import Tile from './Tile.js';
import {CASE_BLUE, CASE_GREEN, CASE_RED, CASE_ORANGE, CASE_EMPTY} from './Constants.js'

const ANIM_TIME = 500;

export default class Gameboard  {

    constructor(w = 10, h = 10){
        this.init(w, h);
    }

    init(w, h){
        this.width = parseInt(localStorage.getItem('gridWidth')) || parseInt(w);
        this.height = parseInt(localStorage.getItem('gridHeight')) || parseInt(h);
        this.grid = [];
        this.emptyTiles = this.width * this.height;
        this.event;
        this.npc = [CASE_BLUE, CASE_GREEN, CASE_ORANGE];
        this.inputHeight = undefined;
        this.inputWidth = undefined;  
        this.controlsElement = undefined;
        this.controlsSelector = undefined;
        this.scoreElement = undefined;
        this.createGrid();
    }

    /**
     * Create the grid to be used in the game.
     */
    createGrid(){
        for(var i = 0 ; i < this.width * this.height ; i++){
            this.grid[i] = new Tile(i);
        }
    }

     /**
      * Display the dom grid in the defined selector element.
      * 
      * @param selector  the selector you would use to get the element in querySelector (ex : "#app" or ".game")
      */
    attachTo(selector){
        let domGrid = document.querySelector(selector);
        domGrid.innerHTML = "";
        domGrid.classList.add('grid');
        domGrid.style.display = "flex";
        domGrid.style.flexWrap = "wrap";

        if(domGrid === undefined)
            throw new ReferenceError("Selector not valid. Can't display grid.");

        this.element = domGrid;

        this.spawnGrid(this.element);

        this.generateGridStyle();
        this.event = this.tileClickEvent.bind(this);
        this.element.addEventListener('click', this.event);        
    }

    /**
     * Create markup for the grid and append it to the element parameter
     * 
     * @param {*} grid 
     */
    spawnGrid(grid){
        grid.innerHTML = "";
        this.grid.forEach(e => {
            grid.appendChild(e.node);           
        });
    }

    attachControls(selector){
        let domControls = document.querySelector(selector);
        domControls.innerHTML = "";
        domControls.classList.add('controls');

        if(domControls === undefined)
            throw new ReferenceError("Selector not valid. Can't display controls.");

        this.controlsElement = domControls;

        let defaultWidth = localStorage.getItem('gridWidth') || 10;
        let defaultHeight = localStorage.getItem('gridHeight') || 10;

        this.controlsSelector = selector;
        this.controlsElement.innerHTML = this.generateControlsMarkup(defaultWidth, defaultHeight);
        this.scoreElement = document.querySelector('#score');

        this.inputWidth = document.querySelector('#gridWidth');
        this.inputWidth.addEventListener('click', function(){ this.setSelectionRange(0, this.value.length) }.bind(this.inputWidth));
        this.inputWidth.addEventListener('change', () => this.updateGrid());

        this.inputHeight = document.querySelector('#gridHeight');
        this.inputHeight.addEventListener('click', function(){ this.setSelectionRange(0, this.value.length) }.bind(this.inputHeight));
        this.inputHeight.addEventListener('change', () => this.updateGrid());
    }

    /**
     * Event triggered when tile is clicked
     * 
     * @param e ClickEvent 
     */
    tileClickEvent(e){
        const tile = e.target;
        const index = parseInt(tile.dataset.index);
        
        // Player 1
        this.propagateTeam(index, CASE_RED);
        // Npcs
        this.npc.forEach(color => {
            this.playAI(color);
        });

        this.element.removeEventListener('click', this.event);
    }

    /**
     * Recursive function propagating a color in the grid
     * 
     * @param index 
     * @param color 
     */
    propagateTeam(index, color){

        if(index < 0)
            return;

        if(index > (this.width * this.height) - 1)    // -1 because, array indexes...
            return;
            
        if(this.grid[index].value !== CASE_EMPTY)
            return;

        this.grid[index].changeTeam(color);
        this.emptyTiles--;
        
        setTimeout(() => {
                
            this.propagateTeam(index - this.width, color);
            this.propagateTeam(index + this.width, color);
            
            if((index % this.width) + 1 == (index+1) % this.width)
                this.propagateTeam(index + 1, color);            
            
            if((index % this.width) - 1 == (index-1) % this.width)
                this.propagateTeam(index - 1, color);

        }, ANIM_TIME);
        
        if(this.emptyTiles === 0)
            if(this.scoreElement !== undefined)
                this.displayScore();       
            else
                throw new ReferenceError("Selector not defined. Can't display score.");
    }

    /**
     * AI plays
     */
    playAI(color){
        const total = this.grid.length;
        let start = this.getRandomInt(total);
        while(this.grid[start].value === 1)
            start = this.getRandomInt(total);
        
        this.propagateTeam(start, color);
    }

    /**
     * Get a random number from 0 to total
     * 
     * @param max Maximum number in the range
     */
    getRandomInt(max){
        return Math.floor(Math.random() * Math.floor(max));
    }

    /**
     * Dynamically create the style for the grid from the selector
     */
    generateGridStyle(){
        let style = document.createElement('style');
        style.type = "text/css";

        let styles = ".tile{flex: 0 1 " + 100 / this.width + "%; }";
        styles += ".grid{ display:flex; flex-wrap:wrap; width:90vmin; height:90vmin; }";

        style.appendChild(document.createTextNode(styles));
        this.element.appendChild(style);
    }

    /**
     * Generate the markup for the grid controls
     */
    generateControlsMarkup(w, h){
        return `<h2>Controls</h2>
                <div id="choice">
                    <input id="gridWidth" value="${w}"> X <input id="gridHeight" value="${h}">
                </div>
                <div id="score"></div>`;
    }

    displayScore(){
        let colors = [0, 0];
        this.npc.forEach(c => colors[c] = 0);
        this.grid.forEach(x => colors[x.value]++);

        const total = colors.reduce((acc, cur) => acc + cur);
        if( total != this.width * this.height)
            throw new RangeError('Displayed tile count does not match system tile count');

        let output = "";
        const players = new Map();
        players.set("Red", colors[1]);
        players.set("Blue", colors[2]);
        players.set("Green", colors[3]);
        players.set("Orange", colors[4]);

        let it = players.entries();
        let result = it.next();
        while(!result.done){
            output += `<p 
                            class='player_row' 
                            style='--color: ${result.value[0].toLowerCase()}'>
                        ${result.value[0]} : ${result.value[1]}
                        </p>`;            
            result = it.next();
        }
        this.scoreElement.innerHTML = output;
        
    }

    updateGrid(){
        
        if(this.inputWidth.value <= 3)
            this.inputWidth.value = 4;
    
        if(this.inputHeight.value <= 3)
            this.inputHeight.value = 4;

        this.width = parseInt(this.inputWidth.value);
        this.height = parseInt(this.inputHeight.value);

        this.event = this.tileClickEvent.bind(this);
        this.element.removeEventListener('click', this.event); 

        this.grid = [];        
        this.emptyTiles = this.width * this.height;
        this.createGrid();
        this.spawnGrid(this.element);
        this.generateGridStyle();
        
        this.event = this.tileClickEvent.bind(this);
        this.element.addEventListener('click', this.event);

        this.scoreElement.innerHTML = "";
    
        localStorage.setItem('gridWidth', this.width);
        localStorage.setItem('gridHeight', this.height);
    }
}