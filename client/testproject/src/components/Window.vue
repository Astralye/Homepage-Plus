<script>
    export default {
        props: {
            title: String
        },
        emits: ['closeWindow'],

        data() {
            return{
                windowHover: false,

                positions: {
                    clientX: undefined,
                    clientY: undefined,
                    movementX: 0,
                    movementY: 0
                }
            }
        },
        methods: {          
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
            elementDrag: function ( event) {
                event.preventDefault();

                this.positions.movementX = this.positions.clientX - event.clientX
                this.positions.movementY = this.positions.clientY - event.clientY
                this.positions.clientX = event.clientX
                this.positions.clientY = event.clientY

                this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
                this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
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
                <div class="headerContent headerText">
                    <h1> {{ title }} </h1>
                </div>
                <button 
                    class="headerContent exitBtn noselect"
                    @click="$emit('closeWindow', `${title}`)"
                    @mouseenter.self="windowHover = false"
                    >
                    X
                </button>
        </div>

        <!-- Main content -->
        <div
        class="wind-container noselect">
            <slot name="window-content"></slot>
        </div>
    </div>
    
</template>

<style scoped>

.wind-container{
    background-color: beige;
    height: auto;
    
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;

    color: black;

    padding-top: 5px;

    /* Todo:
        Window width and height variable
        -> Set shadow width + height
        -> Set header width 
    */
}

.headerContent{
    margin-top: auto;
    margin-bottom: auto;
}

.headerText{
    margin-left: 4px;
}

.exitBtn{
    background-color: rgb(228, 69, 69);
    margin-right: 4px;
    color: white;
    height: 30px;
    width: 30px;
    font-size: 12px;
    border-radius: 5px;
}

.header{
    background-color: grey;
    width: 100%;
    height: 3em;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
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
    width: 300px;
    height: auto;
    box-shadow: 4px 4px 10px grey;
    position: absolute;
    top: 0;
    left: 0;
}

/* A box shadow is defined with container
    offset, x + y
    blur
    color

    By default css the size is the size of the container,
    but we could try change the size of the container manually

*/
/* .shadow{
    position: absolute;
    
    width: 100px;
    height: 100px;
    background: black;
    filter:blur(10px); 
} */

</style>