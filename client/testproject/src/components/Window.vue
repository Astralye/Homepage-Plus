<script>
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
                    movementX: 0,
                    movementY: 0
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

                // Get mouse location
                this.positions.clientX = event.clientX;
                this.positions.clientY = event.clientY;

                // register on mouse move and mouse up events
                document.onmousemove = this.elementDrag;
                document.onmouseup = this.closeDragElement;

            },
            elementDrag: function (event) {
                event.preventDefault();

                this.positions.movementX = this.positions.clientX - event.clientX
                this.positions.movementY = this.positions.clientY - event.clientY
                this.positions.clientX = event.clientX
                this.positions.clientY = event.clientY

                this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
                this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
            
                this.updateZIndex();
            },
            closeDragElement () {
                document.onmouseup = null;
                document.onmousemove = null;
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
            class="header" 
            
            @mousedown="dragMouseDown"
            @mouseenter.self="windowHover = true"
            @mouseleave.self="windowHover = false"
            >
                <div class="header-container flex">
                    <div class="headerContent">
                        <h1 class="header-title__line-height--small"> {{ title }} </h1>
                    </div>
                    <button 
                        class="headerContent exitBtn noselect"
                        @click="$emit('closeWindow', `${title}`)"
                        @mouseenter.self="windowHover = false"
                        >
                        X
                    </button>
                </div>
        </div>

        <!-- Main content -->
        <div
        class="wind-container noselect">
            <slot name="window-content"></slot>
        </div>
    </div>
    
</template>

<style scoped>
/*
    Make sure to include 
    @import '../assets/base.css';
    to use the styled variables
*/
@import '../assets/base.css';

.header-title__line-height--small{
    line-height: 1.0;
}

.header-container{
    padding: var(--window-padding);
}

.wind-container{
    background-color: var(--Tertiary-background-colour);
    height: auto;
    
    border-bottom-left-radius: 7px;
    border-bottom-right-radius: 7px;
    
    color: black;

    padding: var(--window-padding);
    
    /* Todo:
        Window width and height variable
        -> Set shadow width + height
        -> Set header width 
    */
}

.headerContent{
    margin-top: 3px;
}

.exitBtn{
    color: white;
    height: 30px;
    width: 30px;
    font-size: 24px;
    font-family: var(--font-family);
    text-align: center;
    border-radius: 5px;
}

.header{
    background-color: var(--Secondary-background-colour);
    padding-top: 2px;
}

.flex{
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    height: 100%;
    justify-content: space-between;
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