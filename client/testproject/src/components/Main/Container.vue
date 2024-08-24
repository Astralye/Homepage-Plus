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
            },
            render_divider:{
                type: Boolean,
                default: false
            }
        },

        // x_Y -> props
        // m_xY -> member values
        // xY -> local variables

        data(){
            return{

                // Objects

                /*
                    Each component stores data of the container.
                    This data determines how it is rendered

                    The values are taken from the global variable and 
                    watchers update the values
                */
                m_ContainerData:         
                {
                    level: 0,
                    divisionType: "Vertical",
                    id: "0A",
                    NoChildren: 0,
                    siblings: 0,
                    evenSplit: true,
                    unevenFRData: ""
                },

                // component (HTML DOM) data NOT container
                m_ComponentData:{
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                },

                m_MouseCoordinate:{
                    x: 0,
                    y: 0
                },

                // Conditional HTML 
                m_edit: true,
                m_isHover: false,
                m_isClick: false,

                // Default instantiate values
                m_EditMode: false,
                m_isStoredClick: false,
                m_isVertical: true,
                m_isMoveContainer: false,
                
                // Data 
                m_columnData: null,
                m_rowData: null,
                m_gridStyle: null,
                
                m_pxThreshold: 5,
                m_StepSize: 0.25,

                m_cursor: "default",
            }
        },

        // Initializer
        // Sets variables from props
        created(){
            
            this.$GlobalStates.clickLoad = true;
            this.setCurrentContainer();
            this.recalculateThreshold();
        },
        mounted(){
            this.setComponentDOMValues();
            
        },
        methods:{

// Logging Functions 
// -----------------------------------------------------------------------------------------------------
            printContainerInfo(){
                  console.log("Container Info\n",
                              "\nLevel: ", this.m_ContainerData.level,
                              "\nDivision Type:", this.m_ContainerData.divisionType,
                              "\nID:", this.m_ContainerData.id,
                              "\nSiblings:", this.m_ContainerData.siblings,
                              "\nEven Split?", this.m_ContainerData.evenSplit,
                              "\nFR data:", this.m_ContainerData.unevenFRData,
                  );
            },
            printMouseCoordinate(){
                console.log("Mouse Coordinate (Absolute)\n",
                            "\nX:", this.m_MouseCoordinate.x,
                            "\nY:", this.m_MouseCoordinate.y,
                );
            },
            printParentContainerInfo(){
                console.log("Parent information\n" ,
                            "\nx:", this.$parent.$data.m_ComponentData.x,
                            "\ny:", this.$parent.$data.m_ComponentData.y,
                            "\nheight:", this.$parent.$data.m_ComponentData.height,
                            "\nwidth:", this.$parent.$data.m_ComponentData.width);
            },
// -------------------------------------------------------------------------------------------------------

// Row + Column Data variable setters
// -------------------------------------------------------------------------------------------------------
            setGridEven(type){
                if(type === "Horizontal"){
                    this.m_rowData = "1fr ".repeat(this.m_ContainerData.NoChildren);
                    this.m_columnData = "1fr";
                }
                else{
                    this.m_columnData = "1fr ".repeat(this.m_ContainerData.NoChildren);
                    this.m_rowData = "1fr";
                }
            },
            setGridNonEven(container){
                if(container.divisionType === "Horizontal"){
                    this.m_rowData = container.unevenFRData;
                    this.m_columnData = "1fr";
                }
                else{
                    this.m_rowData = "1fr";
                    this.m_columnData = container.unevenFRData;
                }
            },

// -------------------------------------------------------------------------------------------------------

// General Container Functions
// --------------------------------------------------------------------------------------------------------


            toggleSelectionMode(){
                this.m_EditMode = true;
            },

            // Applies any changed data to the container
            setCurrentContainer(){
                this.m_ContainerData.level = this.nest_level;
                let tmpID = (this.nest_level === 0) ? this.$ContainerData.value.id : this.parent_ID.concat(this.createID());
                let tmpContainer = this.getLevelData(this.$ContainerData.value, this.m_ContainerData.level, tmpID);

                // Set the current container data
                if(tmpContainer == null){
                    console.error(`ERROR: Container not found. Level: ${this.m_ContainerData.level}, ID: ${tmpID}`);
                    return;
                }

                // Set container component data.
                this.m_ContainerData.level = tmpContainer.level;
                this.m_ContainerData.divisionType = tmpContainer.divisionType;
                this.m_ContainerData.id = tmpContainer.id
                this.m_ContainerData.NoChildren = tmpContainer.NoChildren;
                this.m_ContainerData.siblings = tmpContainer.siblings;
                this.m_ContainerData.evenSplit = tmpContainer.evenSplit;
                this.m_ContainerData.unevenFRData = tmpContainer.unevenFRData;

                if(this.m_ContainerData.evenSplit){
                    this.setGridEven(this.m_ContainerData.divisionType);
                    tmpContainer["unevenFRData"] = ""; // Deletes uneven data when even spacing is turned on.
                }
                else if(this.$GlobalStates.clickLoad){
                    this.setGridNonEven(this.m_ContainerData);
                }

                // Check if the container is the final container to be rendered
                let lastRenderContainer = this.isFinalNode(this.getLevelData(this.$ContainerData.value, 0, "0A"), this.m_ContainerData.id);
                // Turn off Load rendering
                if( lastRenderContainer && this.$GlobalStates.clickLoad) { this.$GlobalStates.clickLoad = false;}
                
                this.recalculateThreshold();
                this.setDragOrientation();
            },

            // Create ID based on the level and child instance
            createID(){
                return `${this.m_ContainerData.level}`.concat(String.fromCharCode(64 + 1 + this.child_Instance));
            },

            // Store container data to global variable
            storeClickedContainer(){
                if(this.m_ContainerData.id === null) {return;}
                this.$GlobalStates.value.edit.containerSelected = this.m_ContainerData.id;
                this.$GlobalStates.value.edit.enabled = true;
                this.$GlobalStates.value.containerSelectionMode = false;
            },

            // Boolean, store if container was clicked.
            isStoredClick(){
                this.m_isStoredClick = (this.$GlobalStates.value.edit.containerSelected != this.m_ContainerData.id) ? false : true;
            },

            // Sibling identifier, A,B,C,D
            getSiblingNumber(){
                let LastValue = this.m_ContainerData.id.substring(this.m_ContainerData.id.length - 1).toLowerCase();
                return LastValue.charCodeAt(0) - 97;
            },
            getParentObj(){
                let parentID = this.m_ContainerData.id.substring(0, this.m_ContainerData.id.length - 2);
                return this.getLevelData(this.$ContainerData.value, this.m_ContainerData.level - 1, parentID);
            },
            
            isFirstSibling(){ return (this.getSiblingNumber() === 0) ? true : false; },
            isLastSibling(){ return (this.getSiblingNumber() === this.getParentObj().NoChildren - 1) ? true : false; },
            isBaseContainer(){ return this.m_ContainerData.id === "0A" ? true : false; },
            setDragOrientation(){
                if(this.isBaseContainer()){ return;} // Base 
                this.m_isVertical = (this.getParentObj().divisionType === "Vertical") ? true : false; 
            },
            
            /*
                Due to rendering the order of the division varies
                Vertical -> Extra at the start
            */
            isExtraContainerValue(){ return !this.m_isVertical ? !this.isLastSibling() : !this.isFirstSibling(); },
            getGridData(data){
                let splitData = data.split(" ");
                let tmpArray = [];
                splitData.pop();

                for(let i = 0; i < splitData.length; i++){
                    tmpArray.push(Number(splitData[i].substring(0,splitData[i].length-2)));
                }
                return tmpArray;
            },

// --------------------------------------------------------------------------------------------------------

// Recurrsion and tree based functions
// --------------------------------------------------------------------------------------------------------
            
            // Check if the child is the last container in the tree
            isFinalNode(parentObject, childID){
                if( parentObject.NoChildren === 0 ) { return false; } // if no children;

                let lastChild = parentObject.containerData[ parentObject.containerData.length - 1];
                let count = 0;
                while(true){
                    if(lastChild.containerData.length !== 0){
                        lastChild = lastChild.containerData[lastChild.containerData.length - 1];
                        count++;
                        if(count === 100) { break; } // Avoid a potential infinite loop
                        continue;
                    }
                    break;
                }
                return (lastChild.id === childID) ? true : false;
            },

            // Depth-first search recurrsion function
            // Finds the corresponding data from the level and ID
            getLevelData(currentLevelData, Level, ID){
                
                // Input level is the current level data
                if(Level == currentLevelData.level ){
                    // console.log("Item found at current level:", currentLevelData.level, Level );
                    return currentLevelData;
                }

                // Retrieve child data
                var childData = currentLevelData.containerData; // if no children, move up stack.
                if(childData.length === 0 ) return null; 
                // console.log("nest:", this.nest_level,  "current Level: ", currentLevelData.level, "Looking for ID:",ID);
                
                // Looks at children
                for(let i = 0; i < childData.length; i++){
                    let item = childData[i];
                    // console.log("Looking at:", item.id);

                    // Base case (Found item)
                    if(item.id == ID){ return item; }

                    // Base case (Nothing found and no siblings)
                    else if(item.NoChildren === 0 && childData.length <= 1) { return null; }
                    
                    // Base case (Has children)
                    else{
                        var tmp = this.getLevelData(item, Level + 1, ID);
                        // If any item is found, return up stack.
                        if(tmp !== null){ return tmp; }
                    }
                }
                return null; // Not found in children, move up stack.
            },

// ---------------------------------------------------------------------------------------------------------

// Divider drag functions
// ---------------------------------------------------------------------------------------------------------


            // Start event on mouse down on divider.
            // End event on mouse up regardless of position.
            onMouseHold(event, holding){
                this.m_isMoveContainer = true;
                
                document.addEventListener('mouseup', function(e) {
                    this.m_isMoveContainer = false;
                    document.onmousemove = null;
                    this.m_cursor = "default";
                    document.documentElement.style.setProperty("--cursor", this.m_cursor);

                }, { once: true });

                document.onmousemove = this.trackMousePosition;

                this.m_cursor = (this.$parent.$data.m_ContainerData.divisionType === "Vertical") ? "col-resize" : "row-resize";
                document.documentElement.style.setProperty("--cursor", this.m_cursor);
            },

            // Store absolute mouse position
            trackMousePosition: function(event){
                this.m_MouseCoordinate.x = event.pageX;
                this.m_MouseCoordinate.y = event.pageY;
                this.moveContainer();
            },

            // Find difference in coordinates of mouse and divider center
            calculateMouseDifference(division){
                const divider = this.$refs["divider"].getBoundingClientRect();
                // Absolute value need to convert to relative position

                let relMouseCoord = { x: 0, y: 0 };
                let relDividerCoord = { x: 0, y:0 };

                // Calculation values
                let dividerSize;
                let mousePos;
                let dividerCoord;

                relMouseCoord.x = this.m_MouseCoordinate.x - this.$parent.$data.m_ComponentData.x;
                relMouseCoord.y = this.m_MouseCoordinate.y - this.$parent.$data.m_ComponentData.y;

                relDividerCoord.x = divider.x - this.$parent.$data.m_ComponentData.x;
                relDividerCoord.y = divider.y - this.$parent.$data.m_ComponentData.y;

                // console.log(`Rel Mouse Coord: ${relMouseCoord.x}, ${relMouseCoord.y}`,
                //             `\nRel Divider Coord: ${relDividerCoord.x}, ${relDividerCoord.y}`);

                if(division === "Vertical"){
                    mousePos = relMouseCoord.x;
                    dividerCoord = relDividerCoord.x;
                    dividerSize = divider.width / 2;
                }
                else{
                    mousePos = relMouseCoord.y;
                    dividerCoord = relDividerCoord.y;
                    dividerSize = divider.height / 2;
                }

                return mousePos - dividerCoord - dividerSize;
            },

            moveContainer(){
                let parentObj = this.getParentObj();
                if(parentObj.evenSplit) { return; }

                const difference = this.calculateMouseDifference(parentObj.divisionType);

                // console.log(`Diffrence: ${difference}, ${this.m_pxThreshold}`);
                let siblingData = parentObj.containerData;
                let siblingIndex;

                let isMoveContainer = false;
                let isPositive = false;

                // Find the adjacent sibling
                for(let i = 0; i < siblingData.length; i++){
                    if(siblingData[i].id == this.m_ContainerData.id){
                        siblingIndex = i;
                        break;
                    }
                }

                // Horizontal divisions, Extra container removed is the start, count after
                if(!this.m_isVertical){ siblingIndex += 1;};


                // console.log(this.$parent.$data.m_pxThreshold);
                // console.log(difference);

                // Determines whether to run move function
                if(Math.abs(difference) >= this.m_pxThreshold){
                    isMoveContainer = true;
                    if( difference < 0) { isPositive = true;}
                }
                // isPositive = True -> Right or Up
                // isPositive = False -> Left or Down

                // Data sent to parent
                let data = {
                    index: siblingIndex,
                    type: parentObj.divisionType,
                    direction: isPositive
                };

                // Run parent function
                if(isMoveContainer){ this.$emit('drag', data);}
            },


            // This function only runs at the parents container
            // because it modifies the css variable.
            updateParentColumnRow(data){
                let siblingIndex = data.index;
                let baseIndex = siblingIndex - 1;
                let siblingValue;
                let baseValue;

                let arrayData = (data.type === "Vertical") ? this.getGridData(this.m_columnData) : this.getGridData(this.m_rowData);

                siblingValue = arrayData[siblingIndex];
                baseValue = arrayData[baseIndex];

                // False -> Left or Down
                // True -> Right or Up
                if(data.direction){
                    baseValue -= this.m_StepSize;
                    siblingValue += this.m_StepSize;
                }
                else{
                    baseValue += this.m_StepSize;
                    siblingValue -= this.m_StepSize;
                }

                // Set back the values 
                arrayData[siblingIndex] = siblingValue;
                arrayData[baseIndex] = baseValue;

                // Convert back to string.
                let tmpString = "";
                for(let i = 0; i < arrayData.length; i++){ tmpString += String(arrayData[i]) + "fr "; }
                
                // Set the corresponding data 
                if(data.type === "Vertical"){ this.m_columnData = tmpString; } 
                else{ this.m_rowData = tmpString; } 

                // Updates the global container values
                let globalLevelData = this.getLevelData(this.$ContainerData.value, this.m_ContainerData.level, this.m_ContainerData.id)
                globalLevelData.unevenFRData = tmpString;

            },

            /*
                This runs every N times for N containers when resized
                Modifies (in px) the threshold of mouse position to move per stepsize
            */
            recalculateThreshold(){

                // this.printContainerInfo();
                let width;
                let height;

                let margin = 8;
                let divisionStatement;

                let thresholdOffset = -4;
                
                if(this.m_ContainerData.id === "0A") {
                    divisionStatement = this.m_ContainerData.divisionType;

                    width = window.innerWidth - ( 2 * margin);
                    height = window.innerHeight - ( 2 * margin);
                }
                else{
                    const parentComponent = this.$parent.$data.m_ComponentData;
                    divisionStatement = this.$parent.$data.m_ContainerData.divisionType;

                    // Dimension without margin
                    width = parentComponent.width - (2 * margin);
                    height = parentComponent.height - (2 * margin);
                }

                // if vertical, use width,
                let container_px = (divisionStatement === "Vertical") ? width : height;
                

                let totalContainers = this.m_ContainerData.siblings + 1;
                let pxPerFractionalUnit = container_px / totalContainers;
                let pxPerStep = pxPerFractionalUnit * this.m_StepSize;

                this.m_pxThreshold = pxPerStep + thresholdOffset;
            },

            // Allows child components to calculate relative coordinates.
            setComponentDOMValues(){
                let data = this.$refs["refContainer"].getBoundingClientRect();
                
                this.m_ComponentData.x = data.x;
                this.m_ComponentData.y = data.y;
                this.m_ComponentData.width = data.width;
                this.m_ComponentData.height = data.height;
            }
        },

// Watchers
// --------------------------------------------------------------------------------------------------------------

        watch: {
            '$GlobalStates.value.edit.containerSelected'(val, oldval){
                this.isStoredClick();
            },
            '$GlobalStates.value.edit.windowSize':{
                handler(val,oldval){
                    this.setComponentDOMValues();
                    this.recalculateThreshold();
                },
                deep: true
            },
            '$GlobalStates.value.edit.dragStepSize'(val, oldval){
                this.m_StepSize = val;
            },
            // When the values in the container data change
            '$ContainerData.value': {
                handler(val, oldVal){
                    this.setComponentDOMValues();
                    this.setCurrentContainer();
                },
                deep: true
            },

        }
    }
</script>

<template>
    <!-- Container wrapper -->
    <div class="component-container">
        
        <!-- Container -->
        <div
            class="page-content-container"
            ref="refContainer"
            >
            
            <!-- Edit based container functions -->
            <div 
            :class="{'edit-mode': this.$GlobalStates.value.edit.enabled, 
                    'edit-hover': (this.$GlobalStates.value.edit.enabled && this.m_isHover && !this.m_isStoredClick),
            'selected-container': this.m_isStoredClick && this.$GlobalStates.value.edit.enabled  }"
            class="grid-template"
            @mouseover.self="m_isHover = this.$GlobalStates.value.containerSelectionMode"
            @mouseout.self="m_isHover=false"
            @click.self="this.$GlobalStates.value.containerSelectionMode ? ( this.$GlobalStates.value.edit.enabled ? storeClickedContainer() : null ) : null">

<!-- Tmp comment
Check if the 'select container statement is true'
If not, disable the mouse over and click.self functionality.
-->


                <template v-if="this.m_ContainerData.NoChildren > 0">
                    
                    <!-- Recurrsion, uses data to determine how many to render -->
                    <Container 
                        v-for="n in this.m_ContainerData.NoChildren" 
                        :nest_level="nest_level+1"
                        :parent_ID="this.m_ContainerData.id"
                        :child_Instance="n-1"
                        :render_divider="true"
                        @drag="updateParentColumnRow"
                        />

                </template>
            </div>
        </div>
        
        <!-- Divider -->
        <template v-if="this.render_divider">
            <div v-if="this.$GlobalStates.value.edit.enabled && 
                      !this.isBaseContainer() && this.isExtraContainerValue()"
            :class="{
                'page-drag-Horizontal': ( !this.m_isVertical),
                'page-drag-Vertical': (this.m_isVertical)}"
            @mousedown="onMouseHold"
            ref="divider">
            </div>
        </template>
    </div>
</template>

<!---------------------------------------------------------------------------------------------------------------------------
    CSS
-->

<style scoped>
@import '../../assets/base.css';

.component-container{
    height: 100%;
}

.grid-template{
    display: grid;
    grid-template-columns: v-bind("m_columnData");
    grid-template-rows: v-bind("m_rowData");
    grid-gap: 10px;
    padding: 8px;
    
    
    /*
    Transitions change the position of the slider.
        Causes bugs with the math and calculations
        Maybe in future implement
        transition: grid 0.2s linear;
    */

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
    height: 10px;
    width: 100%;
    background-color: rgba(255,255,255,0);
    border-radius: 10px;
    transition: all 0.2s ease-in-out;
}

.page-drag-Horizontal:hover{
    background-color: rgba(255,255,255,0.2);
    cursor: row-resize;
}
.page-drag-Horizontal:active{
    background-color: rgba(255,255,255,0.6);
}

/*
    Use a standard colour
*/
.page-drag-Vertical{
    height: 100%;
    width: 20px;
    transform: translate(-15px, -100%);
    background-color: rgba(255,255,255,0.4);
    background-color: rgba(255,255,255, 0 );
    border-radius: 10px;
    transition: all 0.2s ease-in-out;
}
.page-drag-Vertical:hover{
    background-color: rgba(255,255,255,0.2);
    cursor: col-resize;
}
.page-drag-Vertical:active{
    background-color: rgba(255,255,255,0.6);
}

.page-content-container{
    display: grid;

    height: 100%;
    width: 100%;
    background-color: var(--Primary-background-colour);
    transition: all 0.1s ease-in-out;
}

</style>