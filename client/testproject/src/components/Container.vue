<script>
    export default {
        name: "recursive-container",
        props: {
            nest_level: {
                type: Number,
                default: 0,
                required: true
            },

            division_type: {
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

        // x_Y -> props
        // m_xY -> member values
        // xY -> local variables

        // Initializer
        // Sets variables from props
        created(){

            // Sets component variables to props
            this.m_level = this.nest_level;
            this.m_divisionNumber = this.division_number;

            // Sets child component values to props
            let childDivisionType = this.division_type; 
            // I assume this depends not on the parent but what the user choses
            // Gets overridden only for the first layer
            
            let childLevel = this.m_level + 1;
            let childDivisionNumber = 1; // Base case, 1 stops the recurrsion
            this.configureDivisionType();

            // NEST TEST
            // DELETE LATER

            if(this.nest_level === 0){ // Root layer
                childDivisionType = "Vertical";
            }
            else if(this.id === "10"){
                this.m_divisionNumber = 3; // Changes current division number.
                childDivisionType = "Vertical";
            }
            else if(this.id === "22"){
                this.m_divisionNumber = 3; // Changes current division number.
                childDivisionType = "Horizontal";
            }

            // NEST TEST
        
            // Initializes containers
            // Need a way of removing containers
            for(let i = 0; i < this.m_divisionNumber; i++){

                this.m_childNodes.push(
                    { 
                    Level: childLevel,
                    DivisionType: childDivisionType,
                    DivisionNumber: childDivisionNumber,
                    id : childLevel.toString() + i.toString()
                    }
                );
            }

            this.configureGridData();

            // Logging
            console.log(`level: ${this.m_level}, id: ${this.id}, type: ${this.division_type}, child_type: ${childDivisionType}, divisions: ${this.m_divisionNumber}`);
            console.log(this.gridColumnStyle, this.gridRowStyle);
        },
        data(){
            return{

                m_edit: true,
                m_isHover: false,
                m_isClick: false,         
                m_divisionNumber: 0,
                m_level: 0,


                // This is temporary code
                // Will need to link with buttons later
                m_horizontalDivision: false,
                
                m_columnData: null,
                m_rowData: null,

                // Array of child templates
                m_childNodes: [],

                m_gridStyle: null
            }
        },
        methods:{

            // Sets local division based on prop
            configureDivisionType(){
                this.m_horizontalDivision = (this.division_type === "Vertical") ? false : true ;
            },

            // Sets css grids
            configureGridData(){

                let children = 2;
                let evenSplit = true;

                // Todo
                // Implement generic algorithm
                // for calculating non-even widths.
                // Sum -> 1fr * children.
                // Any division means sum is always the same.

                if(evenSplit){
                    if(this.m_horizontalDivision){                  
                        this.rowData = "1fr ".repeat(this.m_divisionNumber);
                    }
                    else{
                        this.columnData = "1fr ".repeat(this.m_divisionNumber);
                    }
                }
                else{
                    if(this.m_horizontalDivision){
                        this.rowData = "1fr ".repeat(children);
                    }
                    else{
                        this.columnData = "1fr";
                    }
                }

                // Sets grid style of component independently of each other
                this.m_gridStyle = {
                    'grid-template-columns' : this.columnData,
                    'grid-template-rows' : this.rowData
                }
            },


            flipDivisionType(){

                // Shortened. Havent tested if this works.
                // this.divisionType = (this.divisionType === "Vertical") ? "Horizontal" : "Vertical";
                // configureDivisionType();

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
            }
        }
    }
</script>

<template>
    <div
        @mouseover.self="m_isHover=true"
        @mouseout.self="m_isHover=false"
        @mouseclick.self="m_isClick=true"
        class="page-content-container"
        >
        <div 
            :class="{'edit-mode': this.m_edit}"
            class="grid-template"
            @mouseover.self="m_isHover=true"
            @mouseout.self="m_isHover=false"
            @mouseclick.self="m_isClick=true">
            
            <template v-if="this.m_divisionNumber > 1">
                <Container 
                    v-for="child in m_childNodes" 
                    :key="child.id"
                    :nest_level="child.Level"
                    :division_type="child.DivisionType"
                    :division_number="child.DivisionNumber"
                    :id="child.id"
                    :styles="m_gridStyle"
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