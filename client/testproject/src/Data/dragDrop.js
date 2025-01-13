import { reactive } from 'vue'
import { editVariables } from './SettingVariables';
import { iconImageStorage } from './iconImages';
import { iconData, iconSelect } from './iconData';
import { mouseData } from './mouseData';
import { multiSelect } from './multiSelect';
/*

    Drag and drop functionality for icons.

*/

class dragAndDropClass{
    constructor(){ this.init(); }
    
    init(){
        this.data = {

            enabled: false,
    
            displayIconID: null,
            savedIndex: -1,
            originContainer: null,
            
            dragWrapRef: null,
            textRef: null,
            
            isDraggingEvent: false,
            transitionName: '',
    
            listIconSize: "2em",
            
            displayIconData:{
                iconColour: "#000000",
                iconSize: "0",
                iconImage: "",
                viewBox: "", 
            },
    
            iconBounds: null,
            textWidth: null,
    
            mouseHoverContainerType: "",

            isMultiSelect: false,
        } 
    }

    get allData(){ return this.data; };

// Initializer on click

    initVariables(iconID, containerID, type, isMultiSelect){
        editVariables.setIconDragData({
            storedContainer:  containerID,
            storedID: iconID,
        });

        this.setIsMultiSelect(isMultiSelect);
        multiSelect.setValidDrag(true);

        this.setTransitionName("");
        this.setDisplayIcon(iconID);
        this.setContainerOrigin(containerID);
        this.setSVGDragData();
        this.updateContainerType(type);
    }
    
    /*
        Initializer for drag and drop event
        Timeout makes the user wait a certain time before dragging.
        Also defines what makes a drag and a click
        
        Initializer that requires bounding box and has to be run later.
    */

    initDragDrop(event, index, containerType){

        // Save the icon bounds. When the timer has gone, the bounding box has been changed
        // Requires a copy to be used.
        this.data.iconBounds = structuredClone(this.data.dragWrapRef.getBoundingClientRect());
        
        this.data.textWidth = Math.floor(this.data.textRef.getBoundingClientRect().width) + "px";
        var localTextWidth  = Math.floor(this.data.textRef.getBoundingClientRect().width);
    
        // Dragging functionality only works after a period of time holding the icon.
        this.m_draggableFnc = setTimeout(() => {

            // Run only if the mouse is still on the element
            document.querySelectorAll( ":hover" ).forEach(el => {
                if(el == event.target){ return;}
            });
            
            console.log("is MultiSelect:", this.data.isMultiSelect)


            this.data.enabled = true;
            this.data.isDraggingEvent = true;
            this.data.savedIndex = index;

            // Set mouse functions
            mouseData.movementFunctions ([ "drag_Move" ]);
            mouseData.mouseUpFunctions  ([ "drag_End" ]);
            mouseData.useObject(this); // allows the mouse objects to run this object functions.
            
            mouseData.enableTracking();
            mouseData.enableMouseUp();
            
            this.setVisibility("visible");
            this.setIconCSSHandler(containerType,`success`);
            this.updateIconDragPosition(event.clientX, event.clientY, localTextWidth)
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
        this.updateIconDragPosition(mouseData.Coordinates.x, mouseData.Coordinates.y,0);
    }

    // Resets the variables on end.
    drag_End(){
        this.data.isDraggingEvent = false;
        this.data.textDimensions = null;
        this.data.iconBounds = null;
        this.data.textWidth = null;
        this.data.enabled = false;
        this.setDisplayIcon(null);
        this.setDragWrapperRef(null);
        this.data.savedIndex = -1;
        multiSelect.setValidDrag(true);
        this.setIsMultiSelect(false);

        mouseData.disableTracking();
        mouseData.disableMouseUp();
        
        iconSelect.resetData();
    }

// Updaters

    updateIconDragPosition(x, y, startOffset=0){

        let boundsWidth  = this.data.iconBounds.width;
        let boundsHeight = this.data.iconBounds.height;
        
        // Start offset is used because the text ref changes the width,
        if(startOffset != 0 && this.data.mouseHoverContainerType === "GRID"){
            boundsWidth -= startOffset;
        }

        // Transform scaling does not change the top X position
        // Recalculate by finding difference.
        let initialX = boundsWidth  / 1.5;
        let initialY = boundsHeight / 1.5;

        let differenceX = boundsWidth  - initialX;
        let differenceY = boundsHeight - initialY;

        this.data.dragWrapRef.style.left = x - differenceX + "px";
        this.data.dragWrapRef.style.top  = y - differenceY + "px";
    }

    // Only updates when the value has changed
    updateContainerType(type){
        
        // Uses the icon ref to recalculate the bounding box
        if(this.data.dragWrapRef != null){
            this.data.iconBounds = structuredClone(this.data.dragWrapRef.getBoundingClientRect());
        }
        
        if(this.data.mouseHoverContainerType != type){
            this.setIconCSSHandler(type, 'success');
            this.data.mouseHoverContainerType = (type == "Storage") ? "GRID" : type;
        }

        // Change size of icon
        
        if(type === "LIST"){ 
            this.data.displayIconData.iconSize = this.data.listIconSize;
            
        }
        else{
            this.setSVGDragData();
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
        this.data.textRef.style.visibility = val;
    }
    setContainerOrigin(str){ this.data.originContainer = str; }
    setTransitionName(name){ this.data.transitionName = name; }
    setDragWrapperRef(ref){ this.data.dragWrapRef = ref; }
    setTextRef(ref){ this.data.textRef = ref; }
    setIsMultiSelect(val){ this.data.isMultiSelect = val; }
    setDisplayIcon(iconID){ this.data.displayIconID = iconID; }

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
                iconImageStorage.getViewBox(svgData.iconImage),
            )
        }
    }

// Getter
    
    // Note:
    // This is for retrieving the icon data to be displayed, not for anything other
    // Because in the event of multi drag, data would be passed as static.
    get storedIconData(){
        if(!editVariables.iconDragData || !this.data.displayIconID){ return null; } // Requires data

        // Change to different icon if multi select 
        if(this.isMultiSelect){
            return {
                iconColour: "#000000",
                iconSize: "4em",
                iconImage: "Stack",
                viewBox: `${iconImageStorage.getViewBox('Stack')}`, 
            }
        }

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
    get textWidth()   { return this.data.textWidth; }

    get isMultiSelect(){ return this.data.isMultiSelect; }
}

const dragAndDropInstance = new dragAndDropClass;
export const dragAndDrop = reactive(dragAndDropInstance);