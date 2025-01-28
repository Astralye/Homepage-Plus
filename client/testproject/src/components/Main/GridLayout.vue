<template>
    <div class="grid-wrapper border-box"
        :style="{
            'grid-template-columns': `repeat(auto-fit, minmax(${gridItemWidth}px, 1fr))`,
            'grid-template-rows':    `repeat(auto-fit, minmax(${gridItemWidth}px, 1fr))`,
        }"
        ref="container"
        @mouseup="resetSelection(); (editVariables.isEnabled) ? dragAndDrop.resetTimer() : null"
        @mouseenter="dragAndDrop.enabled ? dragAndDrop.updateContainerType('GRID') : null"
        >
        
        <!-- Draws all grids -->
        <div v-for="(item, index) in m_GridDimensions.Rows * m_GridDimensions.Columns" :key="index"
            class="grid-proper"
            @mouseup="(!this.isProfileDisplay) ? checkDropIcon(index) : null"
            @click="iconClick($event, index)"
            >
            <!-- Generalized grid item -->
            <div class="grid-item icon-selector"
                ref="gridPosition"
                :class="{ 'icon' : renderIcon(index),
                        'pointer': renderIcon(index) && !isProfileDisplay
                }"
                :style="{
                    'border-color': themeStorage.getIconColourOpacity( (isSelectedIcon(index) && !isProfileDisplay) ? 0.8 : 0.15 ),
                    'border-width': gridItemThickness,
                    'border-radius': gridItemRadius,
                    'width' : `${gridItemWidth}px`,
                }">

                <!-- Loads icon data to be rendered -->
                <Transition name="fade">
                    <IconHandler v-show="renderIcon(index)"
                        :key="getIconData(index)"
                        :profileDisplayName="profileDisplayName"
                        class="icon"
                        :class="{'opacity-none' : ( dragAndDrop.isDraggingEvent && dragAndDrop.isSavedIcon(index, component_ID)) ,
                                 'opacity-full' : !dragAndDrop.isDraggingEvent }"
                        :icon_data="getIconData(index)"
                        :toggle_Container_Text="m_containerData.gridData.displayText && !(editVariables.appearanceGrid.isApplyGlobal && !editVariables.appearanceGrid.isDisableIconLabels)"
                        :override_Size="iconOverrideSize"
                        @mousedown.left="iconDrag($event, index)"
                    />
                </Transition>

            </div>
        </div>
    </div>

    <IconDragHandler
        ref="icon-drag-handler"
        :component_ID="component_ID"
    />
</template>
<!-- 
    Ideas:

    In edit mode:
        Double click -> Rename
    
    Normal:
        Right Click 
        
    Misc, Other notes:

    CTRL + C, CTRL + V
    -> copy paste icon. 

-->

<script>

import { GridModificationClass } from '../Functions/gridModification';
import { editVariables } from '../../Data/SettingVariables';
import { iconData, iconSelect } from '../../Data/iconData';
import { containerData } from '../../Data/containerData';
import { iconImageStorage } from '../../Data/iconImages';
import { themeStorage } from '../../Data/themeStorage';
import { multiSelect } from '../../Data/multiSelect';
import { dragAndDrop } from '../../Data/dragDrop';
import { mouseData } from '../../Data/mouseData';

import { profileHandler } from '../../Data/profileHandler';

import SVGHandler from '../Input Components/SVGHandler.vue';
import IconDragHandler from './IconDragHandler.vue';
import IconHandler from './IconHandler.vue';

export default {
    components:{
        IconDragHandler,
        IconHandler,
        SVGHandler,
    },
    props:{
        /*
            profileDisplayName, used for displaying the profile in Profiles.vue tab.

            ensures only displaying is visible, prevent normal container functions to work.
            This will also make sure to override all global data, and only apply values passed in via profile
        */
        profileDisplayName:{ 
            type: String,
            default: null,
        },

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
            profileHandler,
            editVariables,
            themeStorage,
            dragAndDrop,
            multiSelect,
            iconSelect,
            mouseData,
            iconData,
            
            // Main Grid values

            m_GridDimensions: {
                Rows: 0,
                Columns: 0,
            },

            m_containerData: null,
            m_GroupData: null,  // Group data to check and move data between groups 
            m_iconID: null,     // ID of currently selected icon
            m_Observer: null,

            m_lastClickedIndex: -1,
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

            if(this.isProfileDisplay){
                console.log("here");
                this.m_containerData = containerData.getObjectFromIDData(profileHandler.getProfileData(this.profileDisplayName).containerDisplayData, this.component_ID);
                this.m_GroupData = iconData.getGroupFromData(profileHandler.getProfileData(this.profileDisplayName).iconData, this.m_containerData.ID);
                return;
            }

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

// AABB collision detection
// -------------------------------------------------------------------------------------------

        // this.$refs['gridPosition'] would contain ALL the currently rendered icons
        // We only want the values with data
        initBounds(){
            if(!this.$refs) return;

            for(let i = 0; i < this.$refs['gridPosition'].length; i++ ){

                // If a valid icon is in the position.
                if(!this.renderIcon(i)) continue;

                multiSelect.allIconDataSetter(
                    this.$refs['gridPosition'][i].getBoundingClientRect(),
                    i,
                    this.setSelectedIcon
                );
            }
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

// Multiselect
// ------------------------------------------------------------------------------------------

        // Sets alt and ctrl holds.
        kbShortcut(event){
            multiSelect.setHoldingShift(event.shiftKey);
            multiSelect.setHoldingCtrl(event.ctrlKey);
        },

        // For holding Shift or Ctrl
        specialKeySelection(iconID,index){
            // Check if empty
            if(multiSelect.isArrayEmpty){ this.initBounds(); }

            // Toggle index collision value
            if(multiSelect.isHoldingCtrl){

                multiSelect.toggleGridIndexCollision(index);

                (multiSelect.isGridIndexSelected(index)) ?
                    iconSelect.addNewData(iconID, this.m_containerData.ID):
                    iconSelect.removeData(iconID, this.m_containerData.ID);

                return;
            }

            // Shift click

            // // Gets min and max indexes
            let indexA = this.m_lastClickedIndex;
            let indexB = index;

            if(indexA === -1 || indexB === -1) return; // non-valid values
            if(indexA === indexB) return; // the same

            let minIndex = (indexA > indexB) ? indexB : indexA;
            let maxIndex = (indexA > indexB) ? indexA : indexB;
            maxIndex += 1; // +1, it removes the current index

            multiSelect.setCollisionEnableList(minIndex, maxIndex); 

            // // Set all the selected values on.
            for(let i = minIndex; i < maxIndex; i++){
                let icon = this.m_GroupData[i];
                iconSelect.addNewData(icon.iconID, this.m_containerData.ID);
            }
        },



        isIconOnGrid(groupID){
            return (containerData.getLayoutType(groupID) === "Grid");
        },

        selectionDrag(event, index){
            // tmp
            this.$refs['icon-drag-handler'].dragDropSetup(event, index, this.getIconData(index), 'GRID');
        },

    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

        mouseLeaveGrid(){

            // Prevent other icons from triggering this.
            if(editVariables.iconDragData.storedContainer !== this.component_ID) return;

            (iconSelect.isMultiSelect) ? this.removeMultiSelectData() : this.removeSingleItemData();
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
                if(!this.isSameIcon(moveToGroup, dirIndex, iconID)){ 
                    dragAndDrop.setTransitionName('icon-cancel'); }; 
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

// Icon Functions
// ------------------------------------------------------------------------------------------

        // disable mouse button functionality if profile display

        iconClick(event, index){           
            // Prevent click events on display
            if(this.isProfileDisplay) return;

            this.kbShortcut(event);
            this.setSelectedIcon(index, true, true)
        },

        iconDrag(event, index){            
            if(editVariables.isEnabled && !this.isProfileDisplay){
                this.selectionDrag(event, index)
            } 
        },

        // Click selection for linkmaker
        isSelectedIcon(index){
            if(!this.getIconData(index) || iconSelect.length === 0 ){ return false; } // No data

            return iconSelect.isContainSelectedData(this.getIconData(index).iconID, this.m_containerData.ID);
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
            if(this.m_GroupData === null){ return false; } // no data
            return (this.m_containerData.gridData.contentAlign === "Compact") ? this.renderCompact(index) : this.renderFree(index);
        },

        renderCompact(index){
            let tmpIconData = iconData.getIconDataFromIndex(this.m_GroupData, this.directionalIndexHandler(index));
            
            if(!tmpIconData) return false; // Contains no value

            let containsIcon = iconSelect.isContainSelectedData(tmpIconData.iconID, this.m_containerData.ID);

            if(containsIcon && iconSelect.isMultiSelect && dragAndDrop.enabled) return false;
            
            return true;
        },
        
        renderFree(index){
            let coord = iconData.indexToCoord(index, this.m_GridDimensions.Rows);
            let tmpIconData = iconData.getIconDataFromCoordinate(this.m_GroupData, coord.x, coord.y);
            
            if(!tmpIconData) return false; // Contains no value

            let containsIcon = iconSelect.isContainSelectedData(tmpIconData.iconID, this.m_containerData.ID);
            
            if(containsIcon && iconSelect.isMultiSelect && dragAndDrop.enabled) return false;

            return true;
        },

    // Setters

        setSelectedIcon(index, AABBcollision, click=false){
            if(!this.renderIcon(index)){ iconSelect.resetData(); return; } // No data

            let iconID = this.getIconData(index).iconID;

            if(!AABBcollision){
                iconSelect.removeData(iconID, this.m_containerData.ID);
                return;
            }
            
            var keyHold = multiSelect.isHoldingCtrl || multiSelect.isHoldingShift;
            
            // No keys held
            if(!keyHold){
                // Standard click
                if(click){ iconSelect.resetData(); }
                
                // Drag or click
                iconSelect.addNewData(iconID, this.m_containerData.ID);
                this.m_lastClickedIndex = index;
                return;
            }

            this.specialKeySelection(iconID, index);
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

                let size = this.gridItemWidth;

                console.log(size, "size");

                let dimension = GridModificationClass.calculateGridDimension(width, height, size);
                this.setRowColData(dimension.rows, dimension.columns);
            });

            this.m_Observer.observe(containerRef);
        },

        // global resizing
        resizeGrids(){
            let containerRef = this.$refs["container"];
            if(!containerRef){ console.error(`Error (GridLayout.vue): container ref not defined`); return; }

            console.log("reszie")

            let dims = containerRef.getBoundingClientRect();

            let size = this.gridItemWidth;

            let dimension = GridModificationClass.calculateGridDimension(dims.width, dims.height, size );
            this.setRowColData(dimension.rows, dimension.columns);
        },


        // Dimension is stored as 'R , C'
        setRowColData(rows, columns){
            this.m_GridDimensions.Rows    = rows
            this.m_GridDimensions.Columns = columns
        },
    },
    computed:{
        
        // Boolean flag to redirect code from normal function to only display
        isProfileDisplay(){ return (this.profileDisplayName)  },

        gridItemThickness(){ return (this.isProfileDisplay) ? '2px' : '3px'; },
        gridItemRadius(){ return (this.isProfileDisplay) ? "5px" : "10px"; }, 

        iconOverrideSize(){

            // Need to calculate this size
            if(this.isProfileDisplay) return 20;


            return (editVariables.appearanceGrid.isApplyGlobal) ? editVariables.appearanceGrid.globalIconSize : null;
        },

        
        gridItemWidth(){

            if(this.isProfileDisplay){

                // do some math conversions to get the correct size

                // Static for now
                return (editVariables.appearanceGrid.isApplyGlobal) ? 35 : 35; 
            }

            return (editVariables.appearanceGrid.isApplyGlobal) ? editVariables.appearanceGrid.globalGridItemSize : 125;
        }
    },
    watch:{
        'editVariables.resetFlag'(val){
            if(val){
                this.initGrid();
            }
        },
        // Check if started multiselect drag
        'multiSelect.isEnabled'(val){
            if(val){
                this.initBounds();
            }
        },

        // Recalculate grids when it is applied
        'editVariables.appearanceGrid.isApplyGlobal'(){
            this.resizeGrids();
        },

        // Watch changes in grid size.
        'editVariables.appearanceGrid.globalGridItemSize':{
            handler(){
                if(!editVariables.appearanceGrid.isApplyGlobal) return;
                this.resizeGrids();
            },
            deep: true,
        }
    }
}
</script>

<style scoped>

.pointer{
    cursor: pointer;
}

.opacity-none{
    opacity: 0;
}

.opacity-full{
    transition: all 125ms ease-in-out;
    transition-delay: 125ms;
}

/* 
    rgba(255, 255, 255, 0.15);
*/
.icon-selector{
    border-style: solid; 

    -webkit-transition: border-color 0.15s linear; /* Saf3.2+, Chrome */
       -moz-transition: border-color 0.15s linear; /* FF3.7+ */
         -o-transition: border-color 0.15s linear; /* Opera 10.5 */
            transition: border-color 0.15s linear;
}

.icon{
    display: flex;
    flex-direction: column;
    
    justify-content: center;
    align-items: center;
    
}
.grid-item{
    margin: auto;
    box-sizing: border-box;
    align-self: center;
    position: absolute;
    
    top: 50%;
    right: 50%;
    transform: translate(50%,-50%);

    transition: width 300ms ease-out;

    aspect-ratio: 1;
}

.grid-proper{
    position: relative;
}

.grid-wrapper{
    width:  100%;
    height: 100%;
    
    display: grid;
}

</style>