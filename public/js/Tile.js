import {CASE_BLUE, CASE_GREEN, CASE_RED, CASE_YELLOW, CASE_EMPTY} from './Constants.js'

export default class Tile{
    constructor(index){
        this.value = CASE_EMPTY;
        this.node = document.createElement("div");
        this.node.classList.add("tile");
        this.node.dataset.index = index;
        this.index = index;
    }

    changeTeam(newColor){
        if(typeof parseInt(newColor) !== "number")
            throw new TypeError("You must put a number as argument");
        
        let color;

        switch(newColor){
            case CASE_RED: color = "red"; break;
            case CASE_BLUE: color = "blue"; break;
            case CASE_GREEN: color = "green"; break;
            case CASE_YELLOW: color = "yellow"; break;
        }
        
        this.node.style.backgroundColor = color;            
        this.value = newColor;
    }
}