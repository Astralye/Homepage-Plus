<script>

import { iconImageStorage } from '../../Data/iconImages';
import SVGHandler from '../Input Components/SVGHandler.vue';
import { mouseData } from '../../Data/mouseData';

import { windowHandler } from '../../Data/userWindow';

export default {
    components:  {
        SVGHandler, 
    },
    props: {
        title: {
            type: String,
            required: true,
        },

        width: {
            type: Number,
            default: 300
        },
    },
    data() {
        return{
            iconImageStorage,
            windowHandler,

            windowHover: false,

            positions: {
                clientX: undefined,
                clientY: undefined,
            },
            
            windowWidth: `${this.width}px`,

            windowObj: null,

            // Css values
            m_zIndex: 0,
            m_left: 0,
            m_top: 0,
        }
    },
    created(){
        // Window stack is automatically deleted during 'disableWindow'
        // No need for unmounted
        windowHandler.checkAddStack(this.title);
        this.windowObj = windowHandler.getEditObj(this.title);
    },
    mounted(){
        this.updateZIndex();
    },
    watch: {
        // When the array changes, update all the other z-index values
        'windowHandler.windowStack':{
            handler(){ this.updateZIndex(); },
            deep: true
        },
    },
    methods: {          
        updateZIndex(){
            let index = windowHandler.getIndexWindowStack(this.windowObj.name);
            if(index === -1){ return; } // return if not found
            this.m_zIndex = index + 10;
        },

        elementDrag(){

            // Stored mouse coordinates
            let mouse = mouseData.Coordinates;

            // Difference of last mouse position
            let movementX = this.positions.clientX - mouse.x;
            let movementY = this.positions.clientY - mouse.y;

            // Store mouse position of current frame 
            this.positions.clientX = mouse.x;
            this.positions.clientY = mouse.y;

            // Update style coordinate
            this.m_top  = (this.$refs['draggableContainer'].offsetTop  - movementY) + 'px';
            this.m_left = (this.$refs['draggableContainer'].offsetLeft - movementX) + 'px';
        },
        // Touchscreen
        touchDown(event){
            // Position of touch
            this.positions.clientX = event.changedTouches[0].clientX;
            this.positions.clientY = event.changedTouches[0].clientY;

            mouseData.movementFunctions([ this.elementDrag ]);
            mouseData.touchUpFunctions([ this.closeDrag ]);

            mouseData.enableTouchMove();
            mouseData.enableTouchUp();
        },
        closeDrag(){
            mouseData.disableTouchMove();
            mouseData.disableTouchUp();
        },

        dragMouseDown(event){
            if(!this.windowHover) {return; }
            
            // Get current mouse location
            this.positions.clientX = event.clientX;
            this.positions.clientY = event.clientY;

            // register on mouse move and mouse up events
            mouseData.movementFunctions( [ this.elementDrag ]);
            mouseData.mouseUpFunctions ( [ this.closeDragElement ]);
            
            mouseData.enableTracking();
            mouseData.enableMouseUp();
        },
        closeDragElement() {
            mouseData.disableMouseUp();
            mouseData.disableTracking();
        }
    }
}
</script>

<template>
    <!-- main container -->
    <div
        @mousedown="windowHandler.moveToTopStack(windowObj)"
        @touchstart="windowHandler.moveToTopStack(windowObj)"

        ref="draggableContainer" 
        class="window"
        :style="{ 'z-index' : m_zIndex,
                  'top' : m_top,
                  'left': m_left,
        }">

        <!-- Header -->
        <div 
            class="header flex noselect" 
            
            @touchstart="touchDown"

            @mousedown="dragMouseDown"
            @mouseenter.self="windowHover = true"
            @mouseleave.self="windowHover = false"
            >
            

                <!--  Title -->
                <div class="flex">
                    <!-- Icon -->
                    <div class="margin-right flex align-center">
                        <slot name="window-icon"> </slot>
                    </div>

                    <h1 class="header-title flex align-center"> 
                        {{ title }} 
                    </h1>
                </div>

                <!-- Exit button -->
                <button 
                    @click="windowHandler.disableWindow(title)"
                    @mouseenter.self="windowHover = false"
                    >
                    <SVGHandler 
                        class="align-center flex"
                        height="3em"
                        width="3em"
                        :path_Value="iconImageStorage.getPathData('Cross')"
                        view_Box="0 -960 960 960"
                        fill_Colour="#CCCCCC"
                        />
                </button>
        </div>

        <hr>

        <!-- Main content -->
        <div
        class="wind-container">
            <slot name="window-content"></slot>
        </div>
    </div>
    
</template>

<style>

.margin-y-auto{
    margin-top: auto;
    margin-bottom: auto;
}

.margin-x-auto{
    margin-left: auto;
    margin-right: auto;
}

</style>

<style scoped>
@import '../../assets/base.css';

hr{
    border: solid #C9CBA3 1px;
    margin: 0 0.5em 0.25em 0.5em;
}

.header-title{
    position: relative;
    line-height: 1.5;
}

.margin-right{
    margin-right: 1em;
}

.wind-container{
    position: relative;
    background-color: var(--Secondary-background-colour);
    height: auto;
    
    border-radius: 1em;
    padding: 0.25em;
}

.flex{
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
}

.align-center{
    align-items: center;
}


.header{
    background-color: var(--Secondary-background-colour);

    padding-top: 5px;
    padding-bottom: 0.25em;
    padding-left: 0.5em;
}

.header:hover{
    cursor: grab;
}

.window{
    width: v-bind("windowWidth");
    background-color: var(--Secondary-background-colour);
    height: auto;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 30;
    
    border: solid var(--WindowBorder-Thickness) var(--Secondary-background-colour);
    border-radius: var(--WindowBorder-Radius);
    box-shadow: var(--box-shadow);
}

</style>