<!-- 
    This file is used for the larger data structures used for SVGs to load properly
    For simple SVG, it will only occur once.

    SVG with g tags will recurse.
-->
<template>
    
    <!-- Base case -->
    <template v-if="isEnd">
        <!-- Render all the path data -->
        <template v-for="(item, index) in pathData.d" :key="index">
            <path v-if="isEnd" :d="item" />
        </template>
    </template>    
    <!-- Recurse -->
    <template v-else>
        <g :transform="pathData.transforms">
            <template v-for="(item, index) in pathData.d" :key="index">
                <SVGRecursion :pathData="item" />
            </template>
        </g>
    </template>

</template>

<script>
export default {
    props: {
        pathData : {
            required: true,
        }
    },
    computed:{

        // Check if it is at the end node
        // First value of the array, is a string
        isEnd(){
            if(!this.pathData) return false;
            return typeof(this.pathData.d[0]) === "string";
        },
        isEmpty(){
            return this.pathData.length === 0;
        }
    }
}
</script>

<style scoped>

</style>