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

        enabled: false,

        displayIconID: null,
        savedIndex: -1,
        originContainer: null,
        
        iconRef: null,
        
        isDraggingEvent: false,
        transitionName: '',

        displayIconData:{
            iconColour: "#000000",
            iconSize: "100",
            iconImage: "",
            viewBox: "", 
        },

        mouseHoverContainerType: ""
    }}

    get allData(){ return this.data; };

// Initializer on click

    initDragDrop(event, index, iconID, containerID, containerType){

        var runFnc = false;
        this.m_draggableFnc = setTimeout(() => { 
            // Checks if the current mouse hover is over the same element
            document.querySelectorAll( ":hover" ).forEach(el => {
                if(el == event.target){ runFnc = true; return;}
            });
            
            if(!runFnc){ return; }

            // Dragging event to for the icon to follow the mouse.

            this.data.enabled = true;
            this.data.displayIconID = iconID;
            this.data.isDraggingEvent = true;
            this.data.savedIndex = index;

            this.updateMouseDragType(containerType);
            this.setIconCSSHandler(containerType,`success`);

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
            this.updateIconDragPosition(event.clientX, event.clientY); 
        }, 125);
    }
    // The CSS this handles is found in IconDragHandler.vue
    setIconCSSHandler(type, success){
        console.log(`${type.toLowerCase()}-type-${success}`, "value");
        this.setTransitionName(`${type.toLowerCase()}-type-${success}`);
    }

// Mouse Event

    // Updates position of dragged icon.
    drag_Move(){ 
        this.updateIconDragPosition(mouseData.Coordinates.x, mouseData.Coordinates.y);
    }

    drag_End(){
        this.data.enabled = false;
        this.data.isDraggingEvent = false;
        this.data.displayIconID  = null;
        this.data.savedIndex = -1;

        mouseData.disableTracking();
        mouseData.disableMouseUp();
    }

// Updaters

    updateIconDragPosition(x, y){

        this.data.iconRef.style.left = x - ( this.data.displayIconData.iconSize / 2 ) + 'px';
        this.data.iconRef.style.top  = y - ( this.data.displayIconData.iconSize / 2 ) + 'px';
    }

    // Only updates when the value has changed
    updateMouseDragType(type){
        if(this.data.mouseHoverContainerType != type){
            if(type == "Storage") { this.data.mouseHoverContainerType = "GRID"};
            this.data.mouseHoverContainerType = type;
        }
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
    setIconRef(ref){ this.data.iconRef = ref; }

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

    get enabled()    { return this.data.enabled; }
    get isDraggingEvent(){ return this.data.isDraggingEvent; }
    get iconColour() { return this.data.displayIconData.iconColour; }
    get iconImage()  { return this.data.displayIconData.iconImage; }
    get iconSize()   { return this.data.displayIconData.iconSize; }
    get viewBox()    { return this.data.displayIconData.viewBox; }
    get transitionName() { return this.data.transitionName; }
    get mouseHoverContainerType(){ return this.data.mouseHoverContainerType; }
    get isHoverGrid() { return (this.data.mouseHoverContainerType === "GRID"); }
    get isHoverList() { return (this.data.mouseHoverContainerType === "LIST"); }
}

const dragAndDropInstance = new dragAndDropClass;
export const dragAndDrop = reactive(dragAndDropInstance);