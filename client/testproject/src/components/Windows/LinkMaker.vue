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
                :enabled="(iconSelect.dataValue.iconID != '')"
                @click="deleteIcon"
            >
                Delete
            </SingleButton>

        </div>

        <br>

        <h3> Saved Icons </h3>
            <div class="saved-grid width-full">

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

    <!-- 
        Possibly display a tree, or show the screen.

        Non-functional
    -->
    <WindowContainerDivider>
        <template #header>
            <h2>  Icon Location </h2>
        </template>

        <template #content>
            <SingleButton>
                Select area to put icon
            </SingleButton>
        </template>
    </WindowContainerDivider>

    <WindowContainerDivider>
        <template #content>

        <!-- Tabs -->
        <TabWrapper
            :tab_Buttons="m_IconTypeTabs"
            :default_Tab="0"
        >

<!-- 
    Icon customization 
    &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  
-->
            <template #Tab-0>
                <div class="width-full flex">
                    <WindowContainerDivider>
                        <template #header>
                            <h2>
                                Displayed icon
                            </h2>
                        </template>
                
                        <template #content>
                            <!-- Icon display -->
                            <div class="flex display-wrapper">
            
                                <!-- Modification buttons -->
                                <div class="flex button-column"> 
                                <!-- Colour -->
                                    <div class="modification-button">
                                        <ColourPicker
                                            :loaded_Data="m_SelectedObject.iconColour"
                                            @setColour="(hex) => setColourData(hex)"
                                            :enabled="isCurrentlySelected"
                                        />
                                    </div>
            
                                    <div class="modification-button">
                                        <SingleButton
                                            class="width-full"
                                            m_IconString="Image"
                                            @click="windowHandler.toggleWindow('icon menu')"
                                            :enabled="isCurrentlySelected"
                                        >
                                            Icon
                                        </SingleButton>
                                    </div>
            
                                    <div class="modification-button">
                                        <SingleButton
                                            class="width-full"
                                            m_IconString="Aspect-Ratio"
                                            @click="console.log('iconSize')"
                                            :enabled="isCurrentlySelected"
                                        >
                                            Icon Size
                                        </SingleButton>
                                    </div>
            
                                    <div class="modification-button">
                                        <SingleButton
                                            class="width-full"
                                            m_IconString="Edit-Note"
                                            @click="console.log('icon text')"
                                            :enabled="isCurrentlySelected"
                                        >
                                            Icon Text
                                        </SingleButton>
                                    </div>
            
                                    <div class="modification-button">
                                        <SingleButton
                                            class="width-full"
                                            m_IconString="Text-UL"
                                            @click="console.log('text size')"
                                            :enabled="isCurrentlySelected"
                                        >
                                            Text size
                                        </SingleButton>
                                    </div>
                                </div>
            
                                <div class="image-placeholder flex">
            
                                    <!-- Empty selection. Display default -->
                                    <template v-if="isCurrentlySelected">
                                        <div class="icon-fit center fit-content">
                                            <SVGHandler
                                                class="icon-center"
                                                height="90%"
                                                width="90%"
                                                :fill_Colour="m_SelectedObject.iconColour"
                                                :path_Value="iconImageStorage.getPathData(m_SelectedObject.iconImage)"
                                                :view_Box="iconImageStorage.getViewBoxName(m_SelectedObject.iconImage)"
                                            />
                                        </div>
                                    </template>
                                    
                                    <!-- Contains value -->
                                    <template v-else>
                                        <div class="icon-fit center fit-content">
                                            <SVGHandler
                                                class="icon-center"
                                                height="90%"
                                                width="90%"
                                                :path_Value="iconImageStorage.getPathData('Cross')"
                                                :view_Box="iconImageStorage.getViewBoxName('Cross')"
                                            />
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </WindowContainerDivider>
                </div>
            
                <WindowContainerDivider>
                    <template #header>
                        <h3> Setting that changes</h3>
                    </template>
            
                    <template #content>
                        Display Content
                    </template>
                </WindowContainerDivider>
            
            </template>

<!-- 
    Icon Functionality
    &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  
-->

            <template #Tab-1>

                <!-- Non-functional -->
                <RadioBtn
                    v-model="m_FunctionalityType"
                    :enable_Radio="isCurrentlySelected"
                    @clickEvent="val => console.log(val)"
                />
                
                <WindowContainerDivider
                class="container-divider">
                    <template #header> 
                        <h2>
                            URL Link
                        </h2>
                    </template>
            
                    <template #content>
                        <TextInput
                            v-model="m_DisplayLink"
                            :enabled="isCurrentlySelected"
                        />
                    </template>
            
                    <template #tooltip>
                        <ToolTip>
                            Calculates the domain and directory automatically.
                            'https://' is required otherwise it opens the relative to this site.
                        </ToolTip>
                    </template>
                </WindowContainerDivider>
            
                <WindowContainerDivider>
                    <template #content>
                        <WindowContainerDivider
                        class="container-divider">
                            <template #header> 
                                <h3>
                                    Hostname
                                </h3>
                            </template>
                
                            <template #content>
                                <OptionSelect
                                    v-model="m_StoredDomains"
                                    :enabled="isCurrentlySelected"
                                    :Selected_Index="m_SelectedIndex"
                                    @Selected-Value="value => m_LinkInfo.root = value"
                                />
                            </template>
                
                            <template #tooltip>
                                <ToolTip>
                                    Root name of a website. It contains something like [www.XYZ.jkl]
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
                                <TextInput 
                                    v-model="m_LinkInfo.subdirectory"
                                    :enabled="isCurrentlySelected"
                                />
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

                                <!-- Non-Functional -->
                                <Checkbox
                                    :checkValue="true"
                                    :enabled="isCurrentlySelected"
                                    text="Open on new window?"
                                /> 
                    
                                <div class="right-side">
                                    <SingleButton
                                        :m_iconString="Save"
                                        @click="updateLink()"
                                        :enabled="isCurrentlySelected"
                                    >
                                        Save
                                    </SingleButton>
                                </div>
                            </template>
                        </WindowContainerDivider>
                    </template>
                </WindowContainerDivider>
            </template>
            <template #Tab-2>
                Tab-3
            </template>
        </TabWrapper>

        
    </template>
    </WindowContainerDivider>

<!-- 
    Icon menu Window 
    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
-->
    <teleport to="body">
    <Transition name="fade">
        <Window
            v-if="isIconMenuOpen"
            title="Icon Menu"
            :width="500">
            <template #window-icon>
                <SVGHandler
                    class="icon-center"
                    height="2em"
                    width="2em"
                    view_Box="0 -960 960 960"
                    fill_Colour="#CCCCCC"
                    :path_Value="iconImageStorage.getPathData('Bookmark_Plus')"
                />
            </template>

            <template #window-content>
            <!-- Window content -->

            <WindowContainerDivider>
                <template #content>
                    <div class="icon-selection-menu width-full flex">
                        <template v-for="(item, index) in 50" :key="index">
                            
                            <div class="saved-icons icon-wrapper"
                                :class="{ 'icon-Selection' : selectedIconMenu(index), 'grid-item' : !selectedIconMenu(index) }"
                                >
                                <SVGHandler v-if="iconImageStorage.isValidIndex(index)"
                                    width="100%"
                                    height="100%"
                                    :fill_Colour="m_localIconColourHex"
                                    :path_Value="getSVG(index)"
                                    :view_Box="iconImageStorage.getViewBoxIndex(index)"
                                    @click="newSelect(index)"
                                />
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



<!-- 
    Icon Function
    &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  
-->
</template>

<script>
import ToolTip from '../Window Components/ToolTip.vue';
import WindowContainerDivider from '../Window Components/WindowContainerDivider.vue';
import TextInput from '../Input Components/TextInput.vue';
import SingleButton from '../Input Components/SingleButton.vue';
import IconHandler from '../Main/IconHandler.vue';
import TabWrapper from '../Window Components/TabWrapper.vue';
import RangeSlider from '../Input Components/RangeSlider.vue';
import ColourPicker from '../Input Components/ColourPicker.vue';
import OptionSelect from '../Input Components/OptionSelect.vue';
import Checkbox from '../Input Components/Checkbox.vue';
import RadioBtn from '../Input Components/RadioBtn.vue';

import Window from '../Window Components/Window.vue';

import { iconImageStorage } from '../../Data/iconImages';
import { iconData, iconStorage, iconSelect } from '../../Data/iconData';
import { mouseData } from '../../Data/mouseData';
import { windowHandler } from '../../Data/userWindow';
import { editVariables } from '../../Data/SettingVariables';

import SVGHandler from '../Input Components/SVGHandler.vue';

export default {
    components: {
        WindowContainerDivider,
        SingleButton,
        ColourPicker,
        OptionSelect,
        RangeSlider,
        IconHandler,
        SVGHandler,
        TabWrapper,
        TextInput,
        RadioBtn,
        Checkbox,
        ToolTip,
        Window,
    },
    data(){
        return {
            iconImageStorage,
            editVariables,
            windowHandler,
            iconStorage,
            iconSelect,
            mouseData,

            m_Rows: 4,
            m_Columns: 3,

            m_STORAGE: "Storage",
            m_SelectedObject: {}, // Data for selected object.
            
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
            },

            m_SelectedIconIndex: -1,

            // Tabs
            m_IconTypeTabs: [
                {
                    text:'Display Icon',
                    icon_Image:'Image'
                },
                {
                    text:'Functionality',
                    icon_Image:'Edit-Note'
                },
                {
                    text:'Other',
                    icon_Image:'Remove_Select'
                }
            ],

            // Icon Functionality 
            
            m_DisplayLink: "",
            m_LinkInfo: {
                protocol: "https://",
                root: "",
                subdirectory: "",
                search: ""
            },

            m_SelectedIndex: -1,

            m_URLObject: null,
            m_StoredDomains: [],

            m_FunctionalityType:[
                { id:"Link", selected: true},
                { id:"Folder", selected: false},
            ]
        }
    },
    created(){
        editVariables.enableIsIconSelector();
        this.displaySelectedData(iconSelect.dataValue);
    },
    unmounted(){
        editVariables.disableIsIconSelector();
        iconSelect.resetData();
    },
    methods: {

// Icon Customize
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

        // When a new icon / none is selected, displays the link data.
        displaySelectedData(newIconData){

            // Reset everything first.

            this.setLinkData("", "", "");
            this.m_SelectedIndex = -1;

            if(newIconData.iconID === "" || newIconData.groupID === ""){  this.m_SelectedObject = {};  return; }

            let group = iconData.getGroup(newIconData.groupID);
            this.m_SelectedObject = iconData.getIconDataFromID(group, newIconData.iconID);

            this.setSVGIndex(this.m_SelectedObject.iconImage);
            this.setDisplayLink(this.m_SelectedObject.link);
        },

        // // From the name of the icon, get the index at which it appears in iconImages
        setSVGIndex(svgName){
            this.m_SelectedIconIndex = iconImageStorage.getIndexFromName(svgName);
        },

        // Changes the currently selected. Displays
        newSelect(index){
            if(!this.isCurrentlySelected){ return; } // No selection

            let svg = iconImageStorage.getPathFromIndex(index);
            this.m_SelectedObject.iconImage = svg.name;
            this.setSVGIndex(svg.name);
        },

        getSVG(index){
            let svg = iconImageStorage.getPathFromIndex(index);
            return svg.pathData;
        },

        setColourData(hex){
            this.m_SelectedObject.iconColour = hex;
        },

        // Check if current selected icon is the index.
        selectedIconMenu(index){
            if(!this.isCurrentlySelected){ return; } // No selection
            return (this.m_SelectedIconIndex === index);
        },

// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

// Icon Functionality
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        // Update link if there is data.
        updateLink(){
            if(Object.keys(this.m_SelectedObject).length === 0 && this.m_SelectedObject.constructor === Object){ return; }
        
            // update link value
            this.m_SelectedObject.link = this.m_URLObject.href;  
        },

        updateLinkValue(fullString){
            this.m_URLObject = new URL(fullString); 
        },

        addDomain(name){
            if(!this.m_StoredDomains.includes(name)) this.m_StoredDomains.push(name);

            for(let i = 0; i < this.m_StoredDomains.length; i++){
                if(this.m_StoredDomains[i] === name){
                    this.m_SelectedIndex = i;
                }
            }
        },

        setDisplayLink(newValue){
            let result = URL.parse(newValue);
            if(!result){
                // If URL does not follow convention
                // IE. opening a local file
                return;
            }
            this.updateLinkValue(result);
            this.addDomain(this.m_URLObject.host);
            this.setLinkData(this.m_URLObject.host, this.m_URLObject.pathname, this.m_URLObject.search);
        },

        setLinkData(root, path, search){
            this.m_LinkInfo.root = root;
            this.m_LinkInfo.subdirectory = path;
            this.m_LinkInfo.search = search;
        },

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
    },
    watch: {

        // Gets fired when selected icon changes
        'iconSelect.dataValue': {
            handler(val){ this.displaySelectedData(val); },
            deep: true
        },
    },
    computed:{
        isIconMenuOpen(){
            return (this.isCurrentlySelected && windowHandler.getEditValue('Icon Menu'));
        },
        isCurrentlySelected(){
            return !(Object.keys(this.m_SelectedObject).length === 0 && this.m_SelectedObject.constructor === Object);
        },
        m_DisplayLink:{
            get(){
                if(this.m_LinkInfo.root === ""){ return;}
                if(this.m_LinkInfo.subdirectory[0] != "/"){ "/" + this.m_LinkInfo.subdirectory}
    
                this.updateLinkValue(this.m_LinkInfo.protocol + this.m_LinkInfo.root + this.m_LinkInfo.subdirectory + this.m_LinkInfo.search); 
                
                return this.m_URLObject.href;
            },
            set(newValue){
                this.setDisplayLink(newValue);
            }
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

/* 
    Icon customization
*/

.button-column{
    flex-direction: column;
    width: 20%;
}

.modification-button{
    height: fit-content;
}
    
.icon-fit{
    max-width: fit-content;
    height: auto;
}

.image-placeholder{
    border: 2px solid var(--Accent-background-colour);
    border-top-right-radius: 2em;
    border-bottom-right-radius: 2em;
    border-left: 0;

    width: auto;
    position: relative;
    transition: all 0.15s ease-in-out;
}

/* 
    Icon Menu
*/

.icon-selection-menu{
    flex-wrap: wrap;
    overflow-y: scroll;
    height: 350px;
}

.icon-wrapper{
    height: 5em;
    width: 5em;
}

.right-side{
    width: 100%;
    height: auto;
    position: relative;
    display: flex;
    justify-content: flex-end;
}

</style>