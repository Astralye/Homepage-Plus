<!--

    Functionality to implement:
        
        Icon selection
        Icon drag and drop.

        Icon drag swapping.
-->


<template>
    <!-- Container wrapper -->
    <div class="height-full"
        @click.self="iconSelect.resetData()"
        @mouseup="checkDropIcon(index)"
    >
        <div v-for="(item, index) in m_GroupData" :key="index">
            <div            
                class="list-item-wrapper flex"
                :class="{ 'icon-Selection' : isSelectedIcon(index),
                        'unselect-icon'  : !isSelectedIcon(index)
                }"
                @click="(editVariables.isIconSelector) ? setSelectedIcon(index) : null"
                >
                    <!-- Icon if any -->
                    <div v-if="hasIcon(item)"
                        class="icon-spacing"
                        >
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

            <hr v-if="!isLastPosition(index)">

        </div>
    </div>
</template>

<script>

import { containerData } from '../../Data/containerData';
import { iconData, iconSelect } from '../../Data/iconData';
import { editVariables } from '../../Data/SettingVariables';

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
            editVariables,
            iconSelect,
            iconData,

            m_GroupData: null,
            m_containerData: null,
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

        // If iconID is empty
        hasIcon(item){ return (item.iconID !== ""); },

        // checks if index is last position of the indexing.
        isLastPosition(index){ return (this.m_GroupData.length-1 === index); },

    // Taken from GridLayout.vue

        // Click selection for linkmaker
        isSelectedIcon(index){

            let icon = this.m_GroupData[index];
            if(!icon || !iconSelect) return false;
            return (icon.iconID === iconSelect.data.iconID && this.m_containerData.ID === iconSelect.data.groupID);
        },


        // Because they are rendered in indexes, they must have values.
        setSelectedIcon(index){

            let icon = this.m_GroupData[index];
            if(!icon) return; 
            // no data, however, this should not occur because
            // it indexes through each of the elements

            iconSelect.setData(icon.iconID, this.m_containerData.ID);
        },
    },
}
</script>

<style scoped>

.icon-Selection{
    border: 3px solid rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    
    -webkit-transition: border-color 0.15s linear; /* Saf3.2+, Chrome */
       -moz-transition: border-color 0.15s linear; /* FF3.7+ */
         -o-transition: border-color 0.15s linear; /* Opera 10.5 */
            transition: border-color 0.15s linear;
}

.unselect-icon{
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;

    -webkit-transition: border-color 0.15s linear; /* Saf3.2+, Chrome */
       -moz-transition: border-color 0.15s linear; /* FF3.7+ */
         -o-transition: border-color 0.15s linear; /* Opera 10.5 */
            transition: border-color 0.15s linear;
}

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

.height-full{
    height: 100%;
}

</style>