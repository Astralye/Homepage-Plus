<template>
    <WindowContainerDivider
    class="container-divider">
        <template #header> 
            <h2 class="inline">
                URL Link
            </h2>
        </template>

        <template #content>
            <TextInput
                :placeholder_text="'https://'">
                
            </TextInput>
        </template>

        <template #tooltip>
            <ToolTip>
                Calculates the domain and directory automatically.
            </ToolTip>
        </template>
    </WindowContainerDivider>
    
    <div class="flex flex-space">
        <WindowContainerDivider
        class="container-divider">
            <template #header> 
                <h3 class="inline">
                    Domain Name
                </h3>
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
                <TextInput
                    :placeholder_text="'/'">
                </TextInput>
            </template>

            <template #tooltip>
                <ToolTip>
                    Directory after the domain name e.g youtube.com/{XYZ}
                    where XYZ is the input
                </ToolTip>
            </template>
        </WindowContainerDivider>

    </div>

    <WindowContainerDivider
    class="container-divider">
        <template #content>
            <input type="checkbox"/>
            Open on new window? 
        </template>
    </WindowContainerDivider>
</template>

<script>
import ToolTip from '../ToolTip.vue';
import WindowContainerDivider from '../WindowContainerDivider.vue';
import TextInput from '../../Input Components/TextInput.vue';

import { iconData, iconSelect } from '../../../Data/iconData';

export default {
    components: {
        ToolTip,
        WindowContainerDivider,
        TextInput,
    }
    ,data() {
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
        }
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
.flex{
    display: flex;
}

.flex-space{
    justify-content: space-evenly;
}

</style>