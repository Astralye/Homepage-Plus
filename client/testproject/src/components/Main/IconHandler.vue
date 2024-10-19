<!-- 
    This file is responsible for displaying icons on the various grids.
-->

<template>
    <div class="center noselect">

        <div class="center fit-content">

            <SVGHandler
                :height="icon_data.iconSize"
                width="auto"
                :path_Value="iconImageStorage.getPathData(icon_data.iconImage)"
                :fill_Colour="icon_data.iconColour"
                :view_Box="iconImageStorage.getViewBoxName(icon_data.iconImage)"

                @dblclick="(this.$GlobalStates.value.edit.enabled) ? null : openLink()"
            />
        </div>

        <template v-if="icon_data.displayText">
            <div class="center fit-content text-padding">
                <p>
                    {{ iconText }}
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
            required: true,
        },
    },
    data(){
        return{
            iconImageStorage,

            iconText: ""
        }
    },
    created(){
        this.iconText = this.icon_data.iconString; 
    },
    methods: {
        openLink(){
            window.open(this.icon_data.link, '_blank');
        },
    },
    watch: {
        'icon_data':{
            handler(val){ this.iconText = val.iconString },
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