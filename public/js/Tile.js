const CASE_EMPTY = 0;
const CASE_RED = 1;
const CASE_BLUE = 2;

export default class Tile{
    constructor(){
        this.value = CASE_EMPTY;
        this.node = document.createElement("div");
        this.node.classList.add("tile");
    }

    changeTeam(color){
        if(typeof parseInt(color) !== "number")
            throw new TypeError("You must put a number as argument");
        
        this.value = color;

        if(color === CASE_RED)
            this.node.style.backgroundColor = "red";
        else if(color === CASE_BLUE)
            this.node.style.backgroundColor = "blue";
    }
}