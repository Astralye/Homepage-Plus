<!--

    Functionality to implement:
        
        Icon selection
        Icon drag and drop.

        Icon drag swapping.
-->


<template>
    <!-- Container wrapper -->
    <div class="height-full">
        <div v-for="(item, index) in m_GroupData" :key="index"
            class="list-item-wrapper flex">
            
            <!-- Icon if any -->
            <div v-if="hasIcon(item)"
                class="icon-spacing">
                <SVGHandler
                    class="icon-center"
                    width="2em"
                    height="2em"
                    :path_Value="iconImageStorage.getPathData(item.iconImage)"
                    :view_Box="iconImageStorage.getViewBoxName(item.iconImage)"
                    :fill_Colour="item.iconColour"
                />
            </div>

            <!-- Name -->
            <div
                class="center-text">
                {{ item.iconString }}
            </div>
        </div>
    </div>
</template>

<script>

import { containerData } from '../../Data/containerData';
import { iconData } from '../../Data/iconData';

import SVGHandler from '../Input Components/SVGHandler.vue';

import { iconImageStorage } from '../../Data/iconImages';

export default {
    props:{
        component_ID: {
            type: String,
            default: "",
            required: true
        },
    },
    components:{
        SVGHandler, 
    },
    data(){
        return{
            iconImageStorage,
            containerData,
            iconData,

            m_GroupData: null,
        }
    },
    created(){
        this.initData();
    },
    methods:{
        initData(){

            this.m_containerData = containerData.getObjectFromID(this.component_ID);
            this.m_GroupData = iconData.getGroup(this.m_containerData.ID);

            if(this.m_GroupData === null){ 
                iconData.createGroup(this.m_containerData.ID);
                this.m_GroupData = iconData.getGroup(this.m_containerData.ID);
            } // group data does not exist

            this.m_GroupData = iconData.getGroup(this.component_ID);
        },

        hasIcon(item){
            return (item.iconID !== "");
        }
    },
}
</script>

<style scoped>

.icon-spacing{
    padding-right: 0.75em;
}

.center-text{
    text-align: center;   
    margin-top: auto;
    margin-bottom: auto; 
}

.flex{
    display: flex;
}

.list-item-wrapper{
    margin: 0.5em;
    box-sizing: border-box;

    width: auto;
    height: fit-content;

    padding: 0.5em;
}

.list-item-wrapper:not(:last-child){
    border-bottom: var(--Accent-background-colour) solid 2px;
}

.height-full{
    height: 100%;
}

</style>