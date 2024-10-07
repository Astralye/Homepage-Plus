<!-- 
    This file is responsible in only loading the all the current SVG data


-->

<template>
    <SVGHandler>
        
    </SVGHandler>
</template>

<script>
import SVGHandler from './SVGHandler.vue';

export default {
    components: {
        SVGHandler
    },
    props:{
        data: String,
    }
}
</script>

<style scoped>

</style>