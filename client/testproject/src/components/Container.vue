<script>
    export default {
        name: "recursive-container",
        props: {
            nest_level: {
                type: Number,
                default: 0,
                required: true,
            },
            parent_ID:{
                type: String,
                default: ""
            },
            child_Instance:{
                type: Number,
                default: 0
            }
        },

        // x_Y -> props
        // m_xY -> member values
        // xY -> local variables

        // Initializer
        // Sets variables from props
        created(){
            
            this.setCurrentContainer();
            this.configureDivisionType();
            this.configureGridData();

            // Logging
            // console.log(`level: ${this.m_level}, id: ${this.id}, type: ${this.division_type}, child_type: ${childDivisionType}, divisions: ${this.m_divisionNumber}`);
            // console.log(this.gridColumnStyle, this.gridRowStyle);
        },
        data(){
            return{

                m_ContainerData:         
                {
                    level: 0,
                    divisionType: "Vertical",
                    id: "0A",
                    NoChildren: 0
                },
                    
                m_edit: true,
                m_isHover: false,
                m_isClick: false,


                // This is temporary code
                // Will need to link with buttons later
                m_horizontalDivision: false,
                
                m_columnData: null,
                m_rowData: null,

                m_gridStyle: null,

                m_EditMode: false
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
            },


            flipDivisionType(){

                // Shortened. Havent tested if this works.
                this.divisionType = (this.divisionType === "Vertical") ? "Horizontal" : "Vertical";
                configureDivisionType();
            },

            onSelectionMode(){
                this.m_EditMode = true;
            },
            setCurrentContainer(){
                this.m_ContainerData.level = this.nest_level;

                var tmpID;
                if(this.nest_level === 0){
                    tmpID = this.$ContainerData.value.id;
                    console.log(tmpID);
                }
                else{
                    tmpID = this.parent_ID.concat(this.createID());
                }


                let tmpContainer = this.findLevelData(this.$ContainerData.value, this.m_ContainerData.level, tmpID);
                // console.log(this.m_ContainerData);
                
                this.m_ContainerData.level = tmpContainer.level;
                this.m_ContainerData.divisionType = tmpContainer.divisionType;
                this.m_ContainerData.id = tmpContainer.id
                this.m_ContainerData.NoChildren = tmpContainer.NoChildren;

            },

            createID(){
                return `${this.m_ContainerData.level}`.concat(String.fromCharCode(64 + 1 + this.child_Instance));
            },

            // Breadth first recurrsion function
            // Finds the corresponding data from the level and ID
            findLevelData(currentLevelData, Level, ID){

                var childData = currentLevelData.containerData;

                console.log("nest:", this.nest_level,  "current Level: ", currentLevelData.level, "Looking for ID:",ID);

                // If this level,
                if(this.nest_level === currentLevelData.level && Level == currentLevelData.level ){
                    // console.log("Item found")
                    return currentLevelData;
                }
                
                if(childData.length === 0 ) return null;

                // Needs to look at itself
                // Looks at the children
                for(let i = 0; i < childData.length; i++){
                    
                    let item = childData[i];
                    console.log("Looking at:", item.id);

                    // Base case (Found item)
                    if(item.id == ID){
                        // console.log("Item found")
                        return item
                    }
                    // Base case (Nothing found and only no siblings)
                    else if(item.NoChildren === 0 && childData.length <= 1)
                    {
                        return null;
                    }
                    // Recursive
                    else{
                        // Moves down 1 level
                        var tmp = this.findLevelData(item, Level + 1, ID);
                        // If found, return up stack.
                        if(tmp !== null){ return tmp; }
                    }
                }
                return null;
            },

            updateChildren(){
                // Update no. children depending on how many values in containerData
            }
        },
        watch: {
            '$GlobalStates.value.containerSelectionMode': {
                handler(val, oldval){
                    this.onSelectionMode();
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
            :class="{'edit-mode': this.$GlobalStates.value.editMode, 
                    'edit-hover': (this.m_EditMode && this.m_isHover) }"
            class="grid-template separator"
            @mouseover.self="m_isHover=true"
            @mouseout.self="m_isHover=false"
            @mouseclick.self="m_isClick=true">

                <template v-if="this.m_ContainerData.NoChildren > 0">
                    <Container 
                        v-for="n in this.m_ContainerData.NoChildren" 
                        :nest_level="nest_level+1"
                        :parent_ID="this.m_ContainerData.id"
                        :child_Instance="n-1"
                        />
                </template>
                
        </div>

    </div>
</template>

<style scoped>

.grid-template{
    display: grid;
    grid-template-columns: v-bind("columnData");
    grid-template-rows: v-bind("rowData");
    padding: 8px;

    border-radius: 10px;
}

.edit-mode{
    border-color: black;
    border-radius: 10px;

    outline: black dashed 2px;
}

.edit-hover{
    background-color: brown !important;
}

.page-content-container{
    box-sizing: border-box;
    display: grid;

    height: 100%;
    width: 100%;
    border-radius: 10px; 
    background-color: #DD7373;
}

</style>