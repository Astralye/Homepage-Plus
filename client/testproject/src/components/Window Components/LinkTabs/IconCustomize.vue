<template>
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
                    <div class="image-placeholder flex"
                    @click="toggleWindow()">

                        <template v-if="!isCurrentlySelected()">
                            <div class="icon-fit center fit-content">
                                <SVGIcon
                                :name="m_SelectedObject.iconImage"/>

                            </div>
                        </template>
                        <template v-else>
                            <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="auto" fill="#e8eaed">
                                <path d="m254-238-16-16 226-226-226-226 16-16 226 226 226-226 16 16-226 226 226 226-16 16-226-226-226 226Z"/>
                            </svg>
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
                        v-model="m_SelectedObject.iconString">
                    </TextInput>
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

    <teleport to="body">
        <Transition name="fade">
            <Window
                v-if="m_DisplayWindow"
                title="Icon Menu"
                :width="400"
                @close-window="toggleWindow()"
                @focusTab="focusClickedTab">
                <template #window-icon>
                    <svg class="margin-y-auto" xmlns="http://www.w3.org/2000/svg" height="35px" width="auto" viewBox="0 -960 960 960" fill="#CCCCCC">
                        <path d="M360-240h440v-107H360v107ZM160-613h120v-107H160v107Zm0 187h120v-107H160v107Zm0 186h120v-107H160v107Zm200-186h440v-107H360v107Zm0-187h440v-107H360v107ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Z"/>
                    </svg>
                </template>

                <template #window-content>
                <!-- Window content -->

                <WindowContainerDivider>
                    <template #content>
                        <div class="saved-grid width-full grid">
                            <template v-for="(item, index) in m_Rows * m_Columns" :key="index">
                                <div class="saved-icons grid-item flex">
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
import SVGIcon from '../../Input Components/SVGIcon.vue';

import Window from '../Window.vue';

import { iconData, iconSelect } from '../../../Data/iconData';

export default {
    components:{
        WindowContainerDivider,
        ToolTip,
        RangeSlider,
        TextInput,
        SVGIcon,

        Window,
    },
    data() {
        return {
            iconSelect,

            m_SelectedObject: {},
            
            m_DisplayWindow: false,

            m_Rows: 5,
            m_Columns: 0
        }
    },

    created(){
        this.calculateDimensions();
    },

    unmounted(){
        this.m_DisplayWindow = false; 
    },

// Data retrieval
// ---------------------------------------------------------------------------------------------- 

    methods:{

        calculateDimensions(){
            // Need to get the size of the folder and all the icons.

            let noIcons = 40;
            this.m_Columns = ~~(noIcons / this.m_Rows);
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


        toggleWindow(){
            this.m_DisplayWindow = !this.m_DisplayWindow;
            return this.m_DisplayWindow;
        },

        // Check for empty object
        isCurrentlySelected(){
            return (Object.keys(this.m_SelectedObject).length === 0 && this.m_SelectedObject.constructor === Object);
        },

        displaySelectedData(newIconData){
            if(newIconData.iconID === "" || newIconData.groupID === ""){ this.m_SelectedObject = {}; return; }

            let group = iconData.getGroup(newIconData.groupID);
            this.m_SelectedObject = iconData.getIconDataFromID(group, newIconData.iconID);
        },

        tmp(){ }
    },

// ----------------------------------------------------------------------------------------------
    watch: {
        'iconSelect.dataValue': {
            handler(val){ this.displaySelectedData(val); },
            deep: true
        }
    }
}
</script>

<style scoped>

.center{
    margin: auto;
}

.fit-content{
    max-width: fit-content;
}

.icon-fit{
    width: 90%;
    height: auto;
}

.grid-item{
    border: solid rgba(255, 255, 255, 0.4) 0.5px;
}

.saved-grid{
    border: 2px solid black;
    height: 200px;
    grid-template-columns:  repeat(5, 1fr);
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
    width: 175px;
    height: 175px;
}
</style>