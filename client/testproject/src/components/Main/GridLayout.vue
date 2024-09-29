getIconData<template>
    <div class="fill grid base-margin border-box"
        ref="container"
        @mouseup="resetSelection"
        >
        <template v-for="(item, index) in m_Rows * m_Columns" :key="index">
            <div class="flex-center"
                @mouseup="checkDropIcon(index)">
                <template v-if="renderIcon(index)">

                    <!-- Edit mode Icon -->
                    <IconHandler
                    :icon_data="getIconData(index)"
                    @mousedown="(this.$GlobalStates.value.edit.enabled) ? dragAndDrop(index) : null"
                    />
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
                </template>
            </div>
        </template>
    </div>
</template>

<script>
import { containerData } from '../../Data/containerData';
import IconHandler from './IconHandler.vue';
import { iconData } from '../../Data/iconData.js';
import { mouseData } from '../../Data/mouseData.js';

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
            iconData,
            mouseData,
            
            
            m_containerData: null,
            
            m_Column_Data: "",
            m_Column_Gap: "",

            m_Rows_Data: "",
            m_Row_Gap: "",

            m_Rows: 0,
            m_Columns: 0, 

            m_iconSize: 0,

            m_GroupData: null,

            m_iconID: null
        }
    },
    created(){
        this.initGrid();
    },
    methods: {

        initGrid(){

            this.m_containerData = this.getContainerData();
            this.m_GroupData = iconData.getGroup(this.m_containerData.ID);

            if(this.m_GroupData === null){ 
                iconData.createGroup(this.m_containerData.ID);
                this.m_GroupData = iconData.getGroup(this.m_containerData.ID);
            } // group data does not exist
            this.setDimension();
            this.m_iconSize = containerData.getIconSize(this.component_ID);
            this.setContainerIconData();
            
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

            // No spaces available
            // This should not occur in any case, Dragging to new location requires an empty space
            // If no empty space, this function should not be run.
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

    // Setters

        setContainerIconData(){ this.m_GroupData = iconData.getGroup(this.component_ID); },

// ------------------------------------------------------------------------------------------
// Grid Functions

        getContainerData(){ return containerData.getObjectFromID(this.component_ID); },

        // Dimension is stored as 'C,R'
        setRowColData(dimString){
            dimString = dimString.split(',');
            this.m_Rows    = Number(dimString[0]);
            this.m_Columns = Number(dimString[1]);

            this.m_Column_Data = "1fr ".repeat(dimString[0]);
            this.m_Rows_Data   = "1fr ".repeat(dimString[1]);
        },

        setDimension(){
            let dim = containerData.getGridDimension(this.component_ID);
            this.setRowColData(dim);
            this.calculateGridGap();
        },

        /*
            This calcualtes grid gap

            There are bugs when there is only 1 row/ column as there is no grid gap.
            Will need to take into consideration.
        */

        calculateGridGap(){
            this.$nextTick( () => {
                let data = this.$refs["container"].getBoundingClientRect();

                let columnGap = (data.width  - (this.m_iconSize * this.m_Rows))    / ( this.m_Rows - 1 );
                let rowGap    = (data.height - (this.m_iconSize * this.m_Columns)) / ( this.m_Columns - 1 );

                this.m_Column_Gap = `${columnGap}px`;
                this.m_Row_Gap    = `${rowGap}px`;
            })
        },
    },
    watch: {
        'm_containerData.gridData.gridDimensions'(){ this.setDimension(); },
        '$GlobalStates.value.edit.windowSize':{
            handler(val,oldval){ this.calculateGridGap(); },
            deep: true
        },
        'update_Grid_Flag'(){
            this.calculateGridGap();
        },
    }
}
</script>

<style scoped>
.border-box{
    box-sizing: border-box;
}

.flex-center{
    display: flex;
    justify-content: center;
    align-content: center;
}

.grid-item{
    border: solid rgba(255, 255, 255, 0.4) 0.5px;
}

.fill{
    width:  100%;
    height: 100%;
}

.grid{
    display: grid;
    grid-template-columns: v-bind("m_Column_Data");
    grid-template-rows:    v-bind("m_Rows_Data");

    grid-row-gap:    v-bind("m_Row_Gap");
    grid-column-gap: v-bind("m_Column_Gap");

    /* 
    
    grid-row-gap + grid-column-gap has to be calculated manually.

    Static widths for the box causes the program to go all buggy.
    Instead, change the sizes of the row + column gaps via calculation to ensure the values are static.
    
    */
}


</style>