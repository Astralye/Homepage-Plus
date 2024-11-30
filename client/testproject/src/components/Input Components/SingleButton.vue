<!-- 
    Functionality comes from passing an 
    @click event from the parent container 
    Removes the need to pass a prop
-->
<template>
     <button role="button" 
        @click="flipToggle"
        :disabled="!enabled"
        class="button-name flex-column"
        :class="{'toggle-up': button_toggle && !m_isButtonActive && enabled,
                 'toggle-down': button_toggle && m_isButtonActive && enabled,
                 
                 'button-enabled' : enabled,
                 'disabled' : !enabled
                }"> <!-- Class only is affected if the button is togglable-->
        <SVGHandler
            height="40px"
            width="40px"
            view_Box="0 -960 960 960"
            :path_Value="iconImageStorage.getPathData(m_IconString)"
        />
        <p class="text flex-column">
            <slot> </slot>
        </p>
    </button>
</template>

<script>
import SVGHandler from '../Input Components/SVGHandler.vue';
import { iconImageStorage } from '../../Data/iconImages';

export default{
    components:{
        SVGHandler
    },
    props: {
        m_IconString: {
            type: String,
            default: "Dotted_Square"
        },
        button_toggle:{
            type: Boolean,
            default: false,
        },
        enabled:{
            type: Boolean,
            default: true,
        }
    },
    data(){
        return{
            iconImageStorage,

            m_isButtonActive: null, // State of button if it is active or not
        }
    },
    created(){
        this.disableToggle();
    },
    methods:{
        enableToggle(){  if(this.button_toggle){ this.m_isButtonActive = true; } },
        disableToggle(){ if(this.button_toggle){ this.m_isButtonActive = false; } },

        flipToggle(){
            if(this.button_toggle){
                (this.m_isButtonActive) ? this.disableToggle() : this.enableToggle(); 
            }
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

.flex-column{
    flex-direction: column;
}

.text{
    padding-bottom: 0.5em;
    font-size: 12px;
}

.disabled{
    background-color: #5e5e5e ;
    color: white;
    cursor: not-allowed;
}

/* 

Credit to Custyyyy on UIVerse for base
https://uiverse.io/Custyyyy/short-lizard-47

*/ 

.button-enabled{
    background-color: #FCFCFD;
    cursor: pointer;
}

.button-name {
    align-items: center;
    appearance: none;
    border-radius: 4px;
    border-width: 0;
    box-shadow: rgba(45, 35, 66, 0.2) 0 2px 4px,rgba(45, 35, 66, 0.15) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset;
    box-sizing: border-box;
    display: flex;
    font-family: "JetBrains Mono",monospace;
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
}


.button-enabled:focus {
    box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
}
.button-enabled:hover {
    box-shadow: rgba(45, 35, 66, 0.3) 0 4px 8px, rgba(45, 35, 66, 0.2) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
    transform: translateY(-2px);
}

.button-enabled:active {
    box-shadow: rgba(45, 35, 66, 0.2) 0 2px 4px,rgba(45, 35, 66, 0.15) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset;
    transform: translateY(2px);
}

/*
    Extra css for extra functionality
    .toggle-up{
    
    }
*/

.toggle-down{
    box-shadow: rgba(45, 35, 66, 0.2) 0 2px 4px,rgba(45, 35, 66, 0.15) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset;
    transform: translateY(2px);
}

</style>