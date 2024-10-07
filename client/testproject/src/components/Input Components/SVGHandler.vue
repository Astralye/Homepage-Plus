<!-- 
    This file is responsible in only loading the SVG data
-->

<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="viewBox"
        :width="width"
        :height="height">
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
            viewBox: {
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

            path_Value:{
                type: String,
                required: true
            }
        },
        created(){
            console.log(this.path_Value);
        }
    }
</script>

<style lang="scss" scoped>

</style>