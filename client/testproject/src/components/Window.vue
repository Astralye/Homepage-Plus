<script>
    export default {
        props: {
            title: String
        },
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
            @mouseover="windowHover = true"
            @mouseleave="windowHover = false"
            :style="{ left: defaultPosition.x, top: defaultPosition.y}"
            >
            <div class="headerContainer">
                {{ title }}
            </div>
        </div>
    </div>
</template>

<style scoped>

.headerContainer{
    margin: 2px;
}

.header{
    background-color: grey;
    width: 100%;
    height: 2em;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
}

.header:hover{
    cursor: grab;
}

.window{
    border-radius: 3px;
    background-color: azure;
    width: 200px;
    height: 200px;
}

</style>