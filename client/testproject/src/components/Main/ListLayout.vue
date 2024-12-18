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
        @click.self="iconSelect.resetData()"
        @mouseup="checkDrop(); dragAndDrop.resetTimer();"
        @mouseenter="dragAndDrop.enabled ? mouseEnterList() : null"
        @mouseleave="mouseLeaveList()"
    >
        
        <TransitionGroup name="list">
            <div v-for="(item, index) in m_GroupData"
            :key="item.iconID"
            @mousemove="dragAndDrop.enabled ? hoveringIndex(index) : null"
            >
                <div
                    ref="list-item"         
                    class="list-item-wrapper flex"
                    :class="{ 'icon-Selection' : isSelectedIcon(index),
                              'unselect-icon'  : !isSelectedIcon(index)
                    }"
                    @click="(editVariables.isIconSelector) ? setSelectedIcon(index) : null"
                    @dblclick="(editVariables.isEnabled) ? null : openLink(index)"
                    @mousedown="(editVariables.isEnabled) ? iconHandlerDataMove($event, index) : null"
                >   
                    <!-- Icon if any -->
                    <div v-if="hasIcon(item)"
                        class="icon-spacing"
                        >
                        <SVGHandler
                            width="2em"
                            height="2em"
                            :path_Value="iconImageStorage.getPathData(item.iconImage)"
                            :view_Box="iconImageStorage.getViewBoxName(item.iconImage)"
                            :fill_Colour="item.iconColour"
                        />
                    </div>
            
                    <!-- Name -->
                    <div
                        class="center-text"
                        :style="{
                            'font-size' : item.iconStringSize
                        }">
                        {{ item.iconString }}
                    </div>

                </div>

                <hr v-if="!isLastPosition(index)">
            </div>
        </TransitionGroup>
    </div>

    <IconDragHandler
        ref="icon-drag-handler"
        :component_ID="component_ID"
    />    
</template>

<script>

import { containerData } from '../../Data/containerData';
import { iconData, iconSelect } from '../../Data/iconData';
import { editVariables } from '../../Data/SettingVariables';
import { dragAndDrop } from '../../Data/dragDrop';
import { iconStorage } from '../../Data/iconData';

import { toRaw } from 'vue';

import { iconImageStorage } from '../../Data/iconImages';

import SVGHandler from '../Input Components/SVGHandler.vue';
import IconDragHandler from './IconDragHandler.vue';

export default {
    props:{
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
            containerData,
            editVariables,
            iconStorage,
            dragAndDrop,
            iconSelect,
            iconData,

            m_GroupData: null,
            m_containerData: null,
            m_OriginalDrag: false,

            m_placementIndex: -1,
            m_startIndex: -1,
        }
    },
    created(){
        this.initData();
    },
    methods:{
        initData(){

            this.m_containerData = containerData.getObjectFromID(this.component_ID);
            this.m_GroupData = iconData.getGroup(this.m_containerData.ID);

            if(this.m_GroupData === null){ 
                iconData.createGroup(this.m_containerData.ID);
                this.m_GroupData = iconData.getGroup(this.m_containerData.ID);
                return
            } // group data does not exist

            this.m_GroupData = iconData.getGroup(this.component_ID);
        },

        openLink(item){
            window.open(item.link, '_blank');
        },

    // Drag drop temporary data
        
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
            this.initData();
        },

    // Taken from GridLayout.vue

        getIconData(index){ return this.m_GroupData[index]; },

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

        // Resets the data.
        mouseLeaveList(){

            // Resets the data back to the original 
            this.initData();

            // This is for removing the displayed original location 
            if(!this.m_OriginalDrag && !editVariables.iconDragData) return;

            // Prevent other icons from triggering this.
            if(editVariables.iconDragData.storedContainer !== this.component_ID) return;
            
            this.m_GroupData = structuredClone(toRaw(this.m_GroupData));

            let groupData = iconData.getGroup(editVariables.iconDragData.storedContainer);
            let tmpIcon = iconData.getIconDataFromID(groupData, editVariables.iconDragData.storedID);
            
            let index = iconData.getIconIndexOfGroup(groupData, tmpIcon.iconID);

            this.m_GroupData.splice(index, 1);
        },

        
        createTempGroupData(){

            // Do no add if this was the original location
            this.m_GroupData = structuredClone(toRaw(this.m_GroupData));

            if(!editVariables.iconDragData) return;

            // Check the origin of the data
            let containerString = (this.m_OriginalDrag) ? this.m_containerData.ID : editVariables.iconDragData.storedContainer;

            let tmpIcon = iconData.getIconDataFromID( iconData.getGroup(containerString), editVariables.iconDragData.storedID);

            this.m_GroupData.push(tmpIcon);
            this.m_placementIndex = this.m_GroupData.length -1;
        },

        // If dropped at any empty space
        checkDrop(){
            if(!editVariables.iconDragData){ return; } // Requires data
            
            // Assuming it is here, just push to end.
            let oldGroupID = editVariables.iconDragData.storedContainer;
            let iconID     = editVariables.iconDragData.storedID;

            // Different group
            if(oldGroupID !== this.m_containerData.ID){
                iconData.moveIcon(iconID, oldGroupID, this.m_containerData.ID, 0, false, this.m_placementIndex);
            }
            else{
                // Swap within group.
                this.m_GroupData = iconData.getGroup(this.m_containerData.ID);

                let containerString = (this.m_OriginalDrag) ? this.m_containerData.ID : editVariables.iconDragData.storedContainer;
                let tmpIcon = iconData.getIconDataFromID( iconData.getGroup(containerString), editVariables.iconDragData.storedID);

                if(!iconData.isIconIDInGroup(this.m_GroupData, editVariables.iconDragData.storedID)) return;

                let iconIndex = iconData.getIconIndexOfGroup(this.m_GroupData, tmpIcon.iconID);
                iconData.deleteIndex(this.m_GroupData, iconIndex);
                iconData.moveItemToIndex(this.m_GroupData, this.m_placementIndex, tmpIcon);
            }

            this.resetData();
        },

        // Click selection for linkmaker
        isSelectedIcon(index){

            let icon = this.m_GroupData[index];
            if(!icon || !iconSelect) return false;
            return (icon.iconID === iconSelect.data.iconID && this.m_containerData.ID === iconSelect.data.groupID);
        },

        // Because they are rendered in indexes, they must have values.
        setSelectedIcon(index){
            let icon = this.m_GroupData[index];
            if(!icon) return; 
            // no data, however, this should not occur because it indexes through each of the elements

            iconSelect.setData(icon.iconID, this.m_containerData.ID);
        },

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
        }
    }
}
</script>

<style scoped>

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
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
    border: 3px solid rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    
    -webkit-transition: border-color 0.15s linear; /* Saf3.2+, Chrome */
       -moz-transition: border-color 0.15s linear; /* FF3.7+ */
         -o-transition: border-color 0.15s linear; /* Opera 10.5 */
            transition: border-color 0.15s linear;
}

.unselect-icon{
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;

    -webkit-transition: border-color 0.15s linear; /* Saf3.2+, Chrome */
       -moz-transition: border-color 0.15s linear; /* FF3.7+ */
         -o-transition: border-color 0.15s linear; /* Opera 10.5 */
            transition: border-color 0.15s linear;
}

.icon-spacing{
    padding-right: 0.75em;
}

.center-text{
    text-align: center;   
    margin-top: auto;
    margin-bottom: auto; 

    overflow: hidden;

    transition: font-size ease 200ms;
}

.flex{
    display: flex;
}

.list-item-wrapper{
    margin: 0.5em;
    box-sizing: border-box;

    width: auto;
    padding: 0.5em;
}

.list-container{
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    position: absolute;
}

</style>