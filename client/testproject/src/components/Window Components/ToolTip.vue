<script>
import { iconImageStorage } from '../../Data/iconImages';
import SVGHandler from '../Input Components/SVGHandler.vue';

// The window gets cropped if it is in a parent overflow

export default{
    components:{
        SVGHandler,
    },
    data(){
        return{
            iconImageStorage
        }
    }
}

</script>

<template>
    <div class="tooltip-container">
        <SVGHandler
            height="30px"
            width="auto"
            view_Box="0 -960 960 960"
            fill_Colour="#CCCCCC"
            :path_Value="iconImageStorage.getPathData('Question_Mark')"
            />
        <span class="tooltip">
            <slot> </slot>
        </span>
    </div>
</template>

<style scoped>

.pt-serif-bold-italic {
    font-family: "PT Serif", serif;
    font-weight: 700;
    font-style: italic;
}

.tooltip-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.4s;
}

.tooltip {
    position: absolute;
    padding: 0.3em 0.6em;
    bottom: 150%;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s linear 0.4s;
    
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    color: rgb(34, 34, 34);

    width: 200px;
    box-shadow: 0 0 25px rgba(0,0,0,0.5);
}

.tooltip-container:hover .tooltip {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}


</style>