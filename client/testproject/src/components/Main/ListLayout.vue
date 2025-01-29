<!--

    Functionality to implement:
        
        Icon selection
        Icon drag and drop.

        Icon drag swapping.
-->


<template>
    <!-- Container wrapper -->
    <div
        class="list-container no-pointer-event"
        @click.self="checkReset($event)"
        @mouseup="checkDrop(); dragAndDrop.resetTimer();"
        @mouseenter="dragAndDrop.enabled ? mouseEnterList() : null"
        @mouseleave="mouseLeaveList()"
    >
        <TransitionGroup name="list">
            <div v-for="(item, index) in m_GroupData"
            :key="item.iconID"
            @mousemove="dragAndDrop.enabled ? hoveringIndex(index) : null"
            @click="listItemClick($event, index)"
            >
                <div
                    ref="list-item"         
                    class="list-item-wrapper flex"
                    :class="{ 'icon-Selection' : isSelectedIcon(index),
                              'unselect-icon'  : !isSelectedIcon(index)
                    }"
                    :style="{
                        'border-color': themeStorage.getIconColourOpacity( isSelectedIcon(index) ? 0.8 : 0.15 ),
                        'border-width': borderWidth,
                        'border-radius': borderRadius,
                        'height': editVariables.appearanceList.globalitemHeight,
                        'margin-top' : topBottomMargin,
                        'margin-bottom': topBottomMargin,
                        'padding' : itemPadding,
                    }"
                    @dblclick="(editVariables.isEnabled) ? null : openLink(index)"
                    @mousedown.left="(editVariables.isEnabled) ? iconHandlerDataMove($event, index) : null"
                >   
                    <!-- Icon if any -->
                    <div v-if="m_containerData.ListData.displayIcon &&
                            !(editVariables.appearanceList.isApplyGlobal && !editVariables.appearanceList.isDisableIcons)"
                        class="icon-spacing icon-center"
                        >
                        <SVGHandler
                            :width="svgSize"
                            :height="svgSize"
                            :path_Value="iconImageStorage.getPathData(item.iconImage)"
                            :view_Box="iconImageStorage.getViewBox(item.iconImage)"
                            :fill_Colour="colourIcon(item)"
                        />
                    </div>
            
                    <!-- Name -->
                    <div
                        class="base-text-wrapper"
                        :class="{
                            'center-text' : (isCenter && m_containerData.ListData.displayIcon && !(editVariables.appearanceList.isApplyGlobal && !editVariables.appearanceList.isDisableIcons)),
                        }"
                        :style="{
                            'font-size' : textSize,
                            'text-align': layoutCSSDirection,
                        }">
                        {{ item.iconString }}
                    </div>

                </div>

                <hr v-if="!isLastPosition(index) && !(editVariables.appearanceList.isApplyGlobal && !editVariables.appearanceList.globalDisplayListDivider) ">
            </div>
        </TransitionGroup>
    </div>

    <IconDragHandler
        ref="icon-drag-handler"
        :component_ID="component_ID"
    />    
</template>

<script>
import { editVariables } from '../../Data/SettingVariables';
import { iconData, iconSelect } from '../../Data/iconData';
import { containerData } from '../../Data/containerData';
import { multiSelect } from '../../Data/multiSelect';
import { dragAndDrop } from '../../Data/dragDrop';
import { iconStorage } from '../../Data/iconData';
import { mouseData } from '../../Data/mouseData';
import { themeStorage } from '../../Data/themeStorage';
import { profileHandler } from '../../Data/profileHandler';

import { toRaw } from 'vue';

import { iconImageStorage } from '../../Data/iconImages';

import SVGHandler from '../Input Components/SVGHandler.vue';
import IconDragHandler from './IconDragHandler.vue';

export default {
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

        isDisplayWindow:{
            type: Boolean,
            default: false,
        },


        component_ID: {
            type: String,
            default: "",
            required: true
        },
    },
    components:{
        IconDragHandler,
        SVGHandler,
    },
    data(){
        return{
            iconImageStorage,
            profileHandler,
            containerData,
            editVariables,
            themeStorage,
            iconStorage,
            dragAndDrop,
            multiSelect,
            iconSelect,
            mouseData,
            iconData,

            m_GroupData: null,
            m_containerData: null,
            m_OriginalDrag: false,

            m_placementIndex: -1,
            m_startIndex: -1,
            m_lastClickedIndex: -1,

            // JS doesn't distinguish between click
            // and click drag.
            // Need to compare coordinates
            m_ClickStart: {
                x: 0,
                y: 0,
            }
        }
    },
    created(){
        this.initData();
    },
    methods:{
        initData(){

            if(this.isProfileDisplay){
                this.m_containerData = containerData.getObjectFromIDData(profileHandler.getProfileData(this.profileDisplayName).containerDisplayData, this.component_ID);

                // group data does not exist
                if(!profileHandler.getProfileData(this.profileDisplayName).iconData){ 
                    iconData.createGroup(this.m_containerData.ID);
                    this.m_GroupData = iconData.getGroup(this.m_containerData.ID);
                    return;
                }
                
                this.m_GroupData = iconData.getGroupFromData(profileHandler.getProfileData(this.profileDisplayName).iconData, this.m_containerData.ID);
                return;
            }

            this.m_containerData = containerData.getObjectFromID(this.component_ID);
            this.m_GroupData = iconData.getGroup(this.m_containerData.ID);

            if(this.m_GroupData === null){ 
                iconData.createGroup(this.m_containerData.ID);
                return
            } // group data does not exist

            this.m_GroupData = iconData.getGroup(this.component_ID);
        },

        openLink(item){
            window.open(item.link, '_blank');
        },

// Profile functions
// -------------------------------------------------------------------------------------------

        listItemClick(event, index){

            if(this.isProfileDisplay)  return;

            this.kbShortcut(event);
            this.setSelectedIcon(index, true, true)
        },

// AABB collision detection
// -------------------------------------------------------------------------------------------

        // Because it is all filled from the start, add everything.
        initBounds(){
            
            if(this.m_GroupData.length === 0) return;

            // Sorted by y coordinate
            // Otherwise, the ref index will not be aligned with what is shown.
            let sortedRef = this.$refs['list-item'].sort(function(a,b){
                return a.getBoundingClientRect().y - b.getBoundingClientRect().y;
            })

            for(let i = 0; i < sortedRef.length; i++ ){
                multiSelect.allIconDataSetter(
                    sortedRef[i].getBoundingClientRect(), 
                    i,
                    this.setSelectedIcon
                );
            }

            this.m_ClickStart.x = mouseData.Coordinates.x;
            this.m_ClickStart.y = mouseData.Coordinates.y;
        },

        // Prevents reset if there is selection
        checkReset(event){
            if(Math.abs(event.x - this.m_ClickStart.x) < 2 || Math.abs(event.y - this.m_ClickStart.y) < 2){
                iconSelect.resetData();
            }
        },

// Drag drop temporary data
// ---------------------------------------------------------------------------------------------------
        
        // Swaps the temporary list
        hoveringIndex(index){
        
            // If not found in group, skip
            if(!iconData.isIconIDInGroup(this.m_GroupData, editVariables.iconDragData.storedID)) return;
            
            // Same position do nothing
            if(this.m_placementIndex == index) return; 
        
            this.m_placementIndex = index;
        },

        resetData(){
            this.resetSelection();
            this.m_placementIndex = -1;
            this.m_startIndex   = -1;
            this.m_OriginalDrag = false;
            multiSelect.setValidDrag(true);
            this.initData();
        },

// Mouse Functions
// ----------------------------------------------------------------------------------------------------------------

        // Sets alt and ctrl holds.
        kbShortcut(event){
            multiSelect.setHoldingShift(event.shiftKey);
            multiSelect.setHoldingCtrl(event.ctrlKey);
        },

        // Start drag handler
        iconHandlerDataMove(event, index){

            this.m_OriginalDrag   = true;
            this.m_placementIndex = index;
            this.m_startIndex     = index;

            // Ref of current grid position.
            this.$refs['icon-drag-handler'].dragDropSetup(event, index, this.getIconData(index), 'LIST');
        },

    // Conditions and values to check before drop functionality

        mouseEnterList(){
            dragAndDrop.updateContainerType('LIST'); 
            this.createTempGroupData();
        },

        /*
            Remove any temporary data cause from dragging in.
            Removes the visual for the current icon dragged out
        */
        mouseLeaveList(){

            // Resets the data back to the original 
            this.initData();

            // This is for removing the displayed original location 
            if(!this.m_OriginalDrag && !editVariables.iconDragData) return;

            // Prevent other icons from triggering this.
            if(editVariables.iconDragData.storedContainer !== this.component_ID) return;
            
            this.m_GroupData = structuredClone(toRaw(this.m_GroupData));

            (iconSelect.isMultiSelect) ? this.removeMultiSelectData() : this.removeSingleItemData();
        },

// Single and multi selection
// ----------------------------------------------------------------------------------------------------------------

        // Check if data is currently within the group
        isDataInGroup(iconID, groupID){
            let isContained = false;

            this.m_GroupData.forEach(element => {
                if(element.iconID === iconID && element.groupID === groupID){
                    isContained = true;
                }
            });

            return isContained;
        },

    /*
        Create temporary store to display the new data for the list
        This will get removed if the mouse is left
        But will remain if dropped.
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    */
        createTempGroupData(){

            // Do no add if this was the original location
            this.m_GroupData = structuredClone(toRaw(this.m_GroupData));

            if(!editVariables.iconDragData) return;

            // Check if drag is multiple.
            (iconSelect.isMultiSelect) ? this.createMultiSelectGroup() : this.createSingleItemGroup() ;
        },

        createMultiSelectGroup(){
            iconSelect.array.forEach(icon => {
                    if(!this.isDataInGroup(icon.iconID, icon.groupID)){
                        let tmpIcon = iconData.getIconDataFromID( iconData.getGroup(icon.groupID), icon.iconID);
                        this.m_GroupData.push(tmpIcon);
                    }
                });
            this.m_placementIndex = this.m_GroupData.length -1;
        },

        createSingleItemGroup(){

            // Check the origin of the data
            let containerString = (this.m_OriginalDrag) ? this.m_containerData.ID : editVariables.iconDragData.storedContainer;
            let tmpIcon = iconData.getIconDataFromID( iconData.getGroup(containerString), editVariables.iconDragData.storedID);

            this.m_GroupData.push(tmpIcon);
            this.m_placementIndex = this.m_GroupData.length -1;
        },

    // Mouse leave
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        getIndexFromGroup(iconID, groupID){
            let groupData = iconData.getGroup(groupID);
            let tmpIcon   = iconData.getIconDataFromID(groupData, iconID);
            return iconData.getIconIndexOfGroup(groupData, tmpIcon.iconID);
        },

        // TODO
        // Ok so now the problem is, that if there is data from different groups
        // for now, i will ignore this and only focus if they are within the same group and fix this later
        removeMultiSelectData(){
            iconSelect.array.forEach(icon => {
                this.m_GroupData.splice(this.getIndexFromGroup(icon.iconID, icon.groupID), 1);
            });
        },

        removeSingleItemData(){
            this.m_GroupData.splice(
                this.getIndexFromGroup(editVariables.iconDragData.storedID, editVariables.iconDragData.storedContainer),
                1
            );
        },

// Drop Algorithms
// ---------------------------------------------------------------------------------------------------------------------        

        // If dropped at any empty space
        checkDrop(){
            
            if(!editVariables.iconDragData){ return; } // Requires data
            
            // TODO
            // Again, this is the same stored ID and container,     
            // this has to be changed to use the icon data instead.

            // Assuming it is here, just push to end.
            let oldGroupID = editVariables.iconDragData.storedContainer;
            let iconID     = editVariables.iconDragData.storedID;

            // Check where has been dropped
            (oldGroupID !== this.m_containerData.ID) ? this.differentGroupDrop(iconID, oldGroupID) : this.sameGroupDrop() ;

            this.resetData();
        },

        // If dropped to different group
        differentGroupDrop(iconID, oldGroupID){
            if(iconSelect.isMultiSelect){

                // TODO
                // Ok so now the problem is, that if there is data from different groups
                // for now, i will ignore this and only focus if they are within the same group and fix this later
                iconSelect.array.forEach(icon => {
                    iconData.moveIcon(icon.iconID, icon.groupID, this.m_containerData.ID, 0, false);
                });
            }
            else{
                iconData.moveIcon(iconID, oldGroupID, this.m_containerData.ID, 0, false, this.m_placementIndex);
            }
            this.resetData();
        },

        // Swap within group.
        sameGroupDrop(){
            this.m_GroupData = iconData.getGroup(this.m_containerData.ID);

            let containerString = (this.m_OriginalDrag) ? this.m_containerData.ID : editVariables.iconDragData.storedContainer;
            let tmpIcon = iconData.getIconDataFromID( iconData.getGroup(containerString), editVariables.iconDragData.storedID);

            if(!iconData.isIconIDInGroup(this.m_GroupData, editVariables.iconDragData.storedID)) return;

            let iconIndex = iconData.getIconIndexOfGroup(this.m_GroupData, tmpIcon.iconID);
            iconData.deleteIndex(this.m_GroupData, iconIndex);
            iconData.moveItemToIndex(this.m_GroupData, this.m_placementIndex, tmpIcon);
        },

// Misc
// ------------------------------------------------------------------------------------------------------------

        // Colour
        colourIcon(item){
            
            // Use tertiary
            if(editVariables.appearanceIcon.isApplyGlobal && editVariables.appearanceIcon.isUseTertiary){
                return themeStorage.tertiary;
            }
            // Use colour
            else if(editVariables.appearanceIcon.isApplyGlobal && !editVariables.appearanceIcon.isUseTertiary){
                return editVariables.appearanceIcon.colour;
            }
            // Use icon own
            return item.colourIcon;
        },
        


        // Click selection for linkmaker
        isSelectedIcon(index){

            let icon = this.m_GroupData[index];
            if(!icon) return false;

            return iconSelect.isContainSelectedData(icon.iconID, this.m_containerData.ID);
        },

        // Because the icons are rendered in indexes, they must have values.
        setSelectedIcon(index, AABBcollision, click=false){
            let icon = this.m_GroupData[index];
            if(!icon) return; 
            // no data, however, this should not occur because it indexes through each of the elements

            // No collision, remove data
            if(!AABBcollision){
                iconSelect.removeData(icon.iconID, this.m_containerData.ID);
                return;
            }
            
            var keyHold = multiSelect.isHoldingCtrl || multiSelect.isHoldingShift;
            
            // No keys held
            if(!keyHold){
                // Standard click
                if(click){ iconSelect.resetData(); }

                // Drag or click
                iconSelect.addNewData(icon.iconID, this.m_containerData.ID);
                this.m_lastClickedIndex = index;
                return;
            }

            this.specialKeySelection(icon.iconID, index);
        },

        // For holding Shift or Ctrl
        specialKeySelection(iconID, index){
            // Check if empty
            if(multiSelect.isArrayEmpty){ this.initBounds(); }

            // Toggle index collision value
            if(multiSelect.isHoldingCtrl){
                multiSelect.toggleIndexCollision(index);

                (multiSelect.isIndexSelected(index)) ? iconSelect.addNewData(iconID, this.m_containerData.ID): iconSelect.removeData(iconID, this.m_containerData.ID);

                return;
            }

            // Shift click

            // Gets min and max indexes
            let indexA = this.m_lastClickedIndex;
            let indexB = index;

            if(indexA === -1 || indexB === -1) return; // non-valid values
            if(indexA === indexB) return; // the same

            let minIndex = (indexA > indexB) ? indexB : indexA;
            let maxIndex = (indexA > indexB) ? indexA : indexB;
            maxIndex += 1; // +1, it removes the current index

            multiSelect.setCollisionEnableList(minIndex, maxIndex); 

            // Set all the selected values on.
            for(let i = minIndex; i < maxIndex; i++){
                let icon = this.m_GroupData[i];
                iconSelect.addNewData(icon.iconID, this.m_containerData.ID);
            }
        },

        getIconData(index){ return this.m_GroupData[index]; },

    // Resetter

        resetSelection(){
            editVariables.resetIconDragData();
        },

        // Boolean

        // If iconID is empty
        hasIcon(item){ return (item.iconID !== ""); },

        // checks if index is last position of the indexing.
        isLastPosition(index){ return (this.m_GroupData.length-1 === index); },
    },
    computed:{

        // Boolean flag to redirect code from normal function to only display
        isProfileDisplay(){ return (this.isDisplayWindow)  },
                
        textSize(){

            if(this.isProfileDisplay) return "4px";

            return (editVariables.appearanceFont.isApplyGlobal) ? editVariables.appearanceFont.size : item.iconStringSize;
        },

        borderWidth() { return (this.isProfileDisplay) ? "2px" : "3px" },
        borderRadius(){ return (this.isProfileDisplay) ? "5px" : "10px"},

        svgSize(){ return (this.isProfileDisplay) ? "6px" : "2em";  },
        
        topBottomMargin(){ return (this.isProfileDisplay) ? "5px" : editVariables.appearanceList.globalPadding; },
        itemPadding(){ return (this.isProfileDisplay) ? '1px 2px' : '0.25em 0.5em'; },


        layoutCSSDirection(){ return containerData.getTextLayout(this.component_ID) },
        isCenter(){ return (this.layoutCSSDirection === "Center"); },
    },
    watch:{
        'editVariables.iconDragData.storedContainer'(val,oldVal){
            // null value, was reset
            if(!val){
                this.m_OriginalDrag = false;
            } 
        },
        'editVariables.resetFlag'(val, oldVal){
            if(val){
                this.initData();
            }
        },

        // Check if started multiselect drag
        'multiSelect.isEnabled'(val, oldVal){
            if(val){
                this.initBounds();
            }
        },
    }
}
</script>

<style scoped>

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 300ms ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}



.icon-success-enter-active {
    animation: grow 200ms ease-out;
    transition: opacity 50ms ease-in;
}

.icon-success-leave-active {
    animation: grow 200ms reverse ease-out;
    transition: opacity 50ms ease-in;
}

.icon-cancel-leave-active {
    transition: opacity 50ms ease-in;
}





.icon-drag-effect{
    position: absolute;
    transform: scale(1.5);
    z-index: 20;
}

.no-pointer-event{

    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
}

.icon-Selection{
    border-style: solid;
    border-radius: 10px;
    
    -webkit-transition: border-color 0.15s linear; /* Saf3.2+, Chrome */
       -moz-transition: border-color 0.15s linear; /* FF3.7+ */
         -o-transition: border-color 0.15s linear; /* Opera 10.5 */
            transition: border-color 0.15s linear;
}

.unselect-icon{
    border:rgba(255, 255, 255, 0.1);
    border-style: solid;
    border-radius: 10px;

    -webkit-transition: border-color 0.15s linear; /* Saf3.2+, Chrome */
       -moz-transition: border-color 0.15s linear; /* FF3.7+ */
         -o-transition: border-color 0.15s linear; /* Opera 10.5 */
            transition: border-color 0.15s linear;
}

.icon-spacing{
    padding-right: 0.75em;
}

.base-text-wrapper{
    width: 100%;
    height: auto;

    transition: font-size ease 200ms;


    margin-top: auto;
    margin-bottom: auto; 
    
    transition: all 300ms ease;
}

.center-text{
    height: auto;
    
    transition: all 300ms ease;

    justify-content: center;
    flex-direction: column;
    
}

.flex{
    display: flex;
}

.list-item-wrapper{
    box-sizing: border-box;
    position: relative;
    
    width: auto;
    margin: 0.5em;
    padding: 0.25em 0.5em;

    transition: all 300ms ease;
}

.list-container{
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    position: absolute;
}

</style>