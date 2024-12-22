import { reactive } from 'vue'

export class MultiSelect{
    constructor(){ this.data ={
        isEnabled: false,

        isValidDrag: true,

        startLocation: {
            x: 0,
            y: 0,
        },

        width: 0,
        height: 0,

        XdirectionRight: false,
        YdirectionBottom: false,
    }}
    
    // Setters
    enable(){ this.data.isEnabled = true; }
    disable(){ this.data.isEnabled = false; }

    setBoxDimensions(mousePosX, mousePosY){

        let width = this.data.startLocation.x - mousePosX;
        let height = this.data.startLocation.y - mousePosY;

        this.data.XdirectionRight =  ( width >= 0);
        this.data.YdirectionBottom = ( height >= 0);

        this.setWidth (Math.abs(width));
        this.setHeight(Math.abs(height));
    }

    // This is set when within dragdrop.
    // It is set to false in a drag event 
    setValidDrag(val){ this.data.isValidDrag = val; }

    setWidth(val) { this.data.width = val; }
    setHeight(val){ this.data.height = val; }

    resetStartLocation(){ this.setStartLocation(0,0); }
    setStartLocation(x,y){ 
        this.data.startLocation.x = x;
        this.data.startLocation.y = y;
    }
    
    // Getter
    get isEnabled(){ return this.data.isEnabled; }
    get isValidDrag(){ return this.data.isValidDrag;}

    get x(){ return this.data.startLocation.x; }
    get y(){ return this.data.startLocation.y; }
    get width() { return this.data.width; }
    get height(){ return this.data.height; }

    get isInverseX(){ return this.data.XdirectionRight; }
    get isInverseY(){ return this.data.YdirectionBottom; }
}

const multiSelectInstance = new MultiSelect;
export const multiSelect = reactive(multiSelectInstance);