<template>
    <div class="fill grid base-margin border-box"
        ref="container"
        @mouseup="resetSelection"
        >
        <template v-for="(item, index) in m_Rows * m_Columns" :key="index">
            <div class="grid-item flex-center"
                @mouseup="checkDropIcon(index)">
                <template v-if="renderIcon(index)">

                    <!-- Edit mode Icon -->
                    <template v-if="this.$GlobalStates.value.edit.enabled">
                        <IconHandler
                        :icon_data="getIconData(index)"
                        @mousedown="dragAndDrop(index)"
                        />

                        <!-- 
                            mousedown would have many functions, but for this instance, just a single
                            mouse click will store the data
                          -->
                    </template>
                    
                    <!-- Non-Edit mode Icon -->
                    <template v-else>
                        <IconHandler
                        :icon_data="getIconData(index)"
                        @mousedown="console.log('Open')"
                        @mouseup="console.log('Close')"
                        />
                    </template>

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
    created(){
        this.m_containerData = this.getContainerData();
        this.setDimension();
        this.m_iconSize = containerData.getIconSize(this.component_ID);
        this.setContainerIconData();
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
    methods: {

// Coordinate Index
// -------------------------------------------------------------------------------------------
        coordinateToIndex(x,y){
            return (this.m_Columns * y) + x;
        },

        indexToCoord(index){
            let x = ( index % this.m_Rows);
            let y = ~~(index / this.m_Rows); 
            return {x , y};
        },

// Icon Movement
// ------------------------------------------------------------------------------------------

        edit_Drag_MouseDown(){
            // Find what it is holding and store it.
            console.log('holding...');
            this.$GlobalStates.value.edit.iconDragData = {
                storedContainer:  this.m_containerData.ID,
                storedID: this.m_iconID,
            };
        },

        edit_Drag_Move(){
            // console.log('Moving!');
        },

        resetSelection(){
            // console.log("reset!");
            this.$GlobalStates.value.edit.iconDragData = null;
        },


        checkDropIcon(index){
            if(!this.$GlobalStates.value.edit.iconDragData){ return; }

            let newGroupID = this.m_containerData.ID;
            let oldGroupID = this.$GlobalStates.value.edit.iconDragData.storedContainer;

            if(this.m_GroupData === null){ iconData.createGroup(newGroupID); } // group data does not exist

            // Find group to move to.
            let moveToGroup    = (oldGroupID !== newGroupID) ? iconData.getGroup(newGroupID): this.m_GroupData ;
            let differentGroup = (oldGroupID !== newGroupID);

            if(this.isPositionAvailable(moveToGroup, this.indexToCoord(index))){ 
                this.dropIcon(this.m_GroupData, moveToGroup, differentGroup, index);
            }
        },

        // Free and compact have different requirements.

        // Look at the current group. getIconData return null if free space.
        isPositionAvailable(group, newCoord){
            return (iconData.getIconData(group, newCoord.x, newCoord.y) === null);
        },

        dropIcon(oldGroup, newGroup, differentGroup, newIndex){
            if(differentGroup){
                
            }
            else{ // Same group
                let modIconData = iconData.getIconDataFromID(newGroup, this.$GlobalStates.value.edit.iconDragData.storedID);
                let coord = this.indexToCoord(newIndex);
                modIconData.coordinate.x = coord.x;
                modIconData.coordinate.y = coord.y;
            }
            console.log('Drop!');

            this.resetSelection();
        },


        dragAndDrop(index){
            // let iconData = this.getIconData(index);
            // console.log(iconData);

            mouseData.mouseDownFunctions([ this.edit_Drag_MouseDown ]);
            mouseData.movementFunctions ([ this.edit_Drag_Move ]);
            mouseData.mouseUpFunctions  ([ this.disableDrag ]);
            
            mouseData.enableMouseDown();
            mouseData.enableTracking();
            mouseData.enableMouseUp();



            this.m_iconID = this.getIconData(index).iconID;
        },

        disableDrag(){
            mouseData.disableMouseDown();
            mouseData.disableTracking();
            mouseData.disableMouseUp();
        },


// Icon Functions
// ------------------------------------------------------------------------------------------

    // Render Flags
        renderIcon(index){
            if(this.m_GroupData === null){ return false; }
            return (this.m_containerData.gridData.contentAlign === "Compact") ? this.renderCompact(index) : this.renderFree(index);
        },

        renderCompact(index){
            let data = iconData.getIconDataCompactIndex(this.m_GroupData, index);
            
            if(data === null){ return false; }
            return true;
        },
        
        renderFree(index){
            let coord = this.indexToCoord(index);
            let data = iconData.getIconData(this.m_GroupData, coord.x, coord.y);

            if(data === null){ return false; }
            return true;
        },

    // Getters

        getIconData(index){
            return (this.m_containerData.gridData.contentAlign === "Compact") ? this.getCompactIconData(index) : this.getFreeIconData(index);
        },

        getCompactIconData(index){
            return iconData.getIconDataCompactIndex(this.m_GroupData, index);
        },

        getFreeIconData(index){
            let coord = this.indexToCoord(index);
            return iconData.getIconData(this.m_GroupData, coord.x, coord.y);
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
        }
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
    border: solid rgba(255, 255, 255, 0.4) 1px;
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