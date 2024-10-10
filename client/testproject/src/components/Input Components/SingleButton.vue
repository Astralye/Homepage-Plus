<template>
    <!-- 
     Functionality comes from passing an 
     @click event from the parent container 
     Removes the need to pass a prop
     -->
     <button role="button" class="button-name">
        <SVGHandler
            height="40px"
            width="40px"
            view_Box="0 -960 960 960"
            :path_Value="iconImageStorage.getPathData('Dotted_Square')"
        />
        <slot> </slot>
    </button>
</template>

<script>
import SVGHandler from '../Input Components/SVGHandler.vue';
import { iconImageStorage } from '../../Data/iconImages';

export default{
    components:{
        SVGHandler
    },
    data(){
        return{
            iconImageStorage,
        }
    }
}
</script>

<style>
.single-button-dark{
    color: black;
}
</style>

<style scoped>
@import '../../assets/base.css';

/* 

Credit to Custyyyy on UIVerse
https://uiverse.io/Custyyyy/short-lizard-47

*/ 

.button-name {
    align-items: center;
    appearance: none;
    background-color: #FCFCFD;
    border-radius: 4px;
    border-width: 0;
    box-shadow: rgba(45, 35, 66, 0.2) 0 2px 4px,rgba(45, 35, 66, 0.15) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    font-family: "JetBrains Mono",monospace;
    height: 48px;
    justify-content: center;
    line-height: 1;
    list-style: none;
    overflow: hidden;
    padding-left: 16px;
    padding-right: 16px;
    position: relative;
    text-align: left;
    text-decoration: none;
    transition: box-shadow .15s,transform .15s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    white-space: nowrap;
    will-change: box-shadow,transform;
    font-size: 18px;
}

.button-name:focus {
    box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
}

.button-name:hover {
    box-shadow: rgba(45, 35, 66, 0.3) 0 4px 8px, rgba(45, 35, 66, 0.2) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
    transform: translateY(-2px);
}

.button-name:active {
    box-shadow: #D6D6E7 0 3px 7px inset;
    transform: translateY(2px);
}
</style>