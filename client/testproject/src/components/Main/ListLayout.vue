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
        @mousemove="dragAndDrop.enabled ? dragAndDrop.updateMouseDragType('LIST') : null"
    >
        <div v-for="(item, index) in m_GroupData" :key="index"
        >
            <div
                ref="list-item"         
                class="list-item-wrapper flex"
                :class="{ 'icon-Selection' : isSelectedIcon(index),
                          'unselect-icon'  : !isSelectedIcon(index)
                }"
                @click="(editVariables.isIconSelector) ? setSelectedIcon(index) : null"
                @dblclick="(editVariables.isEnabled) ? null : openLink(item)"
                @mouseup="checkDropIndex(index)"
                @mousedown="(editVariables.isEnabled) ? $refs['icon-drag-handler'].dragDropSetup($event, index, this.getIconData(index), 'LIST') : null"
            >   
                <!-- Icon if any -->
                <div v-if="hasIcon(item)"
                    class="icon-spacing"
                    >
                    <SVGHandler
                        class="icon-center"
                        width="2em"
                        height="2em"
                        :path_Value="iconImageStorage.getPathData(item.iconImage)"
                        :view_Box="iconImageStorage.getViewBoxName(item.iconImage)"
                        :fill_Colour="item.iconColour"
                    />
                </div>
        
                <!-- Name -->
                <div
                    class="center-text">
                    {{ item.iconString }}
                </div>

            </div>

            <hr v-if="!isLastPosition(index)">
        </div>
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
            } // group data does not exist

            this.m_GroupData = iconData.getGroup(this.component_ID);
        },

        openLink(item){
            window.open(item.link, '_blank');
        },

    // Taken from GridLayout.vue

        // pass data to dragdrop.js
        iconHandlerDataMove(event, index){

            // Ref of current grid position.
            this.$refs['icon-drag-handler'].dragDropSetup(event, index, this.getIconData(index).iconID, "LIST");
        },

        getIconData(index){ return this.m_GroupData[index]; },

        // Conditions and values to check before drop functionality

        // If dropped at any empty space
        checkDrop(){
            if(!editVariables.iconDragData){ return; } // Requires data
            
            // Assuming it is here, just push to end.
            let oldGroupID = editVariables.iconDragData.storedContainer;
            let iconID     = editVariables.iconDragData.storedID;

            if(oldGroupID !== this.m_containerData.ID){
                iconData.moveIcon(iconID, oldGroupID, this.m_containerData.ID, 0, false);
            }

            this.resetSelection();
        },

        // If dropped at a specific location
        // Need to swap
        checkDropIndex(index){
            if(!editVariables.iconDragData){ return; } // Requires data

            // let newGroupID = this.m_containerData.ID;
            // let oldGroupID = editVariables.iconDragData.storedContainer;
            // let iconID     = editVariables.iconDragData.storedID;

            // let isFree     = (this.m_containerData.gridData.contentAlign === "Free");
            // let dirIndex   = this.directionalIndexHandler(index);

            // // Find group to move to.
            // let moveToGroup      = (oldGroupID !== newGroupID) ? iconData.getGroup(newGroupID): this.m_GroupData ;
            // let isDifferentGroup = (oldGroupID !== newGroupID);

            // if(!this.isPositionAvailable(moveToGroup, dirIndex, isFree)){ 
            //     if(!this.isSameIcon(moveToGroup, dirIndex, iconID)){this.m_TransitionName = 'icon-cancel' }; 
            //     return;
            // }

            // this.dropIcon(oldGroupID, newGroupID, iconID, isDifferentGroup, isFree, dirIndex);
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
}
</script>

<style scoped>

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

/*

    Note,
    Height 100% prevents overflow to work.
    Height Npx prevents it to reach full height. 
*/

.list-container{
    height: 100%;
    width: 100%;
    overflow-y: auto;
    position: absolute;
}

/*

    Variable CSS for dragging elements

*/

.classA{
    background-color: rgba(0, 0, 0, 0.5);
}

.classB{
    background-color: rgba(255, 255, 255, 0.5);
}


</style>