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
                v-model="m_DisplayLink">
            </TextInput>
        </template>

        <template #tooltip>
            <ToolTip>
                Calculates the domain and directory automatically.
                'https://' is required otherwise it opens the relative to this site.
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
                <TextInput v-model="m_LinkInfo.subdirectory"/>
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

            <div class="right-side">
                <SingleButton
                    :m_iconString="Save"
                    @click="updateLink()">
                    Save
                </SingleButton>
            </div>
        </template>
    </WindowContainerDivider>
</template>

<script>
import ToolTip from '../ToolTip.vue';
import WindowContainerDivider from '../WindowContainerDivider.vue';
import TextInput from '../../Input Components/TextInput.vue';
import OptionSelect from '../../Input Components/OptionSelect.vue';
import SingleButton from '../../Input Components/SingleButton.vue';

import { iconData, iconSelect } from '../../../Data/iconData';

export default {
    components: {
        ToolTip,
        WindowContainerDivider,
        TextInput,
        OptionSelect,
        SingleButton
    },
    data() {
        return {
            iconSelect,
            
            m_LinkInfo: {
                protocol: "https://",
                root: "",
                subdirectory: "",
                search: ""
            },

            m_SelectedIndex: -1,

            m_URLObject: null,
            
            m_SelectedObject: {},
            m_StoredDomains: [],
        }
    },

    created(){
        // In the event of selection before opening component.
        this.displaySelectedData(iconSelect.dataValue);
    },

// Data retrieval
// ---------------------------------------------------------------------------------------------- 

    methods:{
        // Loads the icon data to component
        displaySelectedData(newIconData){
            if(newIconData.iconID === "" || newIconData.groupID === ""){ this.m_SelectedObject = {}; return; }
            
            let group = iconData.getGroup(newIconData.groupID);
            this.m_SelectedObject = iconData.getIconDataFromID(group, newIconData.iconID);
        },

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
        }
    },

// ----------------------------------------------------------------------------------------------
    watch: {
        'iconSelect.dataValue': {
            handler(val){ 
                this.displaySelectedData(val); },
            deep: true
        }
    },

    computed:{
        m_DisplayLink:{
            get(){
                if(this.m_LinkInfo.root === ""){ return;}
                if(this.m_LinkInfo.subdirectory[0] != "/"){ "/" + this.m_LinkInfo.subdirectory}

                this.updateLinkValue(this.m_LinkInfo.protocol + this.m_LinkInfo.root + this.m_LinkInfo.subdirectory + this.m_LinkInfo.search); 
                
                return this.m_URLObject.href;
            },
            set(newValue){
                let result = URL.parse(newValue);
                if(!result){
                    // If URL does not follow convention
                    // IE. opening a local file
                    return;
                }
                this.updateLinkValue(result);
                this.addDomain(this.m_URLObject.host);

                this.m_LinkInfo.root = this.m_URLObject.host;
                this.m_LinkInfo.subdirectory = this.m_URLObject.pathname;
                this.m_LinkInfo.search = this.m_URLObject.search;
            }
        }
    }
}
</script>

<style scoped>
.right-side{
    width: 100%;
    height: auto;
    position: relative;
    display: flex;
    justify-content: flex-end;
}

.flex{
    display: flex;
}

.flex-space{
    justify-content: space-evenly;
}

</style>