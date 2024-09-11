<script>

import { mouseData } from '../../Data/mouseData';

export default {
    props: {
        title: String,

        width: {
            type: Number,
            default: 300
        },
    },
    emits: ['closeWindow', 'focusTab'],
    data() {
        return{
            windowHover: false,

            positions: {
                clientX: undefined,
                clientY: undefined,
            },
            
            windowWidth: `${this.width}px`
        }
    },
    watch: {

        // When the array changes, update all the other z-index values
        // indirectly update values.
        '$windowStack.value': {
            handler(val, oldval){
                this.updateZIndex();
            },
        deep: true
        }
    },
    methods: {          
        updateZIndex(){
            let tmpArray = this.$windowStack.value;
            let name = this.title.toLowerCase();
            
            let index = tmpArray.indexOf(name);

            if(index > -1){
                index += 10; // always in front
                this.$refs.draggableContainer.style.zIndex = index;
            }
        },
        dragMouseDown: function ( event ){

            if(!this.windowHover) {return; }
            event.preventDefault();
            
            // Get current mouse location
            this.positions.clientX = event.clientX;
            this.positions.clientY = event.clientY;

            // register on mouse move and mouse up events
            mouseData.movementFunctions( [ this.elementDrag ]);
            mouseData.mouseUpFunctions([ this.closeDragElement ]);
            
            mouseData.enableTracking();
            mouseData.enableMouseUp();
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
            this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - movementY) + 'px'
            this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - movementX) + 'px'
        
            this.updateZIndex();
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
        @mousedown="$emit('focusTab', `${title}`)"
        ref="draggableContainer" 
        class="window"
        >

        <!-- Header -->
        <div 
            class="header flex" 
            
            @mousedown="dragMouseDown"
            @mouseenter.self="windowHover = true"
            @mouseleave.self="windowHover = false"
            >

                <!--  Title -->
                <div class="header-Title flex">
                    <div class="margin-right flex align-center">
                        <slot name="window-icon"> </slot>
                    </div>

                    <h1 class="header-title__line-height--small flex align-center"> 
                        {{ title }} 
                    </h1>
                </div>

                <!-- Exit button -->
                <button 
                    class="header-Button align-center flex"
                    @click="$emit('closeWindow', `${title}`)"
                    @mouseenter.self="windowHover = false"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" height="2.5em" viewBox="0 -960 960 960" width="auto" fill="#CCCCCC">
                        <path d="m259-206-52-53 220-221-220-221 52-53 221 221 221-221 52 53-220 221 220 221-52 53-221-221-221 221Z"/>
                    </svg>
                </button>
        </div>

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

.header-title__line-height--small{
    position: relative;
    line-height: 1.1;
}

.margin-right{
    margin-right: 0.5em;
}

.wind-container{
    background-color: var(--Tertiary-background-colour);
    height: auto;
    
    border-bottom-left-radius: 7px;
    border-bottom-right-radius: 7px;

    padding: var(--window-padding);
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
    padding: var(--window-padding);
}

.header:hover{
    cursor: grab;
}

.window{
    width: v-bind("windowWidth");
    height: auto;
    position: absolute;
    top: 0;
    left: 0;
    box-shadow: 5px 5px 3px rgba(0, 0, 0, 0.3), -3px -3px 20px rgba(0, 0, 0, 0.2);
    z-index: 30;

    border-radius: 10px;
    border-style: solid;
    border-width: 3px;
    border-color: var(--Secondary-background-colour);
}

</style>