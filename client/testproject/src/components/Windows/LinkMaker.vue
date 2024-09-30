<template>

    <div>
        <div class="flex flex-space">
            <SingleButton
            class="flex"
            @click="generateIcon">
                <h2 class="single-button-dark"> New icon </h2>
            </SingleButton>
            <SingleButton
            class="flex"
            @click="deleteIcon">
                <h2 class="single-button-dark"> Delete icon </h2>
            </SingleButton>
        </div>
        <WindowContainerDivider
            class="container-divider">
                <template #header> 
                    <h2 class="inline">
                        Saved Icons
                    </h2>
                </template>
        
                <template #content>
                    <div class="saved-grid width-full grid">
                        <template v-for="(item, index) in m_Rows * m_Columns" :key="index">
                            <div class="saved-icons grid-item"
                            @mouseup="checkDropIcon(index)">
                                
                                <!-- For rendering any icons saved -->
                                <template v-if="renderIcon(index)">
                                    <IconHandler
                                        :icon_data="getIconData(index)"
                                        @mousedown="(this.$GlobalStates.value.edit.enabled) ? dragAndDrop(index) : null"
                                    />
                                </template> 
                            </div>
                        </template>
                    </div>
                </template>
            </WindowContainerDivider>
    </div>
        <!-- Grid -->
    <div class="flex">
        <div class="width-half">
            <WindowContainerDivider
            class="container-divider">
                <template #header>
                    <h2 class="inline">
                        Displayed icon
                    </h2>
                </template>
        
                <template #content>
                    <div class="image-placeholder"
                    @click="console.log('Click! select icon.')"/>
                    <!-- <RangeSlider/> -->
                </template>
            </WindowContainerDivider>
        </div>

        <div class="width-half">
            <WindowContainerDivider
            class="container-divider">
                <template #header>
                    <h2 class="inline">
                        Name
                    </h2>
                </template>
        
                <template #content>
                    <input placeholder="Item name">
                </template>
            </WindowContainerDivider>
    
            <WindowContainerDivider
            class="container-divider">
                <template #header>
                    <h2 class="inline">
                        Icon Size
                    </h2>
                </template>
        
                <template #content>
                    <RangeSlider
                    :m_function="tmp"
                    :input_Data="['50','75', '100', '125']"/>
                </template>

                <template #tooltip>
                    <ToolTip> Size in px of the icon</ToolTip>
                </template>
            </WindowContainerDivider>

        </div>

    </div>

    <WindowContainerDivider
    class="container-divider">
        <template #header> 
            <h2 class="inline">
                Domain Name
            </h2>
        </template>

        <template #content>
            <div class="custom-select width-full">
                <select class="width-full">
                  <option value="0"></option>
                  <option value="1">https://Youtube.com</option>
                  <option value="2">https://Facebook.com</option>
                  <option value="3">Add</option>
                </select>
              </div>
        </template>

        <template #tooltip>
            <ToolTip>
                Top level domain of the website. You can store folders based on the domain.
            </ToolTip>
        </template>
    </WindowContainerDivider>

    <WindowContainerDivider
    class="container-divider">
        <template #header> 
            <h3 class="inline">
                Subdirectory
            </h3>
        </template>

        <template #content>
            <TextInput></TextInput>
        </template>

        <template #tooltip>
            <ToolTip>
                Directory after the domain name e.g youtube.com/{XYZ}
                where XYZ is the input
            </ToolTip>
        </template>
    </WindowContainerDivider>

    <WindowContainerDivider
    class="container-divider">
        <template #content>
            Open on new window? 
            <input type="checkbox">

            </input>
        </template>
    </WindowContainerDivider>
</template>

<script>
import ToolTip from '../Window Components/ToolTip.vue';
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import RangeSlider from '../Input Components/RangeSlider.vue';
import TextInput from '../Input Components/TextInput.vue';
import SingleButton from '../Input Components/SingleButton.vue';
import IconHandler from '../Main/IconHandler.vue';
import { iconData, iconStorage } from '../../Data/iconData';
import { mouseData } from '../../Data/mouseData';

export default {
    components: {
        WindowContainerDivider,
        ToolTip,
        RangeSlider,
        TextInput,
        SingleButton,
        IconHandler,
    },
    data(){
        return {
            iconStorage,
            mouseData,


            m_Rows: 4,
            m_Columns: 3,

            m_iconID: null
        }
    },
    methods: {

// Icon functions
// ------------------------------------------------------------------------------------------------------------


// Some of the functions are copied but altered from GridLayout.vue
// Perhaps I can move them to a single function later

        checkDropIcon(index){ // icon drag onto saved storage
            if(!this.$GlobalStates.value.edit.iconDragData){ return; } // Requires data

            let oldGroupID = this.$GlobalStates.value.edit.iconDragData.storedContainer;
            let iconID     = this.$GlobalStates.value.edit.iconDragData.storedID;
            
            if(oldGroupID === "Storage"){
                this.rearrangeIcons(index, iconID);
            }
            else{
                iconData.moveIcon(iconID, oldGroupID, "Storage", this.m_Columns, false);
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
            let newIcon = iconStorage.generateIcon(null, null, "Burger", "Icon");
            iconStorage.allData.push(newIcon);

            console.log(iconStorage.allData, "generated");
        },

        deleteIcon(){

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
                storedContainer:  "Storage",
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

        }
    }
}

</script>

<style scoped>

.grid-item{
    border: solid rgba(255, 255, 255, 0.4) 0.5px;
}

.saved-grid{
    border: 2px solid black;
    height: 150px;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    overflow-y: scroll;
}

.width-half{
    width: 50%;
}

.width-full{
    width: 100%;
}

.saved-icons{
    height: 116px;
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

.image-placeholder{
    border: 2px solid black;
    width: 150px;
    height: 150px;
}
</style>