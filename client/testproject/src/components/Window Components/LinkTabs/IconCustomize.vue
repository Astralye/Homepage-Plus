<template>
    <div>
        <!-- Main container -->
        <div class="flex">

            <!-- Display icon -->
            <div class="width-half">
                <WindowContainerDivider
                    class="container-divider">
                    <template #header>
                        <h2 class="inline">
                            Displayed icon
                        </h2>
                    </template>
            
                    <template #content>
                        <!-- Icon display -->
                        <div class="image-placeholder flex pos-relative mouse-hover"
                        @click.self="windowHandler.toggleWindow('icon menu')">

                            <!-- Empty selection. Display default -->
                            <template v-if="!isCurrentlySelected()">
                                <div class="icon-fit center fit-content"
                                    @click="windowHandler.toggleWindow('icon menu')">
                                    <SVGHandler
                                        height="150"
                                        width="150"
                                        :fill_Colour="m_SelectedObject.iconColour"
                                        :path_Value="iconImageStorage.getPathData(m_SelectedObject.iconImage)"
                                        :view_Box="iconImageStorage.getViewBoxName(m_SelectedObject.iconImage)"
                                    />
                                </div>
                                <div class="pos-absolute bottom-right button-shift">
                                    <ColourPicker
                                        :loaded_Data="m_SelectedObject.iconColour"
                                        @setColour="(hex) => setColourData(hex)"
                                    />
                                </div>
                            </template>
                            
                            <!-- Contains value -->
                            <template v-else>
                                <SVGHandler
                                    height="100%"
                                    width="100%"
                                    :path_Value="iconImageStorage.getPathData('Cross')"
                                    :view_Box="iconImageStorage.getViewBoxName('Cross')"
                                />
                            </template>
                        </div>

                        <template v-if="isCurrentlySelected()">
                            <p>
                                None currently selected!
                            </p>
                        </template>
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
                        <TextInput
                            :placeholder_text="'Icon name'"
                            v-model="m_SelectedObject.iconString"/>
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
                            :no_Items="m_iconSizePixels.length"
                            :caption_Data="m_iconSizePixels"
                            v-model="m_SelectedObject.iconSize"
                            />
                    </template>

                    <template #tooltip>
                        <ToolTip> Size in px of the icon</ToolTip>
                    </template>
                </WindowContainerDivider>

            </div> 

        </div>

        <div>
            <label>
                <input type="checkbox" v-model="m_SelectedObject.displayText">
                Display text
            </label>
        </div>
    </div>

    
    <!-- Icon menu Window -->
    <teleport to="body">
        <Transition name="fade">
            <Window
            windowHandler
                v-if="windowHandler.getEditValue('Icon Menu')"
                title="Icon Menu"
                :width="500"
                @focusTab="focusClickedTab">
                <template #window-icon>
                    <SVGHandler
                        height="35px"
                        width="auto"
                        view_Box="0 -960 960 960"
                        fill_Colour="#CCCCCC"
                        :path_Value="iconImageStorage.getPathData('Bookmark_Plus')"
                    />
                </template>

                <template #window-content>
                <!-- Window content -->

                <WindowContainerDivider>
                    <template #content>
                        <div class="saved-grid width-full grid">
                            <template v-for="(item, index) in m_Rows * m_Columns" :key="index">
                                
                                <div class="saved-icons flex"
                                    :class="{ 'icon-Selection' : isSelectedIcon(index), 'grid-item' : !isSelectedIcon(index) }"
                                    >
                                    <template v-if="iconImageStorage.isValidIndex(index)">
                                        <SVGHandler
                                            width="100%"
                                            height="auto"
                                            :fill_Colour="m_localIconColourHex"
                                            :path_Value="getSVG(index)"
                                            :view_Box="iconImageStorage.getViewBoxIndex(index)"
                                            @click="newSelect(index)"
                                        />
                                    </template>
                                    <!-- It needs to load the correct icon -->
                                </div>
                            </template>
                        </div>
                    </template>
                </WindowContainerDivider>

                </template>
            </Window>
        </Transition>
    </teleport>


</template>

<script>
import ToolTip from '../ToolTip.vue';
import WindowContainerDivider from '../WindowContainerDivider.vue';
import RangeSlider from '../../Input Components/RangeSlider.vue';
import TextInput from '../../Input Components/TextInput.vue';

import SVGHandler from '../../Input Components/SVGHandler.vue';

import Window from '../Window.vue';
import { windowHandler } from '../../../Data/userWindow';

import { iconData, iconSelect } from '../../../Data/iconData';
import { iconImageStorage } from '../../../Data/iconImages';
import ColourPicker from '../../Input Components/ColourPicker.vue';


export default {
    components:{
        WindowContainerDivider,
        ToolTip,
        RangeSlider,
        TextInput,

        SVGHandler,

        Window,

        ColourPicker,

        RangeSlider
    },
    data() {
        return {
            iconSelect,
            iconImageStorage,
            windowHandler,

            m_SelectedObject: {},
            m_SelectedIconIndex: -1,
            
            displayText: true,

            m_Rows: 7,
            m_Columns: 0,

            m_iconSizePixels: ['50', '75', '100', '125'],

            m_localIconColourHex: "#CCCCCC"
        }
    },

    created(){
        this.calculateDimensions();
    },

    unmounted(){
        windowHandler.disableWindow("Icon menu")
    },

    methods:{

// Colour picker Values
// ----------------------------------------------------------------------------------------------

        setColourData(hex){
            this.m_SelectedObject.iconColour = hex;
        },

// Data retrieval
// ---------------------------------------------------------------------------------------------- 

        getIndex(){
            for(let i = 0; i < this.m_iconSizePixels.length; i++){
                if(this.m_SelectedObject.iconSize === this.m_iconSizePixels[i]){ return i; }
            }
        },

        // Changes the currently selected. Displays
        newSelect(index){
            if(this.isCurrentlySelected()){ return; } // No selection

            let svg = iconImageStorage.getPathFromIndex(index);
            this.m_SelectedObject.iconImage = svg.name;
            this.setSVGIndex(svg.name);
        },
        
        getSVG(index){
            let svg = iconImageStorage.getPathFromIndex(index);
            return svg.pathData;
        },

        calculateDimensions(){
            // Need to get the size of the folder and all the icons.

            let noIcons = 40; // arbiturary number
            // Should be the N total icons
            this.m_Columns = ~~(noIcons / this.m_Rows);
        },

        // Check if current selected icon is the index.
        isSelectedIcon(index){
            if(this.isCurrentlySelected()){ return; } // No selection
            return (this.m_SelectedIconIndex === index);
        },

        // Window functions 

        focusClickedTab(name){

            // Run code if > 1 element
            if(this.$windowStack.length <= 1) { return; }

            let windowString = name.toLowerCase();
            let index = this.$windowStack.value.indexOf(windowString);

            // Run code if not last
            if(index == this.$windowStack.value.length-1) { return; }

            if (index > -1) {
                let tmp = this.$windowStack.value[index];
                this.$windowStack.value.splice(index, 1);
                this.$windowStack.value.push(tmp);
            }
        },

        // Check for empty object
        isCurrentlySelected(){
            return (Object.keys(this.m_SelectedObject).length === 0 && this.m_SelectedObject.constructor === Object);
        },

        displaySelectedData(newIconData){
            if(newIconData.iconID === "" || newIconData.groupID === ""){ this.m_SelectedObject = {}; return; }

            let group = iconData.getGroup(newIconData.groupID);
            this.m_SelectedObject = iconData.getIconDataFromID(group, newIconData.iconID);

            this.setSVGIndex(this.m_SelectedObject.iconImage);
        },

        // From the name of the icon, get the index at which it appears in iconImages
        setSVGIndex(svgName){
            this.m_SelectedIconIndex = iconImageStorage.getIndexFromName(svgName);
        },

        changeIconSize(index){
            this.m_SelectedObject.iconSize = this.m_iconSizePixels[index];
        }
    },

// ----------------------------------------------------------------------------------------------
    watch: {
        'iconSelect.dataValue': {
            handler(val){ this.displaySelectedData(val); },
            deep: true
        },
    }
}
</script>

<style scoped>

.bottom-right{
    bottom: 0;
    right: 0;
}

.button-shift{
    transform: translate(2px, 2px);
}

.pos-relative{
    position: relative;
}

.pos-absolute{
    position: absolute;
}

.mouse-hover{
    transition: all 0.15s ease-in-out;
}

.mouse-hover:hover{
    background-color: rgba(50, 50, 50, 0.3);
    cursor: pointer;
}

.icon-Selection{
    border: 4px solid brown;
    transition: all 0.2s ease-in-out;
}

.center{
    margin: auto;
}

.fit-content{
    max-width: fit-content;
}

.icon-fit{
    width: 100%;
    height: auto;
}

.grid-item{
    border: solid rgba(255, 255, 255, 0.4) 0.5px;

    transition: all 0.2s ease-in-out;
}

.saved-grid{
    border: 2px solid black;
    height: 300px;
    grid-template-columns:  repeat(7, 1fr);
    overflow-y: scroll;
}

.width-half{
    width: 50%;
}

.width-full{
    width: 100%;
}

.saved-icons{
    height: 100%;
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

.image-placeholder{
    border: 2px solid black; 
    border-radius: 1em;
    width: 100%;
    height: 175px;
}
</style>