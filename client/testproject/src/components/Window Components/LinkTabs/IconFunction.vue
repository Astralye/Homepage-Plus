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
                :placeholder_text="'https://' + m_SelectedDomain">
                
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
                    Hostname
                </h3>
            </template>

            <template #content>
                <OptionSelect
                    v-model="m_StoredDomains"
                    @Selected-Value="value => m_SelectedDomain = value"
                />
            </template>

            <template #tooltip>
                <ToolTip>
                    Root name of a website.
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
import OptionSelect from '../../Input Components/OptionSelect.vue';

import { iconData, iconSelect } from '../../../Data/iconData';

export default {
    components: {
        ToolTip,
        WindowContainerDivider,
        TextInput,
        OptionSelect
    }
    ,data() {
        return {
            iconSelect,

            m_SelectedObject: {},

            m_StoredDomains: [],
            m_SelectedDomain: ""
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