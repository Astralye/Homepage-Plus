<template>
    <div>
        <div class="flex flex-space">
            <SingleButton class="flex"
                m_IconString="Dotted_Square"
                @click="generateIcon"
            >
                    <h2 class="single-button-dark"> New </h2>
            </SingleButton>
            
            <SingleButton
                class="flex"
                m_IconString="Dotted_Square"
                @click="deleteIcon"
            >
                <h2 class="single-button-dark"> Delete </h2>
            </SingleButton>
        </div>
        <WindowContainerDivider
            class="container-divider">
                <template #header> 
                    <h2 class="inline">
                        Saved Icons
                    </h2>
                </template>

                <template #tooltip>
                    <ToolTip> When the window is open, you can select via clicking</ToolTip>
                </template>

                <template #content>
                    <div class="saved-grid width-full grid">

                        <!-- Grid pattern -->
                        <div v-for="(item, index) in m_Rows * m_Columns" :key="index"
                            class="saved-icons flex"
                            :class="{ 'icon-Selection' : isSelectedIcon(index), 
                                      'grid-item' : !isSelectedIcon(index),
                                      'mouse-pointer': renderIcon(index)}"

                            @mouseup="checkDropIcon(index)"
                            @click="(this.$GlobalStates.value.edit.isIconSelector) ? setSelectData(index) : null"
                        >
                            <!-- For rendering any icons saved -->
                            <IconHandler v-if="renderIcon(index)"
                                :icon_data="getIconData(index)"
                                @mousedown="(this.$GlobalStates.value.edit.enabled) ? dragAndDrop(index) : null"
                            />
                        </div>
                    </div>
                </template>
            </WindowContainerDivider>
    </div>
        <!-- Grid -->

    <!-- If none is selected, remove all -->

    <Tabs :tab_Array="[ 'IconCustomize' , 'IconFunction' ]" folder_Name="LinkTabs"/>

</template>

<script>
import ToolTip from '../Window Components/ToolTip.vue';
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import TextInput from '../Input Components/TextInput.vue';
import SingleButton from '../Input Components/SingleButton.vue';
import IconHandler from '../Main/IconHandler.vue';
import Tabs from '../Window Components/Tabs.vue';

import { iconData, iconStorage, iconSelect } from '../../Data/iconData';
import { mouseData } from '../../Data/mouseData';

export default {
    components: {
        WindowContainerDivider,
        ToolTip,
        TextInput,
        SingleButton,
        IconHandler,
        Tabs,
    },
    data(){
        return {
            iconStorage,
            mouseData,
            iconSelect,

            m_Rows: 4,
            m_Columns: 3,

            m_iconID: null,

            m_STORAGE: "Storage",
        }
    },
    created(){
        this.$GlobalStates.value.edit.isIconSelector = true;
    },
    unmounted(){
        this.$GlobalStates.value.edit.isIconSelector = false;
        
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
            if(!this.$GlobalStates.value.edit.iconDragData){ return; } // Requires data

            let oldGroupID = this.$GlobalStates.value.edit.iconDragData.storedContainer;
            let iconID     = this.$GlobalStates.value.edit.iconDragData.storedID;
            
            if(oldGroupID === this.m_STORAGE){
                this.rearrangeIcons(index, iconID);
            }
            else{
                iconData.moveIcon(iconID, oldGroupID, this.m_STORAGE, this.m_Columns, false);
            }
            this.resetSelection();
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

        resetSelection(){
            this.$GlobalStates.value.edit.iconDragData = null;
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

// Reused code from Gridlayout.vue, could put into own file later

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
                storedContainer:  this.m_STORAGE,
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

// ------------------------------------------------------------------------------------------------------------

        renderIcon(index){ // Check if there is data
            // console.log(iconStorage.allData[index]);
            return (iconStorage.allData[index]) ? true : false;
        },
        tmp(){

        },
    }
}

</script>

<style scoped>

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

.saved-grid{
    border: 2px solid black;
    border-radius: 5px;
    height: 150px;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    overflow-y: scroll;
}

.width-full{
    width: 100%;
}

.saved-icons{
    aspect-ratio: 1;
}

.grid{
    display: grid;
}

.flex{
    display: flex;
}

.flex-space{
    justify-content: space-between;
}
</style>