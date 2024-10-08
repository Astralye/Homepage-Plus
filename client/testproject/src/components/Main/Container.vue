<script>
import { containerData } from '../../Data/containerData.js'
import { layout, LayoutDataClass } from '../../Data/layoutData.js';
import { mouseData } from '../../Data/mouseData.js';
import { ContainerDividerClass } from '../Functions/containerDivider.js';

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
            layout,
            LayoutDataClass,
            ContainerDividerClass,
            mouseData,

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
            let repeatedData = "1fr ".repeat(this.m_LayoutData.NoChildren);
            let normal = "1fr";

            this.m_rowData = (type === "Horizontal")  ? repeatedData : normal;
            this.m_columnData = (type === "Horizontal")  ? normal : repeatedData;
        },
        setGridNonEven(container){
            let normal = "1fr";

            this.m_rowData = (container.divisionType === "Horizontal")  ? container.unevenFRData : normal;
            this.m_columnData = (container.divisionType === "Horizontal")  ? normal : container.unevenFRData;
        },

// -------------------------------------------------------------------------------------------------------

// General Container Functions
// --------------------------------------------------------------------------------------------------------

        isStoredClick(){
            this.m_isStoredClick = (this.$GlobalStates.value.edit.containerSelected != this.m_LayoutData.id) ? false : true;
        },

        // Applies any changed data to the container
        updateContainerData(){
            let tmpID = (this.nest_level === 0) ? layout.allData.id : this.parent_ID.concat(LayoutDataClass.generateID(this.nest_level, this.child_Instance));
            let tmpContainer = LayoutDataClass.getLevelData(layout.allData, this.nest_level, tmpID);

            if(tmpContainer == null){
                this.printLayoutInfo();
                console.error(`ERROR: Container not found. Level: ${this.m_LayoutData.level}, ID: ${tmpID}`);
                return;
            }

            this.setDataValues(tmpContainer);
            this.loadFractionalData();
            this.renderLastContainer();

            if(!LayoutDataClass.isBaseContainer(this.m_LayoutData.id)){
                this.m_isVertical = (LayoutDataClass.getParentObj(this.m_LayoutData).divisionType === "Vertical"); 
            }
        },
        
        // Set container component data.
        setDataValues(newData){
            this.m_LayoutData.level = newData.level;
            this.m_LayoutData.divisionType = newData.divisionType;
            this.m_LayoutData.id = newData.id
            this.m_LayoutData.NoChildren = newData.NoChildren;
            this.m_LayoutData.siblings = newData.siblings;
            this.m_LayoutData.evenSplit = newData.evenSplit;
            this.m_LayoutData.unevenFRData = newData.unevenFRData;
        },

        // Loads the fractional data
        loadFractionalData(){
            if(this.m_LayoutData.evenSplit){ this.setGridEven(this.m_LayoutData.divisionType); }
            else if(this.$GlobalStates.isRenderFinalNode){ this.setGridNonEven(this.m_LayoutData); }
        },

        // Turn off Load rendering
        // Check if the container is the final container to be rendered
        renderLastContainer(){
            let lastRenderContainer = LayoutDataClass.isFinalNode(LayoutDataClass.getLevelData(layout.allData, 0, "0A"), this.m_LayoutData. id);
            if( lastRenderContainer && this.$GlobalStates.isRenderFinalNode) { this.$GlobalStates.isRenderFinalNode = false;}
        },

// Singleton Data Config
// -------------------------------------------------------------------------------------------------------

        // On Unmount, remove it
        removeGlobalData(){
            containerData.deleteID(this.m_LayoutData.id); // Removes the object from the array
            
            // Remove LayoutData
        },

        // Store container data on click to singleton
        storeClickedContainer(){
            if(this.m_LayoutData.id === null) {return;}
            this.$GlobalStates.value.edit.containerSelected = this.m_LayoutData.id;
            this.$GlobalStates.value.edit.enabled = true;
            this.$GlobalStates.value.containerSelectionMode = false;
        },
        
// Container Config data
// --------------------------------------------------------------------------------------------------------

        // Sets the config data on creation
        setContainerConfigData(){
            let index = containerData.getIndexFromID(this.m_LayoutData.id);
            if(index === null) { containerData.addNewID(this.m_LayoutData.id); return; }
            this.disableConfigOnNonLeaf();
        },

        disableConfigOnNonLeaf(){ if(!LayoutDataClass.isLeafNode(this.m_LayoutData)){ containerData.disableDisplay(this.m_LayoutData.id); }},

// --------------------------------------------------------------------------------------------------------

// Divider drag functions
// ---------------------------------------------------------------------------------------------------------

        /*
            Due to rendering the order of the division varies
            Vertical -> Extra at the start
            Horizontal -> Extra at the end
        */
        displayDivider(){ return LayoutDataClass.isExtraContainer(this.m_LayoutData, this.m_isVertical)},

        /* 
            This runs N times for N containers on window resize 
            Modifies (in px) the threshold of mouse position to move per stepsize
        */
        recalculateThreshold(){ this.m_pxThreshold = ContainerDividerClass.calculateThreshold(this.m_LayoutData, this.$parent.$data, this.m_StepSize); },

        // Start event on mouse down on divider. End event on mouse up.
        onMouseHold(event, holding){
            this.m_isMoveContainer = true;
            
            document.addEventListener('mouseup', function(e) {
                this.m_isMoveContainer = false;
                this.m_cursor = "default";
                mouseData.disableTracking();
                document.documentElement.style.setProperty("--cursor", this.m_cursor); 

            }, { once: true });

            // document.onmousemove = this.trackMousePosition;
            mouseData.movementFunctions( [this.moveContainer ]);
            mouseData.enableTracking();

            this.m_cursor = (this.$parent.$data.m_LayoutData.divisionType === "Vertical") ? "col-resize" : "row-resize";
            document.documentElement.style.setProperty("--cursor", this.m_cursor); 
        },

        // If drag passes threshold, update parent row/column data
        moveContainer(){

            let parentObj = LayoutDataClass.getParentObj(this.m_LayoutData);
            if(parentObj.evenSplit) { return; }

            const difference = ContainerDividerClass.calculateMouseDifference( parentObj.divisionType, 
                this.$refs["divider"].getBoundingClientRect(), 
                mouseData.Coordinates, 
                this.$parent.$data.m_ComponentData
            );
            
            const data = ContainerDividerClass.movementData(parentObj, this.m_LayoutData.id, this.m_isVertical, this.m_pxThreshold, difference);
            // Run parent function
            if(data.moveContainer){ this.$emit('drag', data.dataSend);}
        },

        // Only runs at the parent container to modify css variable
        updateParentColumnRow(data){            
            let newColumnData = ContainerDividerClass.updateParentConfig(data, this.m_StepSize, this.m_columnData, this.m_rowData);
            if(data.type === "Vertical"){ this.m_columnData = newColumnData; } else { this.m_rowData = newColumnData; } 

            // Updates the global container values
            let globalLevelData = LayoutDataClass.getLevelData(layout.allData, this.m_LayoutData.level, this.m_LayoutData.id)
            globalLevelData.unevenFRData = newColumnData;
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
        'layout':{
            handler(val, oldval){
                this.setComponentDOMValues();
                this.recalculateThreshold();
                this.updateContainerData();
                this.disableConfigOnNonLeaf();
            },
            deep: true,
        }

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
            <div v-if="this.$GlobalStates.value.edit.enabled && this.displayDivider()"
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