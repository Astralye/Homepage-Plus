<script>
    export default {
        props: {
            nestLevel: {
                type: Number,
                default: 0,
                required: true
            }
        },
        mounted() {
            if(this.nestLevel == 0){
                this.containerDimensions.height = "100vh";
                this.containerDimensions.width = "100vw";
            }
            else{
                this.containerDimensions.height = "100%";
                this.containerDimensions.width = "100%";
            }
        },
        data(){
            return{
                containerDimensions: {
                    width: "50px",
                    height: "100px"
                }
            }
        },
        methods: {

        }
    }
</script>

<template>
    <div class="page-content-container">

    </div>
</template>

<style scoped>
.page-content-container{
    height: v-bind("containerDimensions.height");
    width: v-bind("containerDimensions.width");
    background-color: #DD7373;
}

</style>