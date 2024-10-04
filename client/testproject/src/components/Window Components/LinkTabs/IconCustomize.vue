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
                    <div class="image-placeholder"
                    @click="console.log('Click! select icon.')"/>
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

import { iconData, iconSelect } from '../../../Data/iconData';

export default {
    components:{
        WindowContainerDivider,
        ToolTip,
        RangeSlider,
        TextInput
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