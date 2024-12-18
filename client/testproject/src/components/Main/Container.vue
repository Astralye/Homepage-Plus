<template>
    <!-- Container wrapper -->
    <div class="height-full">
        
        <!-- Container -->
        <div
            class="page-content-container height-full"
            ref="refContainer"
            >
            
            <!-- Edit based container functions -->
            <div 
            :class="{'edit-mode': editVariables.isEnabled, 
                     'normal-mode' : !editVariables.isEnabled,
                    'edit-hover': (editVariables.isEnabled && m_isHover && !m_isStoredClick),
            'selected-container': (m_isStoredClick && editVariables.isEnabled && editVariables.activeContainerSelection),
            'grid-template' : m_LayoutData.NoChildren > 0 }"
            @mouseover.self="m_isHover = editVariables.containerSelectionMode"
            @mouseout.self="m_isHover=false"
            @click.self="(editVariables.containerSelectionMode && editVariables.isEnabled) ? storeClickedContainer() : null">

                <!-- Recurrsion, uses data to determine how many to render -->
                <template v-if="m_LayoutData.NoChildren > 0">
                    <Container 
                        v-for="n in m_LayoutData.NoChildren" 
                        :nest_level="nest_level+1"
                        :parent_ID="m_LayoutData.id"
                        :child_Instance="n-1"
                        :render_divider="true"
                        @drag="p_updateColumnRow"
                        />
                </template>

                <!-- If no children, display the grid layout -->
                <div v-else-if="m_LayoutData.NoChildren === 0"
                    class="container-wrapper"
                    @click="(editVariables.containerSelectionMode && editVariables.isEnabled ) ? storeClickedContainer() : null"
                    @mouseover="m_isHover = editVariables.containerSelectionMode"
                    @mouseout="m_isHover=false"
                    >

                    <!-- Container header -->
                    <div v-if="containerData.getObjectFromID(m_LayoutData.id).containerHeader.toggle"
                        ref="header"> 
                        <div class="container-header">
                            {{ containerData.getObjectFromID(m_LayoutData.id).containerHeader.text }}                        
                        </div>
                        <hr>
                    </div>

                    <template v-if="containerData.getObjectFromID(m_LayoutData.id).layoutType === 'Grid'">
                        <Gridlayout
                            :component_ID="m_LayoutData.id"
                            :update_Grid_Flag="m_updateGrid"
                        />
                    </template>
                    <!-- Container Grid -->
                    <template v-else>
                        <div>
                            <ListLayout
                                
                                :component_ID="m_LayoutData.id"/>
                        </div>
                    </template>
                     
                </div>
            </div>
        </div>
        
        <!-- Divider -->
        <template v-if="render_divider">
            <div v-if="editVariables.isEnabled && displayDivider()"
            :class="{
                'page-drag-Horizontal': ( !m_isVertical),
                'page-drag-Vertical height-full': (m_isVertical)
            }"
            @mousedown="initDividerDrag"
            ref="divider">
            </div>

            <Transition name="fade">
                <!-- Temporary next position slider -->
                <div v-if="editVariables.isEnabled && m_isMoveContainer && displayDivider()"
                    class="next-pos"
                    :class="{
                        'next-pos-horizontal': ( !m_isVertical),
                        'next-pos-vertical': (m_isVertical)
                    }"
                    ref="next-divider">
                </div>
            </Transition>
        </template>
    </div>
</template>

<script>
import { containerData } from '../../Data/containerData.js'
import { layout, LayoutDataClass } from '../../Data/layoutData.js';
import { mouseData } from '../../Data/mouseData.js';
import { ContainerDividerClass } from '../Functions/containerDivider.js';
import { GridModificationClass } from '../Functions/gridModification.js';
import { editVariables } from '../../Data/SettingVariables.js';
import ListLayout from './ListLayout.vue';

import Gridlayout from './GridLayout.vue'

export default {
    name: "recursive-container",
    components: {
        Gridlayout,
        ListLayout,
    },
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
    // p_xY -> Parent functions

    data(){
        return{
            // Static class functionality
            LayoutDataClass,
            ContainerDividerClass,
            GridModificationClass,

            // Objects
            containerData,
            layout,
            mouseData,

            editVariables,
            // Data

            
            /*
                Each component stores data of the container.
                This data determines how it is rendered

                The values are taken from the global variable and 
                watchers update the values
            */
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

            // Conditional HTML 
            m_edit: true,
            m_isHover: false,
            m_isClick: false,

            // Default instantiate values
            m_EditMode: false,
            m_isVertical: true,
            m_isMoveContainer: false,
            
            // Data 
            m_columnData: null,
            m_rowData: null,
            m_gridStyle: null,
            
            m_pxThreshold: 5,
            m_StepSize: 0.25,

            m_cursor: "default",

            m_updateGrid: false,
            m_headerOffset: "0px",
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
        this.getHeaderSize();
    },
    updated(){
        if(this.m_updateGrid){ this.m_updateGrid = false; }
    },
    unmounted(){
        this.removeGlobalData();
    },
    methods:{

// General Container Functions
// --------------------------------------------------------------------------------------------------------

        // Applies any changed data to the container
        updateContainerData(){
            let tmpID = (this.nest_level === 0) ? layout.allData.id : this.parent_ID.concat(LayoutDataClass.generateID(this.nest_level, this.child_Instance));
            let tmpContainer = LayoutDataClass.getLevelData(layout.allData, this.nest_level, tmpID);

            if(tmpContainer === null){
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
            this.m_LayoutData.level        = newData.level;
            this.m_LayoutData.divisionType = newData.divisionType;
            this.m_LayoutData.id           = newData.id
            this.m_LayoutData.NoChildren   = newData.NoChildren;
            this.m_LayoutData.siblings     = newData.siblings;
            this.m_LayoutData.evenSplit    = newData.evenSplit;
            this.m_LayoutData.unevenFRData = newData.unevenFRData;
        },

        // Loads the fractional data
        loadFractionalData(){
            if(this.m_LayoutData.evenSplit){ this.setGridEven(this.m_LayoutData.divisionType); }
            else if(editVariables.isRenderFinalNode){ this.setGridNonEven(this.m_LayoutData); }
        },

        // Turn off Load rendering
        // Check if the container is the final container to be rendered
        renderLastContainer(){
            let lastRenderContainer = LayoutDataClass.isFinalNode(LayoutDataClass.getLevelData(layout.allData, 0, "0A"), this.m_LayoutData. id);
            if( lastRenderContainer && editVariables.isRenderFinalNode) { editVariables.disableRenderFinalNode(); }
        },

        // Provides offset in px when using lists, to correctly place scrollable div.
        getHeaderSize(){
            let headerRef = this.$refs["header"];
            let isList = (containerData.getObjectFromID(this.m_LayoutData.id).layoutType == "List");

            // No header or grid layout
            if(!headerRef || !isList){ this.m_headerOffset = "0px"; return; }

            // Set value to height of header
            this.m_headerOffset = (Math.round(headerRef.getBoundingClientRect().height * 100) / 100) + "px";
        },

// Singleton Data Config
// -------------------------------------------------------------------------------------------------------

        // On Unmount, remove it
        removeGlobalData(){
            containerData.deleteID(this.m_LayoutData.id); // Removes the object from the array
        },

        // Store container data on click to singleton
        storeClickedContainer(){
            if(this.m_LayoutData.id === null) {return;}
            editVariables.setContainerSelected(this.m_LayoutData.id);
            editVariables.disableContainerSelection();
        },
        
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
        recalculateThreshold(){ this.m_pxThreshold = ContainerDividerClass.calculateThreshold(this.m_LayoutData, this.$parent.$data, editVariables.dragStepSize); },

        // Start event on mouse down on divider. End event on mouse up.
        initDividerDrag(){

            // Mouse Functions
            mouseData.movementFunctions( [ this.drag_MouseMove ]);
            mouseData.mouseUpFunctions ( [ this.drag_MouseUp   ]);
            
            mouseData.enableTracking();
            mouseData.enableMouseUp();

            this.m_isMoveContainer = true;
            this.m_cursor = (this.$parent.$data.m_LayoutData.divisionType === "Vertical") ? "col-resize" : "row-resize";
            document.documentElement.style.setProperty("--cursor", this.m_cursor); 
        },

        // If drag passes threshold, update parent row/column data
        drag_MouseMove(){

            let parentObj = LayoutDataClass.getParentObj(this.m_LayoutData);
            if(parentObj.evenSplit) { return; }

            const difference = ContainerDividerClass.calculateMouseDifference( parentObj.divisionType, 
                this.$refs["divider"].getBoundingClientRect(), 
                mouseData.Coordinates, 
                this.$parent.$data.m_ComponentData
            );
            const data = ContainerDividerClass.movementData(parentObj, this.m_LayoutData.id, this.m_isVertical, this.m_pxThreshold, difference);

            this.calculateDisplayDragLocation(difference);
            
            // Run parent function
            if(data.moveContainer){ this.$emit('drag', data.dataSend);}
        },

        drag_MouseUp(){
            mouseData.disableTracking();
            mouseData.disableMouseUp();

            this.m_isMoveContainer = false;
            this.m_cursor = "default";
            document.documentElement.style.setProperty("--cursor", this.m_cursor); 
        },

        calculateDisplayDragLocation(difference){
            
            let isPositive;
            var translateXVal;
            var translateYVal;
            
            // Within the drag size
            let isInside = ( Math.abs(difference) < 5);

            // If not inside drag, find the difference.
            if(!isInside){ isPositive = (difference > 0); }

            let parent = LayoutDataClass.getParentObj(this.m_LayoutData);

            // value to nothing to reset it.
            this.$refs["next-divider"].style.transform = null;
            
            // Y value changes
            if(parent.divisionType === "Horizontal"){
                translateXVal = 0;

                if(isInside){
                    translateYVal = "-100%";
                }
                else{
                    translateYVal = -this.$refs["next-divider"].getBoundingClientRect().height;
                    translateYVal += (isPositive) ? this.m_pxThreshold : -this.m_pxThreshold;
                    translateYVal += "px";
                }
            }
            // X Value changes
            else{
                translateYVal = "-200%";
                
                translateXVal = -15;
                if(!isInside){
                    translateXVal += (isPositive) ? this.m_pxThreshold : -this.m_pxThreshold;
                }
            }

            this.$refs["next-divider"].style.transform = `translate(${translateXVal}px, ${translateYVal})`; 
        },

        // Only runs at the parent container to modify css variable
        p_updateColumnRow(data){            
            let newColumnData = ContainerDividerClass.updateParentConfig(data, editVariables.dragStepSize, this.m_columnData, this.m_rowData);
            if(data.type === "Vertical"){ this.m_columnData = newColumnData; } else { this.m_rowData = newColumnData; } 

            // Updates the global container values
            let globalLevelData = LayoutDataClass.getLevelData(layout.allData, this.m_LayoutData.level, this.m_LayoutData.id)
            globalLevelData.unevenFRData = newColumnData;
        },

        // Allows child components to calculate relative coordinates.
        setComponentDOMValues(){
            let data = this.$refs["refContainer"].getBoundingClientRect();
            
            this.m_ComponentData.x      = data.x;
            this.m_ComponentData.y      = data.y;
            this.m_ComponentData.width  = data.width;
            this.m_ComponentData.height = data.height;
            // Updates any grid information in the parent.
        },

// Container Config data
// --------------------------------------------------------------------------------------------------------

        // Sets the config data on creation
        setContainerConfigData(){
            let index = containerData.getIndexFromID(this.m_LayoutData.id);
            if(index !== null) {  this.disableConfigOnNonLeaf(); return; }

            // Calculate new grid value.
            containerData.addNewID(this.m_LayoutData.id);
        },

        disableConfigOnNonLeaf(){ if(!LayoutDataClass.isLeafNode(this.m_LayoutData)){ containerData.disableDisplay(this.m_LayoutData.id); }},

    /*
        Because the updates of the values are sequential, it updates the grid dimensions BEFORE any new child containers are added.
        Fixed by only updating values in parent component via iteration only after the last child component is made.
    
        1. global variable which stores the PARENT ID.
        2. Watcher on the global variable.
        3. Watcher function check if the value is the PARENT isParentContainer()
        4. If so, run the update grid.

        All this just for contiguous row + column updating...
    */
        p_storeParentID(){ editVariables.setParentID(this.m_LayoutData.id); },

        // Reset only after last sibling.
        updateContainerGrid(){
            if(LayoutDataClass.isLastSibling(this.m_LayoutData)){ editVariables.resetParentID(); }

            this.m_updateGrid = true;

            // $ref returns null on tick, look at next tick to update values
            this.$nextTick(() => {
                this.setComponentDOMValues();
                this.getHeaderSize();
            });
        },

// --------------------------------------------------------------------------------------------------------

// Row + Column Data variable setters
// -------------------------------------------------------------------------------------------------------

        setGridEven(type){
            let repeatedData = "1fr ".repeat(this.m_LayoutData.NoChildren);
            let normal = "1fr";

            this.m_rowData    = (type === "Horizontal")  ? repeatedData : normal;
            this.m_columnData = (type === "Horizontal")  ? normal : repeatedData;
        },
        setGridNonEven(container){
            let normal = "1fr";

            this.m_rowData    = (container.divisionType === "Horizontal") ? container.unevenFRData : normal;
            this.m_columnData = (container.divisionType === "Horizontal") ? normal : container.unevenFRData;
        },

// -------------------------------------------------------------------------------------------------------

// Logging Functions 
// -----------------------------------------------------------------------------------------------------
        printLayoutInfo(){
            console.log("Container Info\n",
                        "\nLevel: ",        this.m_LayoutData.level,
                        "\nDivision Type:", this.m_LayoutData.divisionType,
                        "\nID:",            this.m_LayoutData.id,
                        "\nSiblings:",      this.m_LayoutData.siblings,
                        "\nEven Split?",    this.m_LayoutData.evenSplit,
                        "\nFR data:",       this.m_LayoutData.unevenFRData,
            );
        },
        printParentContainerInfo(){
            console.log("Parent information\n" ,
                        "\nx:",      this.$parent.$data.m_ComponentData.x,
                        "\ny:",      this.$parent.$data.m_ComponentData.y,
                        "\nheight:", this.$parent.$data.m_ComponentData.height,
                        "\nwidth:",  this.$parent.$data.m_ComponentData.width);
        },
// -------------------------------------------------------------------------------------------------------

    },

    computed:{
        
        // Updates if the container is the current selected
        m_isStoredClick(){
            return (editVariables.containerSelected === this.m_LayoutData.id);
        },
    },


// Watchers
// --------------------------------------------------------------------------------------------------------------

    watch: {

        'editVariables.dragStepSize'(){ this.recalculateThreshold(); },

        // Updates recalculates the layout when the flag changes
        'editVariables.recalculateLayout'(flag){
            if(!flag){ return; }

            this.setComponentDOMValues();
            this.recalculateThreshold();
            this.getHeaderSize();
            
            if(this.m_LayoutData.id !== "0A"){ this.$parent.p_storeParentID(); } // Change in window size update grid Values
            editVariables.disableRecalculation();
        },

        // All containers run this watcher, but only the parent of the selected gets ran.
        'editVariables.parentID'(p_ID){
            if(p_ID === null) { return; }
            let parentObj = LayoutDataClass.getParentObj(this.m_LayoutData);
            if(parentObj === null) { return; }
            else if(parentObj.id === p_ID){ this.updateContainerGrid(); }
        },

        // update grid layout
        'm_LayoutData.siblings'(){
            if(LayoutDataClass.isLastSibling(this.m_LayoutData)){ this.$parent.p_storeParentID(); }
        },

        'm_LayoutData.unevenFRData'(){ this.p_storeParentID(); },
        'm_LayoutData.divisionType'(){ this.p_storeParentID(); },
        // When the values in the container data change
        'layout':{
            handler(val, oldval){
                this.updateContainerData();
                this.recalculateThreshold();
                this.disableConfigOnNonLeaf();
                this.setComponentDOMValues();
                this.getHeaderSize();
            },
            deep: true,
        }

    }
}
</script>
<!---------------------------------------------------------------------------------------------------------------------------
    CSS
-->

<style scoped>
@import '../../assets/base.css';

.next-pos{
    pointer-events: none;
}

.next-pos-horizontal{
    height: 10px;
    width: 100%;
    transform: translate(0, -100%);
    background-color: rgba(0, 0, 0, 0.61);
    border-radius: 10px;
    transition: all 150ms ease-in-out;
}

.next-pos-vertical{
    width: 20px;
    height: 100%;
    transform: translate(-15px, -200%);
    background-color: rgba(0, 0, 0, 0.61);
    border-radius: 10px;
    transition: all 150ms ease-in-out;
}

hr{
    border: 1px solid white;
    margin: 0em 2em;
}

.container-wrapper{
    display: flex;
    flex-flow: column;

    position: relative;
    height: calc(100% - v-bind("m_headerOffset"));
}
/* 
    The wrapper requires 100% height.

    An offset is used if there is text, AND if it uses a list. 
*/

.container-header{
    height: min-content;
    width: 100%;

    padding: 0.75em 1.25em 0.25em 1.25em;
    
    font-size: 24px;
    font-weight: bold;
}

.height-full{
    height: 100%;
}

.grid-template{
    display: grid;
    grid-template-columns: v-bind("m_columnData");
    grid-template-rows: v-bind("m_rowData");
    grid-gap: 0.5em;
    padding: 1em;
    
    max-width: 100%;
    max-height: 100%;
    
    overflow: hidden;
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
    transition: background-color 200ms ease;
}

.normal-mode{
    border-radius: 10px;
    outline: rgba(192, 192, 192, 0) dashed 2px;
    transition: outline 100ms ease;
}

.edit-mode{
    border-radius: 10px;
    outline: rgba(192, 192, 192, 1) dashed 2px;
    transition: outline 100ms ease;
}

.edit-hover{
    background-color: var(--Hover-colour) !important;
    transition: background-color 200ms ease;
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
    
    width: 100%;
    background-color: var(--Primary-background-colour);
    transition: all 0.1s ease-in-out;
}

</style>