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
                    @click="console.log('Click! select icon.')">

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
</template>

<script>
import ToolTip from '../ToolTip.vue';
import WindowContainerDivider from '../WindowContainerDivider.vue';
import RangeSlider from '../../Input Components/RangeSlider.vue';
import TextInput from '../../Input Components/TextInput.vue';
import SVGIcon from '../../Input Components/SVGIcon.vue';

import { iconData, iconSelect } from '../../../Data/iconData';

export default {
    components:{
        WindowContainerDivider,
        ToolTip,
        RangeSlider,
        TextInput,
        SVGIcon
    },
    data() {
        return {
            iconSelect,

            m_SelectedObject: {},
        }
    },

// Data retrieval
// ---------------------------------------------------------------------------------------------- 

    methods:{

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
    width: 175px;
    height: 175px;
}
</style>