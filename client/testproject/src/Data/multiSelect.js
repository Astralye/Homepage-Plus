import { reactive } from 'vue'

export class MultiSelect{
    constructor(){ this.init(); }

    init(){
        this.data ={

            // General Data
            isEnabled: false,
            isValidDrag: true,
    
            // Top left corner
            startLocation: {
                x: 0,
                y: 0,
            },
    
            width: 0,
            height: 0,
    
            XdirectionRight: false,
            YdirectionBottom: false,
            
        // AABB, axis aligned bounding box.
    
            // Due to the transform the coordinates change
            topLeftCoord:{
                minX: 0,
                minY: 0,
                maxX: 0,
                maxY: 0,
            },
            
            // This stores all the displayed icons in grid and list to be checked
            // if their axes are aligned. 
            allIcons: [],
        }
    }
    
// Bounding boxes
    allIconDataSetter(bounds, index, collisionFnc){

        let maxBounds = {
            minX: bounds.x,
            minY: bounds.y,
            maxX: bounds.x + bounds.width,
            maxY: bounds.y + bounds.height,
        }

        this.data.allIcons.push({
            index: index,
            bounds: maxBounds,
            collision: false,
            collFnc: collisionFnc,
        })
    }

    // Collision detection for every icon in the list.
    selectionBoundingBox(){
        this.data.allIcons.forEach(renderedElement => {
            renderedElement.collision = this.intersect(this.data.topLeftCoord, renderedElement.bounds, );

            // Run the function with the index as the parameter
            renderedElement.collFnc.apply(null, [renderedElement.index, renderedElement.collision]);
        });
    }

    // AABB intersection
    intersect(a, b){
        return (
            a.minX <= b.maxX &&
            a.maxX >= b.minX &&
            a.minY <= b.maxY &&
            a.maxY >= b.minY
        );
    }

    isIconIDSelected(iconID){
        for(let i = 0; i < this.data.allIcons.length; i++){
            console.log(this.data.allIcons[i].id);
            if(this.data.allIcons[i].id === iconID){
                return true;
            }
        }

        return false;
    }

// Base functions

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

    setStartLocation(x,y){ 
        this.data.startLocation.x = x;
        this.data.startLocation.y = y;
    }

    setMaxBounds(){
        this.data.topLeftCoord.maxX = this.data.topLeftCoord.minX + this.data.width;
        this.data.topLeftCoord.maxY = this.data.topLeftCoord.minY + this.data.height;
    }

    setTopLeftCoord(x, y){
        this.data.topLeftCoord.minX = x;
        this.data.topLeftCoord.minY = y;
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

    get TLBounds(){ return this.data.topLeftCoord; }
    get iconArray(){ return this.data.allIcons; }
}

export class ContextMenu{
    constructor(){ this.data ={
        isEnabled: false,

        intiLocation: {
            x: 0,
            y: 0,
        },

        width: 0,
        height: 0,
    }}

    // Setters
    enable(){ this.data.isEnabled = true; }
    disable(){ this.data.isEnabled = false; }

    resetStartLocation(){ this.setStartLocation(0,0); }
    setStartLocation(x,y){ 
        this.data.intiLocation.x = x;
        this.data.intiLocation.y = y;
    }

    // Getter
    get isEnabled(){ return this.data.isEnabled; }
    
    get x(){ return this.data.intiLocation.x; }
    get y(){ return this.data.intiLocation.y; }
}

const contextMenuInstance = new ContextMenu;
const multiSelectInstance = new MultiSelect;

export const contextMenu = reactive(contextMenuInstance);
export const multiSelect = reactive(multiSelectInstance);