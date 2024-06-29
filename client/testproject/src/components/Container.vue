<script>
    export default {
        name: "recursive-container",
        props: {
            nestLevel: {
                type: Number,
                default: 0,
                required: true
            },

            divisionType: {
                type: String,
                default: "Vertical",
                required: true
            },

            division_number: {
                type: Number,
                default: 1,
                required: true
            },

            id: {
                type: String,
                default: 0
            }
        },

        // Initializer
        // Sets variables from props
        beforeMount() {


            // TODO
            // Refactor code
            // Currently it is a mess and works via code but needs to be 
            // refactored to make sure it can work with the other components
            
            this.level = this.nestLevel;
            let nextLevel = this.level + 1;
            
            var childDivisionType = this.divisionType;
            
            this.divisionNumber = this.division_number;
            var newDivisionNumber = 1;


            if(this.nestLevel === 0){
                console.log("root");

                childDivisionType = "Vertical";
            }
            else if(this.id === "10"){
                this.divisionNumber = 3; 
                childDivisionType = "Horizontal";

                console.log("a");
            }

            console.log(`level: ${this.level}, id: ${this.id}, type: ${this.divisionType}, child_type: ${childDivisionType}, divisions: ${this.divisionNumber}`);
            

            if(this.divisionType === "Vertical") {
                this.containerDivision.Vertical = true;
                this.containerDivision.Horizontal = false;
            }
            else{
                this.containerDivision.Horizontal = true;
                this.containerDivision.Vertical = false;
            }
            
            // Create child nodes
            for(let i = 0; i < this.divisionNumber; i++){

                this.childNodes.push(
                    { 
                    Level: nextLevel,
                    DivisionType: childDivisionType,
                    DivisionNumber: newDivisionNumber,
                    id : nextLevel.toString() + i.toString()
                    }
                );
            }
        },
        mounted() {

            let children = 2;
            let evenSplit = true;
            if(evenSplit){
                if(this.containerDivision.Vertical){                  
                 this.columnData = "1fr ".repeat(this.divisionNumber);

                }
                else if(this.containerDivision.Horizontal){
                 this.rowData = "1fr ".repeat(this.divisionNumber);

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
                divisionNumber: 0,
                level: 0,


                // This is temporary code
                // Will need to link with buttons later
                containerDivision: {
                    Horizontal: true,
                    Vertical: false
                },
                
                columnData: null,
                rowData: null,

                // Array of child templates
                childNodes: []

            }
        },
        methods:{
            flipDivisionType(){
                if(this.divisionType === "Vertical"){
                    this.divisionType = "Horizontal";

                    this.containerDivision.Horizontal = true;
                    this.containerDivision.Vertical = false;
                    
                }
                else{
                    this.divisionType = "Vertical";           

                    this.containerDivision.Vertical = true;   
                    this.containerDivision.Horizontal = false;
                }
            },
        }
    }
</script>

<template>
    <div
        @mouseover.self="isHover=true"
        @mouseout.self="isHover=false"
        @mouseclick.self="isClick=true"
        class="page-content-container"
        >
        <div 
            :class="{'edit-mode': this.edit}"
            class="grid-template"
            @mouseover.self="isHover=true"
            @mouseout.self="isHover=false"
            @mouseclick.self="isClick=true">
            
            <template v-if="this.divisionNumber > 1">
                <Container 
                    v-for="child in childNodes" 
                    :key="child.id"
                    :nestLevel="child.Level"
                    :divisionType="child.DivisionType"
                    :division_number="child.DivisionNumber"
                    :id="child.id"
                    />
            </template>

        </div>

    </div>
</template>

<!-- Need to put grid-template-xxxxx 
    as a dynamic style in the div element
    This is because grid-template is used by all the recursive
    components and the column and row data is then shared between them
    which is not a property I need.
-->


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