import { reactive } from 'vue'

export class Mouse {
    constructor(){ this.data = {
        x: 0,
        y: 0,
        mouseMoveFunctions: [],
        mouseUpFunctions: [],
        mouseDownFunctions: [],
    }}
    
    get Coordinates(){ return this.data; }
    updateCoordinate(x, y){ this.data.x = x; this.data.y = y;}

// onmouseMove

    /*
        Any functions passed in will only run for that specific component
        This MUST be run first to declare any functions
        Requires an ARRAY of function calls    
    */
    movementFunctions(functionArray){ this.data.mouseMoveFunctions = functionArray; }

    enableTracking(){ 
        document.onmousemove = (event) =>{ 
            this.updateCoordinate(event.pageX, event.pageY); 
            this.data.mouseMoveFunctions.forEach(element => { element(); });
    }}

    // When enabling and disabling, remove all data to ensure safety.
    // Perhaps these take in arguments to check what to enable + disable.
    disableTracking(){ document.onmousemove = null;  this.data.mouseMoveFunctions = []; }

// onmouseUp

    mouseUpFunctions(functionArray){ this.data.mouseUpFunctions = functionArray; }
    enableMouseUp(){ document.onmouseup = (event) => { this.data.mouseUpFunctions.forEach(element => { element(); } ); }; }
    disableMouseUp(){ document.onmouseup = null;  this.data.mouseUpFunctions = []; }

// onmouseDown

    mouseDownFunctions(functionArray){  this.data.mouseDownFunctions = functionArray; }
    enableMouseDown(){ document.onmousedown = (event) => { this.data.mouseDownFunctions.forEach(element => { element(); } ); }; }
    disableMouseDown(){ document.onmousedown = null;  this.data.mouseDownFunctions = []; }

    printPosition() { console.log(`x: ${this.data.x}, y: ${this.data.y}`)};
};


const mouseInstance = new Mouse;
export const mouseData = reactive(mouseInstance);