import { reactive } from 'vue'
import { editVariables } from './SettingVariables';
import { iconImageStorage } from './iconImages';
import { iconData } from './iconData';
import { mouseData } from './mouseData';
/*

    Drag and drop functionality for icons.

*/

class dragAndDropClass{
    constructor(){ this.data = {
        displayIconID: null,
        savedIndex: -1,
        originContainer: null,
        
        iconRef: null,
        locationBoundingBox: null,
        
        isDraggingEvent: false,
        transitionName: 'icon-success',

        displayIconData:{
            iconColour: "#000000",
            iconSize: "100",
            iconImage: "",
            viewBox: "", 
        },

        mouseOffset:{
            x: 0,
            y: 0,
        },
    }}

    get allData(){ return this.data; };

// Initializer on click

    initDragDrop(event, index, iconRef, iconID, containerID){

        var runFnc = false;
        this.m_draggableFnc = setTimeout(() => { 
            // Checks if the current mouse hover is over the same element
            document.querySelectorAll( ":hover" ).forEach(el => {
                if(el == event.target){ runFnc = true; return;}
            });
            
            if(!runFnc){ return; }

            // Dragging event to for the icon to follow the mouse.

            this.data.displayIconID = iconID;
            this.data.iconRef = iconRef;
            this.data.isDraggingEvent = true;
            this.data.savedIndex = index;
            this.setTransitionName('icon-success');

            // // Stores the icon that is being dragged
            // // Used to transfer data between containers
            editVariables.setIconDragData({
                storedContainer:  containerID,
                storedID: iconID,
            });

            // // Set mouse functions
            mouseData.movementFunctions ([ "drag_Move" ]);
            mouseData.mouseUpFunctions  ([ "drag_End" ]);
            mouseData.useObject(this);
            
            mouseData.enableTracking();
            mouseData.enableMouseUp();
            
            // // Initalizers
            this.setSVGDragData();
            this.initIconDragPosition(event.clientX, event.clientY);
        }, 125);
    }

    // Initialize position of offset of mouse by top left corner of icon. 
    initIconDragPosition(initX, initY){

        this.setMouseOffset(initX, initY);
        this.updateIconDragPosition(initX, initY); // This value will always be constant at the start
    }

    // Mouse offset for icon dragging to prevent snapping.
    setMouseOffset(x,y){
        
        if(!this.locationBoundingBox) return; 

        // // grid item is the coordinates of the container, an offset is added to put it at the center
        let gridXoffset = this.locationBoundingBox.x  + (this.locationBoundingBox.width  / 5);
        let gridYoffset = this.locationBoundingBox.y  + (this.locationBoundingBox.height / 5);

        // // mouseOffset is the difference in px from the mouse to the grid offset.
        // // Used to prevent snapping of top left corner to mouse.
        this.data.mouseOffset.x = x - gridXoffset;
        this.data.mouseOffset.y = y - gridYoffset;
    }


// Mouse Event

    // Updates position of dragged icon.
    drag_Move(){ 
        this.updateIconDragPosition(mouseData.Coordinates.x, mouseData.Coordinates.y); 
    }

    drag_End(){
        this.data.isDraggingEvent = false;
        this.data.displayIconID  = null;
        this.data.savedIndex = -1;

        mouseData.disableTracking();
        mouseData.disableMouseUp();
    }

// Updaters

    updateIconDragPosition(x, y){
        this.data.iconRef['draggingIcon'].style.left = x - this.data.mouseOffset.x + 'px';
        this.data.iconRef['draggingIcon'].style.top  = y - this.data.mouseOffset.y + 'px';
    }

    resetTimer(){
        clearTimeout(this.m_draggableFnc);
    }

// Data retrieval

// Boolean

    isStoredIndex(index){ return (this.data.savedIndex === index); }
    isOriginalContainer(groupID){ return (this.data.originContainer === groupID); }
    
    isSavedIcon(index, groupID){ return (this.isStoredIndex(index) && this.isOriginalContainer(groupID)); }

// Setter

    setContainerOrigin(str){ this.data.originContainer = str; }
    setTransitionName(name){ this.data.transitionName = name; }
    setLocationBounds(inputRef){ this.locationBoundingBox = inputRef; }

    setIconData(colour="#000000", size="100", image="", viewBox=""){
        this.data.displayIconData = {
            iconColour: colour,
            iconSize: size,
            iconImage: image,
            viewBox: viewBox, 
        }
    }

    setSVGDragData(){
        let svgData = this.storedIconData;

        if(svgData){
            this.setIconData(
                svgData.iconColour,
                svgData.iconSize,
                iconImageStorage.getPathData(svgData.iconImage),
                iconImageStorage.getViewBoxName(svgData.iconImage),
            )
        }
    }

// Getter
    
    get storedIconData(){
        if(!editVariables.iconDragData || !this.data.displayIconID){ return null; } // Requires data

        let group = iconData.getGroup(editVariables.iconDragData.storedContainer);
        return iconData.getIconDataFromID(group, this.data.displayIconID);
    }

    get isDraggingEvent(){ return this.data.isDraggingEvent; }
    get iconColour() { return this.data.displayIconData.iconColour; }
    get iconImage()  { return this.data.displayIconData.iconImage; }
    get iconSize()   { return this.data.displayIconData.iconSize; }
    get viewBox()    { return this.data.displayIconData.viewBox; }
    get transitionName() { return this.data.transitionName; }
}

const dragAndDropInstance = new dragAndDropClass;
export const dragAndDrop = reactive(dragAndDropInstance);