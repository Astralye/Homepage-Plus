<template>

    <!-- Container for Displaying icons and selection  -->
    <div @mouseup="resetTimer">
        <WindowContainerDivider>
        <template #header>
            <h2> Icon selection </h2>
        </template>

        <template #content>
        <div class="flex flex-space">
            <SingleButton
                class="flex"
                @click="generateIcon" 
                button_toggle="true"
                m_IconString="Dotted_Square"
            >
                New
            </SingleButton>
            
            <SingleButton
                class="flex"
                m_IconString="Delete"
                button_toggle="true"
                @click="deleteIcon"
            >
                Delete
            </SingleButton>

        </div>

        <br>

        <h3> Saved Icons </h3>
    
            <div class="saved-grid width-full grid">

                <!-- Grid pattern -->
                <div v-for="(item, index) in m_Rows * m_Columns" :key="index"
                    class="saved-icons flex noselect"
                    :class="{ 'icon-Selection' : isSelectedIcon(index), 
                                'grid-item' : !isSelectedIcon(index),
                                'mouse-pointer': renderIcon(index)}"

                    @mouseup="checkDropIcon(index)"
                    @click="(editVariables.isIconSelector) ? setSelectData(index) : null"
                >
                    <div class="icon-container flex">

                        <!-- 
                            For rendering any icons saved
                        -->
                        <Transition name="fade">
                            <SVGHandler v-if="renderIcon(index)"
                                ref="icon-Take"
                                :ref_Value="'icon-location'"

                                height="90%"
                                width="90%"
                                
                                :path_Value="iconImageStorage.getPathData(getIconData(index).iconImage)"
                                :fill_Colour="getIconData(index).iconColour"
                                :view_Box="iconImageStorage.getViewBoxName(getIconData(index).iconImage)"
                                class="center icon-center"
                                :class="{'opacity-none' : ( m_DraggingEvent && isStoredIndex(index)),
                                         'opacity-full' : !m_DraggingEvent }"

                                @mousedown="initDragDrop($event, index)"
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

                                :path_Value="m_DisplayIconData.iconImage"
                                :fill_Colour="m_DisplayIconData.iconColour"
                                :view_Box="m_DisplayIconData.viewBox"
                                                                
                                height="50px"
                                width="50px"
                            />
                        </Transition>
                    </Teleport>
                </div>
            </div>

        </template>
        </WindowContainerDivider>
    </div>
        <!-- Grid -->

    <!-- If none is selected, remove all -->

<!-- 
    Icon customization 
    ------------------------------------------------------------------------------------------------------
-->

    <Tabs :tab_Array="[ 'IconCustomize' , 'IconFunction' ]" folder_Name="LinkTabs"/>

<!-- 
    Icon Function
    ------------------------------------------------------------------------------------------------------
-->
</template>

<script>
import ToolTip from '../Window Components/ToolTip.vue';
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import TextInput from '../Input Components/TextInput.vue';
import SingleButton from '../Input Components/SingleButton.vue';
import IconHandler from '../Main/IconHandler.vue';
import Tabs from '../Window Components/Tabs.vue';

import { iconImageStorage } from '../../Data/iconImages';

import { iconData, iconStorage, iconSelect } from '../../Data/iconData';
import { mouseData } from '../../Data/mouseData';

import { editVariables } from '../../Data/SettingVariables';

import SVGHandler from '../Input Components/SVGHandler.vue';

export default {
    components: {
        WindowContainerDivider,
        SingleButton,
        IconHandler,
        SVGHandler,
        TextInput,
        ToolTip,
        Tabs,
    },
    data(){
        return {
            iconImageStorage,
            editVariables,
            iconStorage,
            iconSelect,
            mouseData,

            m_Rows: 4,
            m_Columns: 3,

            m_STORAGE: "Storage",
            
            // Icon drag visual variables

            m_DisplayIconData:{
                iconColour: "#000000",
                iconSize: "100",
                iconImage: "",
                viewBox: "",
            },

            m_TransitionName: 'icon-success',

            m_iconID: null,
            m_DraggingEvent: false,
            m_IconDragRef: null,
            m_SavedIndex: 0,
            m_MouseOffset:{
                x: 0,
                y: 0,
            }
        }
    },
    created(){
        editVariables.enableIsIconSelector();
    },
    unmounted(){
        editVariables.disableIsIconSelector();
        iconSelect.resetData();
    },
    methods: {

// File handler
// ----------------------------------------------------------------------------------------------------------

// Icon functions
// ------------------------------------------------------------------------------------------------------------

        isSelectedIcon(index){
            if(!this.getIconData(index) || !iconSelect ){ return false; } // No data
            return (this.getIconData(index).iconID === iconSelect.data.iconID && this.m_STORAGE === iconSelect.data.groupID);
        },

        setSelectData(index){
            let data = iconStorage.getIconDataFromIndex(iconStorage.allData, index);
            if(!data){ iconSelect.resetData(); return; } // no data
            iconSelect.setData(data.iconID, this.m_STORAGE);
        },

// Some of the functions are copied but altered from GridLayout.vue
// Perhaps I can move them to a single function later

        checkDropIcon(index){ // icon drag onto saved storage
            if(!editVariables.iconDragData){ return; } // Requires data

            let oldGroupID = editVariables.iconDragData.storedContainer;
            let iconID     = editVariables.iconDragData.storedID;
            
            if(oldGroupID === this.m_STORAGE){
                this.rearrangeIcons(index, iconID);
            }
            else{
                iconData.moveIcon(iconID, oldGroupID, this.m_STORAGE, this.m_Columns, false);
            }

            editVariables.resetIconDragData()
        },

        rearrangeIcons(index_A, iconID){
            let group   = iconStorage.allData;
            let data    = iconStorage.getIconDataFromIndex(group, index_A);
            let index_B = iconStorage.getIconIndexOfGroup(group, iconID);
            
            (data) ? iconStorage.swapIndices(group, index_A, index_B) : iconStorage.moveItemToEnd(group, index_B);
        },

        getIconData(index){
            return iconStorage.allData[index];
        },

        generateIcon(){
            let newIcon = iconStorage.generateDefaultIcon();
            iconStorage.allData.push(newIcon);
        },

        deleteIcon(){
            // If nothing, a popup shows 'nothing selected', like the storage values.
            if(iconSelect.dataValue.groupID === "" || iconSelect.dataValue.iconID === "") { return; }

            // Perhaps popup message comes here to confirm
            // User can click a 'Stop showing me this message prompt'

            iconData.deleteIcon(iconSelect.dataValue.groupID, iconSelect.dataValue.iconID);
            iconSelect.resetData();
        },

// Mouse functions
// ------------------------------------------------------------------------------------------------------------

// Reused code from Gridlayout.vue

        initDragDrop: function(event, index){

            var runFnc = false;
            this.m_draggableFnc = setTimeout(() => { 

                // Checks if the current mouse hover is over the same element
                document.querySelectorAll( ":hover" ).forEach(el => {
                    if(el == event.target){ runFnc = true; return;}
                });
                
                if(!runFnc){ return; }

                this.m_iconID = this.getIconData(index).iconID;
                this.m_IconDragRef = this.$refs["svgRef"][index].$refs;
                this.m_DraggingEvent = true;
                this.m_SavedIndex = index;
                this.m_TransitionName = 'icon-success';

                editVariables.setIconDragData({
                    storedContainer:  this.m_STORAGE,
                    storedID: this.m_iconID,
                });

                mouseData.movementFunctions ([ this.edit_Drag_Move ]);
                mouseData.mouseUpFunctions  ([ this.disableDrag ]);
                
                mouseData.enableTracking();
                mouseData.enableMouseUp();

                this.setSVGDragData();
                this.initIconDragPosition(event.clientX, event.clientY);

            }, 125);

        },

        edit_Drag_Move(){
            this.updateIconDragPosition(mouseData.Coordinates.x, mouseData.Coordinates.y);
        },

        disableDrag(){
            mouseData.disableTracking();
            mouseData.disableMouseUp();

            this.m_DraggingEvent = false;
            this.m_iconID = null;
            this.m_SavedIndex = 0;
        },

    // Taken from Gridlayout.vue
        
        // If user lifts mouse event before timer
        resetTimer(){
            clearTimeout(this.m_draggableFnc);
        },

        isStoredIndex(index){
            return (index === this.m_SavedIndex);
        },

        setSVGDragData(){
            let svgData = this.getStoredIconData();
            this.m_DisplayIconData.iconImage  = iconImageStorage.getPathData(svgData.iconImage);
            this.m_DisplayIconData.iconColour = svgData.iconColour;
            this.m_DisplayIconData.iconSize   = svgData.iconSize;
            this.m_DisplayIconData.viewBox    = iconImageStorage.getViewBoxName(svgData.iconImage);
        },

        getStoredIconData(){
            if(!editVariables.iconDragData || !this.m_iconID){ return; } // Requires data

            let group = iconData.getGroup(editVariables.iconDragData.storedContainer);
            return iconData.getIconDataFromID(group, this.m_iconID);
        },

        // Updates the css values to match the cursor
        updateIconDragPosition(x, y){
            this.m_IconDragRef['draggingIcon'].style.left = x - this.m_MouseOffset.x + 'px';
            this.m_IconDragRef['draggingIcon'].style.top  = y - this.m_MouseOffset.y + 'px';
        },

        // This is the offset of the starting position that the mouse offsets by when moving
        initIconDragPosition(initX, initY){

            this.setMouseOffset(initX, initY);
            this.updateIconDragPosition(initX, initY); // This value will always be constant at the start
        },

        setMouseOffset(x,y){

            let iconRealLocation = this.$refs['icon-Take'][this.m_SavedIndex].$refs['icon-location'].getBoundingClientRect();

            if(!iconRealLocation){ return; }

            // grid item is the coordinates of the container, an offset is added to put it at the center
            let gridXoffset = iconRealLocation.left + (iconRealLocation.width  / 5);
            let gridYoffset = iconRealLocation.top  + (iconRealLocation.height / 5);

            // mouseOffset is the difference in px from the mouse to the grid offset.
            // Used to prevent snapping of top left corner to mouse.
            this.m_MouseOffset.x = x - gridXoffset;
            this.m_MouseOffset.y = y - gridYoffset;
        },


// ------------------------------------------------------------------------------------------------------------

        renderIcon(index){ // Check if there is data
            return (iconStorage.allData[index]) ? true : false;
        },
        tmp(){

        },
    }
}

</script>

<style scoped>
/*
    Copied from Gridlayout
*/

@keyframes grow {
    0% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(2.5);
    }
}


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

.icon-drag-effect{
    pointer-events: none;
    position: absolute;
    transform: scale(2.5);
    z-index: 20;
}

.opacity-none{
    opacity: 0;
}

.opacity-full{
    transition: all 125ms ease-in-out;
    transition-delay: 125ms;
}

/* 
    ----------------------------------------------------------------
*/

.mouse-pointer{
    cursor: pointer;
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
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;

    -webkit-transition: border-color 0.15s linear; /* Saf3.2+, Chrome */
       -moz-transition: border-color 0.15s linear; /* FF3.7+ */
         -o-transition: border-color 0.15s linear; /* Opera 10.5 */
            transition: border-color 0.15s linear;
}

.icon-container{
    width: 6em;
    height: auto;
}

.saved-grid{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;

    border: 2px solid var(--Accent-background-colour);
    border-radius: 5px;
    height: 200px;
    overflow-y: scroll;
}

.width-full{
    width: 100%;
}

.saved-icons{
    aspect-ratio: 1;
    margin: 0.25em;
    position: relative;
}

.flex{
    display: flex;
}

.flex-space{
    justify-content: space-between;
}
</style>