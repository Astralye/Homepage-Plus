<script>
    export default {
        props: {
            title: String
        },
        emits: ['closeWindow'],

        data() {
            return{
                defaultPosition: {
                    x: 200,
                    y: 200
                },
                windowHover: false
            }
        },
        methods: {

            // startDrag(event){
            //     console.log(event);
            //     event.dataTransfer.dropEffect = 'move';
            //     event.dataTransfer.effectAllowed = 'move';
            // },

            // onDrop(event){

            // },
            
            moveWindow(){
                
            }
        },
    }
</script>

<template>
    <div 
        class="window" 
        :draggable="windowHover"
        >
        <div 
            class="header" 
            @mouseenter.self="windowHover = true"
            @mouseleave.self="windowHover = false"
            @dragstart="startDrag($event)"
            :style="{ left: defaultPosition.x, top: defaultPosition.y}"
            >
            <div class="flex">
                <div class="headerContent headerText">
                    {{ title }}
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
        <div
        class="container noselect">

            <!-- WindowContent, this would be a 
                component using a forloop. -->
            Hello world!
        </div>
    </div>
</template>

<style scoped>
.container{
    background-color: beige;
    height: 100px;
    
    padding: 4px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;

    color: black;

    /* Todo:
        Window width and height variable
        -> Set shadow width + height
        -> Set header width 
    */
    resize: both;
    overflow: auto;
}

.headerContent{
    margin-top: auto;
    margin-bottom: auto;
}

.headerText{
    margin-left: 4px;
    font-size: 16px;
}

.exitBtn{
    background-color: rgb(228, 69, 69);
    margin-right: 4px;
    color: white;
    height: 25px;
    width: 25px;
    font-size: 12px;
    border-radius: 5px;
}

.header{
    background-color: grey;
    width: 100%;
    height: 2em;
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
    width: 200px;
    height: auto;
    box-shadow: 4px 4px 10px grey;
    position: absolute;
}

/* .shadow{
    position: absolute;
    
    width: 100px;
    height: 100px;
    background: black;
    filter:blur(10px); 
} */

</style>