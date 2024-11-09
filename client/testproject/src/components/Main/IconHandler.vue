<!-- 
    This file is responsible for displaying icons on the various grids.
-->

<template>
    <div class="center noselect">

        <div class="center fit-content">

            <SVGHandler
                :height="iconData.size"
                width="auto"
                :path_Value="iconData.image"
                :fill_Colour="iconData.colour"
                :view_Box="iconData.viewBox"
                @dblclick="(this.$GlobalStates.value.edit.enabled) ? null : openLink()"
            />
        </div>

        <template v-if="iconData.displayText">
            <div class="center fit-content text-padding">
                <p>
                    {{ iconData.text }}
                </p>
            </div>
        </template>
    </div>
</template>

<script>
import SVGHandler from '../Input Components/SVGHandler.vue';
import { iconImageStorage } from '../../Data/iconImages';

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
    },
    data(){
        return{
            iconImageStorage,

            iconData: {
                size: "10",
                image: "",
                colour: "",
                viewBox: "10 10 10 10",
                link: "",
                text: "",
                displayText : false,
            }
        }
    },
    created(){
        this.init();
    },
    methods: {
        init(){
            if(!this.icon_data){ return; }
            this.iconData.size    = this.icon_data.iconSize;
            this.iconData.image   = iconImageStorage.getPathData(this.icon_data.iconImage);
            this.iconData.colour  = this.icon_data.iconColour;
            this.iconData.viewBox = iconImageStorage.getViewBoxName(this.icon_data.iconImage);
            this.iconData.link    = this.icon_data.link;
            this.iconData.text    = this.icon_data.text;
            this.iconData.displayText = this.icon_data.displayText; 
        },
        openLink(){
            window.open(this.iconData.link, '_blank');
        },
    },
    watch: {
        'icon_data':{
            handler(val){ this.init(); },
            deep: true            
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

.fit-content{
    max-width: fit-content;
}

.center{
    margin: auto;
}

</style>