<!-- 
    This file is responsible for displaying icons on the various grids.
-->

<template>
    <div class="center noselect">

        <div class="center fit-content"
            :class="{ 'icon-wrapper-text': !hasEmptyText, 'icon-wrapper-full': hasEmptyText}">
            
            <SVGIcon
            :name="icon_data.iconImage"
            @dblclick="(this.$GlobalStates.value.edit.enabled) ? null : openLink()"
            />
        </div>

        <div class="center fit-content text-padding">
            <p>
                {{ iconText }}
            </p>
        </div>
    </div>
</template>

<script>
import SVGIcon from '../Input Components/SVGIcon.vue';

// This will be drag and drop.
export default {
    components: {
        SVGIcon
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

.icon-wrapper-full{
    width: 80%;
    height: auto;
}

.icon-wrapper-text{
    width: 70%;
    height: auto;
}

.fit-content{
    max-width: fit-content;
}

.center{
    margin: auto;
}

</style>