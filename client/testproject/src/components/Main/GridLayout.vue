<template>
    <div class="fill grid border-box"
        ref="container"
        @mouseup="resetSelection"
        >
        <div v-for="(item, index) in m_Rows * m_Columns" :key="index"
            class="grid-proper"
            @mouseup="checkDropIcon(index)"
            @click="(this.$GlobalStates.value.edit.isIconSelector) ? setSelectedIcon(index) : null"
            >

            <div class="grid-item"
                :class="{ 'icon' : renderIcon(index),
                'icon-Selection' : isSelectedIcon(index),
                'unselect-icon'  : !isSelectedIcon(index)}">
                
                <IconHandler v-if="renderIcon(index)"
                    class="icon"
                    :icon_data="getIconData(index)"
                    @mousedown="(this.$GlobalStates.value.edit.enabled) ? dragAndDrop(index) : null"
                />
                
            </div>
        </div>
                    
                    <!-- @mouseup="  (this.$GlobalStates.value.edit.enabled) ? null : console.log('Close')"  -->

                        <!-- 
                            mousedown would have many functions, but for this instance, just a single
                            mouse click will store the data
                          -->
        
                    <!-- 
                    
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
    </div>
</template>

<script>
import { containerData } from '../../Data/containerData';
import IconHandler from './IconHandler.vue';
import { iconData, iconSelect } from '../../Data/iconData.js';
import { mouseData } from '../../Data/mouseData.js';
import { GridModificationClass } from '../Functions/gridModification.js';

export default {
    components:{
        IconHandler,
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
            GridModificationClass,
            iconData,
            mouseData,
            iconSelect,
            
            m_ComponentDimensions: null,
            m_containerData: null,

            m_Rows: 0,
            m_Columns: 0, 

            m_iconSize: 0,

            m_GroupData: null,
            m_iconID: null,

            m_Observer: null,
        }
    },
    created(){
        this.initGrid();
        this.m_iconSize = containerData.getIconSize(this.component_ID);
    },
    mounted(){
        this.m_ComponentDimensions = this.$refs["container"];

        // Vue3 does not watch the DOM elements
        // JS contains an observer for DOM elements.
        this.m_Observer = new ResizeObserver((dimensions) => {
            let width  = dimensions[0].contentRect.width;
            let height = dimensions[0].contentRect.height;

            let dimension = GridModificationClass.calculateGridDimension(width, height, this.m_iconSize);
            this.setRowColData(dimension.rows, dimension.columns);
        });

        this.m_Observer.observe(this.m_ComponentDimensions)
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


// Coordinate Index
// -------------------------------------------------------------------------------------------

        // Find next available position, Starts from the beginning
        generateNextCoordinate(groupID){
            for(let i = 0; i < this.m_Columns * this.m_Rows; i++){
                let tmpCoord = iconData.indexToCoord(i, this.m_Rows);
                
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

// Icon Movement
// ------------------------------------------------------------------------------------------

        resetSelection(){
            this.$GlobalStates.value.edit.iconDragData = null;
        },

        // Look at the current group. Functions return null if free space.
        // Compact can swap between values,
        isPositionAvailable(group, index, isFree){
            let newCoord = iconData.indexToCoord(index, this.m_Rows);
            
            return (isFree) ? (!iconData.getIconDataFromCoordinate(group, newCoord.x, newCoord.y)) : true;
        },

        // Conditions and values to check before drop functionality
        checkDropIcon(index){
            if(!this.$GlobalStates.value.edit.iconDragData){ return; } // Requires data

            let newGroupID = this.m_containerData.ID;
            let oldGroupID = this.$GlobalStates.value.edit.iconDragData.storedContainer;
            let iconID     = this.$GlobalStates.value.edit.iconDragData.storedID;

            let isFree     = (this.m_containerData.gridData.contentAlign === "Free");
            let dirIndex   = this.directionalIndexHandler(index);

            // Find group to move to.
            let moveToGroup      = (oldGroupID !== newGroupID) ? iconData.getGroup(newGroupID): this.m_GroupData ;
            let isDifferentGroup = (oldGroupID !== newGroupID);

            if(!this.isPositionAvailable(moveToGroup, dirIndex, isFree)){ return; }
            this.dropIcon(oldGroupID, newGroupID, iconID, isDifferentGroup, isFree, dirIndex);
        },

        dropIcon(oldGroupID, newGroupID, iconID, isDifferentGroup, isFree, newIndex){
            
            // Changes the coordinate values FIRST
            (isFree) ? this.setFreeData(oldGroupID, iconID, newIndex) : this.setCompactData(oldGroupID, iconID, newGroupID, isDifferentGroup);

            // Move data across group. Otherwise, re-arrange group.
            (isDifferentGroup) ? iconData.moveIcon(iconID, oldGroupID, newGroupID, this.m_Columns, isFree) :
                this.checkRearrange(iconID, oldGroupID, newIndex, isFree);

            this.resetSelection();
        },

        checkRearrange(iconID, groupID, index_A, isFree){
            let data    = iconData.getIconDataFromIndex(this.m_GroupData, index_A);
            let group   = iconData.getGroup(groupID);
            let index_B = iconData.getIconIndexOfGroup(group, iconID);

            // Free mode, sort group based on coordinate.
            if(!data && isFree){ iconData.sortGroup(groupID, this.m_Columns); return; }

            // If end location contains data, swap. If not, move to end
            (data) ? iconData.swapIndices(group, index_A, index_B) : iconData.moveItemToEnd(group, index_B);
        },

        setCompactData(groupID, iconID, newGroupID, isDifferentGroup){
            if(!isDifferentGroup){ return; }
            
            // Find next available position.
            let newCoordinate = this.generateNextCoordinate(newGroupID);
            iconData.setCoordinate(groupID, iconID, newCoordinate.x, newCoordinate.y);
        },

        setFreeData(groupID, iconID, newIndex){
            let coord = iconData.indexToCoord(newIndex, this.m_Rows);
            iconData.setCoordinate(groupID, iconID, coord.x, coord.y);
        },

    // Mouse Function
    
        dragAndDrop(index){
            mouseData.mouseDownFunctions([ this.edit_Drag_MouseDown ]);
            mouseData.movementFunctions ([ this.edit_Drag_Move ]);
            mouseData.mouseUpFunctions  ([ this.disableDrag ]);
            
            mouseData.enableMouseDown();
            mouseData.enableTracking();
            mouseData.enableMouseUp();

            this.m_iconID = this.getIconData(index).iconID;
        },

        edit_Drag_MouseDown(){
            // Find what it is holding and store it.s
            this.$GlobalStates.value.edit.iconDragData = {
                storedContainer:  this.m_containerData.ID,
                storedID: this.m_iconID,
            };
        },

        edit_Drag_Move(){

        },

        disableDrag(){
            mouseData.disableMouseDown();
            mouseData.disableTracking();
            mouseData.disableMouseUp();
        },

// Icon Functions
// ------------------------------------------------------------------------------------------

        isSelectedIcon(index){
            if(!this.getIconData(index) || !iconSelect ){ return false; } // No data
            return (this.getIconData(index).iconID === iconSelect.data.iconID && this.m_containerData.ID === iconSelect.data.groupID);
        },

        setSelectedIcon(index){
            if(!this.getIconData(index)){ iconSelect.resetData(); return; } // No data
            iconSelect.setData(this.getIconData(index).iconID, this.m_containerData.ID);
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
            let n_Columns = (~~(index / this.m_Rows) + 1); // Y coordinate
            let clampedIndex = (index % this.m_Rows);      // tmp index between 0 - N rows
            
            let startValue = (this.m_Rows) * n_Columns;    // Start value
            return (startValue - (clampedIndex + 1));      // Start value - tmp index;
        },

        // Top to bottom is default index
        // Renders from Bottom to top
        bottomTop(index){
            let n_Columns = (~~(index / this.m_Rows) + 1); // Y coordinate
            let clampedIndex = (index % this.m_Rows);      // tmp index between 0 - N rows

            let startValue = (this.m_Columns - n_Columns) * this.m_Rows;
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
            let coord = iconData.indexToCoord(index, this.m_Rows);
            // Contains no value
            if(!iconData.getIconDataFromCoordinate(this.m_GroupData, coord.x, coord.y)){ return false; }
            return true;
        },

    // Getters

        getIconData(index){
            return (this.m_containerData.gridData.contentAlign === "Compact") ? this.getCompactIconData(index) : this.getFreeIconData(index);
        },

        getCompactIconData(index){
            return iconData.getIconDataFromIndex(this.m_GroupData, this.directionalIndexHandler(index));
        },

        getFreeIconData(index){
            let coord = iconData.indexToCoord(index, this.m_Rows);
            return iconData.getIconDataFromCoordinate(this.m_GroupData, coord.x, coord.y);
        },

// ------------------------------------------------------------------------------------------
// Grid Functions

        // Dimension is stored as 'C,R'
        setRowColData(rows, columns){
            this.m_Rows    = rows
            this.m_Columns = columns
        },
    }
}
</script>

<style scoped>

.icon-wrapper{
    width: 100px;
}

.border-box{
    box-sizing: border-box;
}

.flex-center{
    display: flex;
    justify-content: center;
    align-content: center;
}

.unselect-icon{
    border: 3px solid rgba(255, 255, 255, 0);
    border-radius: 10px;

    -webkit-transition: border-color 0.15s linear; /* Saf3.2+, Chrome */
       -moz-transition: border-color 0.15s linear; /* FF3.7+ */
         -o-transition: border-color 0.15s linear; /* Opera 10.5 */
            transition: border-color 0.15s linear;
}

.icon{
    cursor: pointer
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
    
    border: solid rgba(255, 255, 255, 0.5) 0.5px;
    
    border-radius: 10px;

    -webkit-transition: border-color 0.15s linear; /* Saf3.2+, Chrome */
       -moz-transition: border-color 0.15s linear; /* FF3.7+ */
         -o-transition: border-color 0.15s linear; /* Opera 10.5 */
            transition: border-color 0.15s linear;
}

.grid-proper{
    position: relative;
}

.fill{
    width:  100%;
    height: 100%;
}

.grid{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-template-rows:    repeat(auto-fit, minmax(150px, 1fr));
}


</style>