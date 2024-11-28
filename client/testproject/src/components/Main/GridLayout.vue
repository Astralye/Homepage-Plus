<template>
    <div class="grid-wrapper border-box"
        id="gridTop"
        ref="container"
        @mouseup="resetSelection(); (editVariables.isEnabled) ? resetTimer() : null"
        >

        <!-- Draws all grids -->
        <div v-for="(item, index) in m_GridDimensions.Rows * m_GridDimensions.Columns" :key="index"
            class="grid-proper"
            @mouseup="checkDropIcon(index);"
            @click="(editVariables.isIconSelector) ? setSelectedIcon(index) : null"
            >

            <!-- Generalized grid item -->
            <div class="grid-item"
                ref="gridPosition"
                :class="{ 'icon' : renderIcon(index),
                'icon-Selection' : isSelectedIcon(index),
                'unselect-icon'  : !isSelectedIcon(index)}">
                
                    <!-- Loads icon data to be rendered -->
                    <Transition name="fade">
                        <IconHandler v-if="renderIcon(index)"
                            class="icon"
                            :class="{'opacity-none' : ( m_DraggingEvent && isStoredIndex(index)) ,
                                     'opacity-full' : !m_DraggingEvent }"
                            :icon_data="getIconData(index)"
                            @mousedown="(editVariables.isEnabled) ? initDragDrop($event, index) : null"
                        />
                    </Transition>
            </div>
            
            <!-- Visible icon that follows mouse -->
            <Teleport to="body">
                <Transition :name="m_TransitionName">
                    <SVGHandler
                        v-show="m_DraggingEvent && isStoredIndex(index)"
                        ref="svgRef"
                        class="icon-drag-effect"
                        :ref_Value="'draggingIcon'"

                        :fill_Colour="m_DisplayIconData.iconColour"
                        :path_Value="m_DisplayIconData.iconImage"
                        :height="m_DisplayIconData.iconSize"
                        :width="m_DisplayIconData.iconSize"
                        :view_Box="m_DisplayIconData.viewBox"
                    />
                </Transition>
            </Teleport>
        </div>
    </div>
</template>
<!-- 
    Ideas:

    the icon should have different functionalities

    In edit mode:
        Single click on icon -> Select
        Single click on non icon, selection box

        Right click -> custom context menu.
        Double click -> Rename

        Left click hold -> Drag
        Left click hold up -> Drop
    
    Normal:
        Single click
        Double click

        Right Click 
        
    Misc, Other notes:

    CTRL + C, CTRL + V
    -> copy paste icon. 

    Mass drag + drop.

-->

<script>
import { containerData } from '../../Data/containerData';
import IconHandler from './IconHandler.vue';
import { iconData, iconSelect } from '../../Data/iconData.js';
import { mouseData } from '../../Data/mouseData.js';
import { GridModificationClass } from '../Functions/gridModification.js';
import SVGHandler from '../Input Components/SVGHandler.vue';
import { iconImageStorage } from '../../Data/iconImages';

import { editVariables } from '../../Data/SettingVariables';

export default {
    components:{
        IconHandler,
        SVGHandler
    },
    props:{
        component_ID: {
            type: String,
            default: "",
            required: true
        },
        update_Grid_Flag: {
            type: Boolean,
            default: false,
        }
    },
    data(){
        return{
            // Imported Data
            
            GridModificationClass,
            iconImageStorage,
            iconData,
            mouseData,
            iconSelect,
            editVariables,
            
            
            // Main Grid values

            m_GridDimensions: {
                Rows: 0,
                Columns: 0,
            },

            m_containerData: null,
            m_GroupData: null,  // Group data to check and move data between groups 
            m_iconID: null,     // ID of currently selected icon
            m_Observer: null,   

            // Icon drag visual variables

            m_draggableFnc: null,   // Timer to cancel drag function if not valid
            m_TransitionName: 'icon-success',
            m_SavedIndex: 0,
            m_IconDragRef: null,    // Reference of the icon.
            m_DraggingEvent: false, // Triggers transition and vbind classes

            m_DisplayIconData:{
                iconColour: "#000000",
                iconSize: "100",
                iconImage: "",
            },
            m_MouseOffset:{
                x: 0,
                y: 0,
            }
        }
    },
    created(){
        this.initGrid();
    },
    mounted(){
        this.gridResizer();
    },
    unmounted(){
        this.m_Observer.disconnect();
    },
    methods: {
        
        initGrid(){

            this.m_containerData = containerData.getObjectFromID(this.component_ID);
            this.m_GroupData = iconData.getGroup(this.m_containerData.ID);

            if(this.m_GroupData === null){ 
                iconData.createGroup(this.m_containerData.ID);
                this.m_GroupData = iconData.getGroup(this.m_containerData.ID);
            } // group data does not exist

            this.m_GroupData = iconData.getGroup(this.component_ID);
        },


    // Resetters
    
        resetSelection(){
            editVariables.resetIconDragData();
        },

        // If user lifts mouse event before timer
        resetTimer(){
            clearTimeout(this.m_draggableFnc);
        },


// Coordinate Index
// -------------------------------------------------------------------------------------------

        // Find next available position, Starts from the beginning
        generateNextCoordinate(groupID){
            for(let i = 0; i < this.m_GridDimensions.Columns * this.m_GridDimensions.Rows; i++){
                let tmpCoord = iconData.indexToCoord(i, this.m_GridDimensions.Rows);
                
                // If null (no item in location,) set new coordinate.
                if(!iconData.getIconDataFromCoordinate(iconData.getGroup(groupID), tmpCoord.x, tmpCoord.y)){ return { x: tmpCoord.x, y: tmpCoord.y }; } 
            }

            /*
                No spaces available
                This should not occur in any case, Dragging to new location requires an empty space
                If no empty space, this function should not be run.
            */
            console.error("Error: No spaces available");
            return null;
        },

// Icon Displacement
// ------------------------------------------------------------------------------------------

        // Look at the current group. Functions return null if free space.
        // Compact can swap between values,
        isPositionAvailable(group, index, isFree){
            let newCoord = iconData.indexToCoord(index, this.m_GridDimensions.Rows);
            
            return (isFree) ? (!iconData.getIconDataFromCoordinate(group, newCoord.x, newCoord.y)) : true;
        },

        // Checks if same icon
        isSameIcon(group, index, iconID){
            let newCoord = iconData.indexToCoord(index, this.m_GridDimensions.Rows);
            
            return (iconData.getIconDataFromCoordinate(group, newCoord.x, newCoord.y).iconID === iconID);
        },

        // Conditions and values to check before drop functionality
        checkDropIcon(index){
            if(!editVariables.iconDragData){ return; } // Requires data

            let newGroupID = this.m_containerData.ID;
            let oldGroupID = editVariables.iconDragData.storedContainer;
            let iconID     = editVariables.iconDragData.storedID;

            let isFree     = (this.m_containerData.gridData.contentAlign === "Free");
            let dirIndex   = this.directionalIndexHandler(index);

            // Find group to move to.
            let moveToGroup      = (oldGroupID !== newGroupID) ? iconData.getGroup(newGroupID): this.m_GroupData ;
            let isDifferentGroup = (oldGroupID !== newGroupID);

            if(!this.isPositionAvailable(moveToGroup, dirIndex, isFree)){ 
                if(!this.isSameIcon(moveToGroup, dirIndex, iconID)){this.m_TransitionName = 'icon-cancel' }; 
                return;
            }

            this.dropIcon(oldGroupID, newGroupID, iconID, isDifferentGroup, isFree, dirIndex);
        },

        // Before dropping, run the respective container drop functions
        dropIcon(oldGroupID, newGroupID, iconID, isDifferentGroup, isFree, newIndex){

            // Changes the coordinate values FIRST
            (isFree) ? this.setFreeData(oldGroupID, iconID, newIndex) : this.setCompactData(oldGroupID, iconID, newGroupID, isDifferentGroup);

            // Move data across group. Otherwise, re-arrange group.
            (isDifferentGroup) ? iconData.moveIcon(iconID, oldGroupID, newGroupID, this.m_GridDimensions.Columns, isFree) :
                this.checkRearrange(iconID, oldGroupID, newIndex, isFree);

            this.resetSelection();
        },

        // Checks if the icon can be swapped, only works if compact
        checkRearrange(iconID, groupID, index_A, isFree){
            let data    = iconData.getIconDataFromIndex(this.m_GroupData, index_A);
            let group   = iconData.getGroup(groupID);
            let index_B = iconData.getIconIndexOfGroup(group, iconID);

            // Free mode, sort group based on coordinate, early return
            if(!data && isFree){ iconData.sortGroup(groupID, this.m_GridDimensions.Columns); return; }

            // If end location contains data, swap. If not, move to end
            (data) ? iconData.swapIndices(group, index_A, index_B) : iconData.moveItemToEnd(group, index_B);
        },


    // Setters

        setCompactData(groupID, iconID, newGroupID, isDifferentGroup){
            if(!isDifferentGroup){ return; }
            
            // Find next available position.
            let newCoordinate = this.generateNextCoordinate(newGroupID);
            iconData.setCoordinate(groupID, iconID, newCoordinate.x, newCoordinate.y);
        },

        setFreeData(groupID, iconID, newIndex){
            let coord = iconData.indexToCoord(newIndex, this.m_GridDimensions.Rows);
            iconData.setCoordinate(groupID, iconID, coord.x, coord.y);
        },

// Mouse Function
// ----------------------------------------------------------------------------------------------------------------------------

        /*
            Initializer for drag and drop event
            Timeout makes the user wait a certain time before dragging.
            Also defines what makes a drag and a click
        */
        initDragDrop: function(event, index){

            var runFnc = false;
            this.m_draggableFnc = setTimeout(() => { 

                // Checks if the current mouse hover is over the same element
                document.querySelectorAll( ":hover" ).forEach(el => {
                    if(el == event.target){ runFnc = true; return;}
                });
                
                if(!runFnc){ return; }

                // Dragging event to for the icon to follow the mouse.
                this.m_iconID = this.getIconData(index).iconID;
                this.m_IconDragRef = this.$refs["svgRef"][index].$refs;
                this.m_DraggingEvent = true;
                this.m_SavedIndex = index;
                this.m_TransitionName = 'icon-success';

                // Stores the icon that is being dragged
                // Used to transfer data between containers
                editVariables.setIconDragData({
                    storedContainer:  this.m_containerData.ID,
                    storedID: this.m_iconID,
                });

                // Set mouse functions
                mouseData.movementFunctions ([ this.edit_dragMove ]);
                mouseData.mouseUpFunctions  ([ this.edit_disableDrag ]);
                
                mouseData.enableTracking();
                mouseData.enableMouseUp();
                
                // Initalizers
                this.setSVGDragData();
                this.initIconDragPosition(event.clientX, event.clientY);

            }, 125);

        },

    // Icon follow on mouse position functions

        // Updates position of dragged icon.
        edit_dragMove(){ this.updateIconDragPosition(mouseData.Coordinates.x, mouseData.Coordinates.y); },

        // Resets values when finish the drag event
        edit_disableDrag(){

            mouseData.disableTracking();
            mouseData.disableMouseUp();

            this.m_DraggingEvent = false;
            this.m_iconID = null;
            this.m_SavedIndex = 0;
        },


        // This is the offset of the starting position that the mouse offsets by when moving
        initIconDragPosition(initX, initY){
            let gridItem = this.$refs['gridPosition'][this.m_SavedIndex].getBoundingClientRect();

            this.setMouseOffset(initX, initY, gridItem);
            this.updateIconDragPosition(initX, initY); // This value will always be constant at the start
        },

        // Updates the css values to match the cursor
        updateIconDragPosition(x, y){
            this.m_IconDragRef['draggingIcon'].style.left = x - this.m_MouseOffset.x + 'px';
            this.m_IconDragRef['draggingIcon'].style.top  = y - this.m_MouseOffset.y + 'px';
        },

    // Setters

        setSVGDragData(){
            let svgData = this.getStoredIconData();
            this.m_DisplayIconData.iconImage  = iconImageStorage.getPathData(svgData.iconImage);
            this.m_DisplayIconData.iconColour = svgData.iconColour;
            this.m_DisplayIconData.iconSize   = svgData.iconSize;
            this.m_DisplayIconData.viewBox    = iconImageStorage.getViewBoxName(svgData.iconImage);
        },

        // this.m_MouseOffset indicates the absolute mouse position, after taking into account the grid position
        setMouseOffset(x,y,container){

            // grid item is the coordinates of the container, an offset is added to put it at the center
            let gridXoffset = container.x + (container.width   / 5);
            let gridYoffset = container.y + (container.height  / 5);

            // mouseOffset is the difference in px from the mouse to the grid offset.
            // Used to prevent snapping of top left corner to mouse.
            this.m_MouseOffset.x = x - gridXoffset;
            this.m_MouseOffset.y = y - gridYoffset;
        },

// Icon Functions
// ------------------------------------------------------------------------------------------

        // Checks if the current index is the index the user had dragged
        isStoredIndex(index){
            return (index === this.m_SavedIndex);
        },

        // Click selection for linkmaker
        isSelectedIcon(index){
            if(!this.getIconData(index) || !iconSelect ){ return false; } // No data
            return (this.getIconData(index).iconID === iconSelect.data.iconID && this.m_containerData.ID === iconSelect.data.groupID);
        },

    // Grid Direction

        // Modifies index depending on direction
        directionalIndexHandler(index){
            let modXIndex = (this.m_containerData.gridData.xAxisDirection === "Left") ? index : this.rightLeft(index);
            return          (this.m_containerData.gridData.yAxisDirection === "Top")  ? modXIndex : this.bottomTop(modXIndex);
        },

        // Left to right is default index
        // Rendering from Right to Left
        rightLeft(index){
            let n_Columns = (~~(index / this.m_GridDimensions.Rows) + 1); // Y coordinate
            let clampedIndex = (index % this.m_GridDimensions.Rows);      // tmp index between 0 - N rows
            
            let startValue = (this.m_GridDimensions.Rows) * n_Columns;    // Start value
            return (startValue - (clampedIndex + 1));      // Start value - tmp index;
        },

        // Top to bottom is default index
        // Renders from Bottom to top
        bottomTop(index){
            let n_Columns = (~~(index / this.m_GridDimensions.Rows) + 1); // Y coordinate
            let clampedIndex = (index % this.m_GridDimensions.Rows);      // tmp index between 0 - N rows

            let startValue = (this.m_GridDimensions.Columns - n_Columns) * this.m_GridDimensions.Rows;
            return (startValue + clampedIndex);
        },

    // Render Flags

        renderIcon(index){
            if(this.m_GroupData === null){ return false; }
            return (this.m_containerData.gridData.contentAlign === "Compact") ? this.renderCompact(index) : this.renderFree(index);
        },

        renderCompact(index){
            // Contains no value
            if(!iconData.getIconDataFromIndex(this.m_GroupData, this.directionalIndexHandler(index))){ return false; }
            return true;
        },
        
        renderFree(index){
            let coord = iconData.indexToCoord(index, this.m_GridDimensions.Rows);
            // Contains no value
            if(!iconData.getIconDataFromCoordinate(this.m_GroupData, coord.x, coord.y)){ return false; }
            return true;
        },

    // Setters

        setSelectedIcon(index){
            if(!this.getIconData(index)){ iconSelect.resetData(); return; } // No data
            iconSelect.setData(this.getIconData(index).iconID, this.m_containerData.ID);
        },


    // Getters

        getIconData(index){
            return (this.m_containerData.gridData.contentAlign === "Compact") ? this.getCompactIconData(index) : this.getFreeIconData(index);
        },

        getCompactIconData(index){
            return iconData.getIconDataFromIndex(this.m_GroupData, this.directionalIndexHandler(index));
        },

        getFreeIconData(index){
            let coord = iconData.indexToCoord(index, this.m_GridDimensions.Rows);
            return iconData.getIconDataFromCoordinate(this.m_GroupData, coord.x, coord.y);
        },

        getStoredIconData(){
            if(!editVariables.iconDragData || !this.m_iconID){ return; } // Requires data

            let group = iconData.getGroup(editVariables.iconDragData.storedContainer);
            return iconData.getIconDataFromID(group, this.m_iconID);
        },

// ------------------------------------------------------------------------------------------
// Grid Functions

        /*
            Vue3 does not watch the DOM elements
            JS contains an observer for DOM elements
            
            Watches for changes in element sizes to automatically recalculate the dimensions of the grids.
        */
        gridResizer(){
            let containerRef = this.$refs["container"];
            if(!containerRef){ console.error(`Error (GridLayout.vue): container ref not defined`); return; }

            this.m_Observer = new ResizeObserver((dimensions) => {
                let width  = dimensions[0].contentRect.width;
                let height = dimensions[0].contentRect.height;

                let dimension = GridModificationClass.calculateGridDimension(width, height, containerData.getIconSize(this.component_ID));
                this.setRowColData(dimension.rows, dimension.columns);
            });

            this.m_Observer.observe(containerRef);
        },

        // Dimension is stored as 'R , C'
        setRowColData(rows, columns){
            this.m_GridDimensions.Rows    = rows
            this.m_GridDimensions.Columns = columns
        },
    }
}
</script>

<style scoped>

.icon-success-enter-active {
    animation: grow 200ms ease-out;
    transition: opacity 50ms ease-in;
}

.icon-cancel-leave-active {
    transition: opacity 50ms ease-in;
}

.icon-success-leave-active {
    animation: grow 200ms reverse ease-out;
    transition: opacity 50ms ease-in;
}


@keyframes grow {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.5);
    }
  }

.icon-drag-effect{
    pointer-events: none;
    position: absolute;
    transform: scale(1.5);
    z-index: 20;
}

.opacity-none{
    opacity: 0;
}


.opacity-full{
    transition: all 125ms ease-in-out;
    transition-delay: 125ms;
}

.icon-wrapper{
    width: 100px;
}

.flex-center{
    display: flex;
    justify-content: center;
    align-content: center;
}

.unselect-icon{
    border: 3px solid rgba(255, 255, 255, 0.15);
    border-radius: 10px;

    -webkit-transition: border-color 0.15s linear; /* Saf3.2+, Chrome */
       -moz-transition: border-color 0.15s linear; /* FF3.7+ */
         -o-transition: border-color 0.15s linear; /* Opera 10.5 */
            transition: border-color 0.15s linear;
}

.icon{
    cursor: pointer;

    display: flex;
    flex-direction: column;
    
    justify-content: center;
    align-items: center;
}

.icon-Selection{
    border: 3px solid rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    
    -webkit-transition: border-color 0.15s linear; /* Saf3.2+, Chrome */
       -moz-transition: border-color 0.15s linear; /* FF3.7+ */
         -o-transition: border-color 0.15s linear; /* Opera 10.5 */
            transition: border-color 0.15s linear;
}

.grid-item{
    margin: auto;
    box-sizing: border-box;
    align-self: center;
    position: absolute;
    
    top: 50%;
    right: 50%;
    transform: translate(50%,-50%);

    width: 125px;
    aspect-ratio: 1;
}

.grid-proper{
    position: relative;
}

.auto-width{
    width: auto;
}

.grid-wrapper{
    width:  100%;
    height: 100%;
    
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-template-rows:    repeat(auto-fit, minmax(150px, 1fr));
}

.box{
    width: 100px;
    height: auto;
    aspect-ratio: 1;

    background-color: white;
}


</style>