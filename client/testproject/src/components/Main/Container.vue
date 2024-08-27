<script>
import { containerData } from '../../Data/containerData.js'

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
            containerData,
            // Objects

            /*
                Each component stores data of the container.
                This data determines how it is rendered

                The values are taken from the global variable and 
                watchers update the values
            */
            // 
            m_LayoutData:
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
        this.updateContainerData();
        this.recalculateThreshold();

        this.setContainerConfigData();
    },
    mounted(){
        this.setComponentDOMValues();
    },
    updated(){
        // Need a function to tell if data of the corresponding has been modified.
        // console.log(containerData.data);
    },


    /*
        Note: when using hot-reloading, saving causes unmounted function to run
        
        Not sure why, but keep that in mind when values suddenly change on save
    */
    unmounted(){
        this.removeGlobalData();
    },
    methods:{
// Logging Functions 
// -----------------------------------------------------------------------------------------------------
        printLayoutInfo(){
                console.log("Container Info\n",
                            "\nLevel: ", this.m_LayoutData.level,
                            "\nDivision Type:", this.m_LayoutData.divisionType,
                            "\nID:", this.m_LayoutData.id,
                            "\nSiblings:", this.m_LayoutData.siblings,
                            "\nEven Split?", this.m_LayoutData.evenSplit,
                            "\nFR data:", this.m_LayoutData.unevenFRData,
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
                this.m_rowData = "1fr ".repeat(this.m_LayoutData.NoChildren);
                this.m_columnData = "1fr";
            }
            else{
                this.m_columnData = "1fr ".repeat(this.m_LayoutData.NoChildren);
                this.m_rowData = "1fr";
            }
        },
        setGridNonEven(container){
            console.log("This should run", container.unevenFRData);
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
        updateContainerData(){
            this.m_LayoutData.level = this.nest_level;
            let tmpID = (this.nest_level === 0) ? this.$layoutData.value.id : this.parent_ID.concat(this.createID());
            let tmpContainer = this.getLevelData(this.$layoutData.value, this.m_LayoutData.level, tmpID);

            if(tmpContainer == null){
                console.error(`ERROR: Container not found. Level: ${this.m_LayoutData.level}, ID: ${tmpID}`);
                return;
            }

            // Set container component data.
            this.m_LayoutData.level = tmpContainer.level;
            this.m_LayoutData.divisionType = tmpContainer.divisionType;
            this.m_LayoutData.id = tmpContainer.id
            this.m_LayoutData.NoChildren = tmpContainer.NoChildren;
            this.m_LayoutData.siblings = tmpContainer.siblings;
            this.m_LayoutData.evenSplit = tmpContainer.evenSplit;
            this.m_LayoutData.unevenFRData = tmpContainer.unevenFRData;

            // Loads the fractional data 
            if(this.m_LayoutData.evenSplit){ this.setGridEven(this.m_LayoutData.divisionType); }
            else if(this.$GlobalStates.isRenderFinalNode){ this.setGridNonEven(this.m_LayoutData); }
            
            // Check if the container is the final container to be rendered
            let lastRenderContainer = this.isFinalNode(this.getLevelData(this.$layoutData.value, 0, "0A"), this.m_LayoutData.id);
            // Turn off Load rendering
            if( lastRenderContainer && this.$GlobalStates.isRenderFinalNode) { this.$GlobalStates.isRenderFinalNode = false;}

            this.recalculateThreshold();
            this.setDragOrientation();
        },

        // Create ID based on the level and child instance
        createID(){
            return `${this.m_LayoutData.level}`.concat(String.fromCharCode(64 + 1 + this.child_Instance));
        },

        // Store container data to global variable
        storeClickedContainer(){
            if(this.m_LayoutData.id === null) {return;}
            this.$GlobalStates.value.edit.containerSelected = this.m_LayoutData.id;
            this.$GlobalStates.value.edit.enabled = true;
            this.$GlobalStates.value.containerSelectionMode = false;
        },

        // Boolean, store if container was clicked.
        isStoredClick(){
            this.m_isStoredClick = (this.$GlobalStates.value.edit.containerSelected != this.m_LayoutData.id) ? false : true;
        },

        // Sibling identifier, A,B,C,D
        getSiblingNumber(){
            let LastValue = this.m_LayoutData.id.substring(this.m_LayoutData.id.length - 1).toLowerCase();
            return LastValue.charCodeAt(0) - 97;
        },
        getParentObj(){
            let parentID = this.m_LayoutData.id.substring(0, this.m_LayoutData.id.length - 2);
            return this.getLevelData(this.$layoutData.value, this.m_LayoutData.level - 1, parentID);
        },
        
        isFirstSibling(){ return (this.getSiblingNumber() === 0) ? true : false; },
        isLastSibling(){ return (this.getSiblingNumber() === this.getParentObj().NoChildren - 1) ? true : false; },
        isBaseContainer(){ return this.m_LayoutData.id === "0A" ? true : false; },
        setDragOrientation(){
            if(this.isBaseContainer()){ return;} // Base 
            this.m_isVertical = (this.getParentObj().divisionType === "Vertical") ? true : false; 
        },
        
        /*
            Due to rendering the order of the division varies
            Vertical -> Extra at the start
            Horizontal -> Extra at the end
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

        // This should remove the values stored in any global data
        removeGlobalData(){
            containerData.deleteID(this.m_LayoutData.id); // Removes the object from the array
            
            // Remove LayoutData
        },
        
// Container Config data
// --------------------------------------------------------------------------------------------------------

        // Sets the config data on creation
        setContainerConfigData(){
            let index = containerData.getIndexFromID(this.m_LayoutData.id);
            if(index === null) { containerData.addNewID(this.m_LayoutData.id); return; }

            // On initialize
            this.disableConfigOnNonLeaf();
        },

        disableConfigOnNonLeaf(){ if(!this.isLeafNode(this.m_LayoutData)){ containerData.disableDisplay(this.m_LayoutData.id); }},

// --------------------------------------------------------------------------------------------------------

// Recurrsion and tree based functions
// --------------------------------------------------------------------------------------------------------
        
        // Check if the child is the last container in the tree
        isFinalNode(parentObject, childID){
            if( parentObject.NoChildren === 0 ) { return false; } // if no children;

            let lastChild = parentObject.childContainers[ parentObject.childContainers.length - 1];
            let count = 0;
            while(true){
                if(lastChild.childContainers.length !== 0){
                    lastChild = lastChild.childContainers[lastChild.childContainers.length - 1];
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
            var childData = currentLevelData.childContainers; // if no children, move up stack.
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

        isLeafNode(layoutData){
            return layoutData.NoChildren === 0 ? true : false;
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

            this.m_cursor = (this.$parent.$data.m_LayoutData.divisionType === "Vertical") ? "col-resize" : "row-resize";
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

            let siblingData = parentObj.childContainers;
            let siblingIndex;

            let isMoveContainer = false;
            let isPositive = false;

            // Find the adjacent sibling
            for(let i = 0; i < siblingData.length; i++){
                if(siblingData[i].id == this.m_LayoutData.id){
                    siblingIndex = i;
                    break;
                }
            }

            // Horizontal divisions, Extra container removed is the start, count after
            if(!this.m_isVertical){ siblingIndex += 1;};

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
            let globalLevelData = this.getLevelData(this.$layoutData.value, this.m_LayoutData.level, this.m_LayoutData.id)
            globalLevelData.unevenFRData = tmpString;

        },

        /*
            This runs every N times for N containers when resized
            Modifies (in px) the threshold of mouse position to move per stepsize
        */
        recalculateThreshold(){
            let width;
            let height;

            let margin = 8;
            let divisionStatement;

            let thresholdOffset = -4;
            
            if(this.m_LayoutData.id === "0A") {
                divisionStatement = this.m_LayoutData.divisionType;

                width = window.innerWidth - ( 2 * margin);
                height = window.innerHeight - ( 2 * margin);
            }
            else{
                const parentComponent = this.$parent.$data.m_ComponentData;
                divisionStatement = this.$parent.$data.m_LayoutData.divisionType;

                // Dimension without margin
                width = parentComponent.width - (2 * margin);
                height = parentComponent.height - (2 * margin);
            }

            // if vertical, use width,
            let container_px = (divisionStatement === "Vertical") ? width : height;
            

            let totalContainers = this.m_LayoutData.siblings + 1;
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
        '$layoutData.value': {
            handler(val, oldVal){
                this.setComponentDOMValues();
                this.updateContainerData();
                this.disableConfigOnNonLeaf();
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


                <template v-if="this.m_LayoutData.NoChildren > 0">
                    
                    <!-- Recurrsion, uses data to determine how many to render -->
                    <Container 
                        v-for="n in this.m_LayoutData.NoChildren" 
                        :nest_level="nest_level+1"
                        :parent_ID="this.m_LayoutData.id"
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