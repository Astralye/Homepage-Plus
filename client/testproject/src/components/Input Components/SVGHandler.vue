<!-- 
    This file is responsible in only loading the SVG data

    Note: Ref can only be used on HTML elements, NOT components,
    hence the ref prop
-->

<template>
<div
    class="flex"
    :ref="ref_Value" >
    <svg
        class="change-size"
        
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="view_Box"
        :width="width"
        :height="height"
        :fill="fill_Colour">

        <!-- Need to check for any g elements -->

        <SVGRecursion :pathData="path_Value"/>

        <!-- <template v-for="(item, index) in path_Value" :key="index">
            <path fill-rule="evenodd"
                :d="item"
            />
        </template> -->

        <!--
            Need to check type 
            
            Either the values are a string

            or an object
        -->

    </svg>
</div>
</template>

<script>
import SVGRecursion from './SVGRecursion.vue';

export default {
    components:{
        SVGRecursion
    },
    props: {
        // svg Values
        view_Box: {
            type: String,
            default: "0 0 32 32"
        },
        width:{
            type: String,
            default: "24",
        },
        height:{
            type: String,
            default: "24",
        },
        fill_Colour:{
            type: String,
            default: "#000000",
        },

        // path values
        path_Value:{
            required: true
        },

        ref_Value:{
            type: String,
        }
    },
}
</script>

<style scoped>
.flex{
    display: flex;
}
.change-size{
    transition: width 300ms ease-out, height 300ms ease-out;
}
</style>