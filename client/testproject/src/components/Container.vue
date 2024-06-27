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

            let children = 2;
            let evenSplit = true;
            if(evenSplit){
                if(this.containerDivision.Vertical){
                    this.columnData = "1fr ".repeat(children);
                }
                else if(this.containerDivision.Horizontal){
                    this.rowData = "1fr ".repeat(children);
                }
            }

            // Todo
            // Implement generic algorithm
            // for calculating non-even widths.
            // Sum -> 1fr * children.
            // Any division means sum is always the same.

            else{
                if(this.containerDivision.Vertical){
                    this.columnData = "1fr 1fr";
                }
                else if(this.containerDivision.Horizontal){
                    this.rowData = "1fr ".repeat(children);
                }
            }
            
        },
        data(){
            return{

                edit: true,
                isHover: false,
                isClick: false,

                // This is temporary code
                // Will need to link with buttons later
                containerDivision: {
                    Horizontal: true,
                    Vertical: false
                },
                
                columnData: null,
                rowData: null
            }
        },
        methods: {

        }
    }
</script>

<template>
    <div
        @mouseover.self="isHover=true"
        @mouseout.self="isHover=false"
        @mouseclick.self="isClick=true"
        class="page-content-container"
        :class="{'edit-hover': this.isHover}"
        >
        <div 
            :class="{'edit-mode': this.edit}"
            class="grid-template"
            @mouseover.self="isHover=true"
            @mouseout.self="isHover=false"
            @mouseclick.self="isClick=true">
            
            <slot name="container-content"> </slot>
        </div>

    </div>
</template>

<style scoped>

.grid-template{
    display: grid;
    grid-template-columns: v-bind("columnData");
    grid-template-rows: v-bind("rowData");
}

.edit-mode{
    border-color: black;
    border: 5px dashed black;
    margin: 5px;

    grid-template-columns: v-bind("columnData");
    grid-template-rows: v-bind("rowData");
}

.edit-hover{
    background-color: brown !important;
}

.page-content-container{
    box-sizing: border-box;
    display: grid;

    height: 100%;
    width: 100%;
    background-color: #DD7373;
}

</style>