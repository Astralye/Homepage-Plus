<!-- 
    This file is responsible in only loading the SVG data
-->

<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="view_Box"
        :width="width"
        :height="height"
        :fill="fill_Colour"
        >
        <path
            fill-rule="evenodd"
            :d="path_Value">
        </path>
    </svg>
</template>

<script>
    export default {
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
                type: String,
                required: true
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>