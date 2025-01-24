<!-- 
    This file is responsible for displaying icons on the various grids.
-->

<template>
    <div class="center noselect">
        <div class="center fit-content">

            <SVGHandler
                :height="iconData.size"
                :width="iconData.size"
                :path_Value="iconData.image"
                :fill_Colour="iconData.colour"
                :view_Box="iconData.viewBox"
                @dblclick="(editVariables.isEnabled) ? null : openLink()"
                class="center"
            />
        </div>

        <transition name="fade">
            <template v-if="iconData.isDisplayText && toggle_Container_Text">
                <div class="fit-content text-padding">
                    <p class="text"
                        :style="{
                            'font-size' : (editVariables.appearanceFont.isApplyGlobal) ? editVariables.appearanceFont.size : iconData.text_Size
                        }">
                        {{ iconData.text }}
                    </p>
                </div>
            </template>
        </transition>
    </div>
</template>

<script>
import SVGHandler from '../Input Components/SVGHandler.vue';
import { iconImageStorage } from '../../Data/iconImages';

import { editVariables } from '../../Data/SettingVariables';

// This will be drag and drop.
export default {
    components: {
        SVGHandler
    },
    props:{
        icon_data: {
            type: Object,
            default: null,
        },
        toggle_Container_Text:{
            type: Boolean,
            default: true,
        },
        override_Size:{
            type: String,
            default: null
        }
    },
    data(){
        return{
            iconImageStorage,
            editVariables,

            iconData: {
                size: "10",
                image: "",
                colour: "",
                viewBox: "10 10 10 10",
                link: "",
                text: "",
                text_Size: "12px",
                isDisplayText : false,
            },

            shrinkLength: 20,
            maxDisplayCharLength: 35,
            textShrink: false,
        }
    },
    created(){
        this.init();
    },
    methods: {

        initSize(){
            // If contains value, set the size to override
            
            if(!this.icon_data){ return; }

            this.iconData.size    = (this.override_Size) ? this.override_Size : this.icon_data.iconSize;
        },

        init(){
            if(!this.icon_data){ return; }
            
            this.initSize();
            this.iconData.image   = iconImageStorage.getPathData(this.icon_data.iconImage);
            this.iconData.colour  = this.icon_data.iconColour;
            this.iconData.text_Size = this.icon_data.iconStringSize;
            this.iconData.viewBox = iconImageStorage.getViewBox(this.icon_data.iconImage);
            this.iconData.link    = this.icon_data.link;
            this.iconData.isDisplayText = this.icon_data.displayText; 
            
            // Max chararacter length to display
            // -3 represents an ellipses
            var displayString;
            let str = this.icon_data.iconString;

            if(str.length >= this.shrinkLength){ // Shrink text within here
                this.textShrink = true; 
                displayString = (str.length >= this.maxDisplayCharLength) ? str.substring(0,this.maxDisplayCharLength - 3) + "..." : str;
            }
            else{
                this.textShrink = false; 
                displayString = str;
            }

            this.iconData.text = displayString;
        },
        openLink(){
            window.open(this.iconData.link, '_blank');
        },
    },
    watch: {
        'icon_data':{
            handler(val){ this.init(); },
            deep: true            
        },
        'override_Size'(){
            this.initSize();
        }
    },
    computed: {
        hasEmptyText(){
            return (this.iconText.length === 0);
        }
    }
}
</script>

<style scoped>
@import '../../assets/main.css';

.text-padding{
    padding-left: 0.5em;
    padding-right: 0.5em;
}

.normal-text-size{
    font-size: 16px;
}

.small-text-size{
    font-size: 10px;
}

.text{
    word-wrap: break-word;
    text-wrap: balance;

    width: 100px;
    text-align : center;

    transition: font-size ease 150ms;
}

.fit-content{
    max-width: fit-content;
}

.center{
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;
}

</style>