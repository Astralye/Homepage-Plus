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
        
        dragWrapRef: null,
        
        isDraggingEvent: false,
        transitionName: '',

        displayIconData:{
            iconColour: "#000000",
            iconSize: "0",
            iconImage: "",
            viewBox: "", 
        },

        iconBounds: null,

        mouseHoverContainerType: "",
    }}

    get allData(){ return this.data; };

// Initializer on click

    initVariables(iconID, containerID, type){
        editVariables.setIconDragData({
            storedContainer:  containerID,
            storedID: iconID,
        });

        this.setTransitionName("");
        this.setDisplayIcon(iconID);
        this.setContainerOrigin(containerID);
        this.updateContainerType(type);
        this.setSVGDragData();
    }
    
    /*
        Initializer for drag and drop event
        Timeout makes the user wait a certain time before dragging.
        Also defines what makes a drag and a click
        
        Initializer that requires bounding box and has to be run later.
    */

    initDragDrop(event, index, containerType, test){

        // Save the icon bounds. When the timer has gone, the bounding box has been changed
        // Requires a copy to be used.
        this.data.iconBounds = structuredClone(this.data.dragWrapRef.getBoundingClientRect());

        // Dragging functionality only works after a period of time holding the icon.
        this.m_draggableFnc = setTimeout(() => {

            // Run only if the mouse is still on the element
            document.querySelectorAll( ":hover" ).forEach(el => {
                if(el == event.target){ return;}
            });

            this.data.enabled = true;
            this.data.isDraggingEvent = true;
            this.data.savedIndex = index;

            this.setIconCSSHandler(containerType,`success`);

            // Set mouse functions
            mouseData.movementFunctions ([ "drag_Move" ]);
            mouseData.mouseUpFunctions  ([ "drag_End" ]);
            mouseData.useObject(this);
            
            mouseData.enableTracking();
            mouseData.enableMouseUp();
            
            // Make the drag icon visible again 
            this.setVisibility("visible");

            // Update the coordinates.
            this.updateIconDragPosition(event.clientX, event.clientY);
        }, 125);
    }

    // The CSS this handles is found in IconDragHandler.vue
    setIconCSSHandler(type, success){
        // console.log(`${type.toLowerCase()}-type-${success}`, "value");
        this.setTransitionName(`${type.toLowerCase()}-type-${success.toLowerCase()}`);
    }

// Mouse Event

    // Updates position of dragged icon.
    drag_Move(){ 
        this.updateIconDragPosition(mouseData.Coordinates.x, mouseData.Coordinates.y);
    }

    // Resets the variables on end.
    drag_End(){
        this.data.enabled = false;
        this.data.isDraggingEvent = false;
        this.setDisplayIcon(null);
        this.data.iconBounds = null;
        this.data.savedIndex = -1;

        mouseData.disableTracking();
        mouseData.disableMouseUp();
    }

// Updaters

    updateIconDragPosition(x, y){

        if(this.isHoverGrid){
            let initial = this.data.iconBounds.width / 1.5;
            let difference = this.data.iconBounds.width - initial;
    
            this.data.dragWrapRef.style.left = x - difference + "px";
            this.data.dragWrapRef.style.top  = y - difference + "px";
        }
        else{
            this.data.dragWrapRef.style.left = x - ( this.data.iconBounds.width  / 2) + 'px';
            this.data.dragWrapRef.style.top  = y - ( this.data.iconBounds.height / 2) + 'px';
        }


    }

    // Only updates when the value has changed
    updateMouseDragType(type){

        this.updateContainerType(type);
        
        // Only update CSS if moved to a different type
        if(this.data.mouseHoverContainerType != type){
            this.setIconCSSHandler(type, 'success');
        }
    }

    updateContainerType(type){
        this.data.mouseHoverContainerType = (type == "Storage") ? "GRID" : type;

        // Uses the icon ref to recalculate the bounding box
        if(this.data.dragWrapRef != null){
            this.data.iconBounds = structuredClone(this.data.dragWrapRef.getBoundingClientRect());
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

    setVisibility(val){
        this.data.dragWrapRef.style.visibility = val;
    }
    setContainerOrigin(str){ this.data.originContainer = str; }
    setTransitionName(name){ this.data.transitionName = name; }
    setDragWrapperRef(ref){ this.data.dragWrapRef = ref; }
    setDisplayIcon(iconID){
        this.data.displayIconID = iconID; 
    }

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
    // Enables the mousemove  in Gridlayout and Listlayout only when the drag is active
    
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