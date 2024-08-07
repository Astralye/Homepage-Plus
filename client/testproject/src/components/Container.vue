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

            // Logging
            // console.log(this.gridColumnStyle, this.gridRowStyle);
        },
        data(){
            return{

                m_ContainerData:         
                {
                    level: 0,
                    divisionType: "Vertical",
                    id: "0A",
                    NoChildren: 0,
                    siblings: 0,
                },

                    
                m_edit: true,
                m_isHover: false,
                m_isClick: false,
                
                m_columnData: null,
                m_rowData: null,

                m_gridStyle: null,

                m_EditMode: false,

                m_isStoredClick: false,

                m_isVertical: true,
            }
        },
        methods:{

            // Sets css grids
            configureGridData(type){
                let evenSplit = true;

                // Todo
                // Implement generic algorithm
                // for calculating non-even widths.
                // Sum -> 1fr * children.
                // Any division means sum is always the same.
                if(evenSplit){
                    if(type === "Horizontal"){
                        this.rowData = "1fr ".repeat(this.m_ContainerData.NoChildren);
                        this.m_columnData = "1fr";
                    }
                    else{
                        this.m_columnData = "1fr ".repeat(this.m_ContainerData.NoChildren);
                        this.rowData = "1fr";
                    }

                }
                

                // else{
                //     if(this.m_horizontalDivision){
                //         this.rowData = "1fr ".repeat(children);
                //     }
                //     else{
                //         this.columnData = "1fr";
                //     }
                // }
            },

            onSelectionMode(){
                this.m_EditMode = true;
            },
            setCurrentContainer(){
                this.m_ContainerData.level = this.nest_level;

                var tmpID;
                if(this.nest_level === 0){
                    tmpID = this.$ContainerData.value.id;
                }
                else{
                    tmpID = this.parent_ID.concat(this.createID());
                }


                let tmpContainer = this.findLevelData(this.$ContainerData.value, this.m_ContainerData.level, tmpID);
                
                // Set the current container data
                if(tmpContainer != null){
                    this.m_ContainerData.level = tmpContainer.level;
                    this.m_ContainerData.divisionType = tmpContainer.divisionType;
                    this.m_ContainerData.id = tmpContainer.id
                    this.m_ContainerData.NoChildren = tmpContainer.NoChildren;
                    this.m_ContainerData.siblings = tmpContainer.siblings;
               }
                else{
                    console.error(`ERROR: Container not found. Level: ${this.m_ContainerData.level}, ID: ${tmpID}`);
                }

                this.configureGridData(tmpContainer.divisionType);
                this.setDragOrientation();
            },

            createID(){
                return `${this.m_ContainerData.level}`.concat(String.fromCharCode(64 + 1 + this.child_Instance));
            },



            /*
                TODO
                -------------------------------------------
                This function is broken.
                It uses a predefined variable (this.nest_level),
                This means it cant find level data of values up the hierarchy,
                only down
                -> REFACTOR THIS
                -> Fix any implementation bugs.

                07/08/24
            */

            // Depth-first search recurrsion function
            // Finds the corresponding data from the level and ID
            findLevelData(currentLevelData, Level, ID){

                var childData = currentLevelData.containerData;

                console.log("nest:", this.nest_level,  "current Level: ", currentLevelData.level, "Looking for ID:",ID);

                // If this level,
                if(this.nest_level === currentLevelData.level && Level == currentLevelData.level ){
                    console.log("Item found at current level:", currentLevelData.level, Level );
                    return currentLevelData;
                }
                
                if(childData.length === 0 ) return null;
            
                // Needs to look at itself
                // Looks at the children
                for(let i = 0; i < childData.length; i++){
                    
                    let item = childData[i];
                    // console.log("Looking at:", item.id);

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

            storeClickedContainer(){
                if(this.m_ContainerData.id === null) {return;}

                
                this.$GlobalStates.value.edit.containerSelected = this.m_ContainerData.id;
                this.$GlobalStates.value.edit.enabled = true;
            },

            // Select the container which was clicked
            storedClick(){
                this.m_isStoredClick = (this.$GlobalStates.value.edit.containerSelected != this.m_ContainerData.id) ? false : true;
            },
            
            getSiblingNumber(){
                let LastValue = this.m_ContainerData.id.substring(this.m_ContainerData.id.length - 1).toLowerCase();
                return LastValue.charCodeAt(0) - 97;
            },

            isLastSibling(){
                // if(this.m_ContainerData === undefined) { return true; }
                // console.log(this.getSiblingNumber());
                
                // if(this.getSiblingNumber() == this.containerData.siblings){
                //     return true;
                // }
                // return false;
            },
            isBaseContainer(){
                if(this.m_ContainerData.id === "0A"){ return true;}
                return false;
            },

            // The values are updating correctly,
            // But the Page drag value needs to look at its parent to decide what orientation it should be,
            // NOT the current state.
            setDragOrientation(){
                if(this.isBaseContainer()){ return;} // Base 

                let parentID = this.m_ContainerData.id.substring(0, this.m_ContainerData.id.length - 2);
                console.log("HERE");
                let parentObj = this.findLevelData(this.$ContainerData.value, this.m_ContainerData.level - 1, parentID);
                
                console.log("ID:", parentID, "parent level", this.m_ContainerData.level -1, "parent obj", parentObj);


                this.m_isVertical = (parentObj.divisionType === "Vertical") ? true : false; 

                // console.log(this.m_ContainerData.id, this.m_isVertical);
            }
        },
        watch: {
            '$GlobalStates.value.edit.containerSelected':{
                handler(val,oldval){
                    this.storedClick();
                }
            },
            // When the values in the container data change
            '$ContainerData.value': {
                handler(val, oldval){
                    this.setCurrentContainer();
                },
                deep: true
            }
        }
    }
</script>

<template>
    <div
    class="page-content-container"
    >
        <div 
        :class="{'edit-mode': this.$GlobalStates.value.edit.enabled, 
                'edit-hover': (this.$GlobalStates.value.edit.enabled && this.m_isHover && !this.m_isStoredClick),
                'selected-container': this.m_isStoredClick && this.$GlobalStates.value.edit.enabled  }"
                class="grid-template separator"
                @mouseover.self="m_isHover=true"
                @mouseout.self="m_isHover=false"
                @click.self="this.$GlobalStates.value.edit.enabled ? storeClickedContainer() : null">
                    <template v-if="this.m_ContainerData.NoChildren > 0">
                        <Container 
                            v-for="n in this.m_ContainerData.NoChildren" 
                            :nest_level="nest_level+1"
                            :parent_ID="this.m_ContainerData.id"
                            :child_Instance="n-1"
                            />
                    </template>

                </div>

        <!-- if this is hovered or click, 
            disable the click events for the containers -->

            <!-- 
                Value Verticality SHOULD DEPEND ON THE PARENT VALUE, NOT THE CURRENT CONTAINER
            -->
        <div v-if="this.$GlobalStates.value.edit.enabled && !this.isBaseContainer()"
            :class="{
                'page-drag-Vertical': this.m_isVertical,
                'page-drag-Horizontal': ( !this.m_isVertical),
            }">
                    <!-- Need to switch between classes depending on the divisionType  -->
        </div>
    </div>

</template>

<style scoped>
@import '../assets/base.css';

.grid-template{
    display: grid;
    grid-template-columns: v-bind("m_columnData");
    grid-template-rows: v-bind("m_rowData");
    grid-gap: 10px;
    padding: 8px;

    border-radius: 10px;
}

.selected-container{
    background-color: var(--Select-colour);
}

.edit-mode{
    border-color: black;
    border-radius: 10px;

    outline: silver dashed 2px;
}

.edit-hover{
    background-color: var(--Hover-colour) !important;
}

.page-drag-Horizontal{
    position: absolute;
    left: 0;
    height: 10px;
    width: 100vw;
    transform: translateY(-10px);
    cursor: row-resize;
    background-color: white;
}

.page-drag-Vertical{
    position: absolute;
    top: 0;
    height: 100vh;
    width: 10px;
    transform: translateX(-10px);
    cursor: col-resize;
    background-color: white;
}

.page-content-container{
    box-sizing: border-box;
    display: grid;

    height: 100%;
    width: 100%;
    border-radius: 10px; 
    background-color: var(--Primary-background-colour);
}

</style>