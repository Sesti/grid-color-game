import Tile from './Tile.js';

const ANIM_TIME = 333;

export default class Gameboard  {

    constructor(w, h){
        this.width = w;
        this.height = h;
        this.grid = [];
        this.concreteGrid = [];
        this.selector = undefined;
        this.teamTurn = 1;
        this.createGrid();
    }

    /**
     * Create the grid to be used in the game.
     */
    createGrid(){
        for(var i = 0 ; i < this.width * this.height ; i++){
            this.grid[i] = new Tile;
        }
    }

     /**
      * Display the dom grid in the defined selector element.
      * 
      * @param selector  the selector you would use to get the element in querySelector (ex : "#app" or ".game")
      */
    attachTo(selector){
        let domGrid = document.querySelector(selector);
        domGrid.classList.add('grid');
        domGrid.style.display = "flex";
        domGrid.style.flexWrap = "wrap";

        if(domGrid === undefined)
            throw new ReferenceError("Selector not valid. Can't display grid.");

        this.selector = selector;
        this.element = domGrid;

        this.grid.forEach(e => {
            domGrid.appendChild(e.node);           
        });

        this.generateGridStyle();
        this.element.addEventListener('click', this.tileClickEvent.bind(this));
    }

    /**
     * Event triggered when tile is clicked
     * 
     * @param e ClickEvent 
     */
    tileClickEvent(e){
        if(this.teamTurn !== 1)
            return;

        const tile = e.target;
        const tileIndex = this.grid.flat().findIndex(e => e.node.isSameNode(tile));
        console.log("Player index : " + tileIndex);
        this.propagateTeam(tileIndex, this.teamTurn);
        this.playAI();
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

        if(index > (this.width * this.height) - 1)    // -1 because array indexes...
            return;

        if(this.grid.flat()[index].value !== 0)
            return;
        
        this.grid.flat()[index].changeTeam(color);
        
        setTimeout(() => {
            this.propagateTeam(index - this.width, color);
            this.propagateTeam(index + this.width, color);
            
            if((index % this.width) + 1 == (index+1) % this.width){
                this.propagateTeam(index + 1, color);
            }
            
            if((index % this.width) - 1 == (index-1) % this.width)
                this.propagateTeam(index - 1, color);
        }, ANIM_TIME);
        
    }

    /**
     * AI plays
     */
    playAI(){
        const total = this.grid.flat().length;
        let start = this.getRandomInt(total);
        while(this.grid[start].value === 1)
            start = this.getRandomInt(total);
        
        this.propagateTeam(start, 2);
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
}